import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { deliverWL2IntakeToGhl } from "../wl2IntakeWebhook";

const wl2IntakeSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  zip_code: z.string().trim().max(10),
  weight_goal: z.string().trim().max(100),
  weight_duration: z.string().trim().max(100),
  glp1_before: z.enum(["yes", "no"]),
  glp1_details: z.string().trim().max(2_000),
  conditions: z.string().trim().max(2_000),
  medications: z.string().trim().max(2_000),
  has_labs: z.enum(["yes", "no", ""]),
  primary_goal: z.string().trim().max(100),
  activity_level: z.string().trim().max(100),
  height: z.string().trim().max(20),
  weight_lbs: z.string().trim().max(20),
  age: z.string().trim().max(3),
  sex: z.string().trim().max(20),
  landing_page: z.literal("/lp/WL2"),
});

export const wl2IntakeRouter = router({
  /**
   * Receives a completed WL2 intake in the browser and forwards it to GHL.
   * The GHL destination remains server-only, and failure does not block checkout.
   */
  submit: publicProcedure.input(wl2IntakeSchema).mutation(async ({ input }) => {
    const result = await deliverWL2IntakeToGhl(input);
    return { accepted: true, delivered: result.delivered };
  }),
});
