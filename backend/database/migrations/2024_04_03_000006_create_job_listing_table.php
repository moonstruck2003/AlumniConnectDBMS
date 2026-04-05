<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listing', function (Blueprint $table) {
            $table->id('job_id');
            $table->foreignId('recruiter_id')->constrained('recruiters', 'recruiter_id')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('job_categories', 'category_id')->onDelete('cascade');
            $table->string('job_title');
            $table->string('company_name')->nullable();
            $table->enum('job_type', ['Job', 'Internship'])->default('Job');
            $table->string('location')->nullable();
            $table->text('salary')->nullable();
            $table->date('deadline')->nullable();
            $table->string('contact_email');
            $table->text('job_description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listing');
    }
};
