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

    // কয়েকটি ব্যাকআপ এপিআই লিস্ট
    const apiList = [
        `https://api.vkrdownloader.workers.dev/server?v=${encodeURIComponent(videoUrl)}`,
        `https://api.vkrdownloader.workers.dev/api?url=${encodeURIComponent(videoUrl)}`
    ];

    for (let api of apiList) {
        try {
            const response = await axios.get(api, { timeout: 10000 });
            if (response.data && (response.data.data || response.data.url)) {
                return res.json(response.data);
            }
        } catch (e) {
            console.log("Trying next API...");
        }
    }
    res.status(500).json({ error: 'সবগুলো এপিআই ব্যর্থ হয়েছে' });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
