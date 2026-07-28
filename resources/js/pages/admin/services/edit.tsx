import { Head } from '@inertiajs/react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { ServiceForm } from '@/components/nova/service-form';
import { useLang } from '@/hooks/use-lang';
import type { Service } from '@/types/clinic';

type PageProps = {
    service: Service;
};

export default function AdminServiceEdit({ service }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Admin — Edit service" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                    {t('admin.editService')}
                </h1>
            </div>

            <div className="max-w-2xl">
                <ServiceForm
                    service={service}
                    formProps={ServiceController.update.form(service.id)}
                    submitLabel={t('admin.save')}
                />
            </div>
        </>
    );
}
