import { z } from "zod";
import { procedure, router } from "../trpc";

export const authRouter = router({
  login: procedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .query(({ input }) => {
      // validate user
      // session and token stuff
      // return user/token
      return {
        user: {},
      };
    }),
});

// export type definition of API
export type AppRouter = typeof authRouter;
