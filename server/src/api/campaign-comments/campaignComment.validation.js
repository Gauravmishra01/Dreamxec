const { z } = require("zod");

// Basic Mongo ObjectId check (24 hex chars)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

exports.createCommentSchema = z.object({
  params: z.object({
    campaignId: objectIdSchema,
  }),
  body: z.object({
    content: z
      .string()
      .trim()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment cannot exceed 500 characters"),
    parentId: objectIdSchema.optional(),
  }),
});

exports.deleteCommentSchema = z.object({
  params: z.object({
    commentId: objectIdSchema,
  }),
});

exports.reportCommentSchema = z.object({
  params: z.object({
    commentId: objectIdSchema,
  }),
});
