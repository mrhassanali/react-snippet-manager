/**
 * Custom hook to manage URL filter parameters.
 *
 * @returns {Object} An object containing functions to set and get filter parameters.
 *
 * @example
 * const { setFilterParam, getFilterParam, getFilterParamSingle } = useFilterParams();
 *
 * // Set a single filter parameter
 * setFilterParam('category', 'books');
 *
 * // Set multiple values for a filter parameter
 * setFilterParam('tags', ['fiction', 'bestseller']);
 *
 * // Remove a filter parameter
 * setFilterParam('category', null);
 *
 * // Get all values of a filter parameter
 * const tags = getFilterParam('tags'); // ['fiction', 'bestseller']
 *
 * // Get a single value of a filter parameter
 * const category = getFilterParamSingle('category'); // 'books'
 */
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useFilterParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setFilterParam = useCallback(
    (key: string, value: string | string[] | null) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === null) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.delete(key) // Delete existing values first
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value)
      }

      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const getFilterParam = useCallback(
    (key: string): string[] => {
      const values = searchParams.getAll(key)
      return values
    },
    [searchParams],
  )

  const getFilterParamSingle = useCallback(
    (key: string): string | null => {
      return searchParams.get(key)
    },
    [searchParams],
  )

  return {
    setFilterParam,
    getFilterParam,
    getFilterParamSingle,
  }
}

