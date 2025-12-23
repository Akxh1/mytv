import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter required' });
    }

    try {
        console.log(`Proxying: ${url}`);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': new URL(url).origin + '/',
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
        }

        // Forward content type
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // For m3u8 files, rewrite URLs to go through proxy
        if (url.includes('.m3u8')) {
            let body = await response.text();
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

            // Rewrite relative URLs in the m3u8 to go through our proxy
            body = body.split('\n').map(line => {
                line = line.trim();
                if (line && !line.startsWith('#')) {
                    // It's a URL line
                    if (line.startsWith('http')) {
                        return `/proxy?url=${encodeURIComponent(line)}`;
                    } else {
                        // Relative URL
                        return `/proxy?url=${encodeURIComponent(baseUrl + line)}`;
                    }
                }
                return line;
            }).join('\n');

            res.send(body);
        } else {
            // For .ts segments and other files, pipe directly
            response.body.pipe(res);
        }
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 CORS Proxy server running at http://localhost:${PORT}`);
    console.log(`   Use: http://localhost:${PORT}/proxy?url=<encoded_stream_url>`);
});
