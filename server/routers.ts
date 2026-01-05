import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createLetter, getUserLetters, getUserReplies, createReply, updateLetterStatus } from "./letters";
import { extractEmotionalKeywords, generateAIReply } from "./aiLetterReply";

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

  letters: router({
    sendLetter: protectedProcedure
      .input(
        z.object({
          petId: z.number(),
          petName: z.string(),
          content: z.string().min(10),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const letterResult = await createLetter({
          userId: ctx.user.id,
          petId: input.petId,
          petName: input.petName,
          content: input.content,
          status: "sent",
        });

        const letterId = (letterResult as any).insertId || 1;
        const emotionalKeywords = await extractEmotionalKeywords(input.content);
        const { reply, emotionalTone } = await generateAIReply(
          input.content,
          input.petName,
          emotionalKeywords
        );

        const delayHours = Math.floor(Math.random() * 13) + 12;
        const scheduledFor = new Date(Date.now() + delayHours * 60 * 60 * 1000);

        await createReply({
          letterId: letterId,
          userId: ctx.user.id,
          petName: input.petName,
          content: reply,
          emotionalTone,
          scheduledFor,
        });

        await updateLetterStatus(letterId, "processing");

        return {
          success: true,
          letterId,
          message: `${input.petName}의 편지가 전송되었습니다.`,
        };
      }),

    getMyLetters: protectedProcedure.query(async ({ ctx }) => {
      return await getUserLetters(ctx.user.id);
    }),

    getMyReplies: protectedProcedure.query(async ({ ctx }) => {
      return await getUserReplies(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
