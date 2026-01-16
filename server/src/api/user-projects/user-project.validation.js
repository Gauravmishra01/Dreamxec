const { z } = require('zod');

/* =========================================================
   Shared Milestone Schema
========================================================= */

// This represents ONE milestone object
const milestoneSchema = z.object({
  title: z.string().min(3, 'Milestone title must be at least 3 characters'),
  timeline: z.string().min(1, 'Milestone timeline is required'),
  budget: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive('Milestone budget must be positive')
  ),
  description: z.string().optional(),
});

/* =========================================================
   CREATE USER PROJECT
========================================================= */

exports.createUserProjectSchema = z.object({
  body: z
    .object({
      title: z.string().min(5).max(200),
      description: z.string().min(20),
      companyName: z.string().optional(),

      goalAmount: z.preprocess(
        (val) => (typeof val === 'string' ? parseFloat(val) : val),
        z.number().positive('Goal amount must be positive')
      ),

      skillsRequired: z.preprocess(
        (val) => {
          if (typeof val === 'string') {
            try {
              return JSON.parse(val);
            } catch {
              return [];
            }
          }
          return val;
        },
        z.array(z.string()).optional()
      ),

      // ✅ Milestones come as JSON string via FormData
      milestones: z
        .string()
        .transform((val) => {
          try {
            return JSON.parse(val);
          } catch {
            return [];
          }
        })
        .refine(
          (val) => Array.isArray(val) && val.length > 0,
          'At least one milestone is required'
        )
        .refine(
          (val) => val.every((m) => milestoneSchema.safeParse(m).success),
          'Invalid milestone structure'
        ),

      // External link
      presentationDeckUrl: z.string().url().optional().or(z.literal('')),
    })
    .superRefine((data, ctx) => {
      // 🔒 Validate total milestone budget ≤ goalAmount
      const totalMilestoneBudget = data.milestones.reduce(
        (sum, m) => sum + Number(m.budget || 0),
        0
      );

      if (totalMilestoneBudget > data.goalAmount) {
        ctx.addIssue({
          path: ['milestones'],
          message: 'Total milestone budget cannot exceed goal amount',
          code: z.ZodIssueCode.custom,
        });
      }
    }),
});

/* =========================================================
   UPDATE USER PROJECT
========================================================= */

exports.updateUserProjectSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(200, 'Title too long')
        .optional(),

      description: z
        .string()
        .min(20, 'Description must be at least 20 characters')
        .optional(),

      companyName: z.string().optional(),

      skillsRequired: z
        .preprocess(
          (val) => {
            if (typeof val === 'string') {
              try {
                return JSON.parse(val);
              } catch {
                return [];
              }
            }
            return val;
          },
          z.array(z.string()).optional()
        ),

      goalAmount: z
        .preprocess(
          (val) => (typeof val === 'string' ? parseFloat(val) : val),
          z.number().positive('Goal amount must be positive')
        )
        .optional(),

      imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
      campaignMedia: z.array(z.string().url()).optional(),

      presentationDeckUrl: z.string().url().optional().or(z.literal('')),

      // ✅ Optional milestone update (only PENDING / REJECTED allowed in controller)
      milestones: z
        .string()
        .optional()
        .transform((val) => {
          if (!val) return undefined;
          try {
            return JSON.parse(val);
          } catch {
            return undefined;
          }
        })
        .refine(
          (val) =>
            val === undefined ||
            (Array.isArray(val) &&
              val.every((m) => milestoneSchema.safeParse(m).success)),
          'Invalid milestone structure'
        ),
    })
    .superRefine((data, ctx) => {
      if (data.milestones && data.goalAmount) {
        const totalMilestoneBudget = data.milestones.reduce(
          (sum, m) => sum + Number(m.budget || 0),
          0
        );

        if (totalMilestoneBudget > data.goalAmount) {
          ctx.addIssue({
            path: ['milestones'],
            message: 'Total milestone budget cannot exceed goal amount',
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }),
});
