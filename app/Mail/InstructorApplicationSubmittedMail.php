<?php

namespace App\Mail;

use App\Models\InstructorApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InstructorApplicationSubmittedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public InstructorApplication $application)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'طلب انضمام جديد للمدربين - Kid Coder',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.instructor-application-submitted',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
