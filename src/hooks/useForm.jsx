"use client"

import { useState, useCallback } from "react"

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }, [])

  const handleSubmit = useCallback(
    (callback) => {
      return (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        callback(values)
        setIsSubmitting(false)
      }
    },
    [values],
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  }
}
