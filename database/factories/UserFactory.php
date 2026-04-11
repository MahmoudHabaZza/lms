<?php

namespace Database\Factories;

use App\Models\User;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    protected static ?string $password = null;
    protected static int $profileSequence = 1000;

    public function definition(): array
    {
        $profile = $this->uniqueProfile('student');

        return array_merge($profile, [
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'date_joined' => now()->subDays($this->faker->numberBetween(5, 500)),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function student(): static
    {
        return $this->state(fn () => array_merge($this->uniqueProfile('student'), [
            'is_active' => true,
            'is_verified' => true,
        ]));
    }

    public function instructor(): static
    {
        return $this->state(fn () => array_merge($this->uniqueProfile('instructor'), [
            'is_active' => true,
            'is_verified' => true,
            'instructor_verified' => true,
        ]));
    }

    public function admin(): static
    {
        return $this->state(fn () => array_merge($this->uniqueProfile('admin'), [
            'is_active' => true,
            'is_verified' => true,
            'is_superuser' => false,
        ]));
    }

    private function uniqueProfile(string $role): array
    {
        $sequence = self::$profileSequence++;
        $profile = ArabicSeedSupport::userProfile($sequence, $role);

        $emailLocalPart = Str::before($profile['email'], '@');
        $emailDomain = Str::after($profile['email'], '@');

        $profile['email'] = $emailLocalPart.'.'.$sequence.'@'.$emailDomain;
        $profile['username'] = ($profile['username'] ?? $role).$sequence;

        return $profile;
    }
}
