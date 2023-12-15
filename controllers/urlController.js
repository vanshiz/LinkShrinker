const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortUrl(req, res) {
    try {
        const { url } = req.body;
        console.log(url);
        // Validate if the URL is provided
        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const shortID = shortid.generate();

        // Create a new URL entry
        const newURL = await URL.create({
            shortId: shortID,
            redirectURL: url,
            visitHistory: [],
        });

        return res.render("home",{
            id:shortID,
        });
    } catch (error) {
        console.error("Error generating short URL:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

async function handlegetAnalytics(req, res) {
    try {
        const shortId = req.params.shortId;
        const result = await URL.findOne({ shortId });

        if (!result) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        return res.json({
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        });
    } catch (error) {
        console.error('Error retrieving analytics:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}



module.exports = {
    handleGenerateNewShortUrl,
    handlegetAnalytics,
};
