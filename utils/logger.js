import chalk from 'chalk';
export function logger(message, level = 'info') {
    const now = new Date().toISOString();
    const colors = {
        info: chalk.green,
        warn: chalk.yellow,
        error: chalk.red,
        success: chalk.blue,
        debug: chalk.magenta,
    };
    const color = colors[level] || chalk.white;
    console.log(color(`[${now}] [${level.toUpperCase()}]: ${message}`));
}
