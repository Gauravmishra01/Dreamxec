const { z, email } = require("zod");

// 1) Create Razorpay Order (guest + logged-in)
exports.createOrderSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    email:z.email().required(),
    projectId: z.string().min(1, "Project ID is required"),
    guestEmail: z.string().email("Invalid email").optional(),
    guestPAN: z.string()
      .regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN format')
      .optional()
  }).refine(
    (data) =>
      data.guestEmail && data.guestPAN || !data.guestEmail,
    {
      message: "PAN is required for guest donations",
      path: ["guestPAN"]
    }
  ),
});

// 2) Logged-in direct donation (optional)
exports.makeDonationDirectSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be a positive number"),
    projectId: z.string().min(1, "Project ID is required"),
  }),
});

// 3) Razorpay client-side payment verification (optional)
exports.verifyPaymentSchema = z.object({
  body: z.object({
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1),
  }),
});
