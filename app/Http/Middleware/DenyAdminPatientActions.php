<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Booking and "my appointments" are patient features. Admins may browse the
 * public site, but sending them down a patient flow would create bookings that
 * belong to a staff account, so redirect them to their dashboard instead.
 */
class DenyAdminPatientActions
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->is_admin) {
            return redirect()
                ->route('admin.bookings.index')
                ->with('error', __('Booking is for patients. Manage appointments here instead.'));
        }

        return $next($request);
    }
}
