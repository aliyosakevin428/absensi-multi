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
        Schema::table('attendance_user', function (Blueprint $table) {
            $table->decimal('checkin_lat', 10, 7)->nullable()->after('attended_at');
            $table->decimal('checkin_lng', 10, 7)->nullable()->after('checkin_lat');
            $table->unsignedInteger('checkin_accuracy_m')->nullable()->after('checkin_lng');
            $table->unsignedInteger('checkin_distance_m')->nullable()->after('checkin_accuracy_m');

            $table->index(['attendance_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendance_user', function (Blueprint $table) {
            $table->dropIndex(['attendance_id', 'user_id']);
            $table->dropColumn(['checkin_lat', 'checkin_lng', 'checkin_accuracy_m', 'checkin_distance_m']);
        });
    }
};
