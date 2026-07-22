<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Http\Resources\ServiceResource;
use App\Models\Doctor;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'services' => ServiceResource::collection(
                Service::query()->where('active', true)->orderBy('price')->get()
            ),
            'doctors' => DoctorResource::collection(
                Doctor::query()->with('services')->where('active', true)->get()
            ),
        ]);
    }
}
