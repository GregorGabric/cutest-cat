import { z } from "zod";
import { createRouter } from "./context";

export const catRouter = createRouter()
  .query("getTwoCats", {
    async resolve() {
      return await fetch('https://api.thecatapi.com/v1/images/search?limit=2').then(res => res.json())
    },
  }).mutation("cast-vote", {
    input: z.object({
      votedFor: z.string(),
      votedAgainst: z.string(),
    }),
    async resolve({ input, ctx }) {
      const vote = await ctx.prisma.vote.create({
        data: {
          votedAgainstId: input.votedAgainst,
          votedForId: input.votedFor,
        },
      });
      return { success: true, vote };
    },
  }).mutation("create-cat", {
    input: z.object({

      url: z.string(),
      id: z.string(),
    }),
    async resolve({ input: { url, id }, ctx }) {
      const cat = await ctx.prisma.cat.create({
        data: {
          url,
          id,
        },
      });
      return { success: true, cat };
    }
  })
