<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mentorship_listing', function (Blueprint $table) {
            $table->id('listing_id');
            $table->foreignId('alumni_id')->constrained('alumni', 'alumni_id')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->integer('min_coin_bid')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mentorship_listing');
    }
};
