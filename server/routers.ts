import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { paypalRouter } from "./routers/paypal";
import { emailSettingsRouter } from "./routers/emailSettings";
import { referralCreditsRouter } from "./routers/referralCredits";
import { stripeRouter } from "./routers/stripe";
import { superAdminRouter } from "./routers/superAdmin";
import { wl2IntakeRouter } from "./routers/wl2Intake";
import { careTeamBookingRouter } from "./routers/careTeamBooking";
import { intakeDeliverySettingsRouter } from "./routers/intakeDeliverySettings";
import { masterclassVideoRouter } from "./routers/masterclassVideo";
import { masterclassVideo4799Router } from "./routers/masterclassVideo4799";
import { menopauseVideo97Router } from "./routers/menopauseVideo97";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  stripe: stripeRouter,
  paypal: paypalRouter,
  emailSettings: emailSettingsRouter,
  referralCredits: referralCreditsRouter,
  wl2Intake: wl2IntakeRouter,
  careTeamBooking: careTeamBookingRouter,
  intakeDeliverySettings: intakeDeliverySettingsRouter,
  masterclassVideo: masterclassVideoRouter,
  masterclassVideo4799: masterclassVideo4799Router,
  menopauseVideo97: menopauseVideo97Router,
  superAdmin: superAdminRouter,
});

export type AppRouter = typeof appRouter;
