<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\ForumPost;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'services' => Product::count(),
            'forumPosts' => ForumPost::count(),
        ]);
    }
}
