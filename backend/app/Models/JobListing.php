<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $table = 'job_listing';
    protected $primaryKey = 'job_id';

    protected $fillable = [
        'recruiter_id',
        'category_id',
        'job_title',
        'company_name',
        'job_type',
        'location',
        'salary',
        'deadline',
        'contact_email',
        'job_description',
        'is_active'
    ];

    protected $casts = [
        'deadline' => 'date',
        'is_active' => 'boolean',
    ];

    public function recruiter()
    {
        return $this->belongsTo(Recruiter::class, 'recruiter_id', 'recruiter_id');
    }

    public function category()
    {
        return $this->belongsTo(JobCategory::class, 'category_id', 'category_id');
    }
}
