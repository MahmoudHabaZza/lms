<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Support\DateValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $certificates = Certificate::query()
            ->with(['exam.course', 'attempt'])
            ->where('student_id', $request->user()->id)
            ->latest('issued_at')
            ->get()
            ->map(fn (Certificate $certificate) => [
                'id' => $certificate->id,
                'course_name' => $certificate->exam?->course?->title,
                'exam_title' => $certificate->exam?->title,
                'issued_at' => DateValue::iso8601($certificate->issued_at),
                'issued_at_label' => DateValue::localized($certificate->issued_at, 'd M Y'),
                'certificate_code' => $certificate->certificate_code,
                'verification_code' => $certificate->verification_code,
                'image_url' => filled($certificate->image) ? Storage::disk('public')->url($certificate->image) : null,
                'download_url' => route('student.certificates.download', $certificate),
            ])
            ->values()
            ->all();

        return Inertia::render('Student/Certificates', [
            'certificates' => $certificates,
        ]);
    }

    public function download(Request $request, Certificate $certificate): StreamedResponse
    {
        abort_unless((int) $certificate->student_id === (int) $request->user()->id, 404);
        abort_unless(filled($certificate->image) && Storage::disk('public')->exists($certificate->image), 404);

        return Storage::disk('public')->download($certificate->image, basename($certificate->image));
    }
}
