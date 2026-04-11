<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->extendCoursesTable();
        $this->extendCourseReelsTable();
        $this->backfillExistingCourses();
        $this->copyProgrammingCoursesIntoCourses();
        $this->copyProgrammingEnrollmentsIntoEnrollments();
        $this->linkCourseReelsToUnifiedCourses();
    }

    public function down(): void
    {
        $legacyCourseIds = Schema::hasColumn('courses', 'legacy_programming_course_id')
            ? DB::table('courses')->whereNotNull('legacy_programming_course_id')->pluck('id')
            : collect();

        if ($legacyCourseIds->isNotEmpty()) {
            DB::table('enrollments')->whereIn('course_id', $legacyCourseIds)->delete();

            if (Schema::hasColumn('course_reels', 'course_id')) {
                DB::table('course_reels')->whereIn('course_id', $legacyCourseIds)->update(['course_id' => null]);
            }

            DB::table('courses')->whereIn('id', $legacyCourseIds)->delete();
        }

        if (Schema::hasColumn('course_reels', 'course_id')) {
            Schema::table('course_reels', function (Blueprint $table): void {
                $table->dropIndex(['course_id']);
                $table->dropColumn('course_id');
            });
        }

        $columns = array_values(array_filter([
            Schema::hasColumn('courses', 'short_description') ? 'short_description' : null,
            Schema::hasColumn('courses', 'learning_outcome') ? 'learning_outcome' : null,
            Schema::hasColumn('courses', 'drive_link') ? 'drive_link' : null,
            Schema::hasColumn('courses', 'age_group') ? 'age_group' : null,
            Schema::hasColumn('courses', 'badge') ? 'badge' : null,
            Schema::hasColumn('courses', 'accent_color') ? 'accent_color' : null,
            Schema::hasColumn('courses', 'status') ? 'status' : null,
            Schema::hasColumn('courses', 'sort_order') ? 'sort_order' : null,
            Schema::hasColumn('courses', 'duration_months') ? 'duration_months' : null,
            Schema::hasColumn('courses', 'sessions_count') ? 'sessions_count' : null,
            Schema::hasColumn('courses', 'sessions_per_week') ? 'sessions_per_week' : null,
            Schema::hasColumn('courses', 'legacy_programming_course_id') ? 'legacy_programming_course_id' : null,
        ]));

        if ($columns !== []) {
            Schema::table('courses', function (Blueprint $table) use ($columns): void {
                if (in_array('legacy_programming_course_id', $columns, true)) {
                    $table->dropIndex(['legacy_programming_course_id']);
                }
                $table->dropColumn($columns);
            });
        }
    }

    private function extendCoursesTable(): void
    {
        $hasShortDescription = Schema::hasColumn('courses', 'short_description');
        $hasLearningOutcome = Schema::hasColumn('courses', 'learning_outcome');
        $hasDriveLink = Schema::hasColumn('courses', 'drive_link');
        $hasAgeGroup = Schema::hasColumn('courses', 'age_group');
        $hasBadge = Schema::hasColumn('courses', 'badge');
        $hasAccentColor = Schema::hasColumn('courses', 'accent_color');
        $hasStatus = Schema::hasColumn('courses', 'status');
        $hasSortOrder = Schema::hasColumn('courses', 'sort_order');
        $hasDurationMonths = Schema::hasColumn('courses', 'duration_months');
        $hasSessionsCount = Schema::hasColumn('courses', 'sessions_count');
        $hasSessionsPerWeek = Schema::hasColumn('courses', 'sessions_per_week');
        $hasLegacyProgrammingCourseId = Schema::hasColumn('courses', 'legacy_programming_course_id');

        Schema::table('courses', function (Blueprint $table) use (
            $hasShortDescription,
            $hasLearningOutcome,
            $hasDriveLink,
            $hasAgeGroup,
            $hasBadge,
            $hasAccentColor,
            $hasStatus,
            $hasSortOrder,
            $hasDurationMonths,
            $hasSessionsCount,
            $hasSessionsPerWeek,
            $hasLegacyProgrammingCourseId,
        ): void {
            if (! $hasShortDescription) {
                $table->text('short_description')->nullable();
            }

            if (! $hasLearningOutcome) {
                $table->string('learning_outcome')->nullable();
            }

            if (! $hasDriveLink) {
                $table->string('drive_link')->nullable();
            }

            if (! $hasAgeGroup) {
                $table->string('age_group', 20)->nullable();
            }

            if (! $hasBadge) {
                $table->string('badge', 60)->nullable();
            }

            if (! $hasAccentColor) {
                $table->string('accent_color', 20)->default('#f97316');
            }

            if (! $hasStatus) {
                $table->boolean('status')->default(true);
            }

            if (! $hasSortOrder) {
                $table->unsignedInteger('sort_order')->default(0);
            }

            if (! $hasDurationMonths) {
                $table->unsignedSmallInteger('duration_months')->default(0);
            }

            if (! $hasSessionsCount) {
                $table->unsignedSmallInteger('sessions_count')->default(0);
            }

            if (! $hasSessionsPerWeek) {
                $table->unsignedTinyInteger('sessions_per_week')->default(0);
            }

            if (! $hasLegacyProgrammingCourseId) {
                $table->unsignedBigInteger('legacy_programming_course_id')->nullable()->index();
            }
        });
    }

    private function extendCourseReelsTable(): void
    {
        if (! Schema::hasColumn('course_reels', 'course_id')) {
            Schema::table('course_reels', function (Blueprint $table): void {
                $table->unsignedBigInteger('course_id')->nullable()->index();
            });
        }
    }

    private function backfillExistingCourses(): void
    {
        DB::table('courses')->update([
            'short_description' => DB::raw('COALESCE(short_description, description, title)'),
            'age_group' => DB::raw("COALESCE(age_group, '5-17')"),
            'accent_color' => DB::raw("COALESCE(accent_color, '#f97316')"),
            'status' => DB::raw('CASE WHEN status IS NULL THEN 1 ELSE status END'),
            'sort_order' => DB::raw('CASE WHEN sort_order = 0 THEN id ELSE sort_order END'),
            'duration_months' => DB::raw('CASE WHEN duration_months = 0 THEN 3 ELSE duration_months END'),
            'sessions_count' => DB::raw('CASE WHEN sessions_count = 0 THEN 12 ELSE sessions_count END'),
            'sessions_per_week' => DB::raw('CASE WHEN sessions_per_week = 0 THEN 1 ELSE sessions_per_week END'),
        ]);
    }

    private function copyProgrammingCoursesIntoCourses(): void
    {
        if (! Schema::hasTable('programming_courses')) {
            return;
        }

        $existingLegacyIds = DB::table('courses')
            ->whereNotNull('legacy_programming_course_id')
            ->pluck('legacy_programming_course_id')
            ->map(fn ($id) => (int) $id)
            ->all();

        $fallbackInstructorId = DB::table('users')->where('role', 'instructor')->value('id')
            ?? DB::table('users')->value('id');

        $rows = DB::table('programming_courses')
            ->orderBy('id')
            ->get()
            ->reject(fn ($row) => in_array((int) $row->id, $existingLegacyIds, true))
            ->map(function ($row) use ($fallbackInstructorId) {
                $instructorId = $row->instructor_id ?: $fallbackInstructorId;

                if ($instructorId === null) {
                    return null;
                }

                return [
                    'instructor_id' => $instructorId,
                    'category_id' => $row->category_id,
                    'title' => $row->title,
                    'description' => $row->short_description,
                    'short_description' => $row->short_description,
                    'learning_outcome' => $row->learning_outcome,
                    'thumbnail' => $row->thumbnail,
                    'price' => $row->price,
                    'total_duration_minutes' => $row->total_duration_minutes,
                    'drive_link' => $row->drive_link,
                    'age_group' => $row->age_group ?: '5-17',
                    'badge' => $row->badge,
                    'accent_color' => $row->accent_color ?: '#f97316',
                    'status' => $row->status,
                    'sort_order' => $row->sort_order,
                    'duration_months' => $row->duration_months,
                    'sessions_count' => $row->sessions_count,
                    'sessions_per_week' => $row->sessions_per_week,
                    'legacy_programming_course_id' => $row->id,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ];
            })
            ->filter()
            ->values()
            ->all();

        if ($rows !== []) {
            DB::table('courses')->insert($rows);
        }
    }

    private function copyProgrammingEnrollmentsIntoEnrollments(): void
    {
        if (! Schema::hasTable('course_enrollments')) {
            return;
        }

        $legacyMap = DB::table('courses')
            ->whereNotNull('legacy_programming_course_id')
            ->pluck('id', 'legacy_programming_course_id');

        $rows = DB::table('course_enrollments')
            ->orderBy('id')
            ->get()
            ->map(function ($row) use ($legacyMap) {
                $courseId = $legacyMap[$row->programming_course_id] ?? null;

                if ($courseId === null) {
                    return null;
                }

                return [
                    'student_id' => $row->user_id,
                    'course_id' => $courseId,
                    'enrolled_at' => $row->enrolled_at,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                ];
            })
            ->filter()
            ->values()
            ->all();

        if ($rows !== []) {
            DB::table('enrollments')->insertOrIgnore($rows);
        }
    }

    private function linkCourseReelsToUnifiedCourses(): void
    {
        if (! Schema::hasTable('course_reels') || ! Schema::hasColumn('course_reels', 'programming_course_id')) {
            return;
        }

        $legacyMap = DB::table('courses')
            ->whereNotNull('legacy_programming_course_id')
            ->pluck('id', 'legacy_programming_course_id');

        DB::table('course_reels')
            ->whereNotNull('programming_course_id')
            ->orderBy('id')
            ->get(['id', 'programming_course_id'])
            ->each(function ($reel) use ($legacyMap): void {
                $courseId = $legacyMap[$reel->programming_course_id] ?? null;

                if ($courseId === null) {
                    return;
                }

                DB::table('course_reels')
                    ->where('id', $reel->id)
                    ->update(['course_id' => $courseId]);
            });
    }
};
