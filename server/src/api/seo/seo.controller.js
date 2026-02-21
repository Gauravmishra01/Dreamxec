const prisma = require("../../config/prisma");
const escape = require("escape-html");

exports.getCampaignSeo = async (req, res) => {
    try {
        const { id: identifier } = req.params;

        let campaign;

        // If identifier looks like Mongo ObjectId (24 chars)
        if (identifier.length === 24) {
            campaign = await prisma.userProject.findUnique({
                where: { id: identifier },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    description: true,
                    imageUrl: true,
                },
            });

            // If ID used → redirect to slug (SEO important)
            if (campaign && campaign.slug) {
                return res.redirect(
                    301,
                    `https://dreamxec.com/campaign/${campaign.slug}`
                );
            }
        } else {
            campaign = await prisma.userProject.findUnique({
                where: { slug: identifier },
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    description: true,
                    imageUrl: true,
                },
            });
        }

        if (!campaign) {
            return res.status(404).send("Not Found");
        }

        const title = escape(campaign.title);
        const description = escape(
            campaign.description?.slice(0, 200) ||
            "Support this innovation on DreamXec."
        );

        const image =
            campaign.imageUrl ||
            "https://dreamxec.com/og-image.png";

        const canonicalUrl = `https://dreamxec.com/campaign/${campaign.slug}`;

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": campaign.title,
            "description": campaign.description,
            "image": image,
            "url": canonicalUrl,
            "dateModified": campaign.updatedAt,
            "author": {
                "@type": "Organization",
                "name": "DreamXec"
            },
            "publisher": {
                "@type": "Organization",
                "name": "DreamXec",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://dreamxec.com/og-image.png"
                }
            }
        };


        return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta name="description" content="${description}" />

          <link rel="canonical" href="${canonicalUrl}" />

          <meta property="og:type" content="website" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:url" content="${canonicalUrl}" />
          <meta property="og:site_name" content="DreamXec" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${image}" />

          <script type="application/ld+json">
      ${JSON.stringify(structuredData)}
    </script>

        </head>
        <body></body>
      </html>
    `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
