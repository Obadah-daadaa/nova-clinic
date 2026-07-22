<?php

namespace App\Http\Resources;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Doctor */
class DoctorResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'slug' => $this->slug,
            'title' => $this->title,
            'title_ar' => $this->title_ar,
            'photo_path' => $this->photo_path,
            'bio' => $this->bio,
            'bio_ar' => $this->bio_ar,
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
