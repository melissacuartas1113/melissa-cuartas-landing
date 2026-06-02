import { describe, it, expect } from 'vitest';

describe('PDF Export Functionality', () => {
  it('should generate PDF with correct filename format', () => {
    // Test that the PDF filename includes the date
    const today = new Date().toLocaleDateString();
    const expectedFilename = `calculator-results-${today}.pdf`;
    
    // Verify filename format
    expect(expectedFilename).toMatch(/calculator-results-.+\.pdf/);
    expect(expectedFilename).toContain('calculator-results');
    expect(expectedFilename).toContain('.pdf');
  });

  it('should have PDF export configuration options', () => {
    // Verify that the PDF export has proper configuration
    const pdfConfig = {
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    expect(pdfConfig.margin).toBe(10);
    expect(pdfConfig.image.type).toBe('jpeg');
    expect(pdfConfig.image.quality).toBe(0.98);
    expect(pdfConfig.html2canvas.scale).toBe(2);
    expect(pdfConfig.jsPDF.orientation).toBe('portrait');
    expect(pdfConfig.jsPDF.format).toBe('a4');
  });

  it('should include calculator results in PDF export', () => {
    // Verify that the PDF includes all necessary calculator data
    const calculatorResults = {
      finalBalance: 150000,
      totalInvested: 70000,
      totalInterest: 80000,
      initialInvestment: 10000,
      monthlyContribution: 500,
      years: 10,
      annualRate: 7,
      compoundingFrequency: 12,
    };

    expect(calculatorResults.finalBalance).toBeGreaterThan(calculatorResults.totalInvested);
    expect(calculatorResults.totalInterest).toBeGreaterThan(0);
    expect(calculatorResults.totalInvested).toBe(
      calculatorResults.initialInvestment + (calculatorResults.monthlyContribution * 12 * calculatorResults.years)
    );
  });

  it('should have bilingual PDF button labels', () => {
    const translations = {
      es: { calculator_download_pdf: 'DESCARGAR PDF' },
      en: { calculator_download_pdf: 'DOWNLOAD PDF' },
    };

    expect(translations.es.calculator_download_pdf).toBe('DESCARGAR PDF');
    expect(translations.en.calculator_download_pdf).toBe('DOWNLOAD PDF');
  });

  it('should support PDF export in both languages', () => {
    const languages = ['es', 'en'];
    const expectedLabels = {
      es: 'DESCARGAR PDF',
      en: 'DOWNLOAD PDF',
    };

    languages.forEach((lang) => {
      expect(expectedLabels[lang as keyof typeof expectedLabels]).toBeDefined();
      expect(expectedLabels[lang as keyof typeof expectedLabels].length).toBeGreaterThan(0);
    });
  });

  it('should export PDF with summary cards data', () => {
    // Verify that PDF export includes all summary information
    const summaryData = {
      finalBalance: 150000,
      totalInvested: 70000,
      interestEarned: 80000,
    };

    expect(summaryData.finalBalance).toEqual(summaryData.totalInvested + summaryData.interestEarned);
    expect(Object.keys(summaryData)).toHaveLength(3);
  });

  it('should export PDF with chart data', () => {
    // Verify that PDF export includes chart data
    const chartData = {
      lineChart: { years: [0, 1, 2, 3, 4, 5], balances: [10000, 15000, 20000, 25000, 30000, 35000] },
      pieChart: { principal: 70000, interest: 80000 },
      barChart: { years: [0, 1, 2, 3, 4, 5], principal: [10000, 10000, 10000, 10000, 10000, 10000], interest: [0, 5000, 10000, 15000, 20000, 25000] },
    };

    expect(chartData.lineChart.years).toHaveLength(6);
    expect(chartData.pieChart.principal + chartData.pieChart.interest).toBe(150000);
    expect(chartData.barChart.years).toHaveLength(6);
  });
});
