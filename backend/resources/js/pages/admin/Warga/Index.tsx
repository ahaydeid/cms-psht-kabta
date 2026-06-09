import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Plus, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DataTable, type DataTableColumn } from '@/Components/Base';
import { Badge, Button, Select } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { MemberFormModal, type MemberCitizenship, type MemberGender, type MemberStatus, type OrganizationUnitOption } from './MemberFormModal';

type MemberRow = {
    address: string;
    birthDate: string;
    birthDateValue: string;
    birthPlace: string;
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
    phone: null | string;
    photoUrl?: null | string;
    ranting: string;
    religion: null | string;
    status: MemberStatus;
};

type MemberFilters = {
    page: number;
    per_page: number;
    search: string;
    status: 'active' | 'all' | 'deceased' | 'inactive' | 'transferred';
    unit: string;
};

type MemberPagination = {
    currentPage: number;
    data: MemberRow[];
    perPage: number;
    total: number;
    totalPages: number;
};

type AdminWargaIndexProps = {
    defaultOrganizationUnitId?: null | number;
    filters: MemberFilters;
    members: MemberPagination;
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

const statusOptions: Array<{ label: string; value: 'all' | MemberStatus }> = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Tidak Aktif', value: 'inactive' },
    { label: 'Pindah', value: 'transferred' },
    { label: 'Meninggal', value: 'deceased' },
];

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

function getJakartaTodayParts() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());

    return {
        year: Number(parts.find((part) => part.type === 'year')?.value ?? '0'),
        month: Number(parts.find((part) => part.type === 'month')?.value ?? '0'),
        day: Number(parts.find((part) => part.type === 'day')?.value ?? '0'),
    };
}

function ageLabel(birthDateValue: string) {
    if (!birthDateValue) {
        return '-';
    }

    const [birthYear, birthMonth, birthDay] = birthDateValue.split('-').map(Number);

    if (!birthYear || !birthMonth || !birthDay) {
        return '-';
    }

    const today = getJakartaTodayParts();
    let years = today.year - birthYear;
    let months = today.month - birthMonth;

    if (today.day < birthDay) {
        months -= 1;
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (years < 0) {
        return '-';
    }

    return `${years} thn, ${months} bln`;
}

export default function AdminWargaIndex({
    defaultOrganizationUnitId = null,
    filters,
    members,
    organizationUnitOptions = [],
}: AdminWargaIndexProps) {
    const { auth } = usePage<SharedPageProps>().props;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>(filters.status);
    const [unitFilter, setUnitFilter] = useState(filters.unit);
    const [rowsPerPage, setRowsPerPage] = useState(filters.per_page);
    const shouldShowRanting = true; // Show for all admins in this version

    useEffect(() => {
        setSearchTerm(filters.search);
        setStatusFilter(filters.status);
        setUnitFilter(filters.unit);
        setRowsPerPage(filters.per_page);
    }, [filters.page, filters.per_page, filters.search, filters.status, filters.unit]);

    const applyFilters = (nextFilters: Partial<MemberFilters>) => {
        router.get(
            '/admin/warga',
            {
                page: nextFilters.page ?? filters.page,
                per_page: nextFilters.per_page ?? rowsPerPage,
                search: nextFilters.search ?? searchTerm,
                status: nextFilters.status ?? statusFilter,
                unit: nextFilters.unit ?? unitFilter,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (searchTerm === filters.search) {
                return;
            }

            applyFilters({ page: 1, search: searchTerm });
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [filters.search, searchTerm]);

    const columns: DataTableColumn<MemberRow>[] = [
        {
            cell: (_, index) => <div className="w-8 truncate text-center">{index + 1}</div>,
            header: 'No.',
            key: 'no',
        },
        {
            cell: (row) => (
                <div className="flex w-48 items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-zinc-400">
                        {row.photoUrl ? (
                            <img alt={row.name} className="h-full w-full object-cover" src={row.photoUrl} />
                        ) : (
                            <UserRound className="h-4 w-4" />
                        )}
                    </div>
                    <div className="truncate text-zinc-700">{row.name}</div>
                </div>
            ),
            header: 'Warga',
            key: 'name',
        },
        {
            cell: (row) => <div className="w-32 truncate">{row.memberNumber}</div>,
            header: 'NIW',
            key: 'memberNumber',
        },
        ...(shouldShowRanting
            ? [
                  {
                      cell: (row: MemberRow) => <div className="w-48 truncate">{row.ranting}</div>,
                      header: 'Ranting',
                      key: 'ranting',
                  } satisfies DataTableColumn<MemberRow>,
              ]
            : []),
        {
            cell: (row) => <div className="w-36 truncate">{row.legalizedAt}</div>,
            header: 'Tanggal Pengesahan',
            key: 'legalizedAt',
        },
        {
            cell: (row) => (
                <Badge className="border-0" size="sm" variant={statusBadgeVariant(row.status)}>
                    {statusLabel(row.status)}
                </Badge>
            ),
            header: 'Status',
            key: 'status',
        },
        {
            cell: (row) => (
                <Button
                    className="text-zinc-700"
                    icon={<Eye className="h-4 w-4" />}
                    onClick={() => router.visit(`/admin/warga/${row.id}`)}
                    size="sm"
                    variant="warning"
                >
                    Detail
                </Button>
            ),
            header: 'Aksi',
            key: 'action',
            searchable: false,
            stickyRight: true,
        },
    ];

    return (
        <AdminLayout>
            <Head title="Master Warga" />

            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">Master Warga</h1>
                </div>

                <DataTable
                    leftActions={
                        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setIsCreateOpen(true)} size="md" variant="primary">
                            Tambah Warga
                        </Button>
                    }
                    columns={columns}
                    controlsEnd={
                        <>
                            <Select
                                className="min-w-40"
                                containerClassName="w-auto"
                                onChange={(event) => {
                                    const nextStatus = event.target.value as 'all' | MemberStatus;
                                    setStatusFilter(nextStatus);
                                    applyFilters({ page: 1, status: nextStatus });
                                }}
                                value={statusFilter}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                className="min-w-48"
                                containerClassName="w-auto"
                                onChange={(event) => {
                                    const nextUnit = event.target.value;
                                    setUnitFilter(nextUnit);
                                    applyFilters({ page: 1, unit: nextUnit });
                                }}
                                value={unitFilter}
                            >
                                <option value="all">Semua Ranting</option>
                                {organizationUnitOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </Select>
                        </>
                    }
                    currentPage={members.currentPage}
                    data={members.data}
                    emptyMessage="Belum ada data warga yang sesuai dengan filter."
                    getRowKey={(row) => row.id}
                    onPageChange={(page) => applyFilters({ page })}
                    onRowsPerPageChange={(value) => {
                        setRowsPerPage(value);
                        applyFilters({ page: 1, per_page: value });
                    }}
                    onSearchTermChange={setSearchTerm}
                    placeholder="Cari nama, NIW, Ranting..."
                    rowsPerPage={rowsPerPage}
                    searchTerm={searchTerm}
                    serverSide
                    totalPages={members.totalPages}
                />
            </div>

            <MemberFormModal
                defaultOrganizationUnitId={defaultOrganizationUnitId}
                mode="create"
                onClose={() => setIsCreateOpen(false)}
                open={isCreateOpen}
                organizationUnitOptions={organizationUnitOptions}
                submitUrl="/admin/warga"
            />
        </AdminLayout>
    );
}
