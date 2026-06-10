'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</span>
    {children}
  </div>
)

export default FormField
