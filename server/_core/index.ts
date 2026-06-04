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
  app.post('/api/generate-pdf', async (req, res) => {
    try {
      const { html, filename } = req.body;

      if (!html) {
        return res.status(400).json({ error: 'Missing HTML content' });
      }

      // Import pdfkit dynamically
      const PDFDocument = (await import('pdfkit')).default;
      
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 20,
      });

      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      // Pipe PDF to response
      doc.pipe(res);

      // Extract text from HTML and add to PDF
      doc.fontSize(14).text('Compound Interest Calculator Results', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10);
      
      // Simple HTML to text conversion (remove HTML tags)
      const textContent = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      doc.text(textContent, { align: 'left', width: 500 });
      doc.moveDown();
      doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });

      // Finalize PDF
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
