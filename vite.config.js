import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        req.query = Object.fromEntries(urlObj.searchParams.entries());

        let statusCode = 200;
        res.status = (code) => {
          statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
          const chunks = [];
          req.on('data', (chunk) => { chunks.push(chunk); });
          await new Promise((resolve) => req.on('end', resolve));
          const bodyBuffer = Buffer.concat(chunks).toString('utf-8');
          try {
            req.body = bodyBuffer ? JSON.parse(bodyBuffer) : {};
          } catch (e) {
            req.body = {};
          }
        }

        try {
          if (urlObj.pathname === '/api/upload') {
            const { default: uploadHandler } = await import('./api/upload.js');
            return uploadHandler(req, res);
          }
          if (urlObj.pathname === '/api/workshop-registrations') {
            const { default: registrationsHandler } = await import('./api/workshop-registrations.js');
            return registrationsHandler(req, res);
          }
        } catch (err) {
          console.error('API middleware error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Internal Server Error', details: err.message }));
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevServerPlugin()]
});
