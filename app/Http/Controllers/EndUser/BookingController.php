<?php

namespace App\Http\Controllers\EndUser;

use App\Http\Controllers\Controller;
use App\Mail\BookingRequestMail;
use App\Models\Course;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = Course::query()
            ->where('status', true)
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get(['id', 'title']);

        return Inertia::render('EndUser/Bookings', [
            'courses' => $courses,
            'countries' => $this->countries(),
            'preselectedCourseId' => $request->integer('course') ?: null,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $countryCodes = collect($this->countries())->pluck('code')->all();

        $validated = $request->validate([
            'fullName' => ['required', 'string', 'max:255', 'regex:/^[\p{Arabic}\p{Latin}\s]+$/u'],
            'age' => ['required', 'integer', 'min:5', 'max:17'],
            'whatsappNumber' => ['required', 'string', 'min:10', 'max:15', 'regex:/^\d{10,15}$/'],
            'country' => ['required', 'string', Rule::in($countryCodes)],
            'city' => ['required', 'string', 'max:120'],
            'school' => ['required', 'string', 'max:150'],
            'courseId' => ['required', Rule::exists('courses', 'id')->where('status', true)],
            'isOnline' => ['required', 'boolean'],
        ], [
            'country.required' => 'يرجى اختيار الدولة.',
            'country.in' => 'الدولة المختارة غير متاحة.',
            'city.required' => 'يرجى كتابة اسم المدينة.',
            'school.required' => 'يرجى كتابة اسم المدرسة.',
        ]);

        $adminEmail = Setting::get('booking_notification_email')
            ?? Setting::get('admin_email')
            ?? 'admin@kid-coder.test';

        $course = Course::query()->findOrFail($validated['courseId'], ['id', 'title']);
        $countryName = collect($this->countries())
            ->firstWhere('code', $validated['country'])['name'] ?? $validated['country'];

        $payload = [
            'fullName' => $validated['fullName'],
            'age' => $validated['age'],
            'whatsappNumber' => $validated['whatsappNumber'],
            'country' => $countryName,
            'city' => $validated['city'],
            'school' => $validated['school'],
            'courseId' => $validated['courseId'],
            'isOnline' => $validated['isOnline'],
            'course' => $course->title,
        ];

        try {
            Mail::to($adminEmail)->send(new BookingRequestMail($payload));
        } catch (\Throwable $exception) {
            report($exception);
            Log::warning('Primary booking email delivery failed, attempting log fallback.', [
                'admin_email' => $adminEmail,
                'error' => $exception->getMessage(),
            ]);

            try {
                Mail::mailer('log')->to($adminEmail)->send(new BookingRequestMail($payload));
            } catch (\Throwable $fallbackException) {
                report($fallbackException);

                Log::error('Booking request fallback delivery failed.', [
                    'payload' => $payload,
                    'error' => $fallbackException->getMessage(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'تم استلام طلب الحجز بنجاح، وسنتواصل معك قريبًا.',
        ]);
    }

    public function success(): Response
    {
        return Inertia::render('EndUser/BookingSuccess');
    }

    /**
     * @return array<int, array{code: string, name: string}>
     */
    private function countries(): array
    {
        return [
            ['code' => 'EG', 'name' => 'مصر / Egypt'],
            ['code' => 'SA', 'name' => 'السعودية / Saudi Arabia'],
            ['code' => 'AE', 'name' => 'الإمارات / United Arab Emirates'],
            ['code' => 'KW', 'name' => 'الكويت / Kuwait'],
            ['code' => 'QA', 'name' => 'قطر / Qatar'],
            ['code' => 'BH', 'name' => 'البحرين / Bahrain'],
            ['code' => 'OM', 'name' => 'عمان / Oman'],
            ['code' => 'JO', 'name' => 'الأردن / Jordan'],
            ['code' => 'LB', 'name' => 'لبنان / Lebanon'],
            ['code' => 'IQ', 'name' => 'العراق / Iraq'],
            ['code' => 'LY', 'name' => 'ليبيا / Libya'],
            ['code' => 'TN', 'name' => 'تونس / Tunisia'],
            ['code' => 'DZ', 'name' => 'الجزائر / Algeria'],
            ['code' => 'MA', 'name' => 'المغرب / Morocco'],
            ['code' => 'SD', 'name' => 'السودان / Sudan'],
            ['code' => 'TR', 'name' => 'تركيا / Turkey'],
            ['code' => 'DE', 'name' => 'ألمانيا / Germany'],
            ['code' => 'FR', 'name' => 'فرنسا / France'],
            ['code' => 'GB', 'name' => 'المملكة المتحدة / United Kingdom'],
            ['code' => 'US', 'name' => 'الولايات المتحدة / United States'],
            ['code' => 'CA', 'name' => 'كندا / Canada'],
        ];
    }
}
