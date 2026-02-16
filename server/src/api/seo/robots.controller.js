exports.getRobotsTxt = (req, res) => {
    const content = `User-agent: *
Allow: /

Sitemap: https://dreamxec.com/sitemap.xml
`;

    res.header("Content-Type", "text/plain");
    res.send(content);
};
