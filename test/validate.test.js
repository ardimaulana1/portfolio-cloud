import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../lib/validate.js";

test("accepts a fully valid payload", () => {
  const { valid, errors } = validateContact({
    name: "Budi Santoso",
    email: "budi@example.com",
    message: "Halo, saya tertarik untuk berdiskusi soal proyek.",
  });
  assert.equal(valid, true);
  assert.deepEqual(errors, {});
});

test("rejects a name that is too short", () => {
  const { valid, errors } = validateContact({
    name: "B",
    email: "budi@example.com",
    message: "Pesan ini cukup panjang untuk lolos validasi.",
  });
  assert.equal(valid, false);
  assert.ok(errors.name);
});

test("rejects an invalid email", () => {
  const { valid, errors } = validateContact({
    name: "Budi",
    email: "bukan-email",
    message: "Pesan ini cukup panjang untuk lolos validasi.",
  });
  assert.equal(valid, false);
  assert.ok(errors.email);
});

test("rejects a message that is too short", () => {
  const { valid, errors } = validateContact({
    name: "Budi",
    email: "budi@example.com",
    message: "hai",
  });
  assert.equal(valid, false);
  assert.ok(errors.message);
});

test("handles empty / undefined input safely", () => {
  const { valid } = validateContact(undefined);
  assert.equal(valid, false);
});
