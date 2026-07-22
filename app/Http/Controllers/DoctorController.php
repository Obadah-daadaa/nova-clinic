<?php

namespace App\Http\Controllers;

use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use Inertia\Inertia;
use Inertia\Response;

class DoctorController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('doctors', [
            'doctors' => DoctorResource::collection(
                Doctor::query()->with('services')->where('active', true)->orderBy('name')->get()
            ),
        ]);
    }
}
