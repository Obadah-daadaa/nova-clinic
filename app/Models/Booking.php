<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Carbon\Carbon;
use Database\Factories\BookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $doctor_id
 * @property int $service_id
 * @property Carbon $starts_at
 * @property Carbon $ends_at
 * @property BookingStatus $status
 * @property string|null $notes
 */
#[Fillable(['user_id', 'doctor_id', 'service_id', 'starts_at', 'ends_at', 'status', 'notes'])]
class Booking extends Model
{
    /** @use HasFactory<BookingFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'status' => BookingStatus::class,
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Doctor, $this>
     */
    public function doctor(): BelongsTo
    {
        return $this->belongsTo(Doctor::class);
    }

    /**
     * @return BelongsTo<Service, $this>
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed], true)
            && $this->starts_at->isAfter(now()->addHours(24));
    }
}
