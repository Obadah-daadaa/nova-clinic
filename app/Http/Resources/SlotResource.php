<?php

namespace App\Http\Resources;

use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class SlotResource
{
    /**
     * @return array{starts_at: string, label: string}
     */
    public static function make(CarbonInterface $startsAt): array
    {
        return [
            'starts_at' => $startsAt->toIso8601String(),
            'label' => $startsAt->format('H:i'),
        ];
    }

    /**
     * @param  Collection<int, CarbonInterface>  $slots
     * @return array<int, array{starts_at: string, label: string}>
     */
    public static function collection(Collection $slots): array
    {
        return $slots->map(fn (CarbonInterface $slot) => self::make($slot))->all();
    }
}
