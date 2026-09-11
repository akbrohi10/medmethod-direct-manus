import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { lookupCareTeamBookingCalendarEvent } from "../careTeamBookingCalendar";

export const careTeamBookingRouter = router({
  getCalendarEvent: publicProcedure
    .input(z.object({ contactId: z.string().trim().min(1).max(191) }))
    .query(async ({ input, ctx }) => {
      ctx.res.setHeader("Cache-Control", "no-store, max-age=0");
      return {
        event: await lookupCareTeamBookingCalendarEvent(input.contactId),
      };
    }),
});
