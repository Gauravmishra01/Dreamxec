const prisma = require("../../config/prisma");

exports.getSitemap = async (req, res) => {
    try {
        const campaigns = await prisma.userProject.findMany({
            where: { status: "APPROVED" },
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        const baseUrl = "https://dreamxec.com";

        const urls = campaigns
            .map((campaign) => {
                return `
          <url>
            <loc>${baseUrl}/campaign/${campaign.slug}</loc>
            <lastmod>${campaign.updatedAt.toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `;
            })
            .join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${urls}
</urlset>`;


        res.header("Content-Type", "application/xml");
        res.send(xml);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error generating sitemap");
    }
};
