<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            PlatformContentSeeder::class,
            UserSeeder::class,
            LearningCatalogSeeder::class,
            ProgrammingShowcaseSeeder::class,
            TopStudentsSeeder::class,
            LearningActivitySeeder::class,
            AssessmentAndNotificationsSeeder::class,
        ]);
    }
}
