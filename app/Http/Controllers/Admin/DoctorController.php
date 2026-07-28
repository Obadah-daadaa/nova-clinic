<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDoctorRequest;
use App\Http\Requests\Admin\UpdateDoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Http\Resources\ServiceResource;
use App\Models\Doctor;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DoctorController extends Controller
{
    public function index(): Response
    {
        $doctors = Doctor::query()->with('services')->orderBy('name')->get();

        return Inertia::render('admin/doctors/index', [
            'doctors' => DoctorResource::collection($doctors)->resolve(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/doctors/create', [
            'services' => ServiceResource::collection(Service::query()->orderBy('name')->get())->resolve(),
        ]);
    }

    public function store(StoreDoctorRequest $request): RedirectResponse
    {
        $data = [
            ...$request->safe()->except(['photo', 'service_ids']),
            'active' => $request->boolean('active'),
        ];

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('doctors', 'public');
        }

        $doctor = Doctor::query()->create($data);
        $doctor->services()->sync($request->input('service_ids', []));

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor created.');
    }

    public function edit(Doctor $doctor): Response
    {
        $doctor->load('services');

        return Inertia::render('admin/doctors/edit', [
            'doctor' => new DoctorResource($doctor),
            'services' => ServiceResource::collection(Service::query()->orderBy('name')->get())->resolve(),
        ]);
    }

    public function update(UpdateDoctorRequest $request, Doctor $doctor): RedirectResponse
    {
        $data = [
            ...$request->safe()->except(['photo', 'service_ids']),
            'active' => $request->boolean('active'),
        ];

        if ($request->hasFile('photo')) {
            if ($doctor->photo_path) {
                Storage::disk('public')->delete($doctor->photo_path);
            }

            $data['photo_path'] = $request->file('photo')->store('doctors', 'public');
        }

        $doctor->update($data);
        $doctor->services()->sync($request->input('service_ids', []));

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor updated.');
    }

    public function destroy(Doctor $doctor): RedirectResponse
    {
        if ($doctor->bookings()->exists()) {
            return back()->with('error', 'This doctor has existing bookings and cannot be deleted. Deactivate them instead.');
        }

        if ($doctor->photo_path) {
            Storage::disk('public')->delete($doctor->photo_path);
        }

        $doctor->delete();

        return redirect()->route('admin.doctors.index')->with('success', 'Doctor deleted.');
    }
}
