<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCertificateRequest;
use App\Http\Requests\UpdateCertificateRequest;
use App\Models\Certificate;
use App\Models\Exam;
use App\Models\StudentExamAttempt;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/certificates/index', [
            'certificates' => Certificate::with(['student', 'exam', 'attempt'])
                ->orderBy('issued_at', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Certificate $c) => [
                    'id' => $c->id,
                    'student' => $c->student ? ['id' => $c->student->id, 'name' => $c->student->name] : null,
                    'exam' => $c->exam ? ['id' => $c->exam->id, 'title' => $c->exam->title] : null,
                    'attempt' => $c->attempt ? ['id' => $c->attempt->id] : null,
                    'certificate_code' => $c->certificate_code,
                    'verification_code' => $c->verification_code,
                    'image' => $c->image,
                    'issued_at' => $this->formatDateTime($c->issued_at),
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/certificates/create', [
            'students' => $this->students(),
            'exams' => $this->exams(),
            'attempts' => $this->attempts(),
        ]);
    }

    public function store(StoreCertificateRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        Certificate::create($payload);

        return to_route('admin.certificates.index')->with('success', 'تمت إضافة الشهادة بنجاح.');
    }

    public function edit(Certificate $certificate): Response
    {
        return Inertia::render('admin/certificates/edit', [
            'certificate' => [
                'id' => $certificate->id,
                'attempt_id' => $certificate->attempt_id,
                'student_id' => $certificate->student_id,
                'exam_id' => $certificate->exam_id,
                'certificate_code' => $certificate->certificate_code,
                'verification_code' => $certificate->verification_code,
                'image' => $certificate->image,
                'issued_at' => $this->formatDateTime($certificate->issued_at),
            ],
            'students' => $this->students(),
            'exams' => $this->exams(),
            'attempts' => $this->attempts(),
        ]);
    }

    public function update(UpdateCertificateRequest $request, Certificate $certificate): RedirectResponse
    {
        $payload = $request->validated();
        $certificate->update($payload);

        return to_route('admin.certificates.index')->with('success', 'تم تحديث الشهادة بنجاح.');
    }

    public function destroy(Certificate $certificate): RedirectResponse
    {
        $certificate->delete();

        return to_route('admin.certificates.index')->with('success', 'تم حذف الشهادة بنجاح.');
    }

    private function students(): array
    {
        return User::query()->where('role', 'student')->orderBy('name')->get(['id', 'name'])->toArray();
    }

    private function exams(): array
    {
        return Exam::query()->orderBy('title')->get(['id', 'title'])->toArray();
    }

    private function attempts(): array
    {
        return StudentExamAttempt::query()->with('student', 'exam')->orderByDesc('id')->get()->map(fn (StudentExamAttempt $attempt) => [
            'id' => $attempt->id,
            'label' => 'محاولة #'.$attempt->id.' - '.($attempt->student?->name ?? 'طالب').' - '.($attempt->exam?->title ?? 'اختبار'),
        ])->toArray();
    }

    private function formatDateTime(mixed $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->format('Y-m-d\TH:i');
        }

        return Carbon::parse($value)->format('Y-m-d\TH:i');
    }
}
