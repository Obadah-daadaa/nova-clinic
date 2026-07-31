<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_patients_are_sent_to_their_appointments()
    {
        $this->actingAs(User::factory()->create(['is_admin' => false]));

        $this->get(route('dashboard'))
            ->assertRedirect(route('appointments.index'));
    }

    public function test_admins_are_sent_to_the_bookings_dashboard()
    {
        $this->actingAs(User::factory()->create(['is_admin' => true]));

        $this->get(route('dashboard'))
            ->assertRedirect(route('admin.bookings.index'));
    }
}
