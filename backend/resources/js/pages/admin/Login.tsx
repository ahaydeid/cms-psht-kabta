import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { LoadingOverlay } from '@/Components/ui';

type LoginForm = {
    username: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<LoginForm>({
        username: '',
        password: '',
        remember: false,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform((data) => ({
            ...data,
            username: data.username.trim(),
        }));

        form.post('/admin/login', {
            onFinish: () => {
                form.reset('password');
                form.transform((data) => data);
            },
        });
    }

    return (
        <>
            <Head title="Masuk" />

            <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
                <LoadingOverlay show={form.processing} />

                <section className="z-10 grid w-full max-w-220 grid-cols-1 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xs md:h-130 md:grid-cols-2">
                    <div className="hidden items-center justify-center bg-yellow-50/40 md:flex">
                        <img
                            alt="Logo PSHT"
                            className="h-auto max-h-80 max-w-[70%] object-contain"
                            src="/img/logo-psht.webp"
                        />
                    </div>

                    <div className="flex flex-col justify-center px-6 py-10 md:px-14 md:py-0">
                        <h1 className="mb-2 text-2xl font-semibold text-rose-500">
                            LogIn
                        </h1>
                        <p className="mb-8 text-sm text-slate-500">
                            Selamat datang di PSHT Kabta
                        </p>

                        <form className="mt-6" onSubmit={submit}>
                            <label className="mb-4 block">
                                <span className="ml-0.5 block text-xs font-medium text-gray-700">
                                    Username
                                </span>
                                <input
                                    className="w-full rounded-none border-0 border-b border-gray-300 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-yellow-600"
                                    type="text"
                                    value={form.data.username}
                                    onChange={(event) => form.setData('username', event.target.value)}
                                    autoComplete="username"
                                    disabled={form.processing}
                                    required
                                />
                                {form.errors.username ? (
                                    <p className="mt-1 text-xs text-red-600">{form.errors.username}</p>
                                ) : null}
                            </label>

                            <div className="relative mb-6">
                                <label className="block">
                                    <span className="ml-0.5 block text-xs font-medium text-gray-700">
                                        Password
                                    </span>
                                    <input
                                        className="w-full rounded-none border-0 border-b border-gray-300 bg-transparent px-1 py-2 pr-10 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-yellow-600"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.data.password}
                                        onChange={(event) => form.setData('password', event.target.value)}
                                        autoComplete="current-password"
                                        disabled={form.processing}
                                        required
                                    />
                                </label>
                                {form.data.password ? (
                                    <button
                                        className="absolute right-2 top-7 cursor-pointer text-gray-400 hover:text-gray-600 border-none bg-transparent"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={form.processing}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                ) : null}
                                {form.errors.password ? (
                                    <p className="mt-1 text-xs text-red-600">{form.errors.password}</p>
                                ) : null}
                            </div>

                            <div className="mb-5 flex items-center justify-between gap-3">
                                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                                    <input
                                        className="size-4 rounded-full border-gray-300 accent-yellow-600 cursor-pointer"
                                        type="checkbox"
                                        checked={form.data.remember}
                                        onChange={(event) => form.setData('remember', event.target.checked)}
                                        disabled={form.processing}
                                    />
                                    Ingat sesi
                                </label>

                                <span className="text-xs text-gray-400">
                                    Hubungi pengurus jika lupa password
                                </span>
                            </div>

                            <button
                                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-rose-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                                type="submit"
                                disabled={form.processing}
                            >
                                {form.processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                                Masuk
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-500">
                                Login menggunakan Username (NIW) yang telah terdaftar pada sistem.
                            </p>
                        </form>
                    </div>
                </section>

                <footer className="absolute bottom-10 text-center text-xs text-gray-400">
                    PSHT Cabang Kabupaten Tangerang
                </footer>
            </main>
        </>
    );
}
