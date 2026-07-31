<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ErrorPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_unknown_urls_render_the_branded_404_page()
    {
        $this->get('/no-such-page')
            ->assertNotFound()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('error')
                ->where('status', 404)
            );
    }

    public function test_forbidden_requests_render_the_403_page()
    {
        $this->actingAs(User::factory()->create(['is_admin' => false]))
            ->get(route('admin.bookings.index'))
            ->assertForbidden()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('error')
                ->where('status', 403)
            );
    }

    /**
     * An unmatched URL throws before the `web` middleware group runs, so shared
     * props have to come from a global share — otherwise a signed-in visitor is
     * rendered as a guest and the page loses its branding.
     */
    public function test_the_error_page_keeps_branding_and_the_signed_in_user()
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->get('/no-such-page')
            ->assertNotFound()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('error')
                ->where('auth.user.id', $user->id)
                ->has('branding.name')
            );
    }
}
