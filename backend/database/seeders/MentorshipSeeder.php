<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Alumni;
use App\Models\MentorshipListing;

class MentorshipSeeder extends Seeder
{
    public function run(): void
    {
        $alumni = Alumni::all();

        foreach ($alumni as $alum) {
            MentorshipListing::create([
                'alumni_id' => $alum->alumni_id,
                'description' => "I am a {$alum->job_title} at {$alum->company} and I am looking to mentor students interested in this field.",
                'min_coin_bid' => 50,
            ]);
        }
    }
}
