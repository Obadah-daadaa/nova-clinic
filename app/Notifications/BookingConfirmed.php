<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Booking $booking)
    {
        //
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(User $notifiable): MailMessage
    {
        $booking = $this->booking->loadMissing(['doctor', 'service']);

        return (new MailMessage)
            ->subject('Your Nova Clinic appointment is confirmed')
            ->greeting("Hello {$notifiable->name},")
            ->line("Your appointment for **{$booking->service->name}** with **{$booking->doctor->name}** has been confirmed.")
            ->line('Date & time: '.$booking->starts_at->format('l, d M Y \a\t H:i'))
            ->action('View my appointments', url('/appointments'))
            ->line('If you need to cancel, please do so at least 24 hours in advance.');
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
        ];
    }
}
