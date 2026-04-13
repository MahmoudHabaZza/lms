<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Database\Factories\CategoryFactory;
use Database\Factories\CourseFactory;
use Database\Factories\LessonFactory;
use Database\Factories\ResourceFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LearningCatalogSeeder extends Seeder
{
    use SeedsInChunks;

    public function run(): void
    {
        $now = now();
        $categories = collect(ArabicSeedSupport::categories())
            ->map(fn (array $category) => array_merge(CategoryFactory::new()->raw(), $category, ['created_at' => $now, 'updated_at' => $now]))
            ->all();
        $this->insertInChunks('categories', $categories);

        $categoryIds = Category::query()->pluck('id', 'slug');
        $instructors = User::query()->where('role', 'instructor')->orderBy('id')->get(['id']);
        $blueprints = ArabicSeedSupport::courseBlueprints();
        $families = ArabicSeedSupport::courseFamilies();

        $courseRows = [];
        foreach ($blueprints as $index => $blueprint) {
            $family = $families[$blueprint['family']];
            $durations = collect($family['lesson_titles'])->map(fn (string $title, int $lessonIndex) => 18 + (($index + $lessonIndex) % 6) * 4);
            $courseRows[] = array_merge(CourseFactory::new()->raw(), [
                'instructor_id' => $instructors[$index % $instructors->count()]->id,
                'category_id' => $categoryIds[$blueprint['category_slug']],
                'title' => $blueprint['title'],
                'description' => ArabicSeedSupport::courseDescription($blueprint),
                'thumbnail' => $blueprint['thumbnail'],
                'price' => $blueprint['price'],
                'total_duration_minutes' => $durations->sum(),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->insertInChunks('courses', $courseRows);

        $courseIds = Course::query()->pluck('id', 'title');
        $courseRowsByTitle = Course::query()->get()->keyBy('title');

        $lessonRows = [];
        foreach ($blueprints as $index => $blueprint) {
            $family = $families[$blueprint['family']];
            foreach ($family['lesson_titles'] as $lessonIndex => $lessonTitle) {
                $lessonRows[] = array_merge(LessonFactory::new()->raw(), [
                    'course_id' => $courseIds[$blueprint['title']],
                    'title' => $lessonTitle,
                    'description' => ArabicSeedSupport::lessonDescription($blueprint['title'], $lessonTitle),
                    'video_source' => \App\Models\Lesson::VIDEO_SOURCE_YOUTUBE,
                    'video_url' => $family['video_urls'][$lessonIndex % count($family['video_urls'])],
                    'video_path' => null,
                    'duration_minutes' => 18 + (($index + $lessonIndex) % 6) * 4,
                    'order' => $lessonIndex + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('lessons', $lessonRows);

        $lessons = \App\Models\Lesson::query()->get()->groupBy('course_id');
        $resourceRows = [];

        foreach ($blueprints as $blueprint) {
            $course = $courseRowsByTitle[$blueprint['title']];
            $family = $families[$blueprint['family']];
            $resourceRows[] = array_merge(ResourceFactory::new()->raw(), [
                'course_id' => $course->id,
                'lesson_id' => null,
                'title' => $family['resource_titles'][0],
                'file' => ArabicSeedSupport::resourceFile(Str::slug($blueprint['title']).'/course-overview'),
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach ($lessons[$course->id] as $lessonIndex => $lesson) {
                $resourceRows[] = array_merge(ResourceFactory::new()->raw(), [
                    'course_id' => $course->id,
                    'lesson_id' => $lesson->id,
                    'title' => $family['resource_titles'][($lessonIndex + 1) % count($family['resource_titles'])],
                    'file' => ArabicSeedSupport::resourceFile(Str::slug($blueprint['title']).'/lesson-'.($lessonIndex + 1)),
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }

        $this->insertInChunks('resources', $resourceRows);
    }
}