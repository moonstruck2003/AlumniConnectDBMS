<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipRequest extends Model
{
    use HasFactory;

    protected $table = 'mentorship_requests';
    protected $primaryKey = 'request_id';

    protected $fillable = [
        'listing_id',
        'student_id',
        'message',
        'status',
    ];

    public function listing()
    {
        return $this->belongsTo(MentorshipListing::class, 'listing_id', 'listing_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }
}
