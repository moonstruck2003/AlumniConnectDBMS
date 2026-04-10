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
        // Drop existing if they exist
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');

        Schema::create('messages', function (Blueprint $table) {
            $table->id('message_id');
            // SQL Server doesn't allow multiple cascade paths to the same table
            $table->foreignId('sender_id')->constrained('users', 'user_id')->onDelete('no action');
            $table->foreignId('receiver_id')->constrained('users', 'user_id')->onDelete('no action');
            $table->text('content');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
