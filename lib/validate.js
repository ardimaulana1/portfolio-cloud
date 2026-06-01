// Pure, dependency-free validation logic.
// Kept separate from the route handler so it can be unit-tested in CI.
export function validateContact(input) {
  const data = input || {};
  const errors = {};

  if (!data.name || String(data.name).trim().length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  }

  const email = String(data.email || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!data.message || String(data.message).trim().length < 10) {
    errors.message = "Pesan minimal 10 karakter.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
