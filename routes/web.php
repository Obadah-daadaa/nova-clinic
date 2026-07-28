<?php

use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\CalendarController as AdminCalendarController;
use App\Http\Controllers\Admin\DoctorController as AdminDoctorController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Booking\BookingController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MyAppointmentController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/services', ServiceController::class)->name('services.index');
Route::get('/doctors', DoctorController::class)->name('doctors.index');

Route::prefix('book')->name('book.')->group(function () {
    Route::get('service', [BookingController::class, 'services'])->name('service');
    Route::get('doctor', [BookingController::class, 'doctors'])->name('doctor');
    Route::get('slot', [BookingController::class, 'slot'])->name('slot');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        return $request->user()->is_admin
            ? redirect()->route('admin.bookings.index')
            : redirect()->route('appointments.index');
    })->name('dashboard');

    Route::get('book/confirm', [BookingController::class, 'confirm'])->name('book.confirm');
    Route::post('book', [BookingController::class, 'store'])->name('book.store');

    Route::get('appointments', [MyAppointmentController::class, 'index'])->name('appointments.index');
    Route::post('appointments/{booking}/cancel', [MyAppointmentController::class, 'cancel'])->name('appointments.cancel');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
    Route::patch('bookings/{booking}', [AdminBookingController::class, 'update'])->name('bookings.update');
    Route::get('calendar', AdminCalendarController::class)->name('calendar');
    Route::resource('doctors', AdminDoctorController::class)->except('show');
    Route::resource('services', AdminServiceController::class)->except('show');
});

require __DIR__.'/settings.php';
