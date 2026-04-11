<?php

namespace App\Http\Controllers\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInstructorApplicationRequest;
use App\Mail\InstructorApplicationSubmittedMail;
use App\Models\InstructorApplication;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class InstructorApplicationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('EndUser/JoinUs', [
            'positions' => $this->positions(),
        ]);
    }

    public function store(StoreInstructorApplicationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $hasRecentSubmission = InstructorApplication::query()
            ->where('email', $validated['email'])
            ->where('created_at', '>=', now()->subMinutes(15))
            ->exists();

        if ($hasRecentSubmission) {
            return response()->json([
                'success' => false,
                'message' => 'تم إرسال طلب بهذا البريد الإلكتروني مؤخرًا. يرجى الانتظار قليلًا قبل المحاولة مرة أخرى.',
                'errors' => [
                    'email' => ['تم إرسال طلب بهذا البريد الإلكتروني مؤخرًا. يرجى الانتظار قليلًا قبل المحاولة مرة أخرى.'],
                ],
            ], 422);
        }

        $application = InstructorApplication::query()->create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'position' => $validated['position'],
            'cv_path' => $request->file('cv')->store('cvs', 'public'),
            'notes' => $validated['notes'] ?? null,
            'status' => 'new',
        ]);

        $adminEmail = Setting::get('booking_notification_email')
            ?? Setting::get('admin_email')
            ?? 'admin@kid-coder.test';

        try {
            Mail::to($adminEmail)->send(new InstructorApplicationSubmittedMail($application));
        } catch (\Throwable $exception) {
            report($exception);
            Log::warning('Primary instructor application email delivery failed, attempting log fallback.', [
                'admin_email' => $adminEmail,
                'application_id' => $application->id,
                'error' => $exception->getMessage(),
            ]);

            try {
                Mail::mailer('log')->to($adminEmail)->send(new InstructorApplicationSubmittedMail($application));
            } catch (\Throwable $fallbackException) {
                report($fallbackException);
                Log::error('Instructor application fallback delivery failed.', [
                    'application_id' => $application->id,
                    'error' => $fallbackException->getMessage(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريبًا',
        ]);
    }

    private function positions(): array
    {
        return collect(InstructorApplication::POSITIONS)
            ->map(fn (string $label, string $value) => [
                'value' => $value,
                'label' => $label,
            ])
            ->values()
            ->all();
    }
}
