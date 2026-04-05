<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MentorshipListing extends Model
{
    use HasFactory;

    protected $table = 'mentorship_listing';
    protected $primaryKey = 'listing_id';

    protected $fillable = [
        'alumni_id',
        'description',
        'min_coin_bid',
    ];

    public function alumni()
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }

    public function requests()
    {
        return $this->hasMany(MentorshipRequest::class, 'listing_id', 'listing_id');
    }
}
