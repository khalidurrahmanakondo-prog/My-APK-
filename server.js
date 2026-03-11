const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL is required');

    // কয়েকটি শক্তিশালী এপিআই ব্যাকআপ
    const apiSources = [
        `https://api.vkrdownloader.workers.dev/server?v=${encodeURIComponent(videoUrl)}`,
        `https://api.vkrdownloader.workers.dev/api?url=${encodeURIComponent(videoUrl)}`
    ];

    for (let source of apiSources) {
        try {
            const response = await axios.get(source, { timeout: 10000 });
            if (response.data && (response.data.url || response.data.data)) {
                return res.json(response.data);
            }
        } catch (e) {
            continue; 
        }
    }
    res.status(500).json({ error: 'Video not found after trying multiple sources' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`KR Server running on port ${PORT}`));
