const cluster=require('cluster');
const os=require('os');
const http=require('http');
const WebSocket=require('ws');
require('dotenv').config();
const AIEngine=require('./aiEngine');
const TradeEngine=require('./tradeEngine');
const { startBot } = require('./telegramBot');
const { PRIVATE_KEY, NETWORKS, MIN_BALANCE_THRESHOLD } = require('./config');

if(cluster.isPrimary){
    console.clear();
    console.log(`⚡ Apex Titan v300 | Clustered AI | CPUs: ${os.cpus().length}`);
    startBot(process.env.TELEGRAM_TOKEN, process.env.TELEGRAM_CHAT_ID);
    Object.keys(NETWORKS).forEach(chain=>cluster.fork({ TARGET_CHAIN: chain }));
} else {
    runWorker();
}

async function runWorker(){
    const targetChain=process.env.TARGET_CHAIN;
    const config=NETWORKS[targetChain];
    if(!config) return;

    const provider=new ethers.JsonRpcProvider(config.rpc[0], config.chainId);
    const wallet=new ethers.Wallet(PRIVATE_KEY, provider);
    const trader=new TradeEngine(targetChain, PRIVATE_KEY, provider);
    const ai=new AIEngine();

    // Health server
    http.createServer((req,res)=>{
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({status:"ALIVE",chain:targetChain}));
    }).listen(8080+cluster.worker.id);

    // AI scan loop
    setInterval(async ()=>{
        const signals=await ai.scan();
        if(signals.length){
            for(const s of signals){
                const balance=await trader.getBalance();
                if(balance<MIN_BALANCE_THRESHOLD) continue;
                const amt=trader.determineTradeAmount(balance);
                await trader.executeTrade([s.ticker,"WETH"],amt,s.sentiment);
                ai.updateTrust(s.source,true);
            }
        }
    },5000);
}
