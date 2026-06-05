<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    use HasFactory;

protected $fillable = [
    'user_id',
    'name',
    'description',
    'phone',
    'location',
];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function images()
{
    return $this->hasMany(ProviderImage::class);
}
public function services()
{
    return $this->hasMany(Service::class);
}
}
