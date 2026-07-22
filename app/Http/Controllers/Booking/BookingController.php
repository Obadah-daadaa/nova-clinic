<?php

namespace App\Http\Controllers\Booking;

use App\Actions\Booking\CreateBooking;
use App\Exceptions\SlotUnavailableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\SlotResource;
use App\Models\Doctor;
use App\Models\Service;
use App\Services\SlotGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function services(): Response
    {
        return Inertia::render('book/service', [
            'services' => ServiceResource::collection(
                Service::query()->where('active', true)->orderBy('name')->get()
            ),
        ]);
    }

    public function doctors(Request $request): Response
    {
        $data = $request->validate([
            'service' => ['required', 'integer', Rule::exists('services', 'id')->where('active', true)],
        ]);

        $service = Service::query()->whereKey($data['service'])->firstOrFail();

        $doctors = Doctor::query()
            ->where('active', true)
            ->whereHas('services', fn ($q) => $q->whereKey($service->id))
            ->with('services')
            ->orderBy('name')
            ->get();

        return Inertia::render('book/doctor', [
            'service' => new ServiceResource($service),
            'doctors' => DoctorResource::collection($doctors),
        ]);
    }

    public function slot(Request $request, SlotGenerator $slotGenerator): Response
    {
        $data = $request->validate([
            'service' => ['required', 'integer', Rule::exists('services', 'id')->where('active', true)],
            'doctor' => ['required', 'integer', Rule::exists('doctors', 'id')->where('active', true)],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $service = Service::query()->whereKey($data['service'])->firstOrFail();
        $doctor = Doctor::query()->whereKey($data['doctor'])->firstOrFail();

        abort_unless($doctor->services()->whereKey($service->id)->exists(), 404);

        $date = isset($data['date'])
            ? Carbon::createFromFormat('Y-m-d', $data['date'])->startOfDay()
            : now()->startOfDay();

        if ($date->lt(now()->startOfDay())) {
            $date = now()->startOfDay();
        }

        $slots = $slotGenerator->forDoctorOnDate($doctor, $service, $date);

        return Inertia::render('book/slot', [
            'service' => new ServiceResource($service),
            'doctor' => new DoctorResource($doctor),
            'date' => $date->toDateString(),
            'slots' => SlotResource::collection($slots),
        ]);
    }

    public function confirm(Request $request): Response
    {
        $data = $request->validate([
            'service' => ['required', 'integer', Rule::exists('services', 'id')->where('active', true)],
            'doctor' => ['required', 'integer', Rule::exists('doctors', 'id')->where('active', true)],
            'starts_at' => ['required', 'date', 'after:now'],
        ]);

        $service = Service::query()->whereKey($data['service'])->firstOrFail();
        $doctor = Doctor::query()->whereKey($data['doctor'])->firstOrFail();

        return Inertia::render('book/confirm', [
            'service' => new ServiceResource($service),
            'doctor' => new DoctorResource($doctor),
            'starts_at' => Carbon::parse($data['starts_at'])->toIso8601String(),
        ]);
    }

    public function store(StoreBookingRequest $request, CreateBooking $action): RedirectResponse
    {
        $service = Service::query()->whereKey($request->integer('service_id'))->firstOrFail();
        $doctor = Doctor::query()->whereKey($request->integer('doctor_id'))->firstOrFail();

        try {
            $action->handle(
                $request->user(),
                $doctor,
                $service,
                Carbon::parse($request->string('starts_at')->toString())
            );
        } catch (SlotUnavailableException $e) {
            return back()->withErrors(['starts_at' => $e->getMessage()]);
        }

        return to_route('appointments.index')->with('success', 'Your appointment request has been sent. We will confirm it shortly.');
    }
}
