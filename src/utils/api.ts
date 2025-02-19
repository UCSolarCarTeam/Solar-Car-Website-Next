/**
 * This is the client-side entrypoint for your tRPC API. It is used to create the `api` object which
 * contains the Next.js App-wrapper, as well as your type-safe React Query hooks.
 *
 * We also create a few inference helpers for input and output types.
 */
import superjson from "superjson";

import { env } from "@/env";
import { type AppRouter } from "@/server/api/root";
import { createClient } from "@supabase/supabase-js";
import { type DehydratedState } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";

// Supabase client
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const getBaseUrl = (ssr = false) => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_ENV) return `https://${process.env.STATIC_VERCEL_URL}`; // SSR should use vercel url
  return `http://${ssr ? "127.0.0.1" : "localhost"}:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Links used to determine request flow from client to server.
       *
       * @see https://trpc.io/docs/links
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          /**
           * Transformer used for data de-serialization from the server.
           *
           * @see https://trpc.io/docs/data-transformers
           */
          transformer: superjson,
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   *
   * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
   */
  ssr: false,
  transformer: superjson,
});

/**
 * SSR Helpers
 */
const SsrProxyClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      transformer: superjson,
      url: `${getBaseUrl(true)}/api/trpc`,
    }),
  ],
});
export const SsrHelpers = createServerSideHelpers({
  client: SsrProxyClient,
});

export type SsrTrpcHelper = {
  trpcState: DehydratedState;
};

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
