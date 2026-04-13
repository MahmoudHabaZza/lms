<?php

namespace App\Support;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use DateTimeInterface;

class DateValue
{
    public static function asCarbon(mixed $value): ?CarbonInterface
    {
        if ($value instanceof CarbonInterface) {
            return $value;
        }

        if ($value instanceof DateTimeInterface) {
            return Carbon::instance($value);
        }

        if (is_int($value) || is_float($value) || (is_string($value) && is_numeric($value))) {
            return Carbon::createFromTimestamp((int) $value);
        }

        if (is_string($value) && trim($value) !== '') {
            try {
                return Carbon::parse($value);
            } catch (\Throwable) {
                return null;
            }
        }

        return null;
    }

    public static function iso8601(mixed $value): ?string
    {
        return self::asCarbon($value)?->toIso8601String();
    }

    public static function localized(mixed $value, string $format, ?string $timezone = null): ?string
    {
        $date = self::asCarbon($value);

        if ($date === null) {
            return null;
        }

        if ($timezone) {
            $date = $date->copy()->timezone($timezone);
        }

        return $date->translatedFormat($format);
    }
}

