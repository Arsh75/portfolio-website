import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment';

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    private initialized = false;

    constructor() {
        this.initEmailJS();
    }

    private initEmailJS(): void {
        if (!this.initialized) {
            emailjs.init(environment.emailjs.publicKey);
            this.initialized = true;
        }
    }

    async sendEmail(formData: ContactFormData): Promise<boolean> {
        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_name: 'Arshad Khan',
                reply_to: formData.email,
            };

            const response = await emailjs.send(
                environment.emailjs.serviceId,
                environment.emailjs.templateId,
                templateParams
            );

            return response.status === 200;
        } catch (error: unknown) {
            const err = error as { status?: number; text?: string };
            console.error('EmailJS Error Status:', err.status);
            console.error('EmailJS Error Text:', err.text);
            console.error('EmailJS Full Error:', JSON.stringify(error));
            return false;
        }
    }
}
