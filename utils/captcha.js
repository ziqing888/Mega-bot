import { solveCaptcha } from './solver.js';

export async function solveCaptchaKey(apikey) {
    try {
        return await solveCaptcha(apikey);
    } catch (error) {
        console.error('Error solving captcha:', error);
        throw error;
    }
}
