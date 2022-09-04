// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { catRouter } from "./cat";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("cat.", catRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
