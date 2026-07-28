import { Head } from '@inertiajs/react';
import DoctorController from '@/actions/App/Http/Controllers/Admin/DoctorController';
import { DoctorForm } from '@/components/nova/doctor-form';
import { useLang } from '@/hooks/use-lang';
import type { Service } from '@/types/clinic';

type PageProps = {
    services: Service[];
};

export default function AdminDoctorCreate({ services }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Admin — Add doctor" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                    {t('admin.addDoctor')}
                </h1>
            </div>

            <div className="max-w-2xl">
                <DoctorForm
                    services={services}
                    formProps={DoctorController.store.form()}
                    submitLabel={t('admin.save')}
                />
            </div>
        </>
    );
}
