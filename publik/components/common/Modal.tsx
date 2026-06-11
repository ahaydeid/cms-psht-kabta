"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

type ModalVariant = "center" | "fullscreen";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  variant?: ModalVariant;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  overlayClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  header,
  footer,
  variant = "center",
  showCloseButton = true,
  closeOnBackdrop = true,
  overlayClassName = "",
  panelClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isFullscreen = variant === "fullscreen";
  const overlayClasses = isFullscreen ? `fixed inset-0 z-[70] bg-black/20 ${overlayClassName}` : `fixed inset-0 z-[70] bg-black/40 ${overlayClassName}`;
  const containerClasses = isFullscreen
    ? "fixed inset-0 z-[71]"
    : "fixed inset-0 z-[71] flex items-center justify-center px-4 py-6";
  const panelClasses = isFullscreen
    ? `fixed inset-y-0 left-1/2 z-[71] flex w-full max-w-[430px] -translate-x-1/2 flex-col bg-white shadow-xl ${panelClassName}`
    : `flex w-full max-w-md flex-col rounded-2xl bg-white shadow-xl ${panelClassName}`;

  return (
    <div aria-modal="true" role="dialog">
      <div className={overlayClasses} onClick={closeOnBackdrop ? onClose : undefined} />
      <div className={containerClasses}>
        <div className={panelClasses}>
        {(header || title || showCloseButton) && (
          <div className={`flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 ${headerClassName}`}>
            <div className="min-w-0 flex-1">
              {header ?? (title ? <h2 className="text-lg font-bold text-gray-900">{title}</h2> : null)}
            </div>
            {showCloseButton ? (
              <button onClick={onClose} className="rounded-full p-2 text-gray-700 transition hover:bg-gray-100" aria-label="Tutup modal">
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        )}

        <div className={`min-h-0 ${bodyClassName}`}>{children}</div>

        {footer ? <div className={`border-t border-gray-200 px-4 py-3 ${footerClassName}`}>{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
