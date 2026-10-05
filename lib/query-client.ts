import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const QUERY_KEYS = {
  requests: {
    all: ["requests"] as const,
    list: (filters: Record<string, unknown>) => ["requests", "list", filters] as const,
    detail: (id: string) => ["requests", "detail", id] as const,
    stats: (roleView?: string) => ["requests", "stats", roleView] as const,
  },
  users: {
    all: ["users"] as const,
    current: ["users", "current"] as const,
  },
} as const;
