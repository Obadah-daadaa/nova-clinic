import { Form } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLang } from '@/hooks/use-lang';
import type { Service } from '@/types/clinic';
import type { RouteFormDefinition } from '@/wayfinder';

type ServiceFormFields = {
    name: string;
    name_ar: string;
    slug: string;
    description: string | null;
    description_ar: string | null;
    duration_minutes: number;
    price: number;
    active: boolean;
};

type Props = {
    service?: Service;
    formProps: RouteFormDefinition<'post'>;
    submitLabel: ReactNode;
};

export function ServiceForm({ service, formProps, submitLabel }: Props) {
    const { t } = useLang();

    return (
        <Form<ServiceFormFields>
            {...formProps}
            options={{ preserveScroll: true }}
            className="space-y-6"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {t('admin.fieldNameEn')}
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={service?.name}
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
                                defaultValue={service?.name_ar}
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
                            defaultValue={service?.slug}
                            required
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="description">
                                {t('admin.fieldDescriptionEn')}
                            </Label>
                            <textarea
                                id="description"
                                name="description"
                                defaultValue={service?.description ?? ''}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description_ar">
                                {t('admin.fieldDescriptionAr')}
                            </Label>
                            <textarea
                                id="description_ar"
                                name="description_ar"
                                dir="rtl"
                                defaultValue={service?.description_ar ?? ''}
                                rows={4}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            />
                            <InputError message={errors.description_ar} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="duration_minutes">
                                {t('admin.fieldDuration')}
                            </Label>
                            <Input
                                id="duration_minutes"
                                name="duration_minutes"
                                type="number"
                                min={1}
                                defaultValue={service?.duration_minutes ?? 30}
                                required
                            />
                            <InputError message={errors.duration_minutes} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="price">
                                {t('admin.fieldPrice')}
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min={0}
                                step="0.01"
                                defaultValue={service?.price ?? 0}
                                required
                            />
                            <InputError message={errors.price} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            id="active"
                            name="active"
                            type="checkbox"
                            value="1"
                            defaultChecked={service?.active ?? true}
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
