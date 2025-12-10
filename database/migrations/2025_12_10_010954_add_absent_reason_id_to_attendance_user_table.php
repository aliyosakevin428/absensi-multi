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
            $table->foreignId('absent_reason_id')->nullable()->after('attendance_id')->constrained('absent_reasons')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendance_user', function (Blueprint $table) {
            $table->dropForeign(['absent_reason_id']);
            $table->dropColumn('absent_reason_id');
        });
    }
};
