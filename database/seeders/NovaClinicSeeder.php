<?php

namespace Database\Seeders;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Doctor;
use App\Models\Schedule;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class NovaClinicSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@novaclinic.ae'],
            [
                'name' => 'Nova Clinic Admin',
                'password' => Hash::make('password'),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $patient = User::query()->updateOrCreate(
            ['email' => 'patient@example.com'],
            [
                'name' => 'Fatima Al Nuaimi',
                'password' => Hash::make('password'),
                'is_admin' => false,
                'email_verified_at' => now(),
            ]
        );

        $services = collect([
            [
                'name' => 'General Consultation',
                'name_ar' => 'استشارة عامة',
                'description' => 'A full check-up with one of our general practitioners covering your overall health and any concerns.',
                'description_ar' => 'فحص شامل مع أحد أطبائنا العامين يغطي حالتك الصحية العامة وأي استفسارات لديك.',
                'duration_minutes' => 30,
                'price' => 150,
            ],
            [
                'name' => 'Dental Cleaning & Checkup',
                'name_ar' => 'تنظيف وفحص الأسنان',
                'description' => 'Professional cleaning, polishing and a full dental exam to keep your smile healthy.',
                'description_ar' => 'تنظيف احترافي وتلميع وفحص شامل للأسنان للحفاظ على ابتسامة صحية.',
                'duration_minutes' => 45,
                'price' => 250,
            ],
            [
                'name' => 'Teeth Whitening',
                'name_ar' => 'تبييض الأسنان',
                'description' => 'In-clinic whitening treatment for a noticeably brighter smile in one session.',
                'description_ar' => 'جلسة تبييض داخل العيادة للحصول على ابتسامة أكثر إشراقًا من جلسة واحدة.',
                'duration_minutes' => 60,
                'price' => 600,
            ],
            [
                'name' => 'Root Canal Treatment',
                'name_ar' => 'علاج جذور الأسنان',
                'description' => 'Precision root canal therapy to relieve pain and save the natural tooth.',
                'description_ar' => 'علاج دقيق لجذور الأسنان لتخفيف الألم والحفاظ على السن الطبيعي.',
                'duration_minutes' => 90,
                'price' => 850,
            ],
            [
                'name' => 'Dermatology Consultation',
                'name_ar' => 'استشارة جلدية',
                'description' => 'Skin, hair and nail assessment with a board-certified dermatologist.',
                'description_ar' => 'تقييم للبشرة والشعر والأظافر مع طبيبة جلدية معتمدة.',
                'duration_minutes' => 30,
                'price' => 300,
            ],
            [
                'name' => 'Physiotherapy Session',
                'name_ar' => 'جلسة علاج طبيعي',
                'description' => 'Hands-on rehabilitation session for pain relief, mobility and recovery.',
                'description_ar' => 'جلسة علاج طبيعي عملية لتخفيف الألم وتحسين الحركة والتعافي.',
                'duration_minutes' => 45,
                'price' => 220,
            ],
        ])->map(fn (array $s) => Service::query()->updateOrCreate(
            ['slug' => Str::slug($s['name'])],
            [...$s, 'slug' => Str::slug($s['name']), 'active' => true]
        ))->keyBy('name');

        $doctors = collect([
            [
                'name' => 'Dr. Sara Al Mazrouei',
                'name_ar' => 'د. سارة المزروعي',
                'title' => 'General Practitioner',
                'title_ar' => 'طبيبة عامة',
                'bio' => 'Dr. Sara has over 10 years of experience in family medicine across leading clinics in Dubai and Abu Dhabi.',
                'bio_ar' => 'تتمتع د. سارة بخبرة تفوق 10 سنوات في طب الأسرة في عيادات رائدة بدبي وأبوظبي.',
                'services' => ['General Consultation'],
                'weekdays' => [0, 1, 2, 3, 4],
            ],
            [
                'name' => 'Dr. Ahmed Al Farsi',
                'name_ar' => 'د. أحمد الفارسي',
                'title' => 'Dentist',
                'title_ar' => 'طبيب أسنان',
                'bio' => 'Dr. Ahmed specializes in cosmetic and restorative dentistry, trained in the UK and UAE.',
                'bio_ar' => 'يتخصص د. أحمد في طب الأسنان التجميلي والترميمي، وتلقى تدريبه في بريطانيا والإمارات.',
                'services' => ['Dental Cleaning & Checkup', 'Teeth Whitening', 'Root Canal Treatment'],
                'weekdays' => [0, 1, 2, 3, 4],
            ],
            [
                'name' => 'Dr. Layla Haddad',
                'name_ar' => 'د. ليلى حداد',
                'title' => 'Dermatologist',
                'title_ar' => 'أخصائية جلدية',
                'bio' => 'Dr. Layla is a board-certified dermatologist focused on medical and cosmetic skin care.',
                'bio_ar' => 'د. ليلى أخصائية جلدية معتمدة تركز على العناية الطبية والتجميلية بالبشرة.',
                'services' => ['Dermatology Consultation'],
                'weekdays' => [0, 1, 2, 3],
            ],
            [
                'name' => 'Dr. Omar Al Suwaidi',
                'name_ar' => 'د. عمر السويدي',
                'title' => 'Physiotherapist',
                'title_ar' => 'أخصائي علاج طبيعي',
                'bio' => 'Dr. Omar helps patients recover from injury and chronic pain through personalised therapy plans.',
                'bio_ar' => 'يساعد د. عمر المرضى على التعافي من الإصابات والآلام المزمنة عبر خطط علاجية مخصصة.',
                'services' => ['Physiotherapy Session'],
                'weekdays' => [1, 2, 3, 4],
            ],
        ])->map(function (array $d) use ($services) {
            $doctor = Doctor::query()->updateOrCreate(
                ['slug' => Str::slug($d['name'])],
                [
                    'user_id' => null,
                    'name' => $d['name'],
                    'name_ar' => $d['name_ar'],
                    'title' => $d['title'],
                    'title_ar' => $d['title_ar'],
                    'bio' => $d['bio'],
                    'bio_ar' => $d['bio_ar'],
                    'active' => true,
                ]
            );

            $doctor->services()->sync(
                collect($d['services'])->map(fn ($name) => $services[$name]->id)
            );

            foreach ($d['weekdays'] as $weekday) {
                Schedule::query()->updateOrCreate(
                    ['doctor_id' => $doctor->id, 'weekday' => $weekday],
                    ['start_time' => '09:00:00', 'end_time' => '17:00:00']
                );
            }

            return $doctor;
        });

        $ahmed = $doctors->firstWhere('name', 'Dr. Ahmed Al Farsi');
        $sara = $doctors->firstWhere('name', 'Dr. Sara Al Mazrouei');
        $dentalCleaning = $services['Dental Cleaning & Checkup'];
        $generalConsult = $services['General Consultation'];

        if (! Booking::query()->where('user_id', $patient->id)->exists()) {
            Booking::query()->create([
                'user_id' => $patient->id,
                'doctor_id' => $ahmed->id,
                'service_id' => $dentalCleaning->id,
                'starts_at' => now()->addDays(2)->setTime(10, 0),
                'ends_at' => now()->addDays(2)->setTime(10, 45),
                'status' => BookingStatus::Confirmed,
            ]);

            Booking::query()->create([
                'user_id' => $patient->id,
                'doctor_id' => $sara->id,
                'service_id' => $generalConsult->id,
                'starts_at' => now()->subDays(10)->setTime(11, 0),
                'ends_at' => now()->subDays(10)->setTime(11, 30),
                'status' => BookingStatus::Completed,
            ]);

            Booking::query()->create([
                'user_id' => $patient->id,
                'doctor_id' => $sara->id,
                'service_id' => $generalConsult->id,
                'starts_at' => now()->addDays(5)->setTime(9, 30),
                'ends_at' => now()->addDays(5)->setTime(10, 0),
                'status' => BookingStatus::Pending,
            ]);
        }

        $this->command->info('Nova Clinic demo data seeded: admin@novaclinic.ae / patient@example.com (password: password)');
    }
}
