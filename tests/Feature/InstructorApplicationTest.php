<?php

namespace Tests\Feature;

use App\Mail\InstructorApplicationSubmittedMail;
use App\Models\InstructorApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InstructorApplicationTest extends TestCase
{
    use RefreshDatabase;

    public function test_instructor_application_is_stored_and_emailed(): void
    {
        Storage::fake('public');
        Mail::fake();

        $response = $this->withSession(['_token' => 'test-token'])
            ->post('/join-us', [
                '_token' => 'test-token',
                'first_name' => 'Ahmed',
                'last_name' => 'Ali',
                'email' => 'teacher@example.com',
                'phone' => '+201001112223',
                'position' => 'instructor',
                'cv' => UploadedFile::fake()->create('cv.pdf', 300, 'application/pdf'),
                'notes' => 'Experienced in teaching Scratch and Python.',
            ], [
                'Accept' => 'application/json',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريبًا',
            ]);

        $this->assertDatabaseHas('instructor_applications', [
            'email' => 'teacher@example.com',
            'position' => 'instructor',
            'status' => 'new',
        ]);

        $application = InstructorApplication::query()->firstOrFail();

        Storage::disk('public')->assertExists($application->cv_path);
        Mail::assertSent(InstructorApplicationSubmittedMail::class, 1);
    }

    public function test_duplicate_instructor_application_is_blocked_for_a_short_time(): void
    {
        Storage::fake('public');
        Mail::fake();

        $application = InstructorApplication::query()->create([
            'first_name' => 'Sara',
            'last_name' => 'Omar',
            'email' => 'mentor@example.com',
            'phone' => '01000000000',
            'position' => 'assistant_instructor',
            'cv_path' => 'cvs/old-cv.pdf',
            'notes' => 'Existing submission.',
            'status' => 'new',
        ]);

        $application->forceFill([
            'created_at' => now()->subMinutes(5),
        ])->save();

        $response = $this->withSession(['_token' => 'test-token'])
            ->post('/join-us', [
                '_token' => 'test-token',
                'first_name' => 'Sara',
                'last_name' => 'Omar',
                'email' => 'mentor@example.com',
                'phone' => '01000000000',
                'position' => 'assistant_instructor',
                'cv' => UploadedFile::fake()->create('cv.docx', 200, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
                'notes' => 'Trying to send again too quickly.',
            ], [
                'Accept' => 'application/json',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        $this->assertDatabaseCount('instructor_applications', 1);
        Mail::assertNothingSent();
    }
}
