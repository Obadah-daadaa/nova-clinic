export type Service = {
    id: number;
    name: string;
    name_ar: string;
    slug: string;
    description: string | null;
    description_ar: string | null;
    duration_minutes: number;
    price: number;
    active: boolean;
};

export type Doctor = {
    id: number;
    name: string;
    name_ar: string;
    slug: string;
    title: string;
    title_ar: string;
    photo_path: string | null;
    bio: string | null;
    bio_ar: string | null;
    active: boolean;
    services?: Service[];
};

export type BookingStatusValue =
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled'
    | 'no_show';

export type Booking = {
    id: number;
    starts_at: string;
    ends_at: string;
    status: BookingStatusValue;
    status_label: string;
    status_label_ar: string;
    notes: string | null;
    can_be_cancelled: boolean;
    user: {
        id: number;
        name: string;
        email: string;
    };
    doctor: Doctor;
    service: Service;
};

export type Slot = {
    starts_at: string;
    label: string;
};
