import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { saveLead, markLeadEmailSent, getAllLeads } from "./db";
import { sendLeadNotificationEmail } from "./email";
import { TRPCError } from "@trpc/server";

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
    getAll: protectedProcedure
      .input(
        z.object({
          dateFrom: z.date().optional(),
          dateTo: z.date().optional(),
          source: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        // Only admins can view all leads
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view leads" });
        }

        const leads = await getAllLeads({
          dateFrom: input.dateFrom,
          dateTo: input.dateTo,
          source: input.source,
        });

        return leads;
      }),

    exportCsv: protectedProcedure
      .input(
        z.object({
          dateFrom: z.date().optional(),
          dateTo: z.date().optional(),
          source: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        // Only admins can export leads
        if (ctx.user?.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can export leads" });
        }

        const leads = await getAllLeads({
          dateFrom: input.dateFrom,
          dateTo: input.dateTo,
          source: input.source,
        });

        // Generate CSV
        const headers = ["ID", "Nombre", "Email", "WhatsApp", "País", "Fuente", "Email Enviado", "Fecha Captura"];
        
        const escapeCsvField = (field: any) => {
          const str = String(field || "");
          if (str.includes(",") || str.includes("\n") || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        
        const rows = leads.map((lead: any) => [
          lead.id,
          lead.name,
          lead.email,
          lead.whatsapp || "",
          lead.country || "",
          lead.source,
          lead.emailSent ? "Sí" : "No",
          new Date(lead.createdAt).toLocaleString("es-CO"),
        ]);

        const csv = [
          headers.map(escapeCsvField).join(","),
          ...rows.map((row: any[]) => row.map(escapeCsvField).join(",")),
        ].join("\n");

        return {
          csv,
          filename: `leads-${new Date().toISOString().split("T")[0]}.csv`,
        };
      }),

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
