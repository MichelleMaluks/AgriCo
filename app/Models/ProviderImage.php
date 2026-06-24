<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProviderImage extends Model
{
    protected $fillable = ['provider_id', 'path'];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
}
