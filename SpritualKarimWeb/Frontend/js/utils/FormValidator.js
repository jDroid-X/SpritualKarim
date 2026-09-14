/**
 * js/utils/FormValidator.js
 * Universal Form & Lineage Validation Engine
 * Shree Spritual Karim Sansthan (OOPS MVC Architecture)
 */

class FormValidator {
  static validateName(name) {
    if (!name || typeof name !== 'string') {
      return { valid: false, message: 'Name is required.' };
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return { valid: false, message: 'Name must be at least 2 characters.' };
    }
    if (trimmed.length > 60) {
      return { valid: false, message: 'Name cannot exceed 60 characters.' };
    }
    return { valid: true, message: 'Valid Name' };
  }

  static validatePhone(phone) {
    if (!phone || typeof phone !== 'string') {
      return { valid: false, message: 'Phone number is required.' };
    }
    const clean = phone.replace(/[\s-]/g, '');
    const phoneRegex = /^(\+?[0-9]{1,3})?[0-9]{10}$/;
    if (!phoneRegex.test(clean)) {
      return { valid: false, message: 'Enter a valid 10-digit mobile number (with optional country code).' };
    }
    return { valid: true, message: 'Valid Phone Number' };
  }

  static validateReferenceCode(code, expectedPrefix = null) {
    if (!code || typeof code !== 'string') {
      return { valid: false, message: 'Reference code is required.' };
    }
    const clean = code.trim().toUpperCase();
    const standardRegex = /^SK[A-Z0-9]{2,4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    if (!standardRegex.test(clean)) {
      return { valid: false, message: 'Format must be SKXX-XXXX-XXXX-XXXX.' };
    }
    if (expectedPrefix && !clean.startsWith(expectedPrefix)) {
      return { valid: false, message: `Code must begin with ${expectedPrefix}.` };
    }
    return { valid: true, message: 'Valid Reference Code' };
  }

  static validateSponsor(sponsorCode, candidateCode, allProfiles = []) {
    if (!sponsorCode || !sponsorCode.trim()) {
      return { valid: false, message: 'Sponsor Reference Code is required.' };
    }
    const cleanSponsor = sponsorCode.trim().toUpperCase();
    const cleanCandidate = candidateCode ? candidateCode.trim().toUpperCase() : null;

    if (cleanCandidate && cleanSponsor === cleanCandidate) {
      return { valid: false, message: 'Self-pairing is prohibited. Sponsor cannot be self.' };
    }

    if (Array.isArray(allProfiles) && allProfiles.length > 0) {
      const sponsorProfile = allProfiles.find(p => (p.referenceCode && p.referenceCode.toUpperCase() === cleanSponsor));
      if (!sponsorProfile) {
        return { valid: false, message: 'Sponsor code does not exist in registry.' };
      }
    }

    return { valid: true, message: 'Verified Sponsor' };
  }

  static validateEmail(email, required = false) {
    if (!email || typeof email !== 'string' || !email.trim()) {
      if (required) {
        return { valid: false, message: 'Email address is required.' };
      }
      return { valid: true, message: 'Optional field' };
    }
    const clean = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(clean)) {
      return { valid: false, message: 'Enter a valid email address (e.g. user@example.com).' };
    }
    return { valid: true, message: 'Valid Email' };
  }

  static validateCity(city) {
    if (!city || typeof city !== 'string' || !city.trim()) {
      return { valid: false, message: 'City / Location is required.' };
    }
    const trimmed = city.trim();
    if (trimmed.length < 2) {
      return { valid: false, message: 'City must be at least 2 characters.' };
    }
    if (trimmed.length > 50) {
      return { valid: false, message: 'City name cannot exceed 50 characters.' };
    }
    return { valid: true, message: 'Valid City' };
  }

  static validateJoinDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') {
      return { valid: false, message: 'Join date is required.' };
    }
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return { valid: false, message: 'Enter a valid date.' };
    }
    const now = new Date();
    // Allow up to 1 day into future for timezone tolerance
    now.setDate(now.getDate() + 1);
    if (parsed > now) {
      return { valid: false, message: 'Join date cannot be in the future.' };
    }
    return { valid: true, message: 'Valid Join Date' };
  }

  static validateObjective(text, minLen = 5, maxLen = 500) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      return { valid: false, message: 'Purpose / Objective is required.' };
    }
    const trimmed = text.trim();
    if (trimmed.length < minLen) {
      return { valid: false, message: `Objective must be at least ${minLen} characters.` };
    }
    if (trimmed.length > maxLen) {
      return { valid: false, message: `Objective cannot exceed ${maxLen} characters.` };
    }
    return { valid: true, message: 'Valid Objective' };
  }

  static bindFieldValidation(inputEl, validatorFn, feedbackEl) {
    if (!inputEl) return;
    const handler = () => {
      const res = validatorFn(inputEl.value);
      if (res.valid) {
        inputEl.classList.remove('is-invalid');
        inputEl.classList.add('is-valid');
        if (feedbackEl) {
          feedbackEl.className = 'sk-validation-feedback show-valid';
          feedbackEl.innerHTML = `<span>✓</span> ${res.message}`;
        }
      } else {
        inputEl.classList.remove('is-valid');
        inputEl.classList.add('is-invalid');
        if (feedbackEl) {
          feedbackEl.className = 'sk-validation-feedback show-invalid';
          feedbackEl.innerHTML = `<span>✕</span> ${res.message}`;
        }
      }
    };
    inputEl.addEventListener('input', handler);
    inputEl.addEventListener('blur', handler);
  }
}

if (typeof window !== 'undefined') {
  window.FormValidator = FormValidator;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}
