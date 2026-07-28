<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()->orderBy('name')->get();

        return Inertia::render('admin/services/index', [
            'services' => ServiceResource::collection($services)->resolve(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/services/create');
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::query()->create([
            ...$request->validated(),
            'active' => $request->boolean('active'),
        ]);

        return redirect()->route('admin.services.index')->with('success', 'Service created.');
    }

    public function edit(Service $service): Response
    {
        return Inertia::render('admin/services/edit', [
            'service' => new ServiceResource($service),
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update([
            ...$request->validated(),
            'active' => $request->boolean('active'),
        ]);

        return redirect()->route('admin.services.index')->with('success', 'Service updated.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        if ($service->bookings()->exists()) {
            return back()->with('error', 'This service has existing bookings and cannot be deleted. Deactivate it instead.');
        }

        $service->delete();

        return redirect()->route('admin.services.index')->with('success', 'Service deleted.');
    }
}
