"use client"

import { useState, useCallback } from "react"

// Custom hook for toggle functionality
export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState)

  const toggle = useCallback(() => {
    setState((prevState) => !prevState)
  }, [])

  return [state, toggle]
}
