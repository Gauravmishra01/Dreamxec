const axios = require('axios');

const sendWhatsAppMessage = async ({ to, message }) => {
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const baseUrl = process.env.EVOLUTION_API_URL;

  /* ───────────────────────
     1. Config validation
  ─────────────────────── */
  if (!baseUrl || !apiKey || !instanceName) {
    console.warn('[WhatsApp] Evolution API not configured. Skipping send.', {
      hasBaseUrl: !!baseUrl,
      hasApiKey: !!apiKey,
      hasInstanceName: !!instanceName,
    });
    return { skipped: true, reason: 'CONFIG_MISSING' };
  }

  if (!to || !message) {
    console.warn('[WhatsApp] Invalid payload. Skipping send.', { to, message });
    return { skipped: true, reason: 'INVALID_INPUT' };
  }

  /* ───────────────────────
     2. Normalize phone number
  ─────────────────────── */
  const formattedNumber = to.replace(/\D/g, '').replace(/^91/, '');
  const whatsappNumber = `91${formattedNumber}@s.whatsapp.net`;


  /* ───────────────────────
     3. Correct payload (Evolution v2.3.x)
  ─────────────────────── */
  const payload = {
    number: whatsappNumber,
    text: message,
    options: {
      delay: 1200,
      presence: 'composing',
      linkPreview: false,
    },
  };

  const url = `${baseUrl}/message/sendText/${instanceName}`;

  /* ───────────────────────
     4. Axios request with timeout
  ─────────────────────── */
  try {
    const response = await axios.post(url, payload, {
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 10_000, // prevent hanging requests
    });

    console.log('[WhatsApp] Message queued', {
      to: whatsappNumber,
      messageId: response.data?.key?.id,
      status: response.data?.status,
    });

    return response.data;

  } catch (error) {
    /* ───────────────────────
       5. Safe error logging
    ─────────────────────── */
    const errPayload = {
      to: whatsappNumber,
      status: error.response?.status,
      response: error.response?.data,
      message: error.message,
    };

    console.error('[WhatsApp] Send failed', errPayload);

    // Do NOT crash business flow in production
    return {
      failed: true,
      reason: 'WHATSAPP_SEND_FAILED',
      error: errPayload,
    };
  }
};

module.exports = { sendWhatsAppMessage };


// const sendWhatsAppMessage = async ({ to, message }) => {
//   // Extract OTP (4–6 digits)
//   const otpMatch = message.match(/\b\d{4,6}\b/);
//   const otp = otpMatch ? otpMatch[0] : 'OTP_NOT_FOUND';

//   console.log('[OTP][DEBUG]', {
//     to,
//     otp,
//     message,
//   });

//   // Pretend everything went fine
//   return {
//     skipped: true,
//     reason: 'WHATSAPP_DISABLED',
//     otp,
//   };
// };

// module.exports = { sendWhatsAppMessage };
