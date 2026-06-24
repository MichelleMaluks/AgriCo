<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'provider_id',
        'title',
        'description',
        'price',
    ];
    protected $casts = ['options' => 'array'];
    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }
    public function images()
    {
        return $this->hasMany(ServiceImage::class);
    }

}

