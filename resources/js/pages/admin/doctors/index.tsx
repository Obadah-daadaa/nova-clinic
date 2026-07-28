import { Head, Link, router } from '@inertiajs/react';
import { EyeOff, MoreVertical, Pencil, Plus, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { Doctor } from '@/types/clinic';

type PageProps = {
    doctors: Doctor[];
};

export default function AdminDoctorsIndex({ doctors }: PageProps) {
    const { t, pick } = useLang();
    const getInitials = useInitials();

    const toggleActive = (doctor: Doctor) => {
        router.put(admin.doctors.update(doctor.id).url, {
            name: doctor.name,
            name_ar: doctor.name_ar,
            slug: doctor.slug,
            title: doctor.title,
            title_ar: doctor.title_ar,
            bio: doctor.bio,
            bio_ar: doctor.bio_ar,
            active: !doctor.active,
            service_ids: (doctor.services ?? []).map((s) => s.id),
        });
    };

    const destroy = (doctor: Doctor) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            router.delete(admin.doctors.destroy(doctor.id).url);
        }
    };

    return (
        <>
            <Head title="Admin — Doctors" />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('admin.doctorsTitle')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {t('admin.doctorsSubtitle')}
                    </p>
                </div>
                <Button asChild size="sm" className="gap-1.5">
                    <Link href={admin.doctors.create()}>
                        <Plus className="size-4" />
                        {t('admin.addDoctor')}
                    </Link>
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('admin.columnName')}</TableHead>
                            <TableHead>{t('admin.columnTitle')}</TableHead>
                            <TableHead>{t('admin.columnServices')}</TableHead>
                            <TableHead>{t('admin.columnActive')}</TableHead>
                            <TableHead className="text-end">
                                {t('admin.columnActions')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {doctors.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground"
                                >
                                    {t('admin.noDoctors')}
                                </TableCell>
                            </TableRow>
                        )}
                        {doctors.map((doctor) => (
                            <TableRow key={doctor.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2.5">
                                        {doctor.photo_path ? (
                                            <img
                                                src={`/storage/${doctor.photo_path}`}
                                                alt=""
                                                className="size-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                                                {getInitials(doctor.name)}
                                            </span>
                                        )}
                                        {pick(doctor.name, doctor.name_ar)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {pick(doctor.title, doctor.title_ar)}
                                </TableCell>
                                <TableCell>
                                    {(doctor.services ?? []).length}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            doctor.active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {doctor.active
                                            ? t('admin.fieldActive')
                                            : t('admin.actionDeactivate')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={t(
                                                    'admin.openActions',
                                                )}
                                            >
                                                <MoreVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link
                                                    href={admin.doctors.edit(
                                                        doctor.id,
                                                    )}
                                                >
                                                    <Pencil className="size-4" />
                                                    {t('admin.actionEdit')}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleActive(doctor)
                                                }
                                            >
                                                {doctor.active ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                                {doctor.active
                                                    ? t(
                                                          'admin.actionDeactivate',
                                                      )
                                                    : t('admin.actionActivate')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() =>
                                                    destroy(doctor)
                                                }
                                            >
                                                <Trash2 className="size-4" />
                                                {t('admin.actionDelete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
