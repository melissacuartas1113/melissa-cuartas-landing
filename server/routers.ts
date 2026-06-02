import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { saveLead, markLeadEmailSent } from "./db";
import { sendLeadNotificationEmail } from "./email";

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

  leads: router({
    capture: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Invalid email"),
          whatsapp: z.string().optional(),
          country: z.string().optional(),
          source: z.string().default("landing-page"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Save lead to database
          const result = await saveLead({
            name: input.name,
            email: input.email,
            whatsapp: input.whatsapp,
            country: input.country,
            source: input.source,
          });

          // Get the inserted lead ID
          const leadId = (result as any).insertId;

          // Send email notification asynchronously (fire and forget)
          sendLeadNotificationEmail(input).then((emailSent) => {
            if (emailSent && leadId) {
              markLeadEmailSent(leadId).catch((err) => {
                console.error("[Leads] Error marking email sent:", err);
              });
            }
          }).catch((err) => {
            console.error("[Leads] Error sending email:", err);
          });

          return {
            success: true,
            leadId,
          };
        } catch (error) {
          console.error("[Leads] Error capturing lead:", error);
          throw new Error("Failed to capture lead");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
