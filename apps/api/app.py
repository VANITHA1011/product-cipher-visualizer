from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)


def caesar_cipher(text, shift):
    steps = []
    ciphertext = ''
    for i, char in enumerate(text):
        result_char = char
        is_alphabetic = char.isalpha()
        if is_alphabetic:
            base = 65 if char.isupper() else 97
            result_char = chr((ord(char) - base + shift) % 26 + base)
        ciphertext += result_char
        steps.append({
            'originalChar': char,
            'position': i,
            'shiftAmount': shift,
            'resultChar': result_char,
            'isAlphabetic': is_alphabetic
        })
    return {'ciphertext': ciphertext, 'steps': steps}


def rail_fence_cipher(text, rails):
    if rails < 2 or not text:
        return {'ciphertext': text, 'writeSteps': [], 'readSteps': [], 'railPattern': []}

    rail_pattern = [[None] * len(text) for _ in range(rails)]
    row, direction = 0, 1
    write_steps = []

    for i, char in enumerate(text):
        rail_pattern[row][i] = char
        write_steps.append({'char': char, 'originalPos': i, 'rail': row})
        row += direction
        if row == 0 or row == rails - 1:
            direction *= -1

    ciphertext = ''
    read_steps = []
    for r in range(rails):
        for c in range(len(text)):
            if rail_pattern[r][c] is not None:
                ciphertext += rail_pattern[r][c]
                read_steps.append({
                    'char': rail_pattern[r][c],
                    'originalPos': c,
                    'rail': r,
                    'newPos': len(ciphertext) - 1
                })

    return {
        'ciphertext': ciphertext,
        'writeSteps': write_steps,
        'readSteps': read_steps,
        'railPattern': rail_pattern
    }


def product_cipher(text, shift, rails):
    caesar_result = caesar_cipher(text, shift)
    rail_fence_result = rail_fence_cipher(caesar_result['ciphertext'], rails)
    return {
        'ciphertext': rail_fence_result['ciphertext'],
        'caesarResult': caesar_result,
        'railFenceResult': rail_fence_result
    }


def calculate_entropy(text):
    if not text:
        return 0
    frequency = {}
    for char in text:
        frequency[char] = frequency.get(char, 0) + 1
    length = len(text)
    entropy = 0
    for count in frequency.values():
        p = count / length
        entropy -= p * math.log2(p)
    return min(entropy, 8)


def get_cipher_strength(cipher_type, key_space):
    if key_space <= 5:
        return 'Very Weak'
    if key_space <= 30:
        return 'Weak'
    if key_space <= 100:
        return 'Moderate'
    return 'Strong'


def compare_texts(text1, text2):
    max_length = max(len(text1), len(text2))
    differences = 0
    diff_positions = []
    for i in range(max_length):
        c1 = text1[i] if i < len(text1) else None
        c2 = text2[i] if i < len(text2) else None
        if c1 != c2:
            differences += 1
            diff_positions.append(i)
    percentage = round((differences / max_length) * 100, 1) if max_length > 0 else 0
    return {
        'differences': differences,
        'percentage': str(percentage),
        'diffPositions': diff_positions
    }


@app.route('/api/cipher/caesar', methods=['POST'])
def api_caesar():
    data = request.json
    result = caesar_cipher(data['text'], int(data['shift']))
    result['cipher_text'] = result['ciphertext'].upper()
    return jsonify(result)


@app.route('/api/cipher/rail-fence', methods=['POST'])
def api_rail_fence():
    data = request.json
    result = rail_fence_cipher(data['text'], int(data['rails']))
    result['cipher_text'] = result['ciphertext'].upper()
    return jsonify(result)


@app.route('/api/cipher/product', methods=['POST'])
def api_product():
    data = request.json
    result = product_cipher(data['text'], int(data['shift']), int(data['rails']))
    result['cipher_text'] = result['ciphertext'].upper()
    return jsonify(result)


@app.route('/api/cipher/entropy', methods=['POST'])
def api_entropy():
    data = request.json
    return jsonify({'entropy': calculate_entropy(data['text'])})


@app.route('/api/cipher/strength', methods=['POST'])
def api_strength():
    data = request.json
    return jsonify({'strength': get_cipher_strength(data['cipherType'], data.get('keySpace', 0))})


@app.route('/api/cipher/compare', methods=['POST'])
def api_compare():
    data = request.json
    return jsonify(compare_texts(data['text1'], data['text2']))


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
