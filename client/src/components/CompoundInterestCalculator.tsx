import { useState, useMemo } from 'react';
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

interface CompoundInterestCalculatorProps {
  language: 'es' | 'en';
  translations: Record<string, Record<string, string>>;
}

export default function CompoundInterestCalculator({ language, translations }: CompoundInterestCalculatorProps) {
  const t = translations[language];
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(10);
  const [annualRate, setAnnualRate] = useState(7);
  const [compoundingFrequency, setCompoundingFrequency] = useState(12);

  const compoundingOptions = {
    [t.calculator_annually]: 1,
    [t.calculator_semiannually]: 2,
    [t.calculator_quarterly]: 4,
    [t.calculator_monthly]: 12,
    [t.calculator_daily]: 365,
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
    { name: t.calculator_principal, value: totalContributions },
    { name: t.calculator_interest, value: Math.max(0, totalInterest) },
  ];

  const COLORS = ['#7B5CE7', '#0CBFBF'];

  const handleReset = () => {
    setInitialInvestment(10000);
    setMonthlyContribution(500);
    setYears(10);
    setAnnualRate(7);
    setCompoundingFrequency(12);
  };

  const locale = language === 'es' ? 'es-ES' : 'en-US';

  return (
    <div className="w-full bg-gradient-to-b from-[#F0F3FA] to-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B3E] mb-3">
            {t.calculator_title}
          </h2>
          <p className="text-lg text-[#5A8FE0] max-w-2xl mx-auto">
            {t.calculator_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inputs Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-8 border border-[#E8EAEF]">
            <h3 className="text-xl font-bold text-[#0D1B3E] mb-6">{t.calculator_config}</h3>

            {/* Paso 1: Inversión Inicial */}
            <div className="mb-8 pb-6 border-b border-[#E8EAEF]">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                {t.calculator_step_1}
              </div>
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                {t.calculator_initial_investment} <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                {t.calculator_initial_investment_desc}
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
                {t.calculator_step_2}
              </div>
              
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                {t.calculator_monthly_contribution}
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                {t.calculator_monthly_contribution_desc}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#0D1B3E] font-semibold">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
                  step="100"
                />
              </div>
              <input
                type="range"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min="-10000"
                max="10000"
                step="100"
                className="w-full"
              />
            </div>

            {/* Paso 3: Años y Tasa */}
            <div className="mb-8 pb-6 border-b border-[#E8EAEF]">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                {t.calculator_step_3}
              </div>

              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                {t.calculator_years} <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                {t.calculator_years_desc}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
                  min="1"
                  max="50"
                  step="1"
                />
              </div>
              <input
                type="range"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="1"
                max="50"
                step="1"
                className="w-full mb-6"
              />

              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                {t.calculator_annual_rate} <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                {t.calculator_annual_rate_desc}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#E8EAEF] rounded focus:border-[#0CBFBF] focus:outline-none text-[#0D1B3E]"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="text-[#0D1B3E] font-semibold">%</span>
              </div>
              <input
                type="range"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                min="0"
                max="100"
                step="0.1"
                className="w-full"
              />
            </div>

            {/* Paso 4: Capitalización */}
            <div className="mb-8">
              <div className="bg-[#0CBFBF] text-white px-4 py-2 rounded font-bold mb-4 text-sm">
                {t.calculator_step_4}
              </div>
              <label className="block text-sm font-semibold text-[#0D1B3E] mb-2">
                {t.calculator_compounding_frequency}
              </label>
              <p className="text-xs text-[#5A8FE0] mb-3">
                {t.calculator_compounding_frequency_desc}
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
                {t.calculator_reset}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-[#E8EAEF]">
                <p className="text-xs md:text-sm text-[#5A8FE0] mb-1 md:mb-2">{t.calculator_final_balance}</p>
                <p className="text-lg md:text-2xl font-bold text-[#0CBFBF] break-words">
                  ${finalBalance.toLocaleString(locale)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-[#E8EAEF]">
                <p className="text-xs md:text-sm text-[#5A8FE0] mb-1 md:mb-2">{t.calculator_total_invested}</p>
                <p className="text-lg md:text-2xl font-bold text-[#7B5CE7] break-words">
                  ${totalContributions.toLocaleString(locale)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-[#E8EAEF]">
                <p className="text-xs md:text-sm text-[#5A8FE0] mb-1 md:mb-2">{t.calculator_interest_earned}</p>
                <p className="text-lg md:text-2xl font-bold text-[#5A8FE0] break-words">
                  ${Math.max(0, totalInterest).toLocaleString(locale)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              {/* Line Chart */}
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-[#E8EAEF]">
                <h4 className="text-base md:text-lg font-bold text-[#0D1B3E] mb-3 md:mb-4">{t.calculator_growth}</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={calculateCompoundInterest} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Años / Years', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis width={40} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString(locale)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" stroke="#0CBFBF" name={t.calculator_final_balance} strokeWidth={2} />
                    <Line type="monotone" dataKey="principal" stroke="#7B5CE7" name={t.calculator_principal} strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-[#E8EAEF]">
                <h4 className="text-base md:text-lg font-bold text-[#0D1B3E] mb-3 md:mb-4">{t.calculator_breakdown}</h4>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart margin={{ top: 10, right: 60, left: 60, bottom: 10 }}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${Number(value).toLocaleString(locale)}`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString(locale)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-[#E8EAEF]">
                <h4 className="text-base md:text-lg font-bold text-[#0D1B3E] mb-3 md:mb-4">{t.calculator_year_by_year}</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={calculateCompoundInterest} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Años / Years', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis width={40} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString(locale)}`} />
                    <Legend />
                    <Bar dataKey="principal" fill="#7B5CE7" name={t.calculator_principal} />
                    <Bar dataKey="interest" fill="#0CBFBF" name={t.calculator_interest} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
