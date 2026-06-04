import { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { trpc } from '@/lib/trpc';

const ADMIN_PASSWORD = 'melissa2024';

export default function LeadsDownload() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  const exportQuery = trpc.leads.exportCsv.useQuery(
    {
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      source: source || undefined,
    },
    { enabled: false }
  );

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1B3E] to-[#1a2d5c] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-[#7B5CE7] p-4 rounded-full">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-[#0D1B3E] mb-2">
            Descargar Leads
          </h1>
          <p className="text-center text-[#5A8FE0] mb-6">
            Ingresa la contraseña para acceder
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-2 border-2 border-[#E8EAEF] rounded-lg focus:border-[#0CBFBF] focus:outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#0CBFBF] hover:bg-[#0aa5a5] text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Acceder
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B3E] to-[#1a2d5c] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-8 h-8 text-[#0CBFBF]" />
            <h1 className="text-3xl font-bold text-[#0D1B3E]">
              Descargar Leads
            </h1>
          </div>

          <div className="space-y-6">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                  Desde (fecha)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E8EAEF] rounded-lg focus:border-[#0CBFBF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                  Hasta (fecha)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#E8EAEF] rounded-lg focus:border-[#0CBFBF] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                Fuente
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#E8EAEF] rounded-lg focus:border-[#0CBFBF] focus:outline-none"
              >
                <option value="">Todas las fuentes</option>
                <option value="budget">Presupuesto</option>
                <option value="beliefs">Creencias</option>
                <option value="test">Test</option>
              </select>
            </div>

            {/* Botón de descarga */}
            <button
              onClick={handleExport}
              disabled={exportQuery.isLoading}
              className="w-full bg-[#7B5CE7] hover:bg-[#6a4dd1] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              {exportQuery.isLoading ? 'Descargando...' : 'Descargar CSV'}
            </button>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
