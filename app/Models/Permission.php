<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $fillable = ['name', 'slug'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'permission_user');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permission');
    }
}
