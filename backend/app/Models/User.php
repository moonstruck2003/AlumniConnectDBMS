<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'cgpa' => 'float',
    ];

    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'user_id', 'user_id');
    }

    public function student()
    {
        return $this->hasOne(Student::class, 'user_id', 'user_id');
    }

    public function alumni()
    {
        return $this->hasOne(Alumni::class, 'user_id', 'user_id');
    }

    public function recruiter()
    {
        return $this->hasOne(Recruiter::class, 'user_id', 'user_id');
    }

    /**
     * Get the user's full name from their profile.
     */
    public function getNameAttribute()
    {
        if ($this->profile) {
            return "{$this->profile->first_name} {$this->profile->last_name}";
        }
        return 'Network Node';
    }

    protected $appends = ['name'];
}
