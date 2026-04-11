<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCertificateRequestRequest;
use App\Http\Requests\UpdateCertificateRequestRequest;
use App\Models\CertificateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CertificateRequestController extends Controller
{
    public function index(): Response
    {
        $items = CertificateRequest::with(['student', 'instructor'])
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn (CertificateRequest $item) => [
                'id' => $item->id,
                'student_id' => $item->student_id,
                'instructor_id' => $item->instructor_id,
                'student' => $item->student ? ['id' => $item->student->id, 'name' => $item->student->name] : null,
                'instructor' => $item->instructor ? ['id' => $item->instructor->id, 'name' => $item->instructor->name] : null,
                'course_title' => $item->course_title,
                'status' => $item->status,
            ]);

        return Inertia::render('admin/certificate-requests/index', ['requests' => $items]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/certificate-requests/create', [
            'students' => $this->students(),
            'instructors' => $this->instructors(),
        ]);
    }

    public function store(StoreCertificateRequestRequest $request): RedirectResponse
    {
        CertificateRequest::create($request->validated());

        return redirect()->route('admin.certificate-requests.index')->with('success', 'تمت إضافة طلب الشهادة بنجاح.');
    }

    public function edit(CertificateRequest $certificateRequest): Response
    {
        return Inertia::render('admin/certificate-requests/edit', [
            'request' => $certificateRequest,
            'students' => $this->students(),
            'instructors' => $this->instructors(),
        ]);
    }

    public function update(UpdateCertificateRequestRequest $request, CertificateRequest $certificateRequest): RedirectResponse
    {
        $certificateRequest->update($request->validated());

        return redirect()->route('admin.certificate-requests.index')->with('success', 'تم تحديث طلب الشهادة بنجاح.');
    }

    public function destroy(CertificateRequest $certificateRequest): RedirectResponse
    {
        $certificateRequest->delete();

        return redirect()->route('admin.certificate-requests.index')->with('success', 'تم حذف طلب الشهادة بنجاح.');
    }

    private function students(): array
    {
        return User::query()->where('role', 'student')->orderBy('name')->get(['id', 'name'])->toArray();
    }

    private function instructors(): array
    {
        return User::query()->where('role', 'instructor')->orderBy('name')->get(['id', 'name'])->toArray();
    }
}
