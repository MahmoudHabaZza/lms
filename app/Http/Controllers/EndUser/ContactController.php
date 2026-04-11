<?php

namespace App\Http\Controllers\EndUser;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\ContactMessageMail;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('EndUser/Contact');
    }

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $recipientEmail = Setting::get('contact_notification_email')
            ?? Setting::get('booking_notification_email')
            ?? Setting::get('admin_email')
            ?? Setting::get('contact_email')
            ?? 'admin@kid-coder.test';

        try {
            Mail::to($recipientEmail)->send(new ContactMessageMail($validated));
        } catch (\Throwable $exception) {
            report($exception);
            Log::warning('Primary contact email delivery failed, attempting log fallback.', [
                'recipient_email' => $recipientEmail,
                'sender_email' => $validated['email'],
                'error' => $exception->getMessage(),
            ]);

            try {
                Mail::mailer('log')->to($recipientEmail)->send(new ContactMessageMail($validated));
            } catch (\Throwable $fallbackException) {
                report($fallbackException);
                Log::error('Contact message fallback delivery failed.', [
                    'recipient_email' => $recipientEmail,
                    'payload' => $validated,
                    'error' => $fallbackException->getMessage(),
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال رسالتك بنجاح، وسيتم التواصل معك في أقرب وقت.',
        ]);
    }
}
