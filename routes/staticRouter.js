const express = require("express");
const router = express.Router();
const URL = require("../models/url"); // Import your URL model

router.get("/", async (req, res) => {
    try {
        const allurls = await URL.find({});
        console.log(allurls);
        return res.render("home", {
            urls: allurls
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
