<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('options')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            $table->json('options')->change(); // back to NOT NULL
        });
    }
};
