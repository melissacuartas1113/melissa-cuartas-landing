import { describe, it, expect } from 'vitest';

/**
 * Compound Interest Calculator Tests
 * Tests the mathematical calculations for compound interest
 */

// Fórmula de interés compuesto: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
function calculateCompoundInterestValue(
  principal: number,
  monthlyContribution: number,
  years: number,
  annualRate: number,
  compoundingFrequency: number
): number {
  const months = years * 12;
  let balance = principal;

  for (let month = 1; month <= months; month++) {
    balance = principal * Math.pow(1 + annualRate / 100 / compoundingFrequency, (month / (12 / compoundingFrequency)));
    
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

  return balance;
}

describe('Compound Interest Calculator', () => {
  it('should calculate compound interest with standard parameters', () => {
    // $10,000 inicial, $500 mensuales, 10 años, 7% anual, capitalización mensual
    const result = calculateCompoundInterestValue(10000, 500, 10, 7, 12);
    
    // Esperado: aproximadamente $98,000 - $100,000
    expect(result).toBeGreaterThan(90000);
    expect(result).toBeLessThan(110000);
  });

  it('should handle zero interest rate without division by zero', () => {
    // $10,000 inicial, $500 mensuales, 10 años, 0% anual
    const result = calculateCompoundInterestValue(10000, 500, 10, 0, 12);
    
    // Con 0% interés: principal + (contribuciones mensuales * meses)
    // = 10,000 + (500 * 120) = 10,000 + 60,000 = 70,000
    expect(result).toBe(70000);
  });

  it('should handle no monthly contributions', () => {
    // $10,000 inicial, $0 mensuales, 10 años, 7% anual
    const result = calculateCompoundInterestValue(10000, 0, 10, 7, 12);
    
    // Solo interés compuesto sobre el principal
    // A = 10,000 * (1 + 0.07/12)^(12*10)
    const expected = 10000 * Math.pow(1 + 0.07 / 12, 120);
    expect(Math.abs(result - expected)).toBeLessThan(1); // Tolerancia de $1
  });

  it('should calculate with annual compounding', () => {
    // $10,000 inicial, $500 mensuales, 5 años, 5% anual, capitalización anual
    const result = calculateCompoundInterestValue(10000, 500, 5, 5, 1);
    
    // Debe ser mayor que el principal + contribuciones
    const totalContributions = 10000 + (500 * 60);
    expect(result).toBeGreaterThan(totalContributions);
  });

  it('should calculate with daily compounding', () => {
    // $10,000 inicial, $500 mensuales, 5 años, 5% anual, capitalización diaria
    const result = calculateCompoundInterestValue(10000, 500, 5, 5, 365);
    
    // Con capitalización diaria debe ser ligeramente mayor que mensual
    const monthlyResult = calculateCompoundInterestValue(10000, 500, 5, 5, 12);
    expect(result).toBeGreaterThan(monthlyResult);
  });

  it('should handle high interest rates', () => {
    // $10,000 inicial, $500 mensuales, 10 años, 20% anual
    const result = calculateCompoundInterestValue(10000, 500, 10, 20, 12);
    
    // Con 20% anual debe crecer significativamente
    expect(result).toBeGreaterThan(200000);
  });

  it('should handle long time periods', () => {
    // $10,000 inicial, $500 mensuales, 30 años, 7% anual
    const result = calculateCompoundInterestValue(10000, 500, 30, 7, 12);
    
    // Después de 30 años debe ser significativamente mayor
    expect(result).toBeGreaterThan(500000);
  });

  it('should handle small initial investment', () => {
    // $1,000 inicial, $100 mensuales, 10 años, 7% anual
    const result = calculateCompoundInterestValue(1000, 100, 10, 7, 12);
    
    // Debe ser mayor que el principal + contribuciones
    const totalContributions = 1000 + (100 * 120);
    expect(result).toBeGreaterThan(totalContributions);
  });

  it('should maintain positive balance with realistic parameters', () => {
    // Varios escenarios realistas
    const scenarios = [
      { principal: 5000, contribution: 200, years: 5, rate: 4, frequency: 12 },
      { principal: 20000, contribution: 1000, years: 20, rate: 6, frequency: 4 },
      { principal: 50000, contribution: 500, years: 15, rate: 5, frequency: 2 },
    ];

    scenarios.forEach(scenario => {
      const result = calculateCompoundInterestValue(
        scenario.principal,
        scenario.contribution,
        scenario.years,
        scenario.rate,
        scenario.frequency
      );
      
      expect(result).toBeGreaterThan(0);
      expect(Number.isFinite(result)).toBe(true);
    });
  });
});
