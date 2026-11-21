/**
 * EmailJS Service for MyMarks
 * Sends transactional email notifications (e.g. Contact Acknowledgement) via EmailJS REST API.
 */

const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';

// Service & Template IDs provided for MyMarks Contact Us
const DEFAULT_SERVICE_ID = 'service_v9j4dsz';
const DEFAULT_TEMPLATE_ID = 'template_o6bpwoj';

/**
 * Send an automated acknowledgement email to the user when their contact inquiry
 * has been successfully saved to the database.
 *
 * @param {Object} formData
 * @param {string} formData.name - Full name of the user
 * @param {string} formData.email - User email address
 * @param {string} formData.phone - User phone number
 * @param {string} [formData.subject] - Inquiry category / subject
 * @param {string} formData.message - User message body
 * @param {string} [formData.company] - Optional company name
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function sendContactAcknowledgementEmail(formData) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || DEFAULT_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || DEFAULT_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  if (!publicKey) {
    console.warn(
      '[EmailJS] VITE_EMAILJS_PUBLIC_KEY is not set in your frontend .env file. ' +
      'Please obtain your Public Key from EmailJS Dashboard -> Account -> General -> Public Key.'
    );
    return {
      success: false,
      message: 'EmailJS Public Key is not configured in environment variables.',
    };
  }

  // Split full name into first_name and last_name for the template
  const rawName = (formData.name || '').trim();
  const nameParts = rawName.split(/\s+/);
  const firstName = nameParts[0] || 'Learner';
  const lastName = nameParts.slice(1).join(' ') || '';

  const templateParams = {
    first_name: firstName,
    last_name: lastName,
    email: formData.email?.trim(),
    phone: formData.phone ? String(formData.phone).trim() : '',
    company: formData.company ? formData.company.trim() : 'Individual / Student',
    inquiry_category: formData.subject || 'General Inquiry',
    message: (formData.message || '').trim(),
    // Standard EmailJS recipient & sender routing attributes
    to_email: formData.email?.trim(),
    to_name: rawName,
    reply_to: 'visdomwaves@gmail.com',
  };

  const response = await fetch(EMAILJS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(errorText || `EmailJS responded with HTTP ${response.status}`);
  }

  return { success: true };
}

