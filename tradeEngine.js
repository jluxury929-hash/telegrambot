const { ethers, Wallet, JsonRpcProvider, Interface } = require('ethers');
const SimulationEngine = require('./simulation');
const { RUNTIME, EXECUTOR_ADDRESS, PROFIT_RECIPIENTS, MIN_BALANCE_THRESHOLD, TOKENS } = require('./config');
const { sendUpdate } = require('./telegramBot');

class TradeEngine{
    constructor(networkName, privateKey, provider){
        this.networkName=networkName;
        this.provider=provider || new JsonRpcProvider();
        this.wallet=new Wallet(privateKey, this.provider);
        this.sim=new SimulationEngine();
    }

    async getBalance(){ return await this.provider.getBalance(this.wallet.address); }

    determineTradeAmount(balanceWei){
        if(!RUNTIME.flashLoanEnabled){
            if(RUNTIME.tradeSizingMode==="FIXED") return ethers.parseEther(RUNTIME.fixedAmountETH);
            if(RUNTIME.tradeSizingMode==="PERCENT") return balanceWei*BigInt(RUNTIME.walletPercent)/100n;
        }
        return balanceWei*85n/100n;
    }

    async executeTrade(path, amountWei, confidence){
        if(RUNTIME.simulationMode){
            const profit=this.sim.simulateTrade(path,amountWei,confidence,RUNTIME.bribePercent);
            sendUpdate(`[SIMULATION] ${path.join("->")} | Expected Profit: ${profit} ETH`);
            return profit;
        }
        const iface=new Interface(["function executeComplexPath(string[] path,uint256 amount) external payable"]);
        const data=iface.encodeFunctionData("executeComplexPath",[path,amountWei]);
        const tx={ to:EXECUTOR_ADDRESS, data, value:amountWei, gasLimit:1500000n };
        const signed=await this.wallet.signTransaction(tx);
        const res=await this.provider.sendTransaction(signed);
        await res.wait();
        sendUpdate(`[EXECUTED] ${path.join("->")} | Tx: ${res.hash}`);
        return res;
    }
}

module.exports=TradeEngine;
