<?php

namespace Tests\Feature;

use App\Mail\ContactMessageMail;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_is_accessible(): void
    {
        $this->get('/contact')->assertOk();
    }

    public function test_contact_message_is_emailed_to_configured_recipient(): void
    {
        Mail::fake();

        Setting::set('contact_notification_email', 'contact@kid-coder.test', 'string', 'mail');

        $response = $this->withSession(['_token' => 'test-token'])
            ->post('/contact', [
                '_token' => 'test-token',
                'name' => 'Ahmed Ali',
                'email' => 'parent@example.com',
                'phone' => '+201001112233',
                'subject' => 'استفسار عن الكورسات',
                'message' => 'أريد معرفة تفاصيل المواعيد والأسعار المتاحة للأطفال هذا الشهر.',
            ], [
                'Accept' => 'application/json',
            ]);

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'تم إرسال رسالتك بنجاح، وسيتم التواصل معك في أقرب وقت.',
            ]);

        Mail::assertSent(ContactMessageMail::class, function (ContactMessageMail $mail) {
            return $mail->hasTo('contact@kid-coder.test')
                && $mail->data['name'] === 'Ahmed Ali'
                && $mail->data['subject'] === 'استفسار عن الكورسات';
        });
    }

    public function test_contact_message_validation_errors_are_returned(): void
    {
        Mail::fake();

        $response = $this->withSession(['_token' => 'test-token'])
            ->post('/contact', [
                '_token' => 'test-token',
                'name' => '',
                'email' => 'not-an-email',
                'subject' => '',
                'message' => 'قصير',
            ], [
                'Accept' => 'application/json',
            ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);

        Mail::assertNothingSent();
    }
}
