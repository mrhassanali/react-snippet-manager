'use client'

import { useCallback } from 'react'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

// Type definitions for URL parameter values
export type URLParamValue = string | number | boolean | null | undefined

// Type for parameter object with generic constraints
export type URLParamsObject<T extends Record<string, URLParamValue> = Record<string, URLParamValue>> = {
  [K in keyof T]: T[K]
}

// Type for the hook return value with generics
export interface UseURLParamsReturn<T extends Record<string, URLParamValue> = Record<string, URLParamValue>> {
  getParam: <K extends keyof T>(key: K) => T[K] extends null | undefined ? string : string
  setParam: <K extends keyof T>(key: K, value: T[K]) => void
  removeParam: (key: keyof T) => void
  clearParams: () => void
  hasParams: () => boolean
  getAllParams: (decode?: boolean) => string
  getAllParamsAsObject: () => Record<string, string[]>
  getParamAsNumber: <K extends keyof T>(key: K, defaultValue?: number) => number
  getParamAsBoolean: <K extends keyof T>(key: K, defaultValue?: boolean) => boolean
  setMultipleParams: (params: Partial<T>) => void
  removeMultipleParams: (keys: (keyof T)[]) => void
  keepOnlyParam: <K extends keyof T>(key: K, value?: T[K]) => void
}

// Default parameter type for backward compatibility
export type DefaultURLParams = Record<string, string>

/**
 * Hook for managing URL parameters with type safety and generics support
 * @template T - Type for URL parameters (defaults to DefaultURLParams)
 * @returns Object with methods to manage URL parameters
 */
export default function useURLParams<T extends Record<string, URLParamValue> = DefaultURLParams>(): UseURLParamsReturn<T> {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Get the value of a specific URL parameter
  const getParam = useCallback(
    <K extends keyof T>(key: K): string => {
      return searchParams.get(String(key)) || ''
    },
    [searchParams]
  )

  // Get parameter as number with optional default value
  const getParamAsNumber = useCallback(<K extends keyof T>(key: K, defaultValue: number = 0): number => {
      const value = searchParams.get(String(key))

      if (value === null) return defaultValue

      const num = Number(value)

      return isNaN(num) ? defaultValue : num
    },
    [searchParams]
  )

  // Get parameter as boolean with optional default value
  const getParamAsBoolean = useCallback(<K extends keyof T>(key: K, defaultValue: boolean = false): boolean => {
      const value = searchParams.get(String(key))

      if (value === null) return defaultValue

      return value === 'true' || value === '1'
    },
    [searchParams]
  )

  // Set the value of a specific URL parameter and update the URL
  const setParam = useCallback(<K extends keyof T>(key: K, value: T[K]): void => {
      const params = new URLSearchParams(searchParams)
      
      if (value !== null && value !== undefined && value !== '') {
        params.set(String(key), String(value))
      } else {
        params.delete(String(key))
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  // Set multiple parameters at once
  const setMultipleParams = useCallback((params: Partial<T>): void => {
      const urlParams = new URLSearchParams(searchParams)
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          urlParams.set(key, String(value))
        } else {
          urlParams.delete(key)
        }
      })

      router.replace(`${pathname}?${urlParams.toString()}`)
    },
    [searchParams, pathname, router]
  )

  // Remove a specific URL parameter and update the URL
  const removeParam = useCallback((key: keyof T): void => {
      const params = new URLSearchParams(searchParams)

      params.delete(String(key))

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  // Remove multiple parameters at once
  const removeMultipleParams = useCallback((keys: (keyof T)[]): void => {
      const params = new URLSearchParams(searchParams)
      
      keys.forEach(key => {
        params.delete(String(key))
      })

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  // Clear all URL parameters and update the URL
  const clearParams = useCallback((): void => {
    router.replace(pathname)
  }, [pathname, router])

  // Check if current URL has any search parameters
  const hasParams = useCallback((): boolean => {
    return searchParams.toString().length > 0
  }, [searchParams])

  // Get all URL parameters as a string
  const getAllParams = useCallback((decode: boolean = false): string => {
      const paramsString = searchParams.toString()

      return decode ? decodeURIComponent(paramsString) : paramsString
    },
    [searchParams]
  )

  // Get all URL parameters as an object
  const getAllParamsAsObject = useCallback((): Record<string, string[]> => {
    const params: Record<string, string[]> = {}

    searchParams.forEach((value, key) => {
      if (params[key]) {
        params[key].push(value)
      } else {
        params[key] = [value]
      }
    })
    
    return params
  }, [searchParams])


  // Remove all params except one (keep current value if value not provided, or set new value if provided)
  const keepOnlyParam = useCallback(
    <K extends keyof T>(key: K, value?: T[K]) => {
      const params = new URLSearchParams();

      if (typeof value !== "undefined") {
        // If value is provided, set only that key to the new value
        if (value !== null && value !== "") {
          params.set(String(key), String(value));
        }
      } else {
        // If value is not provided, keep only the current value of that key
        const current = searchParams.get(String(key));
        if (current !== null && current !== "") {
          params.set(String(key), current);
        }
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );


  return {
    getParam,
    setParam,
    removeParam,
    clearParams,
    hasParams,
    getAllParams,
    getAllParamsAsObject,
    getParamAsNumber,
    getParamAsBoolean,
    setMultipleParams,
    removeMultipleParams,
    keepOnlyParam,
  }
}

// Usage examples with generics:
// 
// // Define your parameter types
// interface MyURLParams {
//   limit: number
//   page: number
//   search: string
//   active: boolean
//   category: string | null
// }
//
// // Use with specific types
// const { getParam, setParam, getParamAsNumber, getParamAsBoolean } = useURLParams<MyURLParams>()
//
// // Type-safe parameter access
// const limit = getParamAsNumber('limit', 10) // Returns number
// const search = getParam('search') // Returns string
// const active = getParamAsBoolean('active', false) // Returns boolean
//
// // Type-safe parameter setting
// setParam('limit', 20) // Only accepts number
// setParam('search', 'query') // Only accepts string
// setParam('active', true) // Only accepts boolean
//
// // Multiple parameters
// setMultipleParams({ limit: 25, page: 2, search: 'new' })
// removeMultipleParams(['limit', 'page'])
//
// // Backward compatibility (default usage)
// const { getParam, setParam } = useURLParams() // Uses DefaultURLParams
