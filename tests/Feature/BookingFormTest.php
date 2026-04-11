<?php

namespace Tests\Feature;

use App\Mail\BookingRequestMail;
use App\Models\Category;
use App\Models\Course;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class BookingFormTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_page_is_accessible(): void
    {
        $this->get('/bookings')->assertOk();
    }

    public function test_booking_request_is_emailed_with_country_city_and_school(): void
    {
        Mail::fake();

        Setting::set('booking_notification_email', 'bookings@kid-coder.test', 'string', 'mail');
        $course = $this->createCourse();

        $response = $this->withSession(['_token' => 'test-token'])
            ->post('/bookings', [
                '_token' => 'test-token',
                'fullName' => 'أحمد محمد',
                'age' => 10,
                'whatsappNumber' => '201001112233',
                'country' => 'EG',
                'city' => 'القاهرة',
                'school' => 'مدرسة النيل',
                'courseId' => $course->id,
                'isOnline' => false,
            ], [
                'Accept' => 'application/json',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'تم استلام طلب الحجز بنجاح، وسنتواصل معك قريبًا.',
            ]);

        Mail::assertSent(BookingRequestMail::class, function (BookingRequestMail $mail) use ($course) {
            return $mail->hasTo('bookings@kid-coder.test')
                && $mail->data['country'] === 'مصر / Egypt'
                && $mail->data['city'] === 'القاهرة'
                && $mail->data['school'] === 'مدرسة النيل'
                && $mail->data['course'] === $course->title;
        });
    }

    public function test_booking_request_validates_country_city_and_school(): void
    {
        Mail::fake();

        $course = $this->createCourse();

        $response = $this->withSession(['_token' => 'test-token'])
            ->post('/bookings', [
                '_token' => 'test-token',
                'fullName' => 'أحمد محمد',
                'age' => 10,
                'whatsappNumber' => '201001112233',
                'country' => '',
                'city' => '',
                'school' => '',
                'courseId' => $course->id,
                'isOnline' => true,
            ], [
                'Accept' => 'application/json',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['country', 'city', 'school']);

        Mail::assertNothingSent();
    }

    private function createCourse(): Course
    {
        $instructor = User::factory()->instructor()->create();
        $category = Category::query()->create([
            'name' => 'برمجة',
            'slug' => 'programming-'.str()->random(6),
        ]);

        return Course::query()->create([
            'title' => 'مقدمة في البرمجة',
            'description' => 'وصف مبسط للدورة.',
            'short_description' => 'دورة مناسبة للمبتدئين.',
            'learning_outcome' => 'بناء أساس قوي في البرمجة',
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'age_group' => Course::AGE_GROUP_5_TO_17,
            'thumbnail' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
            'duration_months' => 3,
            'sessions_count' => 12,
            'sessions_per_week' => 1,
            'badge' => 'مبتدئ',
            'accent_color' => '#f97316',
            'status' => true,
            'sort_order' => 1,
            'price' => 0,
            'total_duration_minutes' => 480,
        ]);
    }
}
