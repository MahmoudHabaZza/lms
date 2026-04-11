<?php

namespace App\Models;

class ProgrammingCourse extends Course
{
    protected $table = 'courses';

    /**
     * @return array<int, string>
     */
    public static function ageGroups(): array
    {
        return [
            self::AGE_GROUP_5_TO_17,
        ];
    }
}
