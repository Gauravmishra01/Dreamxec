const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AppError = require('../../utils/AppError');

// Toggle Wishlist (Add/Remove)
exports.toggleWishlist = async (req, res, next) => {
  try {
    const donorId = req.user.id; // From protect middleware (must be DONOR)
    const { campaignId } = req.body;

    if (!campaignId) {
      return next(new AppError('Campaign ID is required', 400));
    }

    // Check if already wishlisted
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        donorId_userProjectId: {
          donorId,
          userProjectId: campaignId,
        },
      },
    });

    if (existingWishlist) {
      // If exists, remove it
      await prisma.wishlist.delete({
        where: { id: existingWishlist.id },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Removed from wishlist',
        isWishlisted: false,
      });
    } else {
      // If not exists, add it
      await prisma.wishlist.create({
        data: {
          donorId,
          userProjectId: campaignId,
        },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Added to wishlist',
        isWishlisted: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get Donor's Wishlist
exports.getMyWishlist = async (req, res, next) => {
  try {
    const donorId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: { donorId },
      include: {
        userProject: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            goalAmount: true,
            amountRaised: true,
            status: true,
            status: true,
            // category: true, // REMOVED: Field does not exist in UserProject schema

            // Checking schema again: UserProject has title, description, companyName, skillsRequired, timeline, goalAmount, amountRaised, imageUrl, status... No category.
            // But CampaignDetails showed category?
            // "campaign.category" was used in CampaignDetails.tsx. Maybe it's mapped or I missed it.
            // Let's stick to available fields.
            createdAt: true,
            companyName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const campaigns = wishlist.map(item => item.userProject);

    res.status(200).json({
      status: 'success',
      results: campaigns.length,
      data: {
        campaigns,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Check if specific campaign is wishlisted
exports.checkWishlistStatus = async (req, res, next) => {
    try {
        const donorId = req.user.id;
        const { campaignId } = req.params;

        const exists = await prisma.wishlist.findUnique({
            where: {
                donorId_userProjectId: {
                    donorId,
                    userProjectId: campaignId
                }
            }
        });

        res.status(200).json({
            status: 'success',
            isWishlisted: !!exists
        });
    } catch (error) {
        next(error);
    }
};
