"use server";

import { headers } from "next/headers";
import { cache } from "react";
import "server-only";

import { type AppRouter, createCaller } from "@/server/api/root";
import { createStaticTRPCContext, createTRPCContext } from "@/server/api/trpc";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 *
 * WARNING: This uses dynamic Next.js APIs (headers()) and will opt the page into dynamic rendering.
 * For public pages that should be statically generated, use `trpcStatic` instead.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

/**
 * Static context creator for public routes that should be statically generated.
 * This does NOT use headers() or currentUser(), allowing static generation at build time.
 */
const createStaticContext = cache(async () => {
  return createStaticTRPCContext();
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);
const staticCaller = createCaller(createStaticContext);

export const { HydrateClient, trpc } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);

/**
 * Static tRPC caller for public pages that should be statically generated.
 * Use this instead of `trpc` for pages that don't require authentication.
 *
 * This caller does NOT use dynamic Next.js APIs, allowing pages to be
 * statically generated at build time (shown as ○ in build output).
 */
export const { trpc: trpcStatic } = createHydrationHelpers<AppRouter>(
  staticCaller,
  getQueryClient,
);
