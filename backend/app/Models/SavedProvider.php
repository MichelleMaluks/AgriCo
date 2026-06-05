<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SavedProvider extends Model
{
    protected $fillable = ['user_id', 'provider_id'];

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

