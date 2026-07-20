import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { parse as parseCookie } from "cookie";
import { jwtVerify } from "jose";
import type { TrpcContext } from "./context";
import { ENV } from "./env";

// ─── Super admin JWT helpers (mirrors superAdmin.ts) ─────────────────────────

const SA_COOKIE_NAME = "sa_session";

function getSaSecret() {
  return new TextEncoder().encode(ENV.cookieSecret + "_super_admin");
}

async function verifySaToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSaSecret(), { algorithms: ["HS256"] });
    if (typeof payload.email !== "string" || payload.type !== "super_admin") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

async function isSuperAdminRequest(req: TrpcContext["req"]): Promise<boolean> {
  const cookies = parseCookie(req.headers.cookie ?? "");
  const token = cookies[SA_COOKIE_NAME];
  if (!token) return false;
  const session = await verifySaToken(token);
  return session !== null;
}

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

/**
 * superAdminOrAdminProcedure — accepts either:
 *  1. A Manus OAuth session with role='admin', OR
 *  2. A valid super admin JWT cookie (sa_session)
 *
 * Use this for admin dashboard procedures that the super admin must also access.
 */
export const superAdminOrAdminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    const isOAuthAdmin = ctx.user?.role === 'admin';
    const isSuperAdmin = await isSuperAdminRequest(ctx.req);

    if (!isOAuthAdmin && !isSuperAdmin) {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({ ctx });
  }),
);
