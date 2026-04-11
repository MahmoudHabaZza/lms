<?php

namespace Database\Factories;

use App\Models\Permission;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    public function definition(): array
    {
        return [
            'name' => 'صلاحية '.fake()->unique()->word(),
            'slug' => Str::slug(fake()->unique()->word()),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}