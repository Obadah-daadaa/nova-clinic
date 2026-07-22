<?php

namespace App\Http\Controllers;

use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('services', [
            'services' => ServiceResource::collection(
                Service::query()->where('active', true)->orderBy('name')->get()
            ),
        ]);
    }
}
