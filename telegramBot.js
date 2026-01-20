const { Telegraf } = require('telegraf');
const { RUNTIME } = require('./config');

let bot;
function startBot(token, chatId){
    bot = new Telegraf(token);
    bot.start((ctx)=>ctx.reply("🤖 Apex Titan v300: /flashloan, /bribe, /simulate"));
    bot.command("flashloan",(ctx)=>{
        const val = ctx.message.text.split(" ")[1];
        RUNTIME.flashLoanEnabled = val==="on";
        ctx.reply(`FlashLoan: ${RUNTIME.flashLoanEnabled?"✅ ON":"❌ OFF"}`);
    });
    bot.command("bribe",(ctx)=>{
        const val=parseInt(ctx.message.text.split(" ")[1]);
        if(!isNaN(val)) RUNTIME.bribePercent=val;
        ctx.reply(`Bribe % set to ${RUNTIME.bribePercent}`);
    });
    bot.command("simulate",(ctx)=>{
        const val = ctx.message.text.split(" ")[1];
        RUNTIME.simulationMode = val==="on";
        ctx.reply(`Simulation mode: ${RUNTIME.simulationMode?"✅ ON":"❌ OFF"}`);
    });
    bot.launch();
    return bot;
}

function sendUpdate(msg){ if(bot) bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID,msg); }

module.exports={ startBot, sendUpdate };
