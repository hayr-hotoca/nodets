'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen?: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  onClose?: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export const Modal = ({
  isOpen = false,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  onClose,
  children,
  footer,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose?.()
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose?.()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeOnEscape])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`relative w-full bg-white rounded-lg shadow-2xl ${sizeClasses[size]}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
