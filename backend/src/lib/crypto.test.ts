import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './crypto';

describe('crypto — encrypt/decrypt', () => {
  it('deve criptografar e descriptografar um texto corretamente', () => {
    const original = '123456';
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(original);
  });

  it('deve gerar texto criptografado diferente do original', () => {
    const original = 'minhamatricula';
    const encrypted = encrypt(original);

    expect(encrypted).not.toBe(original);
  });

  it('deve lidar com matrícula numérica longa', () => {
    const matricula = '20261234567890';
    const encrypted = encrypt(matricula);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(matricula);
  });

  it('deve gerar ciphertexts diferentes para o mesmo input (AES CBC usa IV aleatório)', () => {
    const text = 'mesmoTexto';
    const enc1 = encrypt(text);
    const enc2 = encrypt(text);

    // AES com CryptoJS gera salts diferentes a cada chamada
    expect(enc1).not.toBe(enc2);

    // Mas ambos descriptografam para o mesmo valor
    expect(decrypt(enc1)).toBe(text);
    expect(decrypt(enc2)).toBe(text);
  });

  it('deve lidar com texto vazio', () => {
    const encrypted = encrypt('');
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe('');
  });

  it('deve lidar com caracteres especiais', () => {
    const text = 'àéîõü@#$%&*!';
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(text);
  });
});
