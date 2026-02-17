const zod = require("zod");

/* =====================================================
   CONSTANTS (ANTI-ABUSE LIMITS)
===================================================== */

const MAX_TEAM_MEMBERS = 20;
const MAX_FAQS = 15;
const MAX_MILESTONES = 20;
const MAX_GOAL_AMOUNT = 10_000_000; // 1 Cr limit safety

/* =====================================================
   HELPERS
===================================================== */

const safeJSONParse = (val, label) => {
  try {
    return JSON.parse(val);
  } catch {
    throw new Error(`Invalid ${label} JSON`);
  }
};

const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

/* =====================================================
   MILESTONE
===================================================== */

const milestoneSchema = zod.object({
  title: zod.string().min(3).max(100),
  timeline: zod.string().min(1).max(100),

  budget: zod.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    zod.number().positive().max(MAX_GOAL_AMOUNT)
  ),

  description: zod.string().max(500).optional(),
});

/* =====================================================
   TEAM MEMBER
===================================================== */

const teamMemberSchema = zod.object({
  name: zod.string().min(2).max(50),
  role: zod.string().min(2).max(50),

  // image injected by backend
  image: zod.string().url().optional(),
});

/* =====================================================
   FAQ
===================================================== */

const faqSchema = zod.object({
  question: zod.string().min(5).max(200),
  answer: zod.string().min(5).max(500),
});

/* =====================================================
   CREATE USER PROJECT SCHEMA
===================================================== */

const createUserProjectSchema = zod.object({
  body: zod
    .object({
      /* ------------------ */
      /* BASIC INFO */
      /* ------------------ */

      title: zod.string().min(5).max(200),
      description: zod.string().min(20).max(5000),

      companyName: zod
        .string()
        .trim()
        .max(120)
        .optional()
        .transform((v) => (v === "" ? undefined : v)),

      campaignType: zod
        .enum(["INDIVIDUAL", "TEAM"])
        .default("INDIVIDUAL"),

      goalAmount: zod.preprocess(
        (v) => (typeof v === "string" ? parseFloat(v) : v),
        zod.number().positive().max(MAX_GOAL_AMOUNT)
      ),

      /* ------------------ */
      /* SKILLS */
      /* ------------------ */

      skillsRequired: zod
        .preprocess((v) => {
          if (!v) return [];
          if (typeof v === "string") return safeJSONParse(v, "skills");
          return v;
        }, zod.array(zod.string().min(2).max(50)).max(20))
        .optional(),

      /* ------------------ */
      /* TEAM */
      /* ------------------ */

      teamMembers: zod
        .preprocess((v) => {
          if (!v) return [];
          if (typeof v === "string") return safeJSONParse(v, "teamMembers");
          return v;
        }, zod.array(teamMemberSchema).max(MAX_TEAM_MEMBERS))
        .optional(),

      /* ------------------ */
      /* FAQS */
      /* ------------------ */

      faqs: zod
        .preprocess((v) => {
          if (!v) return [];
          if (typeof v === "string") return safeJSONParse(v, "faqs");
          return v;
        }, zod.array(faqSchema).max(MAX_FAQS))
        .optional(),

      /* ------------------ */
      /* YOUTUBE */
      /* ------------------ */

      youtubeUrl: zod
        .string()
        .optional()
        .refine(
          (v) => !v || youtubeRegex.test(v),
          "Invalid YouTube URL"
        ),

      /* ------------------ */
      /* MILESTONES */
      /* ------------------ */

      milestones: zod.preprocess(
        (v) =>
          typeof v === "string"
            ? safeJSONParse(v, "milestones")
            : v,
        zod
          .array(milestoneSchema)
          .min(1)
          .max(MAX_MILESTONES)
      ),

      presentationDeckUrl: zod
        .string()
        .url()
        .optional()
        .or(zod.literal("")),
    })

    /* =====================================================
       SUPER VALIDATION
    ===================================================== */

    .superRefine((data, ctx) => {
      /* ------------------ */
      /* Budget vs Milestones */
      /* ------------------ */

      let totalMilestones = 0;
      if (Array.isArray(data.milestones)) {
        totalMilestones = data.milestones.reduce(
          (s, m) => s + m.budget,
          0
        );
      }

      if (totalMilestones > data.goalAmount) {
        ctx.addIssue({
          path: ["milestones"],
          message:
            "Total milestone budget cannot exceed goal amount",
          code: zod.ZodIssueCode.custom,
        });
      }

      /* ------------------ */
      /* Team rule */
      /* ------------------ */

      if (
        data.campaignType === "TEAM" &&
        (!data.teamMembers ||
          data.teamMembers.length === 0)
      ) {
        ctx.addIssue({
          path: ["teamMembers"],
          message:
            "TEAM campaign must include team members",
          code: zod.ZodIssueCode.custom,
        });
      }

      /* ------------------ */
      /* Duplicate milestone titles */
      /* ------------------ */

      const titles = Array.isArray(data.milestones) 
        ? data.milestones.map((m) => m.title.toLowerCase())
        : [];

      if (new Set(titles).size !== titles.length) {
        ctx.addIssue({
          path: ["milestones"],
          message:
            "Milestone titles must be unique",
          code: zod.ZodIssueCode.custom,
        });
      }

      /* ------------------ */
      /* Duplicate FAQ questions */
      /* ------------------ */

      if (data.faqs) {
        const questions = data.faqs.map((f) =>
          f.question.toLowerCase()
        );

        if (new Set(questions).size !== questions.length) {
          ctx.addIssue({
            path: ["faqs"],
            message:
              "Duplicate FAQ questions detected",
            code: zod.ZodIssueCode.custom,
          });
        }
      }
    }),
});

module.exports = {
  createUserProjectSchema,
};
