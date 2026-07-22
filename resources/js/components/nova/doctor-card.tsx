import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import { useLang } from '@/hooks/use-lang';
import book from '@/routes/book';
import type { Doctor } from '@/types/clinic';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
    const { t, pick } = useLang();
    const getInitials = useInitials();
    const services = doctor.services ?? [];
    const [selected, setSelected] = useState(
        services[0] ? String(services[0].id) : '',
    );

    const bookHref =
        services.length <= 1
            ? book.slot({
                  query: {
                      doctor: doctor.id,
                      service: services[0]?.id,
                  },
              })
            : null;

    return (
        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
                        {getInitials(doctor.name)}
                    </span>
                    <div>
                        <CardTitle className="text-base">
                            {pick(doctor.name, doctor.name_ar)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {pick(doctor.title, doctor.title_ar)}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {doctor.bio && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {pick(doctor.bio, doctor.bio_ar ?? doctor.bio)}
                    </p>
                )}
                {services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {services.map((service) => (
                            <span
                                key={service.id}
                                className="rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground"
                            >
                                {pick(service.name, service.name_ar)}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
                {bookHref ? (
                    <Button asChild className="w-full">
                        <Link href={bookHref}>{t('doctors.bookButton')}</Link>
                    </Button>
                ) : (
                    <>
                        <Select value={selected} onValueChange={setSelected}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem
                                        key={service.id}
                                        value={String(service.id)}
                                    >
                                        {pick(service.name, service.name_ar)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            className="w-full"
                            onClick={() =>
                                router.visit(
                                    book.slot({
                                        query: {
                                            doctor: doctor.id,
                                            service: selected,
                                        },
                                    }).url,
                                )
                            }
                        >
                            {t('doctors.bookButton')}
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
