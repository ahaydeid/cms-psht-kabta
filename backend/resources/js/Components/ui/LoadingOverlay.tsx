import React from "react";

interface LoadingOverlayProps {
    show: boolean;
    message?: string;
    progress?: number | null;
    subtitle?: string | null;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
    show, 
    message = "Tunggu Sebentar . . .",
    progress = null,
    subtitle = null,
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/35 px-6 transition-all duration-300">
            <div className="flex flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                    <div
                        className="absolute inset-0 animate-spin rounded-full"
                        style={{
                            background:
                                "conic-gradient(from 220deg, rgba(202, 138, 4, 0.06) 0deg, rgba(253, 224, 71, 0.24) 140deg, rgba(234, 179, 8, 0.48) 220deg, rgba(202, 138, 4, 0.88) 300deg, rgba(161, 98, 7, 0.96) 332deg, rgba(202, 138, 4, 0.06) 360deg)",
                            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px))",
                            mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px))",
                        }}
                    />
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        <img src="/img/logo-psht.webp" alt="PSHT" className="h-10 w-auto object-contain" />
                    </div>
                </div>
                <p className="mt-4 rounded-full px-3 py-1 text-lg tracking-tight text-white font-medium">
                    {message}
                </p>
                {subtitle ? (
                    <p className="mt-2 text-sm text-white/85">
                        {subtitle}
                    </p>
                ) : null}
                {progress !== null ? (
                    <div className="mt-5 w-full max-w-xs">
                        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/90">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                            <div
                                className="h-full rounded-full bg-white transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
