import { z } from "zod";

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

const milestoneSchema = z.object({
  title: z.string().min(3).max(100),
  timeline: z.string().min(1).max(100),

  budget: z.preprocess(
    (v) => (typeof v === "string" ? parseFloat(v) : v),
    z.number().positive().max(MAX_GOAL_AMOUNT)
  ),

  description: z.string().max(500).optional(),
});

/* =====================================================
   TEAM MEMBER
===================================================== */

const teamMemberSchema = z.object({
  name: z.string().min(2).max(50),
  role: z.string().min(2).max(50),

  // image injected by backend
  image: z.string().url().optional(),
});

/* =====================================================
   FAQ
===================================================== */

const faqSchema = z.object({
  question: z.string().min(5).max(200),
  answer: z.string().min(5).max(500),
});

export const createUserProjectSchema = z.object({
  body: z
    .object({
      /* ------------------ */
      /* BASIC INFO */
      /* ------------------ */

      title: z.string().min(5).max(200),
      description: z.string().min(20).max(5000),

      companyName: z
        .string()
        .trim()
        .max(120)
        .optional()
        .transform((v) => (v === "" ? undefined : v)),

      campaignType: z
        .enum(["INDIVIDUAL", "TEAM"])
        .default("INDIVIDUAL"),

      goalAmount: z.preprocess(
        (v) => (typeof v === "string" ? parseFloat(v) : v),
        z.number().positive().max(MAX_GOAL_AMOUNT)
      ),

      /* ------------------ */
      /* SKILLS */
      /* ------------------ */

      skillsRequired: z
        .preprocess((v) => {
          if (!v) return [];
          if (typeof v === "string") return safeJSONParse(v, "skills");
          return v;
        }, z.array(z.string().min(2).max(50)).max(20))
        .optional(),

      /* ------------------ */
      /* TEAM */
      /* ------------------ */

      teamMembers: z
        .preprocess((v) => {
          if (!v) return [];
          if (typeof v === "string") return safeJSONParse(v, "teamMembers");
          return v;
        }, z.array(teamMemberSchema).max(MAX_TEAM_MEMBERS))
        .optional(),

      /* ------------------ */
      /* FAQS */
      /* ------------------ */

      faqs: z
        .preprocess((v) => {
          if (!v) return [];
          if (typeof v === "string") return safeJSONParse(v, "faqs");
          return v;
        }, z.array(faqSchema).max(MAX_FAQS))
        .optional(),

      /* ------------------ */
      /* YOUTUBE */
      /* ------------------ */

      youtubeUrl: z
        .string()
        .optional()
        .refine(
          (v) => !v || youtubeRegex.test(v),
          "Invalid YouTube URL"
        ),

      /* ------------------ */
      /* MILESTONES */
      /* ------------------ */

      milestones: z
        .preprocess(
          (v) =>
            typeof v === "string"
              ? safeJSONParse(v, "milestones")
              : v,
          z
            .array(milestoneSchema)
            .min(1)
            .max(MAX_MILESTONES)
        ),

      presentationDeckUrl: z
        .string()
        .url()
        .optional()
        .or(z.literal("")),
    })

    /* =====================================================
       SUPER VALIDATION
    ===================================================== */

    .superRefine((data, ctx) => {
      /* ------------------ */
      /* Budget vs Milestones */
      /* ------------------ */

      const totalMilestones = data.milestones.reduce(
        (s, m) => s + m.budget,
        0
      );

      if (totalMilestones > data.goalAmount) {
        ctx.addIssue({
          path: ["milestones"],
          message:
            "Total milestone budget cannot exceed goal amount",
          code: z.ZodIssueCode.custom,
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
          code: z.ZodIssueCode.custom,
        });
      }

      /* ------------------ */
      /* Duplicate milestone titles */
      /* ------------------ */

      const titles = data.milestones.map((m) =>
        m.title.toLowerCase()
      );

      if (new Set(titles).size !== titles.length) {
        ctx.addIssue({
          path: ["milestones"],
          message:
            "Milestone titles must be unique",
          code: z.ZodIssueCode.custom,
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
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }),
});
