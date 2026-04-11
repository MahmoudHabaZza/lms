<?php

namespace Database\Seeders\Concerns;

trait NormalizesSeedStrings
{
    protected function normalizeSeedValue(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map(fn (mixed $item) => $this->normalizeSeedValue($item), $value);
        }

        if (! is_string($value) || ! $this->looksLikeMojibake($value)) {
            return $value;
        }

        $windows1252Map = [
            8364 => 128,
            8218 => 130,
            402 => 131,
            8222 => 132,
            8230 => 133,
            8224 => 134,
            8225 => 135,
            710 => 136,
            8240 => 137,
            352 => 138,
            8249 => 139,
            338 => 140,
            381 => 142,
            8216 => 145,
            8217 => 146,
            8220 => 147,
            8221 => 148,
            8226 => 149,
            8211 => 150,
            8212 => 151,
            732 => 152,
            8482 => 153,
            353 => 154,
            8250 => 155,
            339 => 156,
            382 => 158,
            376 => 159,
        ];

        $current = $value;

        for ($pass = 0; $pass < 4; $pass++) {
            if (! $this->looksLikeMojibake($current)) {
                return $current;
            }

            $chars = preg_split('//u', $current, -1, PREG_SPLIT_NO_EMPTY);

            if ($chars === false) {
                return $current;
            }

            $bytes = '';

            foreach ($chars as $char) {
                $codePoint = mb_ord($char, 'UTF-8');

                if ($codePoint <= 255) {
                    $bytes .= chr($codePoint);
                    continue;
                }

                if (! isset($windows1252Map[$codePoint])) {
                    return $current;
                }

                $bytes .= chr($windows1252Map[$codePoint]);
            }

            if (! mb_check_encoding($bytes, 'UTF-8') || $bytes === $current) {
                return $current;
            }

            $current = $bytes;
        }

        return $current;
    }

    private function looksLikeMojibake(string $value): bool
    {
        return str_contains($value, 'Ø')
            || str_contains($value, 'Ù')
            || str_contains($value, 'Ã');
    }
}
