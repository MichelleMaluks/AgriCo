<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price_type',
        'price',
        'min_price',
        'max_price',
        'provider_id'
    ];

    public function images()
    {
        return $this->hasMany(ServiceImage::class);
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }
}
