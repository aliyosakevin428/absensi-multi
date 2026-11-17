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
        Schema::table('events', function (Blueprint $table) {
            $table->decimal('latitude', 10, 7)->nullable()->after('lokasi_kegiatan');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->unsignedInteger('radius_m')->default(100)->after('longitude');
            $table->boolean('require_gps')->default(true)->after('radius_m');

            $table->index('waktu_kegiatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex(['waktu_kegiatan']);
            $table->dropColumn(['latitude', 'longitude', 'radius_m', 'require_gps']);
        });
    }
};
