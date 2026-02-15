// Copy this file to environment.ts and environment.prod.ts
// Then fill in your EmailJS credentials from https://dashboard.emailjs.com
export const environment = {
    production: false,
    emailjs: {
        publicKey: 'YOUR_PUBLIC_KEY',
        serviceId: 'YOUR_SERVICE_ID',
        templateId: 'YOUR_TEMPLATE_ID',
    }
};
