@extends('layouts.app')

@section('content')
    <h2>Admin Dashboard</h2>
    <ul>
        <li>Total Users: {{ $userCount }}</li>
        <li>Total Products: {{ $productCount }}</li>
        <li>Total Forum Posts: {{ $forumCount }}</li>
    </ul>
@endsection