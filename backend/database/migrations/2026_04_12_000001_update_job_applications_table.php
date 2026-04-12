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
        Schema::table('job_applications', function (Blueprint $table) {
            $table->foreignId('alumni_id')->nullable()->constrained('alumni', 'alumni_id')->onDelete('no action');
            $table->string('cv_path')->nullable();
            $table->foreignId('student_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropForeign(['alumni_id']);
            $table->dropColumn(['alumni_id', 'cv_path']);
            $table->foreignId('student_id')->nullable(false)->change();
        });
    }
};
