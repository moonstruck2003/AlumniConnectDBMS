<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id('application_id');
            $table->foreignId('job_id')->constrained('job_listing', 'job_id')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students', 'student_id')->onDelete('no action');
            $table->string('status')->default('Pending');
            $table->timestamp('applied_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
