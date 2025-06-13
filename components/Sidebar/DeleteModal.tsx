// components/DeleteModal.tsx
"use client";

import { useEffect } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  threadTitle: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  threadTitle,
}: DeleteModalProps) {
  // Disable background scroll and interactions
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[#f9f3f9] rounded-lg shadow-xl p-6 w-[500px]">
        <h2 className="text-lg font-semibold text-[#501854]">Delete Thread</h2>
        <p className="mt-2 text-[#ac1668]">
          Are you sure you want to delete <strong>{threadTitle}</strong>? This action
          cannot be undone.
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="text-[#7a375b] hover:bg-[#efcae3] py-2 px-3 rounded-md">
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="bg-[#f7086c] text-white px-4 py-1.5 rounded-md shadow hover:bg-[#e6006b] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
