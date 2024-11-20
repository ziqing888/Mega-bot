import fs from 'fs';
import { logger } from './logger.js';
export function saveToTokenFile(data, filePath = 'accounts.json') {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    logger(`Data successfully saved to ${filePath}`, "success");
}

export function loadTokens(filePath = 'accounts.json') {
    if (!fs.existsSync(filePath)) {
        logger(`${filePath} does not exist.`, "error");
        return null;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    try {
        return JSON.parse(data);
    } catch (error) {
        logger(`Error parsing ${filePath}:`, "error", error);
        return null;
    }
}
