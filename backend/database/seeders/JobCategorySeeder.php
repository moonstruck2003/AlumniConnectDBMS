<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobCategory;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Software Development',
            'Data Science & Analytics',
            'Product Management',
            'UX/UI Design',
            'Marketing & Sales',
            'Cloud Infrastructure',
            'Hardware Engineering',
            'Cybersecurity'
        ];

        foreach ($categories as $name) {
            JobCategory::updateOrCreate(['category_name' => $name]);
        }
    }
}
