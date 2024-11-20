import { Solver } from "@2captcha/captcha-solver";
let key;
export async function solveCaptcha(key) {
    const solver = new Solver(key);
    const pageurl = "https://app.megafin.xyz/upgrade?ref=a329efba";
    const sitekey = "0x4AAAAAAA0SGzxWuGl6kriB";
    try {
        const result = await solver.cloudflareTurnstile({ pageurl, sitekey });
        return result.data; 
    } catch (err) {
        throw new Error(`Error solving CAPTCHA: ${err.message}`);
    }
}
