<?php

// app/Http/Controllers/ForumController.php
namespace App\Http\Controllers;

use App\Models\ForumPost;
use Illuminate\Http\Request;

class ForumController extends Controller
{
    public function index()
    {
        return response()->json(ForumPost::latest()->get());
    }

    public function store(Request $request)
    {
        $post = ForumPost::create($request->all());
        return response()->json($post, 201);
    }

    public function show($id)
    {
        $post = ForumPost::findOrFail($id);
        return response()->json($post);
    }
}
