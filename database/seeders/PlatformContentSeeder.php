<?php

namespace Database\Seeders;

use App\Models\City;
use Database\Factories\AcademySectionFactory;
use Database\Factories\BannerSlideFactory;
use Database\Factories\CityFactory;
use Database\Factories\FaqFactory;
use Database\Factories\InstructorApplicationFactory;
use Database\Factories\SchoolFactory;
use Database\Factories\SettingFactory;
use Database\Factories\SiteSettingFactory;
use Database\Seeders\Concerns\SeedsInChunks;
use Database\Seeders\Support\ArabicSeedSupport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlatformContentSeeder extends Seeder
{
    use SeedsInChunks;

    public function run(): void
    {
        $now = now();

        $settings = collect(ArabicSeedSupport::settings())
            ->map(fn (array $setting) => array_merge(SettingFactory::new()->raw(), $setting, [
                'created_at' => $now,
                'updated_at' => $now,
            ]))
            ->values()
            ->all();
        DB::table('settings')->upsert($settings, ['key'], ['value', 'type', 'group', 'updated_at']);

        DB::table('site_settings')->insert(array_merge(
            SiteSettingFactory::new()->raw(),
            ArabicSeedSupport::siteSettings(),
            ['created_at' => $now, 'updated_at' => $now]
        ));

        $cities = collect(ArabicSeedSupport::cities())
            ->map(fn (array $city) => array_merge(CityFactory::new()->raw(), [
                'name' => $city['name'],
                'slug' => $city['slug'],
                'created_at' => $now,
                'updated_at' => $now,
            ]))
            ->all();
        $this->insertInChunks('cities', $cities);

        $cityIds = City::query()->pluck('id', 'slug');
        $schools = [];
        foreach (ArabicSeedSupport::cities() as $city) {
            foreach ($city['schools'] as $schoolName) {
                $schools[] = array_merge(SchoolFactory::new()->raw(), [
                    'city_id' => $cityIds[$city['slug']],
                    'name' => $schoolName,
                    'address' => 'حي '.str_replace('ال', '', $city['name']).' التعليمي',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
        $this->insertInChunks('schools', $schools);

        $sections = collect(ArabicSeedSupport::academySections())
            ->map(fn (array $section) => array_merge(AcademySectionFactory::new()->raw(), $section, ['created_at' => $now, 'updated_at' => $now]))
            ->all();
        $this->insertInChunks('academy_sections', $sections);

        $slides = collect(ArabicSeedSupport::bannerSlides())
            ->map(fn (array $slide) => array_merge(BannerSlideFactory::new()->raw(), $slide, ['created_at' => $now, 'updated_at' => $now]))
            ->all();
        $this->insertInChunks('banner_slides', $slides);

        $faqs = collect(ArabicSeedSupport::faqs())
            ->map(fn (array $faq) => array_merge(FaqFactory::new()->raw(), $faq, ['created_at' => $now, 'updated_at' => $now]))
            ->all();
        $this->insertInChunks('faqs', $faqs);

        $applications = collect(ArabicSeedSupport::instructorApplications())
            ->map(fn (array $application) => array_merge(InstructorApplicationFactory::new()->raw(), $application, ['created_at' => $now, 'updated_at' => $now]))
            ->all();
        $this->insertInChunks('instructor_applications', $applications);
    }
}