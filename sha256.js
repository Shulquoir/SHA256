function sha256(input_string) {
    function rightShift(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }

    let maxWord = Math.pow(2, 32);
    let charCode;
    let result = '';

    let words = [];
    let input_string_BitLength = input_string.length * 8;

    // Начальное значение хеша: первые 32 бита дробных частей квадратных корней первых 8 простых чисел
    let sha256_h = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    // Константы: первые 32 бита дробных частей корней куба первых 64 простых чисел
    let sha256_k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    input_string += '\x80'; // Добавляем 1 бит и заполнение нулями
    while (input_string.length % 64 - 56)
    {
        input_string += '\x00'; // Ещё заполнение нулями
    }

    for (let i = 0; i < input_string.length; i++)
    {
        charCode = input_string.charCodeAt(i);
        if (charCode >> 8) return; // Проверка, принимать только символы в диапазоне 0-255
        words[i >> 2] = words[i >> 2] | charCode << ((3 - i) % 4) * 8;
    }

    words[words.length] = ((input_string_BitLength / maxWord) | 0);
    words[words.length] = (input_string_BitLength);

    // Обрабатываем каждый кусок
    for (let j = 0; j < words.length;)
    {
        let w = words.slice(j, j += 16); // Сообщение расширяется до 64 слов как часть итерации
        let oldHash = sha256_h; // Теперь это «рабочий хеш», часто помеченный как переменные a ... g
        sha256_h = sha256_h.slice(0, 8); // Усекаем длину, иначе в конце накапливаются лишние записи

        for (let i = 0; i < 64; i++) // Развернем сообщение в 64 слова
        {
            let w15 = w[i - 15],
                w2 = w[i - 2];

            // Итерация
            let a = sha256_h[0], e = sha256_h[4]; // Используем начальные значения хеша
            let temp = sha256_h[7]
                + (rightShift(e, 6) ^ rightShift(e, 11) ^ rightShift(e, 25)) // "S1"
                + ((e & sha256_h[5]) ^ ((~e) & sha256_h[6])) // 
                + sha256_k[i]
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightShift(w15, 7) ^ rightShift(w15, 18) ^ (w15 >>> 3)) // "s0"
                        + w[i - 7]
                        + (rightShift(w2, 17) ^ rightShift(w2, 19) ^ (w2 >>> 10)) // "s1"
                    ) | 0
                );
            let temp2 = (rightShift(a, 2) ^ rightShift(a, 13) ^ rightShift(a, 22)) // "S0"
                + ((a & sha256_h[1]) ^ (a & sha256_h[2]) ^ (sha256_h[1] & sha256_h[2]));

            sha256_h = [(temp + temp2) | 0].concat(sha256_h);
            sha256_h[4] = (sha256_h[4] + temp) | 0;
        }

        for (let i = 0; i < 8; i++) {
            sha256_h[i] = (sha256_h[i] + oldHash[i]) | 0; //Объединяем полученный хеш с ранее полученым хешем
        }
    }

    for (let i = 0; i < 8; i++)
    {
        for (let j = 3; j + 1; j--)
        {
            let b = (sha256_h[i] >> (j * 8)) & 255;
            if (b < 16) {
                result += 0 + b.toString(16);
            }
            else {
                result += '' + b.toString(16);
            }
        }
    }
    return result;
}
