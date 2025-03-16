"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

// This hook provides functions to get and set URL parameters
export default function useURLParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get the value of a specific URL parameter
  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key) || "";
    },
    [searchParams],
  );

  // Set the value of a specific URL parameter and update the URL
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // Remove a specific URL parameter and update the URL
  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(key);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  // Clear all URL parameters and update the URL
  const clearParams = useCallback(() => {
    router.replace(pathname);
  }, [pathname, router]);

  return { getParam, setParam, removeParam, clearParams };
}

// Usage:
// import { useDebouncedCallback } from "use-debounce";
// import useURLParams from "@/src/hooks/useURLParams";

// const { getParam, setParam, removeParam } = useURLParams();
// const limit = getParam("limit");
// setParam("limit", "10");
// removeParam("limit");
