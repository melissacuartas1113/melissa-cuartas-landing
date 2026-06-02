/**
 * Admin Leads Dashboard
 * View, filter, and export all captured leads
 */

import { useState, useMemo } from 'react';
import { Download, Filter } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';

export default function AdminLeads() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [source, setSource] = useState<string>('');

  // Redirect if not authenticated
  if (!user) {
    navigate('/');
    return null;
  }

  // Redirect if not admin
  if (user.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Convert string dates to Date objects for query
  const filters = useMemo(() => ({
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
    source: source || undefined,
  }), [dateFrom, dateTo, source]);

  const { data: leads = [], isLoading } = trpc.leads.getAll.useQuery(filters);
  const exportQuery = trpc.leads.exportCsv.useQuery(filters, { enabled: false });

  const handleExport = async () => {
    const result = await exportQuery.refetch();
    if (result.data) {
      const blob = new Blob([result.data.csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', result.data.filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const sourceOptions = [
    { value: '', label: 'Todas las fuentes' },
    { value: 'budget', label: 'Presupuesto' },
    { value: 'beliefs', label: 'Creencias' },
    { value: 'investor-test', label: 'Test Inversor' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-midnight-blue)', color: 'var(--color-mist)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-2">Dashboard de Leads</h1>
          <p style={{ color: 'var(--color-lavender)' }}>
            Total: <span className="font-bold">{leads.length}</span> leads capturados
          </p>
        </div>

        {/* Filters */}
        <div className="bg-opacity-50 backdrop-blur-sm rounded-lg p-6 mb-8" style={{ background: 'rgba(26, 40, 71, 0.5)', border: '1px solid rgba(196, 179, 232, 0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} />
            <h2 className="text-lg font-semibold">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date From */}
            <div>
              <label className="block text-sm font-medium mb-2">Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(196, 179, 232, 0.2)', color: 'var(--color-mist)' }}
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium mb-2">Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(196, 179, 232, 0.2)', color: 'var(--color-mist)' }}
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium mb-2">Fuente</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(196, 179, 232, 0.2)', color: 'var(--color-mist)' }}
              >
                {sourceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ color: '#000' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end">
              <button
                onClick={handleExport}
                disabled={exportQuery.isLoading || leads.length === 0}
                className="w-full px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(to bottom right, var(--color-purple), var(--color-teal))',
                  opacity: exportQuery.isLoading || leads.length === 0 ? 0.5 : 1,
                  cursor: exportQuery.isLoading || leads.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <Download size={18} />
                {exportQuery.isLoading ? 'Exportando...' : 'Exportar CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-opacity-50 backdrop-blur-sm rounded-lg overflow-hidden" style={{ background: 'rgba(26, 40, 71, 0.5)', border: '1px solid rgba(196, 179, 232, 0.2)' }}>
          {isLoading ? (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--color-lavender)' }}>Cargando leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--color-lavender)' }}>No hay leads que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(196, 179, 232, 0.2)', background: 'rgba(196, 179, 232, 0.1)' }}>
                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">WhatsApp</th>
                    <th className="px-4 py-3 text-left font-semibold">País</th>
                    <th className="px-4 py-3 text-left font-semibold">Fuente</th>
                    <th className="px-4 py-3 text-left font-semibold">Email Enviado</th>
                    <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead: any, index: number) => (
                    <tr
                      key={lead.id}
                      style={{
                        borderBottom: '1px solid rgba(196, 179, 232, 0.1)',
                        background: index % 2 === 0 ? 'transparent' : 'rgba(196, 179, 232, 0.05)',
                      }}
                    >
                      <td className="px-4 py-3">{lead.id}</td>
                      <td className="px-4 py-3">{lead.name}</td>
                      <td className="px-4 py-3 text-xs">{lead.email}</td>
                      <td className="px-4 py-3">{lead.whatsapp || '-'}</td>
                      <td className="px-4 py-3">{lead.country || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            background: lead.source === 'budget' ? 'rgba(12, 191, 191, 0.2)' : lead.source === 'beliefs' ? 'rgba(123, 92, 231, 0.2)' : 'rgba(196, 179, 232, 0.2)',
                            color: lead.source === 'budget' ? 'var(--color-teal)' : lead.source === 'beliefs' ? 'var(--color-purple)' : 'var(--color-lavender)',
                          }}
                        >
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: lead.emailSent ? 'var(--color-teal)' : 'var(--color-lavender)' }}>
                          {lead.emailSent ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {new Date(lead.createdAt).toLocaleDateString('es-CO')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
