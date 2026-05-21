import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { spawn } from 'node:child_process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Career-Ops PWA',
        short_name: 'CareerOps',
        description: 'LaTeX Resume Tailoring & Optimization Command Center',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    {
      name: 'gemini-cli-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url || '', 'http://localhost');
          
          if (url.pathname === '/api/gemini-cli/status') {
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store'
            });
            res.end(JSON.stringify({ available: true }));
            return;
          }
          
          if (url.pathname === '/api/gemini-cli' && req.method === 'POST') {
            let body = '';
            
            req.on('data', chunk => {
              body += chunk;
            });
            
            req.on('end', () => {
              try {
                const { prompt } = JSON.parse(body);
                if (!prompt) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Prompt is required' }));
                  return;
                }
                
                // Spawn the local CLI command in non-interactive/headless mode
                const geminiProcess = spawn('gemini', ['-p', prompt, '--skip-trust', '--yolo']);
                
                let stdout = '';
                let stderr = '';
                
                geminiProcess.stdout.on('data', data => {
                  stdout += data.toString();
                });
                
                geminiProcess.stderr.on('data', data => {
                  stderr += data.toString();
                });
                
                geminiProcess.on('close', code => {
                  if (code === 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ rawText: stdout }));
                  } else {
                    console.error('Gemini CLI exited with code:', code, 'stderr:', stderr);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Gemini CLI failed (exit code ${code}): ${stderr || 'Process exited with non-zero code.'}` }));
                  }
                });
                
                geminiProcess.on('error', err => {
                  console.error('Failed to start Gemini CLI:', err);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: `Failed to run Gemini CLI: ${err.message}. Ensure gemini is installed in your local system path.` }));
                });
                
              } catch (err) {
                const error = err as Error;
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `Server error: ${error.message}` }));
              }
            });
            return;
          }
          
          next();
        });
      }
    }
  ]
})

