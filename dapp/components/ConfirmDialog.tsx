'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmStyle?: 'primary' | 'danger' | 'success';
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmStyle = 'primary',
  children,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass =
    confirmStyle === 'danger'
      ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800'
      : confirmStyle === 'success'
      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {description && (
            <p className="text-gray-700 mb-4 whitespace-pre-wrap break-all leading-relaxed">
              {description}
            </p>
          )}
          {children}
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`${confirmClass} text-white px-5 py-2 rounded-xl shadow-md transition-all`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


