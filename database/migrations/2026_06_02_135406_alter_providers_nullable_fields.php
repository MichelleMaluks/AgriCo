<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
public function up()
{
    Schema::table('providers', function (Blueprint $table) {
        $table->string('description')->nullable()->change();
        $table->string('phone')->nullable()->change();
        $table->string('location')->nullable()->change();
    });
}

public function down()
{
    Schema::table('providers', function (Blueprint $table) {
        $table->string('description')->nullable(false)->change();
        $table->string('phone')->nullable(false)->change();
        $table->string('location')->nullable(false)->change();
    });
}
};
