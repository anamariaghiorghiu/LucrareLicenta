import { router } from "../trpc";
import { authRouter } from "./auth";
import { paintingRouter } from "./paint";
import { postRouter } from "./post";
import { tagRouter } from "./tag";
import { userRouter } from "./user";
export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  user: userRouter,
  tag: tagRouter,
  painting: paintingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
