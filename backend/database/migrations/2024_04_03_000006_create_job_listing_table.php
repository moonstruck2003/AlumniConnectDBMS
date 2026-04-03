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
            $table->foreignId('recruiter_id')->constrained('recruiters', 'recruiter_id');
            $table->foreignId('category_id')->constrained('job_categories', 'category_id');
            $table->string('job_title');
            $table->text('job_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listing');
    }
};
