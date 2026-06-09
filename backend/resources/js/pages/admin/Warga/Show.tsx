import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft, Pencil, Trash2, UserRound } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import Swal from 'sweetalert2';

import { Badge, Button } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { showToast } from '@/lib/alert';
import { MemberFormModal, type MemberCitizenship, type MemberGender, type MemberStatus, type OrganizationUnitOption } from './MemberFormModal';

type MemberDetail = {
    address: null | string;
    birthDate: string;
    birthDateValue: string;
    birthPlace: null | string;
    citizenship: MemberCitizenship;
    gender: MemberGender;
    id: number;
    identityNumber: null | string;
    identityType: 'KTP/KK';
    legalizationPlace: null | string;
    legalizedAt: string;
    legalizedAtValue: string;
    memberNumber: string;
    name: string;
    occupation: null | string;
    organizationUnit: string;
    organizationUnitId: number;
    phone: null | string;
    photoUrl?: null | string;
    ranting: string;
    religion: null | string;
    status: MemberStatus;
};

type AdminWargaShowProps = {
    member: MemberDetail;
    organizationUnitOptions: OrganizationUnitOption[];
};

type SharedPageProps = {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
            role: string;
        } | null;
    };
};

function statusBadgeVariant(status: MemberStatus) {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'secondary';
        case 'transferred':
            return 'outline';
        case 'deceased':
            return 'destructive';
        default:
            return 'secondary';
    }
}

function statusLabel(status: MemberStatus) {
    switch (status) {
        case 'active':
            return 'Aktif';
        case 'inactive':
            return 'Tidak Aktif';
        case 'transferred':
            return 'Pindah';
        case 'deceased':
            return 'Meninggal';
        default:
            return status;
    }
}

function emptyValue(value?: null | string) {
    return value && value.trim() ? value : '-';
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value?: null | string;
}) {
    return (
        <div className="space-y-1.5">
            <div className="text-xs font-medium text-zinc-500">{label}</div>
            <div className="text-sm font-semibold text-zinc-800">
                {emptyValue(value)}
            </div>
        </div>
    );
}

function DetailBadgeItem({
    children,
    label,
}: {
    children: ReactNode;
    label: string;
}) {
    return (
        <div className="space-y-1.5">
            <div className="text-xs font-medium text-zinc-500">{label}</div>
            {children}
        </div>
    );
}

function DetailSection({
    children,
    className = '',
    title,
}: {
    children: ReactNode;
    className?: string;
    title: string;
}) {
    return (
        <section className={`student-detail-section ${className}`}>
            <div>
                <h3 className="text-base font-bold text-brand-yellow-dark">{title}</h3>
            </div>
            {children}
        </section>
    );
}

export default function AdminWargaShow({
    member,
    organizationUnitOptions = [],
}: AdminWargaShowProps) {
    const { auth } = usePage<SharedPageProps>().props;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const shouldShowRanting = true;
    const canDeleteMember = !auth?.user || auth?.user?.role === 'superadmin' || auth?.user?.role === 'admin';

    const handleDeleteMember = async () => {
        const result = await Swal.fire({
            title: 'Hapus warga ini?',
            text: `Ketik nama warga persis seperti "${member.name}" untuk melanjutkan.`,
            input: 'text',
            inputLabel: 'Nama warga',
            inputPlaceholder: member.name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            confirmButtonColor: '#facc15',
            cancelButtonColor: '#e4e4e7',
            customClass: {
                title: 'text-2xl!',
                confirmButton: 'text-brand-black!',
                cancelButton: 'text-zinc-700!',
                input: 'rounded! border! border-zinc-300! px-3! py-2! text-sm! text-zinc-800! focus:border-brand-yellow-dark! focus:ring-1! focus:ring-brand-yellow/30!',
                inputLabel: 'text-sm! font-medium! text-zinc-700!',
            },
            inputValidator: (value) => {
                if (value.trim() !== member.name.trim()) {
                    return 'Nama warga tidak cocok.';
                }

                return undefined;
            },
        });

        if (!result.isConfirmed) {
            return;
        }

        router.delete(`/admin/warga/${member.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                showToast({ title: 'Data warga berhasil dihapus.' });
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={`Detail Warga - ${member.name}`} />

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Kembali ke daftar warga"
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-transparent text-zinc-700 transition hover:border-slate-100 hover:bg-white hover:text-brand-black"
                        onClick={() => router.visit('/admin/warga')}
                        type="button"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-zinc-800">
                            Detail Warga
                        </h2>
                    </div>
                </div>

                <div className="student-detail-layout">
                    <div>
                        <aside className="w-full rounded border border-zinc-200 bg-white p-4">
                            <div className="overflow-hidden rounded bg-zinc-100" style={{ aspectRatio: '3 / 4' }}>
                                {member.photoUrl ? (
                                    <img
                                        alt={member.name}
                                        className="h-full w-full object-cover"
                                        src={member.photoUrl}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <UserRound className="h-24 w-24" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <span className="text-lg font-bold leading-tight text-zinc-900">
                                    {member.name}
                                </span>
                                <div className="mt-1 text-sm font-semibold text-zinc-500">
                                    {member.memberNumber}
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div className="min-w-0 space-y-3">
                        <section className="student-detail-card rounded border border-zinc-200 bg-white">
                            <DetailSection title="Data Diri Warga">
                                <div className="student-detail-grid">
                                    <DetailItem
                                        label="Kewarganegaraan"
                                        value={member.citizenship}
                                    />
                                    <DetailItem
                                        label="Nomor Induk Warga (NIW)"
                                        value={member.memberNumber}
                                    />
                                    <DetailItem
                                        label="Nomor Identitas (KTP/KK)"
                                        value={member.identityNumber}
                                    />
                                    <DetailItem
                                        label="Tempat Lahir"
                                        value={member.birthPlace}
                                    />
                                    <DetailItem
                                        label="Tanggal Lahir"
                                        value={member.birthDate}
                                    />
                                    <DetailItem
                                        label="Jenis Kelamin"
                                        value={member.gender}
                                    />
                                    <DetailItem
                                        label="Agama"
                                        value={member.religion}
                                    />
                                </div>
                            </DetailSection>

                            <section className="student-detail-section">
                                <div>
                                    <h3 className="text-base font-bold text-brand-yellow-dark">Kontak</h3>
                                </div>
                                <div className="student-detail-grid student-detail-grid--contact">
                                    <DetailItem
                                        label="Alamat Lengkap"
                                        value={member.address}
                                    />
                                    <DetailItem
                                        label="No HP / WA"
                                        value={
                                            member.phone
                                                ? `+62${member.phone}`
                                                : null
                                        }
                                    />
                                </div>
                            </section>

                            <DetailSection title="Data Keanggotaan">
                                <div className="student-detail-grid">
                                    {shouldShowRanting ? (
                                        <DetailItem
                                            label="Ranting"
                                            value={member.ranting}
                                        />
                                    ) : null}
                                    <DetailItem
                                        label="Tanggal Pengesahan"
                                        value={member.legalizedAt}
                                    />
                                    <DetailItem
                                        label="Tempat Pengesahan"
                                        value={member.legalizationPlace}
                                    />
                                    <DetailBadgeItem label="Status Warga">
                                        <Badge
                                            className="justify-center border-0"
                                            size="sm"
                                            variant={statusBadgeVariant(
                                                member.status,
                                            )}
                                        >
                                            {statusLabel(member.status)}
                                        </Badge>
                                    </DetailBadgeItem>
                                </div>
                            </DetailSection>
                        </section>

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            {canDeleteMember ? (
                                <Button
                                    className="w-full rounded-full hover:border-brand-red! hover:bg-brand-red! hover:text-white! sm:w-40"
                                    icon={<Trash2 className="h-4 w-4" />}
                                    onClick={handleDeleteMember}
                                    size="md"
                                    variant="outline"
                                >
                                    Hapus
                                </Button>
                            ) : null}
                            <Button
                                className="w-full rounded-full hover:border-brand-yellow! hover:bg-brand-yellow! hover:text-brand-black! sm:w-40"
                                icon={<Pencil className="h-4 w-4" />}
                                onClick={() => setIsEditOpen(true)}
                                size="md"
                                variant="outline"
                            >
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <MemberFormModal
                initialData={{
                    _method: 'put',
                    address: member.address ?? '',
                    birth_date: member.birthDateValue,
                    birth_place: member.birthPlace ?? '',
                    citizenship: member.citizenship,
                    gender: member.gender,
                    identity_number: member.identityNumber ?? '',
                    legalized_at: member.legalizedAtValue,
                    legalization_place: member.legalizationPlace ?? '',
                    member_number: member.memberNumber,
                    name: member.name,
                    occupation: member.occupation ?? '',
                    organization_unit_id: String(member.organizationUnitId),
                    phone: member.phone ?? '',
                    photo_url: member.photoUrl ?? null,
                    religion: member.religion ?? '',
                    status: member.status,
                }}
                mode="edit"
                onClose={() => setIsEditOpen(false)}
                open={isEditOpen}
                organizationUnitOptions={organizationUnitOptions}
                submitUrl={`/admin/warga/${member.id}`}
            />
        </AdminLayout>
    );
}
