<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientOnlyAccessTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    private function patient(): User
    {
        return User::factory()->create(['is_admin' => false]);
    }

    public function test_guests_can_browse_the_booking_flow()
    {
        $this->get(route('book.service'))->assertOk();
    }

    public function test_patients_can_browse_the_booking_flow()
    {
        $this->actingAs($this->patient())
            ->get(route('book.service'))
            ->assertOk();
    }

    public function test_admins_are_redirected_away_from_the_booking_flow()
    {
        $this->actingAs($this->admin())
            ->get(route('book.service'))
            ->assertRedirect(route('admin.bookings.index'));
    }

    public function test_admins_cannot_submit_a_booking()
    {
        $this->actingAs($this->admin())
            ->post(route('book.store'))
            ->assertRedirect(route('admin.bookings.index'));
    }

    public function test_admins_are_redirected_away_from_my_appointments()
    {
        $this->actingAs($this->admin())
            ->get(route('appointments.index'))
            ->assertRedirect(route('admin.bookings.index'));
    }

    public function test_patients_can_see_their_appointments()
    {
        $this->actingAs($this->patient())
            ->get(route('appointments.index'))
            ->assertOk();
    }

    public function test_patients_cannot_reach_the_admin_area()
    {
        $this->actingAs($this->patient())
            ->get(route('admin.bookings.index'))
            ->assertForbidden();
    }
}
