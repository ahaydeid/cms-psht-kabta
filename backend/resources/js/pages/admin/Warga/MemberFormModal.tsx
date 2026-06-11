import { useForm } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Modal } from '@/Components/Base';
import { Button, Input, Select, Textarea } from '@/Components/ui';
import { confirmAction, showToast } from '@/lib/alert';

export type MemberStatus = 'active' | 'inactive' | 'transferred' | 'deceased';
export type MemberCitizenship = 'WNI' | 'WNA';
export type MemberGender = 'Laki-laki' | 'Perempuan';
type FormTab = 'identity' | 'contact' | 'membership';
type FormMode = 'create' | 'edit';

export type OrganizationUnitOption = {
    id: number;
    name: string;
};

export type MemberFormData = {
    _method?: 'put';
    address: string;
    birth_date: string;
    birth_place: string;
    citizenship: MemberCitizenship;
    gender: MemberGender;
    identity_number: string;
    legalized_at: string;
    legalization_place: string;
    member_number: string;
    name: string;
    occupation: string;
    organization_unit_id: string;
    phone: string;
    photo: File | null;
    religion: string;
    status: MemberStatus;
    create_account?: boolean;
    is_pengurus_cabang?: boolean;
};

type MemberFormErrors = Partial<Record<keyof MemberFormData, string>>;

type MemberFormInitialData = Partial<MemberFormData> & {
    photo_url?: null | string;
};

type MemberFormModalProps = {
    defaultOrganizationUnitId?: null | number;
    initialData?: MemberFormInitialData;
    mode: FormMode;
    onClose: () => void;
    open: boolean;
    organizationUnitOptions: OrganizationUnitOption[];
    submitUrl: string;
};

const formTabs: Array<{ id: FormTab; label: string }> = [
    { id: 'identity', label: 'Identitas' },
    { id: 'contact', label: 'Kontak' },
    { id: 'membership', label: 'Keanggotaan' },
];

const formTabFields: Record<FormTab, Array<keyof MemberFormData>> = {
    identity: ['citizenship', 'member_number', 'identity_number', 'name', 'birth_place', 'birth_date', 'gender', 'religion'],
    contact: ['address', 'occupation', 'phone'],
    membership: ['organization_unit_id', 'legalized_at', 'legalization_place', 'status', 'photo'],
};

const citizenshipOptions: MemberCitizenship[] = ['WNI', 'WNA'];
const genderOptions: MemberGender[] = ['Laki-laki', 'Perempuan'];
const religionOptions = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];
const statusOptions: Array<{ label: string; value: MemberStatus }> = [
    { label: 'Aktif', value: 'active' },
    { label: 'Tidak Aktif', value: 'inactive' },
    { label: 'Pindah', value: 'transferred' },
    { label: 'Meninggal', value: 'deceased' },
];

const emptyFormData: MemberFormData = {
    address: '',
    birth_date: '',
    birth_place: '',
    citizenship: 'WNI',
    gender: 'Laki-laki',
    identity_number: '',
    legalized_at: '',
    legalization_place: '',
    member_number: '',
    name: '',
    occupation: '',
    organization_unit_id: '',
    phone: '',
    photo: null,
    religion: 'Islam',
    status: 'active',
    create_account: true,
    is_pengurus_cabang: false,
};

function numericOnly(value: string) {
    return value.replace(/\D/g, '');
}

function normalizeMemberNumber(value: string) {
    return value.trim().replace(/\s+/g, '').toLocaleUpperCase('id-ID');
}

function capitalizeWords(value: string) {
    return value
        .trim()
        .replace(/\s+/g, ' ')
        .toLocaleLowerCase('id-ID')
        .replace(/(^|[\s\-/'(])([a-z\u00c0-\u024f])/gu, (match, separator: string, character: string) => `${separator}${character.toLocaleUpperCase('id-ID')}`);
}

function tabClassName(isActive: boolean) {
    return isActive
        ? 'border-brand-yellow text-brand-black'
        : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-brand-black';
}

function firstErrorTab(errors: MemberFormErrors): FormTab {
    return formTabs.find((tab) => formTabFields[tab.id].some((field) => Boolean(errors[field])))?.id ?? 'identity';
}

// Custom identity error checker
function identityRequiredErrors(data: MemberFormData): MemberFormErrors {
    const errors: MemberFormErrors = {};

    if (!data.name.trim()) {
        errors.name = 'Nama lengkap wajib diisi.';
    }

    if (!data.member_number.trim()) {
        errors.member_number = 'NIW wajib diisi.';
    }

    if (data.identity_number.trim() && data.identity_number.length !== 16) {
        errors.identity_number = 'NIK harus terdiri dari 16 digit.';
    }

    return errors;
}

function makeInitialData(mode: FormMode, initialData?: MemberFormInitialData): MemberFormData {
    const { photo_url: _photoUrl, ...restInitialData } = initialData ?? {};

    return {
        ...emptyFormData,
        ...(mode === 'edit' ? { _method: 'put' as const } : {}),
        ...restInitialData,
        photo: null,
    };
}

export function MemberFormModal({
    defaultOrganizationUnitId = null,
    initialData,
    mode,
    onClose,
    open,
    organizationUnitOptions,
    submitUrl,
}: MemberFormModalProps) {
    const [activeTab, setActiveTab] = useState<FormTab>('identity');
    const initialFormData = useMemo(() => makeInitialData(mode, initialData), [initialData, mode]);
    const form = useForm<MemberFormData>(initialFormData);
    const activeTabIndex = formTabs.findIndex((tab) => tab.id === activeTab);
    const isFirstTab = activeTabIndex <= 0;
    const isLastTab = activeTabIndex === formTabs.length - 1;
    const hasValidIdentityRequiredFields = Object.keys(identityRequiredErrors(form.data)).length === 0;
    const isEdit = mode === 'edit';
    const initialPhotoUrl = initialData?.photo_url ?? null;
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState<null | string>(initialPhotoUrl);

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData(initialFormData);
        form.clearErrors();
        setActiveTab('identity');
        setPhotoPreviewUrl(initialPhotoUrl);
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (!form.data.photo) {
            setPhotoPreviewUrl(initialPhotoUrl);
            return;
        }

        const objectUrl = URL.createObjectURL(form.data.photo);
        setPhotoPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [form.data.photo, initialPhotoUrl, open]);

    useEffect(() => {
        if (form.data.organization_unit_id || !open || isEdit) {
            return;
        }

        const defaultUnitId = defaultOrganizationUnitId ?? (organizationUnitOptions.length === 1 ? organizationUnitOptions[0].id : null);

        if (defaultUnitId) {
            form.setData('organization_unit_id', String(defaultUnitId));
        }
    }, [defaultOrganizationUnitId, form, isEdit, open, organizationUnitOptions]);

    const hasIdentityDraft = () => Boolean(form.data.name.trim() || form.data.member_number.trim() || form.data.identity_number.trim());

    const resetForm = () => {
        form.setData(initialFormData);
        form.clearErrors();
        setActiveTab('identity');
        onClose();
    };

    const closeModal = async () => {
        if (form.processing) {
            return;
        }

        if (!isEdit && hasIdentityDraft()) {
            const result = await confirmAction({
                title: 'Batalkan tambah warga?',
                text: 'Nama, NIW, atau NIK yang sudah diisi akan dibuang.',
                confirmButtonText: 'Ya, batalkan',
                cancelButtonText: 'Lanjut isi',
                variant: 'danger',
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        resetForm();
    };

    const validateIdentityBeforeLeaving = () => {
        const frontendErrors = identityRequiredErrors(form.data);

        if (Object.keys(frontendErrors).length === 0) {
            return true;
        }

        form.setError(frontendErrors);
        setActiveTab('identity');
        return false;
    };

    const goToNextTab = () => {
        if (activeTab === 'identity' && !validateIdentityBeforeLeaving()) {
            return;
        }

        setActiveTab(formTabs[Math.min(activeTabIndex + 1, formTabs.length - 1)].id);
    };

    const goToPreviousTab = () => {
        setActiveTab(formTabs[Math.max(activeTabIndex - 1, 0)].id);
    };

    const handleTabClick = (tabId: FormTab) => {
        if (tabId !== 'identity' && !validateIdentityBeforeLeaving()) {
            return;
        }

        setActiveTab(tabId);
    };

    const normalizeTextField = (field: keyof Pick<MemberFormData, 'address' | 'birth_place' | 'legalization_place' | 'name' | 'occupation'>) => {
        form.setData(field, capitalizeWords(form.data[field]));
    };

    const saveForm = async () => {
        const normalizedData = {
            ...form.data,
            address: capitalizeWords(form.data.address),
            birth_place: capitalizeWords(form.data.birth_place),
            legalization_place: capitalizeWords(form.data.legalization_place),
            member_number: normalizeMemberNumber(form.data.member_number),
            name: capitalizeWords(form.data.name),
            occupation: capitalizeWords(form.data.occupation),
        };

        form.setData(normalizedData);

        const frontendErrors = identityRequiredErrors(normalizedData);

        if (Object.keys(frontendErrors).length > 0) {
            form.setError(frontendErrors);
            setActiveTab(firstErrorTab(frontendErrors));
            return;
        }

        const result = await confirmAction({
            title: isEdit ? 'Simpan perubahan warga?' : 'Simpan data warga?',
            text: isEdit ? 'Data warga akan diperbarui.' : 'Pastikan data warga sudah benar sebelum disimpan.',
            confirmButtonText: 'Ya, simpan',
            cancelButtonText: isEdit ? 'Batal' : 'Periksa lagi',
            variant: 'primary',
        });

        if (!result.isConfirmed) {
            return;
        }

        form.transform(() => normalizedData);
        form.post(submitUrl, {
            forceFormData: true,
            onSuccess: () => {
                resetForm();
                showToast({ title: isEdit ? 'Data warga berhasil diperbarui.' : 'Data warga berhasil ditambahkan.' });
            },
            onError: (errors: MemberFormErrors) => {
                setActiveTab(firstErrorTab(errors));

                showToast({
                    title: errors.member_number ?? errors.identity_number ?? 'Data warga gagal disimpan. Periksa kembali isian yang masih bermasalah.',
                    icon: 'error',
                });
            },
        });
    };

    return (
        <Modal
            footer={
                <div className="flex w-full items-center justify-between">
                    <div>
                        {!isEdit ? (
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-zinc-600">Buat Akun Login?</span>
                                <button
                                    className="relative inline-flex h-9 w-[120px] items-center rounded-full border border-zinc-200 bg-white p-1"
                                    onClick={() => form.setData('create_account', !form.data.create_account)}
                                    type="button"
                                >
                                    <div className="absolute flex w-full justify-between pl-[14px] pr-[18px] text-sm text-zinc-400">
                                        <span className={form.data.create_account ? '' : 'opacity-0'}>Tidak</span>
                                        <span className={!form.data.create_account ? '' : 'opacity-0'}>Buat</span>
                                    </div>
                                    <div
                                        className={`absolute left-1 flex h-7 w-14 items-center justify-center rounded-full text-sm font-semibold text-white transition-all duration-300 ${form.data.create_account ? 'translate-x-[56px] bg-emerald-500' : 'translate-x-0 bg-slate-400'}`}
                                    >
                                        {form.data.create_account ? 'Buat' : 'Tidak'}
                                    </div>
                                </button>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                        {!isFirstTab ? (
                            <Button disabled={form.processing} icon={<ChevronLeft className="h-4 w-4" />} onClick={goToPreviousTab} size="md" variant="outline">
                                Sebelumnya
                            </Button>
                        ) : (
                            <Button disabled={form.processing} onClick={closeModal} size="md" variant="outline">
                                Batal
                            </Button>
                        )}
                        {isLastTab ? (
                            <Button className="bg-slate-800 text-white hover:bg-slate-700" isLoading={form.processing} onClick={saveForm} size="md" type="button">
                                {isEdit ? 'Simpan Perubahan' : 'Simpan Warga'}
                            </Button>
                        ) : (
                            <Button className="bg-slate-800 text-white hover:bg-slate-700" onClick={goToNextTab} size="md" type="button">
                                Selanjutnya
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            }
            headerMiddle={
                <div className="flex max-w-full items-center justify-start gap-4 overflow-x-auto px-1 sm:max-w-none sm:justify-center sm:gap-6">
                    {formTabs.map((tab) => {
                        const hasError = formTabFields[tab.id].some((field) => Boolean(form.errors[field]));
                        const isLocked = tab.id !== 'identity' && !hasValidIdentityRequiredFields;

                        return (
                            <button
                                aria-disabled={isLocked}
                                className={`shrink-0 whitespace-nowrap border-b-2 px-1 pb-2 text-sm font-semibold transition ${
                                    isLocked ? 'cursor-not-allowed border-transparent text-zinc-300' : tabClassName(activeTab === tab.id)
                                }`}
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                type="button"
                            >
                                {tab.label}
                                {hasError ? <span className="ml-2 inline-block size-2 rounded-full bg-brand-red align-middle" /> : null}
                            </button>
                        );
                    })}
                </div>
            }
            onClose={closeModal}
            open={open}
            size="full"
            title={isEdit ? 'Edit Warga' : 'Tambah Warga'}
        >
            <form className="mx-auto w-full max-w-5xl space-y-5" onSubmit={(event) => event.preventDefault()}>
                {activeTab === 'identity' ? (
                    <section className="space-y-4">
                        <div className="border-b border-zinc-200 pb-3">
                            <h3 className="text-base font-bold text-brand-yellow-dark">Data Diri Warga</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-0.5 block text-xs font-medium text-zinc-700" htmlFor="member-photo">
                                {isEdit ? 'Ganti Foto Warga (Opsional)' : 'Foto Warga (Opsional)'}
                            </label>
                            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <label
                                    className="group relative flex size-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 transition hover:border-brand-yellow hover:bg-brand-yellow/10"
                                    htmlFor="member-photo"
                                >
                                    {photoPreviewUrl ? (
                                        <img alt="Preview foto warga" className="h-full w-full object-cover" src={photoPreviewUrl} />
                                    ) : (
                                        <UserRound className="h-12 w-12 text-zinc-400 transition group-hover:text-brand-yellow-dark" />
                                    )}
                                    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-center text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                                        Pilih Foto
                                    </span>
                                </label>
                                <div className="space-y-1 text-sm text-zinc-600">
                                    <p>Maksimal 5MB.</p>
                                    {form.errors.photo ? <p className="text-[10px] font-medium text-brand-red md:text-xs">{form.errors.photo}</p> : null}
                                </div>
                            </div>
                            <input
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                className="sr-only"
                                id="member-photo"
                                name="photo"
                                onChange={(event) => form.setData('photo', event.target.files?.[0] ?? null)}
                                type="file"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="text-sm font-semibold text-zinc-800">Kewarganegaraan</div>
                            <div className="flex flex-wrap gap-5">
                                {citizenshipOptions.map((option) => {
                                    const isChecked = form.data.citizenship === option;

                                    return (
                                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700" key={option}>
                                            <span className="relative flex size-5 items-center justify-center">
                                                <input
                                                    checked={isChecked}
                                                    className="peer sr-only"
                                                    name="citizenship"
                                                    onChange={() => form.setData('citizenship', option)}
                                                    type="radio"
                                                    value={option}
                                                />
                                                <span className="absolute inset-0 rounded-full border-2 border-zinc-400 bg-white transition peer-checked:border-brand-yellow-dark peer-focus-visible:ring-2 peer-focus-visible:ring-brand-yellow/40" />
                                                <span className="absolute size-2.5 rounded-full bg-brand-yellow-dark opacity-0 transition peer-checked:opacity-100" />
                                            </span>
                                            {option === 'WNI' ? 'WNI (Indonesia)' : 'WNA (Asing)'}
                                        </label>
                                    );
                                })}
                            </div>
                            {form.errors.citizenship ? <p className="ml-1 text-[10px] font-medium text-brand-red md:text-xs">{form.errors.citizenship}</p> : null}
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <Input
                                error={form.errors.name}
                                label="Nama Lengkap"
                                name="name"
                                onBlur={() => normalizeTextField('name')}
                                onChange={(event) => {
                                    form.setData('name', event.target.value);
                                    form.clearErrors('name');
                                }}
                                placeholder="Sesuai identitas..."
                                requiredNote="*wajib diisi"
                                value={form.data.name}
                            />
                            <Input
                                error={form.errors.member_number}
                                label="Nomor Induk Warga (NIW)"
                                name="member_number"
                                onBlur={() => form.setData('member_number', normalizeMemberNumber(form.data.member_number))}
                                onChange={(event) => {
                                    form.setData('member_number', event.target.value);
                                    form.clearErrors('member_number');
                                }}
                                placeholder="Contoh: NIW-2014-031"
                                requiredNote="*wajib diisi"
                                value={form.data.member_number}
                            />
                            <Input
                                error={form.errors.identity_number}
                                inputMode="numeric"
                                label="Nomor Identitas (KTP/KK)"
                                maxLength={16}
                                name="identity_number"
                                onChange={(event) => {
                                    form.setData('identity_number', numericOnly(event.target.value).slice(0, 16));
                                    form.clearErrors('identity_number');
                                }}
                                pattern="[0-9]*"
                                placeholder="16 Digit NIK..."
                                value={form.data.identity_number}
                            />
                            <Input
                                error={form.errors.birth_place}
                                label="Tempat Lahir"
                                name="birth_place"
                                onBlur={() => normalizeTextField('birth_place')}
                                onChange={(event) => form.setData('birth_place', event.target.value)}
                                value={form.data.birth_place}
                            />
                            <Input error={form.errors.birth_date} label="Tanggal Lahir" name="birth_date" onChange={(event) => form.setData('birth_date', event.target.value)} type="date" value={form.data.birth_date} />
                            <Select error={form.errors.gender} label="Jenis Kelamin" name="gender" onChange={(event) => form.setData('gender', event.target.value as MemberGender)} value={form.data.gender}>
                                {genderOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                            <Select error={form.errors.religion} label="Agama" name="religion" onChange={(event) => form.setData('religion', event.target.value)} value={form.data.religion}>
                                {religionOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </section>
                ) : null}

                {activeTab === 'contact' ? (
                    <section className="space-y-4">
                        <div className="border-b border-zinc-200 pb-3">
                            <h3 className="text-base font-bold text-brand-yellow-dark">Kontak</h3>
                        </div>
                        <Textarea
                            error={form.errors.address}
                            label="Alamat Lengkap"
                            name="address"
                            onBlur={() => normalizeTextField('address')}
                            onChange={(event) => form.setData('address', event.target.value)}
                            placeholder="Jalan, RT/RW, Desa, Kecamatan, Kota..."
                            value={form.data.address}
                        />

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="w-full space-y-1.5">
                                <label className="ml-0.5 block text-xs font-medium text-zinc-700" htmlFor="member-phone">
                                    No HP / WA
                                </label>
                                <div
                                    className={`flex overflow-hidden rounded border bg-white transition-all focus-within:ring-1 focus-within:ring-brand-yellow/30 ${
                                        form.errors.phone ? 'border-brand-red bg-red-50' : 'border-zinc-200'
                                    }`}
                                >
                                    <span className="flex items-center border-r border-zinc-200 bg-zinc-50 px-4 text-sm font-medium text-zinc-700">+62</span>
                                    <input
                                        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-brand-black outline-none placeholder:text-zinc-400"
                                        id="member-phone"
                                        inputMode="numeric"
                                        name="phone"
                                        onChange={(event) => form.setData('phone', numericOnly(event.target.value))}
                                        pattern="[0-9]*"
                                        placeholder="81200002001"
                                        type="text"
                                        value={form.data.phone}
                                    />
                                </div>
                                {form.errors.phone ? <p className="ml-1 mt-1 text-[10px] font-medium text-brand-red md:text-xs">{form.errors.phone}</p> : null}
                            </div>
                        </div>
                    </section>
                ) : null}

                {activeTab === 'membership' ? (
                    <section className="space-y-4">
                        <div className="border-b border-zinc-200 pb-3">
                            <h3 className="text-base font-bold text-brand-yellow-dark">Data Keanggotaan</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div className="space-y-4">
                                <Select error={form.errors.organization_unit_id} label="Ranting" name="organization_unit_id" onChange={(event) => form.setData('organization_unit_id', event.target.value)} value={form.data.organization_unit_id}>
                                    <option value="">Pilih Ranting</option>
                                    {organizationUnitOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </Select>

                                <div className="flex flex-col space-y-1.5">
                                    <span className="block text-xs font-semibold text-zinc-700">Pengurus Cabang?</span>
                                    <button
                                        className="relative inline-flex h-9 w-[120px] items-center rounded-full border border-zinc-200 bg-white p-1"
                                        onClick={() => form.setData('is_pengurus_cabang', !form.data.is_pengurus_cabang)}
                                        type="button"
                                    >
                                        <div className="absolute flex w-full justify-between pl-[14px] pr-[18px] text-sm text-zinc-400">
                                            <span className={form.data.is_pengurus_cabang ? '' : 'opacity-0'}>Tidak</span>
                                            <span className={!form.data.is_pengurus_cabang ? '' : 'opacity-0'}>Ya</span>
                                        </div>
                                        <div
                                            className={`absolute left-1 flex h-7 w-14 items-center justify-center rounded-full text-sm font-semibold text-white transition-all duration-300 ${form.data.is_pengurus_cabang ? 'translate-x-[56px] bg-emerald-500' : 'translate-x-0 bg-slate-400'}`}
                                        >
                                            {form.data.is_pengurus_cabang ? 'Ya' : 'Tidak'}
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <Input error={form.errors.legalized_at} label="Tanggal Pengesahan" name="legalized_at" onChange={(event) => form.setData('legalized_at', event.target.value)} type="date" value={form.data.legalized_at} />
                            <Input
                                error={form.errors.legalization_place}
                                label="Tempat Pengesahan"
                                name="legalization_place"
                                onBlur={() => normalizeTextField('legalization_place')}
                                onChange={(event) => form.setData('legalization_place', event.target.value)}
                                placeholder="Contoh: Cabang Kabupaten Tangerang"
                                value={form.data.legalization_place}
                            />
                            <Select error={form.errors.status} label="Status Warga" name="status" onChange={(event) => form.setData('status', event.target.value as MemberStatus)} value={form.data.status}>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </section>
                ) : null}
            </form>
        </Modal>
    );
}
