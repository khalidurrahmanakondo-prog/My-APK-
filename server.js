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

    try {
        // ভিডিও লিঙ্ক বের করার এপিআই
        const response = await axios.get(`https://api.vkrdownloader.workers.dev/server?v=${encodeURIComponent(videoUrl)}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video link' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`KR Server running on port ${PORT}`));
