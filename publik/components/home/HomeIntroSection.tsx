import { ChevronRight, ChevronDown, Heart } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

import { homeIntro, organizationProfile } from '../../data/homeContent';
import { Link } from '../../runtime/inertia-shim';

const INTRO_HOLD_MS = 500;
const INTRO_EXIT_MS = 420;

type IntroMotion = {
    scale: number;
    x: number;
    y: number;
};

const heartRays = Array.from({ length: 16 }, (_, index) => ({
    angle: index * 22.5,
    isPrimary: index % 2 === 0,
}));

type HeartBurstProps = {
    variant?: 'default' | 'hero';
};

function HeartBurst({ variant = 'default' }: HeartBurstProps) {
    const isHero = variant === 'hero';

    return (
        <>
            {!isHero ? <span className="home-heart-glow absolute size-34 rounded-full bg-white/12 blur-md transition-all duration-300ms" /> : null}
            {heartRays.map(({ angle, isPrimary }, index) => (
                <span
                    className={`home-heart-ray absolute left-1/2 top-1/2 origin-left rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.55)] transition-[height,opacity,transform,width] duration-300ms ${
                        isHero ? 'h-1 opacity-5 lg:opacity-8' : 'h-1'
                    }`}
                    key={angle}
                    style={
                        {
                            animationDelay: `${index * 35}ms`,
                            '--ray-angle': `${angle}deg`,
                            '--ray-distance': isHero ? (isPrimary ? '7.25rem' : '7.6rem') : isPrimary ? '4.85rem' : '5.15rem',
                            '--ray-width': isHero ? (isPrimary ? '78vw' : '58vw') : isPrimary ? '2.35rem' : '1.55rem',
                        } as CSSProperties
                    }
                />
            ))}
            {isHero ? (
                <Heart className="relative size-40 fill-white text-brand-red opacity-30 transition-all duration-300ms lg:size-56" strokeWidth={2.5} />
            ) : (
                <Heart className="home-heart-icon relative size-28 fill-white text-brand-red transition-all duration-300ms" strokeWidth={2.5} />
            )}
        </>
    );
}

function getInitialIntroStage() {
    const initialPathname = (window.initialAppPathname ?? window.location.pathname).replace(/\/+$/, '') || '/';
    const shouldPlayIntro = initialPathname === '/' && !window.hasPlayedHomeIntroAnimation;

    return shouldPlayIntro ? 'hold' : 'done';
}

export function HomeIntroSection() {
    const [introStage, setIntroStage] = useState<'hold' | 'exit' | 'done'>(() => getInitialIntroStage());
    const [introMotion, setIntroMotion] = useState<IntroMotion>({ scale: 1, x: 0, y: 0 });
    const introHeartRef = useRef<HTMLDivElement>(null);
    const finalHeartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (introStage === 'done') {
            return;
        }

        const originalOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        return () => {
            document.documentElement.style.overflow = originalOverflow;
        };
    }, [introStage]);

    useEffect(() => {
        if (introStage !== 'hold') {
            return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            window.hasPlayedHomeIntroAnimation = true;
            setIntroStage('done');
            return;
        }

        let animationFrame = 0;
        const exitTimer = window.setTimeout(() => {
            const finalHeart = finalHeartRef.current;
            const introHeart = introHeartRef.current;

            if (finalHeart && introHeart) {
                const finalRect = finalHeart.getBoundingClientRect();
                const introRect = introHeart.getBoundingClientRect();
                const finalCenterX = finalRect.left + finalRect.width / 2;
                const finalCenterY = finalRect.top + finalRect.height / 2;
                const introCenterX = introRect.left + introRect.width / 2;
                const introCenterY = introRect.top + introRect.height / 2;

                setIntroMotion({
                    scale: 1,
                    x: finalCenterX - introCenterX,
                    y: finalCenterY - introCenterY,
                });
            }

            animationFrame = window.requestAnimationFrame(() => setIntroStage('exit'));
        }, INTRO_HOLD_MS);
        const doneTimer = window.setTimeout(() => {
            window.hasPlayedHomeIntroAnimation = true;
            setIntroStage('done');
        }, INTRO_HOLD_MS + INTRO_EXIT_MS + 50);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.clearTimeout(exitTimer);
            window.clearTimeout(doneTimer);
        };
    }, []);

    const isIntroDone = introStage === 'done';
    const finishIntro = () => {
        if (introStage !== 'exit') {
            return;
        }

        window.hasPlayedHomeIntroAnimation = true;
        setIntroStage('done');
    };

    return (
        <section className="relative min-h-svh overflow-hidden bg-white lg:min-h-screen">
            {!isIntroDone && (
                <div aria-hidden="true" className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className={`home-intro-backdrop absolute inset-0 bg-brand-black transition-opacity duration-500 ${
                            introStage === 'exit' ? 'opacity-0' : 'opacity-100'
                        }`}
                    />
                    <div
                        ref={introHeartRef}
                        className={`home-intro-heart absolute left-1/2 top-1/2 flex h-44 w-44 items-center justify-center transition-transform duration-400ms ease-[cubic-bezier(0.77,0,0.18,1)] ${
                            introStage === 'exit' ? 'home-intro-heart--settle' : ''
                        }`}
                        onTransitionEnd={(event) => {
                            if (event.currentTarget === event.target && event.propertyName === 'transform') {
                                finishIntro();
                            }
                        }}
                        style={{
                            transform:
                                introStage === 'exit'
                                    ? `translate(-50%, -50%) translate3d(${introMotion.x}px, ${introMotion.y}px, 0) scale(${introMotion.scale})`
                                    : 'translate(-50%, -50%) scale(1.25)',
                        }}
                    >
                        <HeartBurst variant={introStage === 'exit' ? 'hero' : 'default'} />
                    </div>
                </div>
            )}

            <div className="pointer-events-none absolute inset-0 z-0 bg-brand-black" />
            <div
                ref={finalHeartRef}
                className={`pointer-events-none absolute left-1/2 top-1/2 z-0 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-[opacity,transform] duration-200 ease-out sm:h-44 sm:w-44 lg:h-72 lg:w-72 ${
                    isIntroDone
                        ? 'scale-100 opacity-[0.07] sm:opacity-[0.09] lg:opacity-[0.13]'
                        : 'scale-90 opacity-0'
                }`}
            >
                <HeartBurst variant="hero" />
            </div>

            <div className="relative z-20 mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-4 py-8 pt-24 sm:px-6 sm:py-10 sm:pt-24 lg:min-h-screen lg:px-8 lg:py-0 lg:pt-16">
                <div className="relative grid flex-1 items-center gap-10 lg:grid-cols-2">
                    <div className="relative z-10 max-w-2xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/75">{organizationProfile.eyebrow}</p>
                        <h1 className="mt-4 text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
                            Cabang Kab.
                            <span className="block text-yellow-500">Tangerang</span>
                        </h1>
                        <blockquote className="relative mt-7 max-w-lg">
                            <span className="absolute -top-5 left-0 text-7xl font-bold leading-none text-brand-yellow/50">"</span>
                            <p className="relative pl-7 text-lg font-semibold italic leading-8 text-white/80">{homeIntro.lead}</p>
                        </blockquote>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link
                                className="inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 text-xs font-medium text-brand-black transition hover:bg-brand-yellow"
                                href="/profil/tentang"
                            >
                                Lihat Profil
                                <ChevronRight className="ml-2 size-4" />
                            </Link>
                            <Link
                                className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 text-xs font-medium text-white transition hover:border-brand-yellow hover:text-brand-yellow"
                                href="/berita"
                            >
                                Berita Terbaru
                            </Link>
                        </div>
                    </div>

                    <aside className="relative hidden lg:flex lg:items-center lg:justify-end">
                        <div className="flex aspect-4/5 w-80 items-center justify-center xl:w-96">
                            <p className="text-sm font-semibold text-white/40">Placeholder Foto</p>
                        </div>
                    </aside>
                </div>
            </div>

            <a
                aria-label="Turun ke bagian tentang cabang"
                className="absolute bottom-5 left-1/2 z-30 inline-flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/35 text-white/80 transition hover:border-brand-yellow hover:text-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow lg:bottom-7"
                href="#tentang"
            >
                <ChevronDown className="size-5" />
            </a>
        </section>
    );
}
