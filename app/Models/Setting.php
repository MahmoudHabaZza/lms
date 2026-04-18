<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class Setting extends Model
{
    use HasFactory;

    private const CACHE_KEY = 'settings.all';

    private const GROUPED_CACHE_KEY = 'settings.grouped';

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    protected static function booted(): void
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }

    /**
     * @return \Illuminate\Support\Collection<int, static>
     */
    public static function allCached(): Collection
    {
        if (static::shouldBypassCache()) {
            /** @var \Illuminate\Support\Collection<int, static> $settings */
            $settings = static::query()
                ->orderBy('group')
                ->orderBy('key')
                ->get();

            return $settings;
        }

        /** @var \Illuminate\Support\Collection<int, static> $settings */
        $settings = Cache::rememberForever(self::CACHE_KEY, fn () => static::query()
            ->orderBy('group')
            ->orderBy('key')
            ->get());

        return $settings;
    }

    /**
     * @return array<string, string|null>
     */
    public static function values(): array
    {
        return static::allCached()->pluck('value', 'key')->all();
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    public static function grouped(): array
    {
        if (static::shouldBypassCache()) {
            return static::allCached()
                ->groupBy('group')
                ->map(fn (Collection $settings) => $settings
                    ->map(fn (self $setting) => $setting->only(['id', 'key', 'value', 'type', 'group']))
                    ->values()
                    ->all())
                ->all();
        }

        /** @var array<string, array<int, array<string, mixed>>> $grouped */
        $grouped = Cache::rememberForever(self::GROUPED_CACHE_KEY, fn () => static::allCached()
            ->groupBy('group')
            ->map(fn (Collection $settings) => $settings
                ->map(fn (self $setting) => $setting->only(['id', 'key', 'value', 'type', 'group']))
                ->values()
                ->all())
            ->all());

        return $grouped;
    }

    /**
     * @param  array<int, string>  $keys
     * @return \Illuminate\Support\Collection<string, string|null>
     */
    public static function subset(array $keys): Collection
    {
        return static::allCached()
            ->whereIn('key', $keys)
            ->pluck('value', 'key');
    }

    /**
     * Get a setting value by its key.
     */
    public static function get(string $key, $default = null)
    {
        return static::allCached()
            ->firstWhere('key', $key)?->value ?? $default;
    }

    /**
     * Set a setting value by its key.
     */
    public static function set(string $key, $value, $type = 'string', $group = 'general')
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type, 'group' => $group]
        );
    }

    public static function clearCache(): void
    {
        if (static::shouldBypassCache()) {
            return;
        }

        Cache::forget(self::CACHE_KEY);
        Cache::forget(self::GROUPED_CACHE_KEY);
    }

    private static function shouldBypassCache(): bool
    {
        if (app()->isProduction()) {
            return false;
        }

        $store = config('cache.default');
        $driver = config("cache.stores.{$store}.driver");

        if ($driver !== 'database') {
            return false;
        }

        try {
            $table = (string) config("cache.stores.{$store}.table", 'cache');
            return ! Schema::hasTable($table);
        } catch (\Throwable $e) {
            return true;
        }
    }
}
