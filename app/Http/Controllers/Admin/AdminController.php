<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Service;
use App\Models\ForumPost;
use App\Models\Provider;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'providers_count' => Provider::count(),
            'services' => Service::count(),
            'forumPosts' => ForumPost::count(),
        ]);
    }
}
