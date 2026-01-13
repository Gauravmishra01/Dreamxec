const { z } = require('zod');

exports.createUserProjectSchema = z.object({
  body: z.object({
    goalAmount: z.preprocess(
      (val) => (typeof val === 'string' ? parseFloat(val) : val),
      z.number().positive('Goal amount must be positive')
    ),
    skillsRequired: z.preprocess(
      (val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch (e) {
            return [];
          }
        }
        return val;
      },
      z.array(z.string()).optional()
    ),
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    companyName: z.string().optional(),
    timeline: z.string().optional(),
    imageUrl: z.string().optional().or(z.literal('')),
    campaignMedia: z.array(z.string().url()).optional(),
    presentationDeckUrl: z.string().optional().or(z.literal('')),
  }),
});

exports.updateUserProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long').optional(),
    description: z.string().min(20, 'Description must be at least 20 characters').optional(),
    companyName: z.string().optional(),
    skillsRequired: z.array(z.string()).optional(),
    timeline: z.string().optional(),
    goalAmount: z.number().positive('Goal amount must be positive').optional(),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    campaignMedia: z.array(z.string().url()).optional(),
    presentationDeckUrl: z.string().url().optional().or(z.literal('')),
  }),
});
