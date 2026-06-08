import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';

import { Button, Input } from '@/Components/ui';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm({
        email: '',
        password: '',
        remember: true,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/admin/login');
    };

    return (
        <>
            <Head title="Login" />

            <main className="relative flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-8">
                <div className="z-10 grid w-full max-w-220 overflow-hidden rounded-xl border border-zinc-100 bg-white md:h-130 md:grid-cols-2">
                    <div className="hidden h-full min-h-0 flex-col items-center justify-center bg-white p-10 lg:flex">
                        <img
                            alt="Logo PSHT"
                            className="h-auto max-h-96 max-w-[72%] object-contain"
                            src="/img/logo-psht.webp"
                        />
                    </div>

                    <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-0">
                        <div className="w-full">
                            <div>
                                <h1 className="mb-2 text-2xl font-semibold text-yellow-600">
                                    <span className="text-slate-700">Log</span>In
                                </h1>
                                <p className="mb-8 text-sm text-slate-500">
                                    Selamat Datang di PSHT Kabta
                                </p>
                            </div>

                            <form className="mt-6" onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="mb-1.5 ml-0.5 block text-xs font-medium text-zinc-700" htmlFor="email">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute top-2.5 left-0 flex h-5 w-5 items-center justify-center text-slate-200">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <Input
                                            autoComplete="email"
                                            className="pl-8"
                                            error={form.errors.email}
                                            id="email"
                                            name="email"
                                            type="email"
                                            onChange={(event) => form.setData('email', event.target.value)}
                                            value={form.data.email}
                                            variant="underlined"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-1.5 ml-0.5 block text-xs font-medium text-zinc-700" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute top-2.5 left-0 flex h-5 w-5 items-center justify-center text-slate-200">
                                            <LockKeyhole className="h-5 w-5" />
                                        </div>
                                        <Input
                                            autoComplete="current-password"
                                            className="pr-10 pl-8"
                                            error={form.errors.password}
                                            id="password"
                                            name="password"
                                            onChange={(event) => form.setData('password', event.target.value)}
                                            type={showPassword ? 'text' : 'password'}
                                            value={form.data.password}
                                            variant="underlined"
                                        />
                                        <button
                                            className="absolute top-2.5 right-2 flex h-5 w-5 items-center justify-center cursor-pointer text-slate-400 transition hover:text-slate-600"
                                            onClick={() => setShowPassword((value) => !value)}
                                            type="button"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="mt-2 text-right">
                                        <button className="text-xs text-yellow-600 hover:underline" type="button">
                                            Lupa password?
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    variant='primary'
                                    className="mt-6 w-full rounded-full"
                                    isLoading={form.processing}
                                    size="lg"
                                    type="submit"
                                >
                                    Masuk
                                </Button>

                                <p className="mt-3 text-center text-xs text-zinc-500">
                                    Belum punya akun?{' '}
                                    <Link className="text-yellow-600 hover:underline" href="#">
                                        Permohonan Akun
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-zinc-400">PSHT Kabupaten Tangerang</div>
            </main>
        </>
    );
}
