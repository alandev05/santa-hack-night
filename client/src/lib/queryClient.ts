import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: string | FormData;
    headers?: Record<string, string>;
  },
): Promise<Response> {
  const { method = "GET", body, headers = {} } = options || {};
  
  const fetchOptions: RequestInit = {
    method,
    credentials: "include",
    body,
  };

  // Only set Content-Type if not FormData
  if (body && !(body instanceof FormData)) {
    fetchOptions.headers = { "Content-Type": "application/json", ...headers };
  } else if (headers && Object.keys(headers).length > 0) {
    fetchOptions.headers = headers;
  }

  const res = await fetch(url, fetchOptions);
  
  // Enhanced error handling
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status} error`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If we can't parse JSON, use the status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
