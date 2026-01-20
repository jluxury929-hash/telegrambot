const { parseEther } = require('ethers');

module.exports = {
    OWNER_ADDRESS: "0xE86f5d6ECDfCD2D7463414948f41d32EDC8D4AE4",
    PROFIT_RECIPIENTS: [
        "0x5e9c92adbdf15d3c71a20da0b0c5a2ff0af51758",
        "0x2b5e2339132aacd0fcbd6fc13013b2b46405c899"
    ],
    OPERATOR_ADDRESS: "0x86303b3FB8369556b376365EE9740E5fA63510Cf",
    EXECUTOR_ADDRESS: process.env.EXECUTOR_ADDRESS,

    NETWORKS: {
        ETHEREUM: { chainId: 1, rpc: [process.env.ETH_RPC], wss: [process.env.ETH_WSS], relay: "https://relay.flashbots.net", moat: "0.005", priority: "2.0", isL2: false },
        BASE: { chainId: 8453, rpc: [process.env.BASE_RPC], wss: [process.env.BASE_WSS], moat: "0.001", priority: "0.1", isL2: true },
        ARBITRUM: { chainId: 42161, rpc: [process.env.ARBITRUM_RPC], wss: [process.env.ARBITRUM_WSS], moat: "0.002", priority: "0.1", isL2: true },
        POLYGON: { chainId: 137, rpc: [process.env.POLYGON_RPC], wss: [process.env.POLYGON_WSS], moat: "0.001", priority: "35.0", isL2: true }
    },

    TOKENS: {
        WETH: "0x4200000000000000000000000000000000000006",
        USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    },

    RUNTIME: {
        flashLoanEnabled: true,
        tradeSizingMode: "AI", // FIXED | PERCENT | AI
        fixedAmountETH: "0.1",
        walletPercent: 30,
        bribePercent: 55,
        simulationMode: true
    },

    MIN_BALANCE_THRESHOLD: parseEther("0.001"),
    AI_SITES: ["https://api.crypto-ai-signals.com/v1/latest","https://top-trading-ai-blog.com/alerts"]
};
