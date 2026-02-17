const prisma = require("../src/config/prisma");
const slugify = require("slugify");

async function backfillClubSlugs() {
  console.log("Starting club slug backfill...\n");

  const allClubs = await prisma.club.findMany();
  const clubs = allClubs.filter(club => !club.slug);

  console.log(`Found ${clubs.length} clubs without slug\n`);

  for (const club of clubs) {
    const baseSlug = slugify(
      `${club.college} ${club.name}`,
      {
        lower: true,
        strict: true,
        trim: true,
      }
    );

    let slug = baseSlug;
    let counter = 1;

    while (await prisma.club.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }


    await prisma.club.update({
      where: { id: club.id },
      data: { slug }
    });

    console.log(`✔ ${club.name} → ${slug}`);
  }

  console.log("\nBackfill completed successfully.");
  process.exit(0);
}

backfillClubSlugs().catch((error) => {
  console.error(error);
  process.exit(1);
});
