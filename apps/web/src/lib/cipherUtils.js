// All cipher logic runs on the Flask backend.
// These functions are async wrappers that match the original signatures exactly,
// so no other file in the frontend needs to change.

async function post(endpoint, body) {
  const res = await fetch(`/api/cipher/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function caesarCipher(text, shift) {
  return post('caesar', { text, shift });
}

export async function railFenceCipher(text, rails) {
  return post('rail-fence', { text, rails });
}

export async function productCipher(text, shift, rails) {
  return post('product', { text, shift, rails });
}

export async function calculateEntropy(text) {
  const data = await post('entropy', { text });
  return data.entropy;
}

export async function getCipherStrength(cipherType, keySpace) {
  const data = await post('strength', { cipherType, keySpace });
  return data.strength;
}

export async function compareTexts(text1, text2) {
  return post('compare', { text1, text2 });
}
