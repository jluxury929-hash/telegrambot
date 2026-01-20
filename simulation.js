const { formatEther } = require('ethers');

class SimulationEngine {
    constructor(){ this.logs=[]; }
    log(msg){ this.logs.push(msg); console.log("[SIM]", msg); }
    simulateTrade(path, amount, confidence, bribePercent){
        this.log(`Simulating: ${path.join("->")} | Amt: ${formatEther(amount)} ETH | AI confidence: ${confidence}% | Bribe: ${bribePercent}%`);
        const profit = Number(formatEther(amount))*(confidence/100)*0.02;
        this.log(`Expected profit: ${profit.toFixed(6)} ETH`);
        return profit;
    }
}

module.exports = SimulationEngine;
