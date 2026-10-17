<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->bigInteger('school_id')->nullable()->after('id');
            $table->string('username')->nullable()->after('name');
            $table->string('department')->nullable()->after('role');
            $table->string('course')->nullable()->after('department');
            $table->string('year_level')->nullable()->after('course');
            $table->string('contact')->nullable()->after('year_level');
            $table->string('profile_pic')->nullable()->after('contact');

            $table->dropColumn(['identifier', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('identifier')->unique()->after('email');
            $table->string('status')->default('Active')->after('role');
            $table->dropColumn(['school_id', 'username', 'department', 'course', 'year_level', 'contact', 'profile_pic']);
        });
    }
};
