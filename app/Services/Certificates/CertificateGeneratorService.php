<?php

namespace App\Services\Certificates;

use App\Models\Certificate;
use App\Models\StudentExamAttempt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CertificateGeneratorService
{
    public function __construct(
        private readonly ArabicTextShaper $arabicTextShaper,
    ) {
    }

    public function issueForAttempt(StudentExamAttempt $attempt): Certificate
    {
        $attempt->loadMissing(['student', 'exam.course']);

        return DB::transaction(function () use ($attempt) {
            $certificate = Certificate::query()->firstOrCreate(
                ['attempt_id' => $attempt->id],
                [
                    'student_id' => $attempt->student_id,
                    'exam_id' => $attempt->exam_id,
                    'certificate_code' => strtoupper(Str::random(12)),
                    'verification_code' => strtoupper(Str::random(16)),
                    'issued_at' => now(),
                ]
            );

            if (blank($certificate->image) || ! Storage::disk('public')->exists($certificate->image)) {
                $certificate->update([
                    'image' => $this->generateImage($certificate->fresh(['student', 'exam.course'])),
                    'issued_at' => $certificate->issued_at ?? now(),
                ]);
            }

            return $certificate->fresh(['student', 'exam.course', 'attempt']);
        });
    }

    private function generateImage(Certificate $certificate): string
    {
        if (! function_exists('imagecreatetruecolor')) {
            return $this->generateSvgFallback($certificate);
        }

        $width = 1600;
        $height = 1100;
        $image = imagecreatetruecolor($width, $height);

        $topColor = [251, 245, 233];
        $bottomColor = [248, 207, 138];
        $navy = imagecolorallocate($image, 24, 34, 58);
        $orange = imagecolorallocate($image, 232, 122, 42);
        $gold = imagecolorallocate($image, 196, 145, 39);
        $muted = imagecolorallocate($image, 92, 100, 121);
        $white = imagecolorallocate($image, 255, 255, 255);

        for ($y = 0; $y < $height; $y++) {
            $ratio = $y / max($height - 1, 1);
            $red = (int) round($topColor[0] + (($bottomColor[0] - $topColor[0]) * $ratio));
            $green = (int) round($topColor[1] + (($bottomColor[1] - $topColor[1]) * $ratio));
            $blue = (int) round($topColor[2] + (($bottomColor[2] - $topColor[2]) * $ratio));
            $lineColor = imagecolorallocate($image, $red, $green, $blue);
            imageline($image, 0, $y, $width, $y, $lineColor);
        }

        imagefilledellipse($image, 180, 170, 340, 340, imagecolorallocatealpha($image, 255, 255, 255, 80));
        imagefilledellipse($image, 1420, 930, 420, 420, imagecolorallocatealpha($image, 255, 255, 255, 90));
        imagefilledrectangle($image, 80, 80, 1520, 1020, $white);
        imagerectangle($image, 80, 80, 1520, 1020, $gold);
        imagerectangle($image, 100, 100, 1500, 1000, $orange);

        $fontRegular = $this->resolveFontPath([
            'C:\Windows\Fonts\arial.ttf',
            'C:\Windows\Fonts\tahoma.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
            '/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf',
        ]);
        $fontBold = $this->resolveFontPath([
            'C:\Windows\Fonts\arialbd.ttf',
            'C:\Windows\Fonts\tahomabd.ttf',
            '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
            '/usr/share/fonts/truetype/noto/NotoNaskhArabic-Bold.ttf',
        ]) ?: $fontRegular;

        if ($fontRegular === null || $fontBold === null) {
            imagedestroy($image);

            return $this->generateSvgFallback($certificate);
        }

        $studentName = $certificate->student?->name ?? 'الطالب';
        $courseName = $certificate->exam?->course?->title ?? $certificate->exam?->title ?? 'الكورس';
        $issuedDate = optional($certificate->issued_at ?? now())->format('Y-m-d');

        $this->drawCenteredText($image, $fontBold, 34, 800, 190, $orange, 'Kid Coder');
        $this->drawCenteredText($image, $fontBold, 54, 800, 290, $navy, 'شهادة إنجاز');
        $this->drawCenteredText($image, $fontRegular, 24, 800, 360, $muted, 'تُمنح هذه الشهادة تقديراً لإتمام المتطلبات التعليمية بنجاح');
        $this->drawCenteredText($image, $fontRegular, 28, 800, 470, $muted, 'تشهد المنصة بأن');
        $this->drawCenteredText($image, $fontBold, 48, 800, 560, $navy, $studentName);
        $this->drawCenteredText($image, $fontRegular, 28, 800, 640, $muted, 'قد أتم بنجاح كورس');
        $this->drawWrappedCenteredText($image, $fontBold, 36, 800, 720, 850, $orange, $courseName, 52);
        $this->drawCenteredText($image, $fontRegular, 24, 800, 820, $muted, 'تاريخ الإكمال');
        $this->drawCenteredText($image, $fontBold, 26, 800, 865, $navy, $issuedDate);
        $this->drawCenteredText($image, $fontRegular, 20, 270, 925, $muted, 'رمز الشهادة');
        $this->drawCenteredText($image, $fontBold, 18, 270, 965, $navy, $certificate->certificate_code);
        $this->drawCenteredText($image, $fontRegular, 20, 1330, 925, $muted, 'رمز التحقق');
        $this->drawCenteredText($image, $fontBold, 18, 1330, 965, $navy, $certificate->verification_code);

        imagefilledellipse($image, 800, 930, 120, 120, imagecolorallocatealpha($image, 232, 122, 42, 80));
        imageellipse($image, 800, 930, 150, 150, $gold);

        $relativePath = 'certificates/'.now()->format('Y/m').'/'.$certificate->certificate_code.'.png';
        $absolutePath = Storage::disk('public')->path($relativePath);
        $directory = dirname($absolutePath);

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        imagepng($image, $absolutePath);
        imagedestroy($image);

        return $relativePath;
    }

    private function drawCenteredText($image, string $fontPath, int $fontSize, int $centerX, int $baselineY, int $color, string $text): void
    {
        $prepared = $this->prepareText($text);
        $box = imagettfbbox($fontSize, 0, $fontPath, $prepared);
        $textWidth = abs(($box[2] ?? 0) - ($box[0] ?? 0));
        $x = (int) round($centerX - ($textWidth / 2));

        imagettftext($image, $fontSize, 0, $x, $baselineY, $color, $fontPath, $prepared);
    }

    private function drawWrappedCenteredText($image, string $fontPath, int $fontSize, int $centerX, int $baselineY, int $maxWidth, int $color, string $text, int $lineHeight): void
    {
        $lines = $this->wrapText($fontPath, $fontSize, $text, $maxWidth);

        foreach ($lines as $index => $line) {
            $this->drawCenteredText($image, $fontPath, $fontSize, $centerX, $baselineY + ($index * $lineHeight), $color, $line);
        }
    }

    private function wrapText(string $fontPath, int $fontSize, string $text, int $maxWidth): array
    {
        $words = preg_split('/\s+/u', trim($text)) ?: [];
        $lines = [];
        $currentLine = '';

        foreach ($words as $word) {
            $candidate = trim($currentLine === '' ? $word : $currentLine.' '.$word);
            $prepared = $this->prepareText($candidate);
            $box = imagettfbbox($fontSize, 0, $fontPath, $prepared);
            $width = abs(($box[2] ?? 0) - ($box[0] ?? 0));

            if ($width > $maxWidth && $currentLine !== '') {
                $lines[] = $currentLine;
                $currentLine = $word;
                continue;
            }

            $currentLine = $candidate;
        }

        if ($currentLine !== '') {
            $lines[] = $currentLine;
        }

        return array_slice($lines, 0, 2);
    }

    private function prepareText(string $text): string
    {
        return preg_match('/\p{Arabic}/u', $text)
            ? $this->arabicTextShaper->shape($text)
            : $text;
    }

    private function resolveFontPath(array $candidates): ?string
    {
        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    private function generateSvgFallback(Certificate $certificate): string
    {
        $studentName = e($certificate->student?->name ?? 'الطالب');
        $courseName = e($certificate->exam?->course?->title ?? $certificate->exam?->title ?? 'الكورس');
        $issuedDate = e(($certificate->issued_at ?? now())->format('Y-m-d'));
        $code = e($certificate->certificate_code);
        $verification = e($certificate->verification_code);

        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbf5e9" />
      <stop offset="100%" stop-color="#f8cf8a" />
    </linearGradient>
  </defs>
  <rect width="1600" height="1100" fill="url(#bg)" />
  <rect x="80" y="80" width="1440" height="940" rx="20" fill="#ffffff" stroke="#c49127" stroke-width="4" />
  <rect x="100" y="100" width="1400" height="900" rx="18" fill="none" stroke="#e87a2a" stroke-width="2" />
  <text x="800" y="190" text-anchor="middle" font-size="34" fill="#e87a2a" font-family="Tahoma, Arial">Kid Coder</text>
  <text x="800" y="290" text-anchor="middle" font-size="54" fill="#18223a" font-family="Tahoma, Arial" direction="rtl">شهادة إنجاز</text>
  <text x="800" y="360" text-anchor="middle" font-size="24" fill="#5c6479" font-family="Tahoma, Arial" direction="rtl">تُمنح هذه الشهادة تقديراً لإتمام المتطلبات التعليمية بنجاح</text>
  <text x="800" y="470" text-anchor="middle" font-size="28" fill="#5c6479" font-family="Tahoma, Arial" direction="rtl">تشهد المنصة بأن</text>
  <text x="800" y="560" text-anchor="middle" font-size="48" fill="#18223a" font-family="Tahoma, Arial">{$studentName}</text>
  <text x="800" y="640" text-anchor="middle" font-size="28" fill="#5c6479" font-family="Tahoma, Arial" direction="rtl">قد أتم بنجاح كورس</text>
  <text x="800" y="720" text-anchor="middle" font-size="36" fill="#e87a2a" font-family="Tahoma, Arial">{$courseName}</text>
  <text x="800" y="820" text-anchor="middle" font-size="24" fill="#5c6479" font-family="Tahoma, Arial" direction="rtl">تاريخ الإكمال</text>
  <text x="800" y="865" text-anchor="middle" font-size="26" fill="#18223a" font-family="Tahoma, Arial">{$issuedDate}</text>
  <text x="270" y="925" text-anchor="middle" font-size="20" fill="#5c6479" font-family="Tahoma, Arial" direction="rtl">رمز الشهادة</text>
  <text x="270" y="965" text-anchor="middle" font-size="18" fill="#18223a" font-family="Tahoma, Arial">{$code}</text>
  <text x="1330" y="925" text-anchor="middle" font-size="20" fill="#5c6479" font-family="Tahoma, Arial" direction="rtl">رمز التحقق</text>
  <text x="1330" y="965" text-anchor="middle" font-size="18" fill="#18223a" font-family="Tahoma, Arial">{$verification}</text>
</svg>
SVG;

        $relativePath = 'certificates/'.now()->format('Y/m').'/'.$certificate->certificate_code.'.svg';
        Storage::disk('public')->put($relativePath, $svg);

        return $relativePath;
    }
}
