
import * as Kopi from './utils/coffee.js';


async function createMultipleWallets(numWallets, apiKey) {
    const tokens = []; 
    const headers = { Accept: '*/*' }; 
    await Kopi.profileRequest(headers); 
    for (let i = 0; i < numWallets; i++) {
        Kopi.logger(`正在创建钱包 ${i + 1}，共 ${numWallets}`); 
        const wallet = Kopi.generateWallet();

        const headersAuth = {
            Accept: '*/*',
            'x-recaptcha-response': await Kopi.solveCaptchaKey(apiKey), 
        };

        try {
            let walletData = await Kopi.createWalletAndRequest(wallet, headersAuth); 

            if (!walletData.token) { 
                Kopi.logger(`创建钱包 ${i + 1} 失败，重试中...`);
                walletData = await Kopi.createWalletAndRequest(wallet, headersAuth);
            }

            if (walletData.token) tokens.push(walletData); 
            else Kopi.logger(`创建钱包 ${i + 1} 重试失败。`, "error");
        } catch (error) {
            Kopi.logger(`创建钱包 ${i + 1} 时出错:`, "error", error);
        }
    }

    Kopi.saveToTokenFile(tokens); 
}


async function main(apiKey) {
    const tokens = Kopi.loadTokens(); 

    if (!tokens) return;

    for (const [index, tokenEntry] of tokens.entries()) {
        Kopi.logger(`处理令牌 #${index + 1}: 地址: ${tokenEntry.address}`);
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenEntry.token}`, 
        };

        try {
            const profile = await Kopi.profileRequest(headers); 
            const response = await Kopi.connectRequest(headers); 
            if (!response.error || response !== undefined) {
                Kopi.logger(JSON.stringify(response.result), "success"); 
            } else {
                Kopi.logger("连接钱包失败。", "error");
            }
            
            if (profile.error || response.error) {
                Kopi.logger(`令牌 ${tokenEntry.address} 已过期，正在重新认证...`, "error");

                const headersAuth = {
                    Accept: '*/*',
                    'x-recaptcha-response': await Kopi.solveCaptchaKey(apiKey),
                };
                await Kopi.profileRequest(headers);
                const walletData = await Kopi.createWalletAndRequest(tokenEntry, headersAuth);
                if (walletData.token) {
                    tokenEntry.token = walletData.token;
                    Kopi.saveToTokenFile(tokens); 
                }
            }
        } catch (error) {
            Kopi.logger(`处理令牌 #${index + 1} 时出错:`, "error", error);
        }
    }
}


(async () => {
    const rl = Kopi.readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    Kopi.logger(Kopi.banner, "debug");

    try {
       
        Kopi.logger("选择一个选项:\n1. 创建并注册钱包\n2. 加载现有令牌并运行");
        const choice = await rl.question("输入你的选择 (1 或 2): ");

        if (choice === "1") {
           
            console.log("\x1b[31m文件 accounts.json 将被覆盖，请确保备份现有账户文件。\x1b[0m");
            const numWalletsInput = await rl.question("你想创建多少个钱包? ");
            const apiKey = await rl.question("输入你的验证码解决API密钥: ");

            const numWallets = parseInt(numWalletsInput, 10); 

            if (isNaN(numWallets) || numWallets <= 0) {
                Kopi.logger('无效的钱包数量，请输入正整数。', "error");
                return;
            }

            Kopi.logger(`正在创建 ${numWallets} 个钱包...`);
            await createMultipleWallets(numWallets, apiKey);

        } else if (choice === "2") {
            
            const apiKey = await rl.question("输入你的验证码解决API密钥: ");
            
            Kopi.logger('将在1分钟内开始处理钱包....');
            
            setInterval(() => main(apiKey), 1000 * 60); 

        } else {
            
            Kopi.logger("无效选择，请输入 1 或 2。", "error");
        }

    } catch (error) {
        Kopi.logger('发生错误:', "error", error);
    } finally {
        rl.close(); 
    }
})();
