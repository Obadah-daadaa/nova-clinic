import { Head } from '@inertiajs/react';
import DoctorController from '@/actions/App/Http/Controllers/Admin/DoctorController';
import { DoctorForm } from '@/components/nova/doctor-form';
import { useLang } from '@/hooks/use-lang';
import type { Doctor, Service } from '@/types/clinic';

type PageProps = {
    doctor: Doctor;
    services: Service[];
};

export default function AdminDoctorEdit({ doctor, services }: PageProps) {
    const { t } = useLang();

    return (
        <>
            <Head title="Admin — Edit doctor" />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                    {t('admin.editDoctor')}
                </h1>
            </div>

            <div className="max-w-2xl">
                <DoctorForm
                    doctor={doctor}
                    services={services}
                    formProps={DoctorController.update.form(doctor.id)}
                    submitLabel={t('admin.save')}
                />
            </div>
        </>
    );
}
