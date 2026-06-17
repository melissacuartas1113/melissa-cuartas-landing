import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  // Download endpoint for Excel files with correct MIME type
  // This endpoint fetches the file from storage and serves it directly to preserve headers
  app.get('/api/download/:type', async (req, res) => {
    const { type } = req.params;
    let storageKey = '';
    let filename = '';

    if (type === 'budget') {
      storageKey = 'presupuesto_consciente_melissa_cuartas_1c4b6977.xlsx';
      filename = 'Presupuesto_Consciente_Melissa_Cuartas.xlsx';
    } else if (type === 'beliefs') {
      storageKey = 'guia_creencias_limitantes_melissa_cuartas(2)_c03e7a38.xlsx';
      filename = 'Guia_Creencias_Limitantes_Melissa_Cuartas.xlsx';
    } else {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    try {
      // Get presigned URL from storage backend
      const forgeUrl = new URL('v1/storage/presign/get', (process.env.BUILT_IN_FORGE_API_URL || '').replace(/\/+$/, '') + '/');
      forgeUrl.searchParams.set('path', storageKey);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}` },
      });

      if (!forgeResp.ok) {
        console.error(`[Download] forge error: ${forgeResp.status}`);
        return res.status(502).json({ error: 'Storage backend error' });
      }

      const { url: presignedUrl } = (await forgeResp.json()) as { url: string };
      if (!presignedUrl) {
        return res.status(502).json({ error: 'Empty signed URL' });
      }

      // Fetch the actual file from the presigned URL
      const fileResp = await fetch(presignedUrl);
      if (!fileResp.ok) {
        console.error(`[Download] file fetch error: ${fileResp.status}`);
        return res.status(502).json({ error: 'File fetch error' });
      }

      const fileBuffer = await fileResp.arrayBuffer();

      // Set headers for direct download (these will survive in in-app browsers)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', fileBuffer.byteLength);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Send file directly
      res.send(Buffer.from(fileBuffer));
    } catch (error) {
      console.error('[Download] error:', error);
      res.status(500).json({ error: 'Download failed' });
    }
  });

  // PDF generation endpoint for calculator (fallback for in-app browsers)
  // New endpoint for calculator PDF generation with structured data
  app.post('/api/generate-calculator-pdf', async (req, res) => {
    try {
      const {
        initialInvestment,
        monthlyContribution,
        years,
        annualRate,
        compoundingFrequency,
        finalBalance,
        totalContributions,
        totalInterest,
        data,
        language,
        filename,
      } = req.body;

      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument({
        size: 'A4',
        margin: 30,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      doc.pipe(res);

      const locale = language === 'es' ? 'es-ES' : 'en-US';
      const t = language === 'es' ? {
        title: 'Resultados de la Calculadora de Interés Compuesto',
        finalBalance: 'Balance Final',
        totalInvested: 'Total Invertido',
        interestEarned: 'Interés Ganado',
        parameters: 'Parámetros',
        initialInvestment: 'Inversión Inicial',
        monthlyContribution: 'Aporte Mensual',
        years: 'Años',
        annualRate: 'Tasa Anual',
        compounding: 'Capitalización',
        breakdown: 'Desglose Anual',
        year: 'Año',
        balance: 'Balance',
      } : {
        title: 'Compound Interest Calculator Results',
        finalBalance: 'Final Balance',
        totalInvested: 'Total Invested',
        interestEarned: 'Interest Earned',
        parameters: 'Parameters',
        initialInvestment: 'Initial Investment',
        monthlyContribution: 'Monthly Contribution',
        years: 'Years',
        annualRate: 'Annual Rate',
        compounding: 'Compounding',
        breakdown: 'Annual Breakdown',
        year: 'Year',
        balance: 'Balance',
      };

      // Title
      doc.fontSize(18).font('Helvetica-Bold').text(t.title, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      // Summary cards
      doc.fontSize(12).font('Helvetica-Bold').text(t.finalBalance);
      doc.fontSize(11).font('Helvetica').text(`$${finalBalance.toLocaleString(locale)}`);
      doc.moveDown(0.3);

      doc.fontSize(12).font('Helvetica-Bold').text(t.totalInvested);
      doc.fontSize(11).font('Helvetica').text(`$${totalContributions.toLocaleString(locale)}`);
      doc.moveDown(0.3);

      doc.fontSize(12).font('Helvetica-Bold').text(t.interestEarned);
      doc.fontSize(11).font('Helvetica').text(`$${Math.max(0, totalInterest).toLocaleString(locale)}`);
      doc.moveDown();

      // Parameters
      doc.fontSize(12).font('Helvetica-Bold').text(t.parameters);
      doc.fontSize(10).font('Helvetica');
      doc.text(`${t.initialInvestment}: $${initialInvestment.toLocaleString(locale)}`);
      doc.text(`${t.monthlyContribution}: $${monthlyContribution.toLocaleString(locale)}`);
      doc.text(`${t.years}: ${years}`);
      doc.text(`${t.annualRate}: ${annualRate}%`);
      doc.text(`${t.compounding}: ${compoundingFrequency}x/year`);
      doc.moveDown();

      // Breakdown table
      doc.fontSize(12).font('Helvetica-Bold').text(t.breakdown);
      doc.moveDown(0.3);

      const tableTop = doc.y;
      const col1X = 50;
      const col2X = 150;
      const col3X = 300;
      const rowHeight = 20;

      // Table header
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text(t.year, col1X, tableTop);
      doc.text(t.balance, col2X, tableTop);
      doc.text(t.interestEarned, col3X, tableTop);

      // Table rows
      doc.fontSize(8).font('Helvetica');
      let yPosition = tableTop + rowHeight;
      
      data.forEach((row: any) => {
        if (yPosition > 750) {
          doc.addPage();
          yPosition = 50;
        }
        doc.text(row.year.toString(), col1X, yPosition);
        doc.text(`$${row.balance.toLocaleString(locale)}`, col2X, yPosition);
        doc.text(`$${row.interest.toLocaleString(locale)}`, col3X, yPosition);
        yPosition += rowHeight;
      });

      doc.end();
    } catch (error) {
      console.error('[Calculator PDF] error:', error);
      res.status(500).json({ error: 'PDF generation failed' });
    }
  });

  // Legacy endpoint for backward compatibility
  app.post('/api/generate-pdf', async (req, res) => {
    try {
      const { html, filename } = req.body;

      if (!html) {
        return res.status(400).json({ error: 'Missing HTML content' });
      }

      const PDFDocument = (await import('pdfkit')).default;
      
      const doc = new PDFDocument({
        size: 'A4',
        margin: 20,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      doc.pipe(res);

      doc.fontSize(14).text('Compound Interest Calculator Results', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10);
      
      const textContent = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      doc.text(textContent, { align: 'left', width: 500 });
      doc.moveDown();
      doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });

      doc.end();
    } catch (error) {
      console.error('[PDF] error:', error);
      res.status(500).json({ error: 'PDF generation failed' });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
