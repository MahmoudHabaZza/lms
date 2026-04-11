<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StudentCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $student,
        public string $plainPassword,
        public string $loginLink,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'بيانات دخول الطالب - Kid Coder',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.student-credentials',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
