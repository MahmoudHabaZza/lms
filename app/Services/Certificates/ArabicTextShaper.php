<?php

namespace App\Services\Certificates;

class ArabicTextShaper
{
    private const FORMS = [
        'ا' => ['ﺍ', 'ﺎ', null, null],
        'أ' => ['ﺃ', 'ﺄ', null, null],
        'إ' => ['ﺇ', 'ﺈ', null, null],
        'آ' => ['ﺁ', 'ﺂ', null, null],
        'ب' => ['ﺏ', 'ﺐ', 'ﺑ', 'ﺒ'],
        'ت' => ['ﺕ', 'ﺖ', 'ﺗ', 'ﺘ'],
        'ث' => ['ﺙ', 'ﺚ', 'ﺛ', 'ﺜ'],
        'ج' => ['ﺝ', 'ﺞ', 'ﺟ', 'ﺠ'],
        'ح' => ['ﺡ', 'ﺢ', 'ﺣ', 'ﺤ'],
        'خ' => ['ﺥ', 'ﺦ', 'ﺧ', 'ﺨ'],
        'د' => ['ﺩ', 'ﺪ', null, null],
        'ذ' => ['ﺫ', 'ﺬ', null, null],
        'ر' => ['ﺭ', 'ﺮ', null, null],
        'ز' => ['ﺯ', 'ﺰ', null, null],
        'س' => ['ﺱ', 'ﺲ', 'ﺳ', 'ﺴ'],
        'ش' => ['ﺵ', 'ﺶ', 'ﺷ', 'ﺸ'],
        'ص' => ['ﺹ', 'ﺺ', 'ﺻ', 'ﺼ'],
        'ض' => ['ﺽ', 'ﺾ', 'ﺿ', 'ﻀ'],
        'ط' => ['ﻁ', 'ﻂ', 'ﻃ', 'ﻄ'],
        'ظ' => ['ﻅ', 'ﻆ', 'ﻇ', 'ﻈ'],
        'ع' => ['ﻉ', 'ﻊ', 'ﻋ', 'ﻌ'],
        'غ' => ['ﻍ', 'ﻎ', 'ﻏ', 'ﻐ'],
        'ف' => ['ﻑ', 'ﻒ', 'ﻓ', 'ﻔ'],
        'ق' => ['ﻕ', 'ﻖ', 'ﻗ', 'ﻘ'],
        'ك' => ['ﻙ', 'ﻚ', 'ﻛ', 'ﻜ'],
        'ل' => ['ﻝ', 'ﻞ', 'ﻟ', 'ﻠ'],
        'م' => ['ﻡ', 'ﻢ', 'ﻣ', 'ﻤ'],
        'ن' => ['ﻥ', 'ﻦ', 'ﻧ', 'ﻨ'],
        'ه' => ['ﻩ', 'ﻪ', 'ﻫ', 'ﻬ'],
        'ة' => ['ﺓ', 'ﺔ', null, null],
        'و' => ['ﻭ', 'ﻮ', null, null],
        'ؤ' => ['ﺅ', 'ﺆ', null, null],
        'ى' => ['ﻯ', 'ﻰ', null, null],
        'ي' => ['ﻱ', 'ﻲ', 'ﻳ', 'ﻴ'],
        'ئ' => ['ﺉ', 'ﺊ', 'ﺋ', 'ﺌ'],
        'ء' => ['ء', 'ء', null, null],
        'ﻻ' => ['ﻻ', 'ﻼ', null, null],
        'ﻷ' => ['ﻷ', 'ﻸ', null, null],
        'ﻹ' => ['ﻹ', 'ﻺ', null, null],
        'ﻵ' => ['ﻵ', 'ﻶ', null, null],
    ];

    public function shape(string $text): string
    {
        if (! preg_match('/\p{Arabic}/u', $text)) {
            return $text;
        }

        $characters = preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $characters = $this->applyLamAlefLigatures($characters);

        $shaped = [];

        foreach ($characters as $index => $character) {
            if (! isset(self::FORMS[$character])) {
                $shaped[] = $character;
                continue;
            }

            $previous = $characters[$index - 1] ?? null;
            $next = $characters[$index + 1] ?? null;

            $connectsPrev = $previous !== null && $this->canConnectForward($previous) && $this->canConnectBackward($character);
            $connectsNext = $next !== null && $this->canConnectForward($character) && $this->canConnectBackward($next);

            [$isolated, $final, $initial, $medial] = self::FORMS[$character];

            $shaped[] = match (true) {
                $connectsPrev && $connectsNext && $medial !== null => $medial,
                $connectsPrev && $final !== null => $final,
                $connectsNext && $initial !== null => $initial,
                default => $isolated,
            };
        }

        return implode('', array_reverse($shaped));
    }

    private function applyLamAlefLigatures(array $characters): array
    {
        $result = [];
        $count = count($characters);

        for ($i = 0; $i < $count; $i++) {
            $current = $characters[$i];
            $next = $characters[$i + 1] ?? null;

            if ($current === 'ل' && in_array($next, ['ا', 'أ', 'إ', 'آ'], true)) {
                $result[] = match ($next) {
                    'ا' => 'ﻻ',
                    'أ' => 'ﻷ',
                    'إ' => 'ﻹ',
                    'آ' => 'ﻵ',
                };
                $i++;
                continue;
            }

            $result[] = $current;
        }

        return $result;
    }

    private function canConnectForward(string $character): bool
    {
        return isset(self::FORMS[$character][2]) || isset(self::FORMS[$character][3]);
    }

    private function canConnectBackward(string $character): bool
    {
        return isset(self::FORMS[$character][1]);
    }
}
