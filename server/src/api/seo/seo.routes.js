const express = require("express");
const { getCampaignSeo } = require("./seo.controller");
const { getSitemap } = require("./sitemap.controller");
const { getRobotsTxt } = require("./robots.controller");

const router = express.Router();

router.get("/seo/campaign/:id", getCampaignSeo);
router.get("/sitemap.xml", getSitemap);
router.get("/robots.txt", getRobotsTxt);

module.exports = router;
