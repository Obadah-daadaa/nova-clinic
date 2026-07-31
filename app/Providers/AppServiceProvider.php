<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->shareInertiaProps();
    }

    /**
     * Props every Inertia page needs, registered here rather than only in
     * HandleInertiaRequests: an unmatched URL throws before the `web` middleware
     * group runs, so a middleware-only share leaves the error page with no
     * branding and no auth — a signed-in user would see "Log in" on a 404.
     */
    protected function shareInertiaProps(): void
    {
        Inertia::share([
            'name' => fn () => config('app.name'),
            'branding' => fn () => [
                'name' => config('branding.name'),
                'tagline' => config('branding.tagline'),
                'logo' => $this->brandAsset(config('branding.logo')),
                'logoDark' => $this->brandAsset(config('branding.logo_dark'))
                    ?? $this->brandAsset(config('branding.logo')),
            ],
            'auth' => fn () => [
                'user' => request()->user(),
            ],
        ]);
    }

    /**
     * Resolve a configured logo path to a URL, passing absolute URLs through.
     */
    protected function brandAsset(?string $path): ?string
    {
        $path = is_string($path) ? trim($path) : null;

        if ($path === null || $path === '') {
            return null;
        }

        if (str_contains($path, '://') || str_starts_with($path, '//')) {
            return $path;
        }

        return asset($path);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        JsonResource::withoutWrapping();

        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
