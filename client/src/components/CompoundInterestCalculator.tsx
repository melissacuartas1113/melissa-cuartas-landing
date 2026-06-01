import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function CompoundInterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(10);
  const [annualRate, setAnnualRate] = useState(7);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12);

  const compoundingOptions = {
    'Anualmente': 1,
    'Semestralmente': 2,
    'Trimestral': 4,
    'Mensualmente': 12,
    'Diariamente': 365,
  };

  const calculateCompoundInterest = useMemo(() => {
    const results = [];
    const months = years * 12;
    let balance = initialInvestment;

    for (let month = 0; month <= months; month++) {
      const year = Math.floor(month / 12);

      if (month > 0) {
        balance = initialInvestment * Math.pow(1 + annualRate / 100 / compoundingFrequency, (month / (12 / compoundingFrequency)));
        
        if (monthlyContribution > 0) {
          const monthlyContributionRate = annualRate / 100 / 12;
          // Evitar división por cero cuando la tasa es 0
          let futureValueOfAnnuity = 0;
          if (monthlyContributionRate === 0) {
            futureValueOfAnnuity = monthlyContribution * month;
          } else {
            futureValueOfAnnuity = monthlyContribution * 
              (Math.pow(1 + monthlyContributionRate, month) - 1) / monthlyContributionRate;
          }
          balance += futureValueOfAnnuity;
        }
      }

      if (month % 12 === 0 || month === months) {
        const interest = balance - initialInvestment - (monthlyContribution * month);
        results.push({
          year,
          balance: Math.round(balance),
          interest: Math.round(Math.max(0, interest)),
          principal: Math.round(initialInvestment + monthlyContribution * month),
          month,
        });
      }
    }

    return results;
  }, [initialInvestment, monthlyContribution, years, annualRate, compoundingFrequency]);

  const finalBalance = calculateCompoundInterest[calculateCompoundInterest.length - 1]?.balance || 0;
  const totalContributions = initialInvestment + monthlyContribution * years * 12;
  const totalInterest = finalBalance - totalContributions;

  const pieData = [
    { name: 'Principal', value: totalContributions },
    { name: 'Interés', value: Math.max(0, totalInterest) },
  ];

  const COLORS = ['#7B5CE7', '#0CBFBF'];

  const handleReset = () => {
    setInitialInvestment(10000);
    setMonthlyContribution(500);
    setYears(10);
    setAnnualRate(7);
    setCompoundingFrequency(12);
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#F0F3FA] to-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B3E] mb-3">
            Calculadora de Interés Compuesto
          </h2>
          <p className="text-lg text-[#5A8FE0] max-w-2xl mx-auto">
            Visualiza cómo crece tu dinero con el poder del interés compuesto. Ingresa tus datos y observa los resultados en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-8 border border-[#E8EAEF]">
            <h3 className="text-xl font-bold text-[#0D1B3E] mb-6">Configuración</h3>

            {/* Paso 1: Inversión Inicial */}
            <div className="mb-8 pb-6 border-b border-[#E8EAEF]">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                Paso 1: Inversión Inicial
              </div>
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                Inversión inicial <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                Monto de dinero que tiene disponible para invertir inicialmente.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#0D1B3E] font-semibold">$</span>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
                  min="0"
                  step="1000"
                />
              </div>
              <input
                type="range"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                min="0"
                max="1000000"
                step="1000"
                className="w-full"
              />
            </div>

            {/* Paso 2: Contribución */}
            <div className="mb-8 pb-6 border-b border-[#E8EAEF]">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                Paso 2: Contribución
              </div>
              
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                Contribución mensual
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                Monto que tiene previsto agregar al capital cada mes.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#0D1B3E] font-semibold">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
                  min="0"
                  step="100"
                />
              </div>
              <input
                type="range"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min="0"
                max="10000"
                step="100"
                className="w-full mb-4"
              />

              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                Cantidad de tiempo en años <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                Cantidad de tiempo, en años, que tiene previsto ahorrar.
              </p>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E] mb-3"
                min="1"
                max="50"
                step="1"
              />
              <input
                type="range"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="1"
                max="50"
                step="1"
                className="w-full"
              />
            </div>

            {/* Paso 3: Tasa de Interés */}
            <div className="mb-8 pb-6 border-b border-[#E8EAEF]">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                Paso 3: Tasa de Interés
              </div>
              
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                Tasa de interés estimada <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                Su tasa de interés anual estimada.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
                  min="0"
                  max="50"
                  step="0.1"
                />
                <span className="text-[#0D1B3E] font-semibold">%</span>
              </div>
              <input
                type="range"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                min="0"
                max="50"
                step="0.1"
                className="w-full"
              />
            </div>

            {/* Paso 4: Capitalización */}
            <div className="mb-6">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                Paso 4: Capitalización
              </div>
              
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                Frecuencia de capitalización
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                Cantidad de veces por año que se capitalizará el interés.
              </p>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
              >
                {Object.entries(compoundingOptions).map(([label, value]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleReset}
                className="w-full bg-[#0CBFBF] hover:bg-[#0aa5a5] text-white font-bold py-2 px-4 rounded transition-colors"
              >
                RESTABLECER
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8EAEF]">
                <p className="text-sm text-[#5A8FE0] mb-2">Balance Final</p>
                <p className="text-2xl font-bold text-[#0CBFBF]">
                  ${finalBalance.toLocaleString('es-ES')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8EAEF]">
                <p className="text-sm text-[#5A8FE0] mb-2">Total Invertido</p>
                <p className="text-2xl font-bold text-[#7B5CE7]">
                  ${totalContributions.toLocaleString('es-ES')}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8EAEF]">
                <p className="text-sm text-[#5A8FE0] mb-2">Interés Ganado</p>
                <p className="text-2xl font-bold text-[#5A8FE0]">
                  ${Math.max(0, totalInterest).toLocaleString('es-ES')}
                </p>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8EAEF]">
              <h4 className="text-lg font-bold text-[#0D1B3E] mb-4">Crecimiento del Dinero</h4>
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={calculateCompoundInterest} margin={{ top: 20, right: 40, left: 60, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAEF" />
                  <XAxis dataKey="year" stroke="#5A8FE0" />
                  <YAxis stroke="#5A8FE0" width={60} />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString('es-ES')}`}
                    labelFormatter={(label) => `Año ${label}`}
                    contentStyle={{ backgroundColor: '#0D1B3E', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#0CBFBF"
                    strokeWidth={3}
                    name="Balance Total"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="principal"
                    stroke="#7B5CE7"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Principal"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8EAEF]">
                <h4 className="text-lg font-bold text-[#0D1B3E] mb-4">Desglose Final</h4>
                <ResponsiveContainer width="100%" height={380}>
                  <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}k`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString('es-ES')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-[#E8EAEF]">
                <h4 className="text-lg font-bold text-[#0D1B3E] mb-4">Año a Año</h4>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={calculateCompoundInterest.filter((_, i) => i % Math.ceil(calculateCompoundInterest.length / 6) === 0)} margin={{ top: 20, right: 40, left: 60, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8EAEF" />
                    <XAxis dataKey="year" stroke="#5A8FE0" />
                    <YAxis stroke="#5A8FE0" width={60} />
                    <Tooltip formatter={(value) => `$${value.toLocaleString('es-ES')}`} />
                    <Legend />
                    <Bar dataKey="principal" stackId="a" fill="#7B5CE7" name="Principal" />
                    <Bar dataKey="interest" stackId="a" fill="#0CBFBF" name="Interés" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Footer Note */}
            <div className="bg-[#F0F3FA] rounded-lg p-4 border border-[#E8EAEF]">
              <p className="text-xs text-[#5A8FE0] text-center">
                Esta calculadora proporciona estimaciones educativas. Los resultados reales pueden variar según las condiciones del mercado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
