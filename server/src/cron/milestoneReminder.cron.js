const cron = require("node-cron");
const prisma = require("../config/prisma");
const { publishEvent } = require("../services/eventPublisher.service");
const EVENTS = require("../config/events");

cron.schedule("0 0 * * *", async () => {
    console.log("Running milestone reminder cron...");

    // Normalize to midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const milestones = await prisma.milestone.findMany({
        where: {
            status: "PENDING",
            activatedAt: { not: null },
            dueDate: { not: null }
        },
        include: {
            project: {
                include: { user: true }
            }
        }
    });

    for (const milestone of milestones) {
        if (!milestone.project?.user?.email) continue;

        const dueDate = new Date(milestone.dueDate);
        dueDate.setUTCHours(0, 0, 0, 0);

        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        try {

            // ==========================================
            // 🔔 3 DAY REMINDER
            // ==========================================
            if (diffDays === 3 && !milestone.reminder3Sent) {

                await publishEvent(EVENTS.MILESTONE_REMINDER, {
                    email: milestone.project.user.email,
                    name: milestone.project.user.name,
                    milestoneTitle: milestone.title,
                    projectTitle: milestone.project.title,
                    dueDate
                });

                await prisma.milestone.update({
                    where: { id: milestone.id },
                    data: { reminder3Sent: true }
                });
            }

            // ==========================================
            // 🔔 1 DAY URGENT REMINDER
            // ==========================================
            if (diffDays === 1 && !milestone.reminder1Sent) {

                await publishEvent(EVENTS.MILESTONE_URGENT_REMINDER, {
                    email: milestone.project.user.email,
                    name: milestone.project.user.name,
                    milestoneTitle: milestone.title,
                    projectTitle: milestone.project.title,
                    dueDate
                });

                await prisma.milestone.update({
                    where: { id: milestone.id },
                    data: { reminder1Sent: true }
                });
            }

            // ==========================================
            // 🚨 OVERDUE LOGIC
            // ==========================================
            if (diffDays < 0) {

                const graceDays = 5;
                const overdueDays = Math.abs(diffDays);

                // Send overdue email only once
                if (!milestone.overdueSent) {

                    await publishEvent(EVENTS.MILESTONE_OVERDUE, {
                        email: milestone.project.user.email,
                        name: milestone.project.user.name,
                        milestoneTitle: milestone.title,
                        projectTitle: milestone.project.title,
                        dueDate
                    });

                    await prisma.milestone.update({
                        where: { id: milestone.id },
                        data: { overdueSent: true }
                    });
                }

                // ======================================
                // ⭐ RATING PENALTY AFTER GRACE
                // ======================================
                // ======================================
                // ⭐ RATING PENALTY AFTER GRACE
                // ======================================
                if (overdueDays > graceDays) {

                    const penaltyDays = overdueDays - graceDays;

                    if (penaltyDays > milestone.ratingPenaltyDays) {

                        const newPenaltyToApply =
                            penaltyDays - milestone.ratingPenaltyDays;

                        const currentRating =
                            milestone.project.rating ?? 5;

                        const penaltyAmount =
                            newPenaltyToApply * 0.2;

                        const newRating = Math.max(
                            0,
                            Math.min(10, currentRating - penaltyAmount)
                        );

                        await prisma.$transaction([
                            prisma.userProject.update({
                                where: { id: milestone.project.id },
                                data: { rating: newRating }
                            }),
                            prisma.milestone.update({
                                where: { id: milestone.id },
                                data: { ratingPenaltyDays: penaltyDays }
                            })
                        ]);
                    }
                }
            }

        } catch (err) {
            console.error("Milestone cron error:", err);
        }
    }
});