const express = require("express");
const router = express.Router();
const { handleGenerateNewShortUrl,handlegetAnalytics} = require("../controllers/urlController");



router.post('/', handleGenerateNewShortUrl);
router.get('/analytics/:shortId',handlegetAnalytics);
module.exports = router;