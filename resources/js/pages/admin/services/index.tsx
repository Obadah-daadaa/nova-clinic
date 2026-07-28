import { Head, Link, router } from '@inertiajs/react';
import { Eye, EyeOff, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { useLang } from '@/hooks/use-lang';
import admin from '@/routes/admin';
import type { Service } from '@/types/clinic';

type PageProps = {
    services: Service[];
};

export default function AdminServicesIndex({ services }: PageProps) {
    const { t, pick } = useLang();

    const toggleActive = (service: Service) => {
        router.put(admin.services.update(service.id).url, {
            name: service.name,
            name_ar: service.name_ar,
            slug: service.slug,
            description: service.description,
            description_ar: service.description_ar,
            duration_minutes: service.duration_minutes,
            price: service.price,
            active: !service.active,
        });
    };

    const destroy = (service: Service) => {
        if (window.confirm(t('admin.confirmDelete'))) {
            router.delete(admin.services.destroy(service.id).url);
        }
    };

    return (
        <>
            <Head title="Admin — Services" />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">
                        {t('admin.servicesTitle')}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {t('admin.servicesSubtitle')}
                    </p>
                </div>
                <Button asChild size="sm" className="gap-1.5">
                    <Link href={admin.services.create()}>
                        <Plus className="size-4" />
                        {t('admin.addService')}
                    </Link>
                </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('admin.columnName')}</TableHead>
                            <TableHead>{t('admin.columnDuration')}</TableHead>
                            <TableHead>{t('admin.columnPrice')}</TableHead>
                            <TableHead>{t('admin.columnActive')}</TableHead>
                            <TableHead className="text-end">
                                {t('admin.columnActions')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground"
                                >
                                    {t('admin.noServices')}
                                </TableCell>
                            </TableRow>
                        )}
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">
                                    {pick(service.name, service.name_ar)}
                                </TableCell>
                                <TableCell>
                                    {service.duration_minutes} {t('common.min')}
                                </TableCell>
                                <TableCell>
                                    {service.price} {t('common.aed')}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            service.active
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {service.active
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
                                                    href={admin.services.edit(
                                                        service.id,
                                                    )}
                                                >
                                                    <Pencil className="size-4" />
                                                    {t('admin.actionEdit')}
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleActive(service)
                                                }
                                            >
                                                {service.active ? (
                                                    <EyeOff className="size-4" />
                                                ) : (
                                                    <Eye className="size-4" />
                                                )}
                                                {service.active
                                                    ? t(
                                                          'admin.actionDeactivate',
                                                      )
                                                    : t('admin.actionActivate')}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() =>
                                                    destroy(service)
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
