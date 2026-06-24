<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumPost;
use Illuminate\Http\Request;

class AdminForumController extends Controller
{
    public function index()
    {
        return response()->json(ForumPost::all());
    }

    public function show($id)
    {
        return response()->json(ForumPost::findOrFail($id));
    }

    public function store(Request $request)
    {
        $post = ForumPost::create([
            'title' => $request->title,
            'content' => $request->input('content'),
            'author' => $request->author,
        ]);
        return response()->json(['message' => 'Forum post created successfully', 'post' => $post]);
    }

    public function update(Request $request, $id)
    {
        $post = ForumPost::findOrFail($id);
        $post->update($request->only('title', 'content', 'author'));
        return response()->json(['message' => 'Forum post updated successfully']);
    }

    public function destroy($id)
    {
        ForumPost::destroy($id);
        return response()->json(['message' => 'Forum post deleted successfully']);
    }
}
