import { Form } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { useLang } from '@/hooks/use-lang';
import type { Doctor, Service } from '@/types/clinic';
import type { RouteFormDefinition } from '@/wayfinder';

type DoctorFormFields = {
    name: string;
    name_ar: string;
    slug: string;
    title: string;
    title_ar: string;
    bio: string | null;
    bio_ar: string | null;
    photo: File | null;
    active: boolean;
    service_ids: number[];
};

type Props = {
    doctor?: Doctor;
    services: Service[];
    formProps: RouteFormDefinition<'post'>;
    submitLabel: ReactNode;
};

export function DoctorForm({ doctor, services, formProps, submitLabel }: Props) {
    const { t, pick } = useLang();
    const getInitials = useInitials();
    const [preview, setPreview] = useState<string | null>(
        doctor?.photo_path ? `/storage/${doctor.photo_path}` : null,
    );
    const selectedServiceIds = new Set(
        (doctor?.services ?? []).map((s) => s.id),
    );

    return (
        <Form<DoctorFormFields>
            {...formProps}
            options={{ preserveScroll: true }}
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="flex items-center gap-4">
                        {preview ? (
                            <img
                                src={preview}
                                alt=""
                                className="size-16 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
                                {doctor ? getInitials(doctor.name) : '?'}
                            </span>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="photo">
                                {t('admin.fieldPhoto')}
                            </Label>
                            <Input
                                id="photo"
                                name="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <InputError message={errors.photo} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {t('admin.fieldNameEn')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={doctor?.name}
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name_ar">
                                {t('admin.fieldNameAr')}
                            </Label>
                            <Input
                                id="name_ar"
                                name="name_ar"
                                dir="rtl"
                                defaultValue={doctor?.name_ar}
                                required
                            />
                            <InputError message={errors.name_ar} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">{t('admin.fieldSlug')}</Label>
                        <Input
                            id="slug"
                            name="slug"
                            defaultValue={doctor?.slug}
                            required
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                {t('admin.fieldTitleEn')}
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={doctor?.title}
                                required
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title_ar">
                                {t('admin.fieldTitleAr')}
                            </Label>
                            <Input
                                id="title_ar"
                                name="title_ar"
                                dir="rtl"
                                defaultValue={doctor?.title_ar}
                                required
                            />
                            <InputError message={errors.title_ar} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="bio">
                                {t('admin.fieldBioEn')}
                            </Label>
                            <textarea
                                id="bio"
                                name="bio"
                                defaultValue={doctor?.bio ?? ''}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.bio} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio_ar">
                                {t('admin.fieldBioAr')}
                            </Label>
                            <textarea
                                id="bio_ar"
                                name="bio_ar"
                                dir="rtl"
                                defaultValue={doctor?.bio_ar ?? ''}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.bio_ar} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>{t('admin.fieldServices')}</Label>
                        <div className="flex flex-wrap gap-3 rounded-md border border-input p-3">
                            {services.map((service) => (
                                <label
                                    key={service.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        name="service_ids[]"
                                        value={service.id}
                                        defaultChecked={selectedServiceIds.has(
                                            service.id,
                                        )}
                                        className="size-4 rounded border-input"
                                    />
                                    {pick(service.name, service.name_ar)}
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.service_ids} />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="active"
                            name="active"
                            type="checkbox"
                            value="1"
                            defaultChecked={doctor?.active ?? true}
                            className="size-4 rounded border-input"
                        />
                        <Label htmlFor="active">
                            {t('admin.fieldActive')}
                        </Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {submitLabel}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
