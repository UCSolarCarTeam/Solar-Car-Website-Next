import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createNextApiHandler } from "@trpc/server/adapters/next";

// export API handler
export default createNextApiHandler({
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ error, path }) => {
          global.console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
  router: appRouter,
});
