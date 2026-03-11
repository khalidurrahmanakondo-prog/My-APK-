const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

// ভিডিও লিঙ্ক খোঁজার উন্নত এপিআই এন্ডপয়েন্ট
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send('URL is required');

    try {
        // নতুন একটি পাবলিক API ব্যবহার করা হচ্ছে যা বেশি কার্যকর
        const apiUrl = `https://api.vkrdownloader.workers.dev/server?v=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        // যদি API থেকে ডাটা পাওয়া যায়
        if (response.data && response.data.data) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: 'Video not found' });
        }
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch video link' });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`KR Server running on port ${PORT}`));
