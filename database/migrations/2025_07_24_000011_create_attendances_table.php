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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('users_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('events_id')->constrained('events')->cascadeOnDelete();
            $table->string('status');
            $table->foreignId('absent_reasons_id')->nullable()->constrained('absent_reasons')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
