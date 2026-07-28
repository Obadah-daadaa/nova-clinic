import { Head } from '@inertiajs/react';
import ServiceController from '@/actions/App/Http/Controllers/Admin/ServiceController';
import { ServiceForm } from '@/components/nova/service-form';
import { useLang } from '@/hooks/use-lang';

export default function AdminServiceCreate() {
    const { t } = useLang();

    return (
        <>
            <Head title="Admin — Add service" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                    {t('admin.addService')}
                </h1>
            </div>

            <div className="max-w-2xl">
                <ServiceForm
                    formProps={ServiceController.store.form()}
                    submitLabel={t('admin.save')}
                />
            </div>
        </>
    );
}
