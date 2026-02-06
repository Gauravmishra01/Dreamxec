const prisma = require("../src/config/prisma");

async function backfillCampaignClubIds() {
  console.log("🚀 Starting campaign clubId backfill...");

  const campaigns = await prisma.userProject.findMany({
    where: {
      OR: [
        { clubId: null },
        { clubId: { isSet: false } }, // 🔑 THIS IS THE FIX
      ],
    },
    include: {
      user: { select: { clubIds: true } },
    },
  });

  if (campaigns.length === 0) {
    console.log("✅ No campaigns found without clubId. Nothing to backfill.");
    return;
  }

  for (const campaign of campaigns) {
    const clubId = campaign.user?.clubIds?.[0];

    if (!clubId) {
      console.log(
        `⚠️ Skipping campaign "${campaign.title}" (${campaign.id}) — user has no club`
      );
      continue;
    }

    await prisma.userProject.update({
      where: { id: campaign.id },
      data: { clubId },
    });

    console.log(
      `✅ Updated campaign "${campaign.title}" → clubId = ${clubId}`
    );
  }

  console.log("🎉 Campaign clubId backfill complete");
}

backfillCampaignClubIds()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
