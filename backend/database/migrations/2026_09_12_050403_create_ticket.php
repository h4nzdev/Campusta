<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->string('category_name');
            $table->text('description');
            $table->enum('priority', ['Low', 'Medium', 'High', 'Urgent'])->default('Medium');
            $table->enum('status', ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'])->default('Pending');
            $table->foreignId('assigned_personnel_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('photo_url')->nullable();
            $table->text('work_notes')->nullable();
            $table->string('completion_photo_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
