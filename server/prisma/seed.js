const prisma = require("../src/config/prisma");
const slugify = require("slugify");

async function run() {
  const campaigns = await prisma.userProject.findMany();

  for (const c of campaigns) {
    if (!c.slug) {
      const slug = slugify(c.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      await prisma.userProject.update({
        where: { id: c.id },
        data: { slug },
      });

      console.log("Updated:", c.title);
    }
  }

  console.log("All slugs generated.");
  process.exit();
}

run();
