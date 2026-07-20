/**
 * superAdmin.ts — tRPC router for super admin email/password authentication.
 *
 * Procedures:
 *   1. publicProcedure: login  — verify email + password, issue a signed JWT cookie
 *   2. publicProcedure: me     — return current super admin session (or null)
 *   3. publicProcedure: logout — clear the super admin session cookie
 *
 * The super admin session uses a SEPARATE cookie ("sa_session") from the Manus
 * OAuth session ("app_session_id"), so both can coexist without conflict.
 */

import bcrypt from "bcryptjs";
import { parse as parseCookie } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { getSuperAdminByEmail } from "../db";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { getSessionCookieOptions } from "../_core/cookies";
import { TRPCError } from "@trpc/server";

// ─── Constants ───────────────────────────────────────────────────────────────

const SA_COOKIE_NAME = "sa_session";
const SA_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ─── JWT helpers ─────────────────────────────────────────────────────────────

function getSecret() {
  return new TextEncoder().encode(ENV.cookieSecret + "_super_admin");
}

async function signSaSession(email: string): Promise<string> {
  const expiresAt = Math.floor((Date.now() + SA_SESSION_DURATION_MS) / 1000);
  return new SignJWT({ email, type: "super_admin" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expiresAt)
    .sign(getSecret());
}

async function verifySaSession(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.email !== "string" ||
      payload.type !== "super_admin"
    ) {
      return null;
    }
    return { email: payload.email };
  } catch {
    return null;
  }
}

function getSaTokenFromRequest(req: { headers: { cookie?: string; authorization?: string } }): string | null {
  const cookies = parseCookie(req.headers.cookie ?? "");
  return cookies[SA_COOKIE_NAME] ?? null;
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const superAdminRouter = router({
  /**
   * Login with email + password.
   * On success, sets a signed HttpOnly cookie and returns { ok: true }.
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const admin = await getSuperAdminByEmail(input.email);

      if (!admin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const valid = await bcrypt.compare(input.password, admin.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const token = await signSaSession(admin.email);

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(SA_COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: SA_SESSION_DURATION_MS,
      });

      return { ok: true, email: admin.email };
    }),

  /**
   * Return the current super admin session or null (for auth state checks).
   */
  me: publicProcedure.query(async ({ ctx }) => {
    const token = getSaTokenFromRequest(ctx.req);
    if (!token) return null;
    const session = await verifySaSession(token);
    if (!session) return null;
    return { email: session.email, isSuperAdmin: true };
  }),

  /**
   * Logout — clears the super admin session cookie.
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.cookie(SA_COOKIE_NAME, "", {
      ...cookieOptions,
      maxAge: 0,
    });
    return { ok: true };
  }),
});
