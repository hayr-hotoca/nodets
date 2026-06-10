'use client'

import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal } from './Modal'

export interface ModalExampleRef {
  openModal: () => void
  closeModal: () => void
}

const ModalExample = forwardRef<ModalExampleRef>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }))

  return (
    <Modal
      isOpen={isOpen}
      title="Example Modal"
      size="lg"
      onClose={closeModal}
      footer={
        <>
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            onClick={closeModal}
          >
            Confirm
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          This is an example modal component using React Portal. The modal is
          rendered outside the normal DOM flow and appended to the body element.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>React Portal for portal rendering</li>
            <li>Smooth enter/leave transitions</li>
            <li>Click outside to close</li>
            <li>Escape key to close</li>
            <li>Responsive sizing</li>
            <li>Customizable header and footer</li>
          </ul>
        </div>
        <p className="text-sm text-gray-500">
          Try clicking the overlay or pressing Escape to close this modal.
        </p>
      </div>
    </Modal>
  )
})

ModalExample.displayName = 'ModalExample'

export default ModalExample
