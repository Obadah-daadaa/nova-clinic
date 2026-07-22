import { Link } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useLang } from '@/hooks/use-lang';
import book from '@/routes/book';
import type { Service } from '@/types/clinic';

export function ServiceCard({ service }: { service: Service }) {
    const { t, pick } = useLang();

    return (
        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">
                    {pick(service.name, service.name_ar)}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {service.description && (
                    <p className="text-sm text-muted-foreground">
                        {pick(service.description, service.description_ar ?? service.description)}
                    </p>
                )}
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-4" />
                        {service.duration_minutes} {t('common.min')}
                    </span>
                    <span className="font-semibold text-primary">
                        {service.price} {t('common.aed')}
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={book.doctor({ query: { service: service.id } })}>
                        {t('services.bookButton')}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
