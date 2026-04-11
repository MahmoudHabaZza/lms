export function generateStudentPassword(): string {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%';
    const all = `${uppercase}${lowercase}${numbers}${symbols}`;

    const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];
    const password = [
        pick(uppercase),
        pick(uppercase),
        pick(lowercase),
        pick(lowercase),
        pick(lowercase),
        pick(lowercase),
        pick(lowercase),
        pick(numbers),
        pick(numbers),
        pick(symbols),
    ];

    for (let index = password.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [password[index], password[swapIndex]] = [password[swapIndex], password[index]];
    }

    while (password.length < 10) {
        password.push(pick(all));
    }

    return password.join('');
}
