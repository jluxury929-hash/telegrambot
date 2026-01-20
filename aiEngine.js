const axios = require('axios');
const fs = require('fs');
const Sentiment = require('sentiment');
const { AI_SITES } = require('./config');

class AIEngine {
    constructor() {
        this.trustFile = "trust_scores.json";
        this.sentiment = new Sentiment();
        this.trustScores = this.loadTrust();
    }

    loadTrust() {
        if(fs.existsSync(this.trustFile)){
            try { return JSON.parse(fs.readFileSync(this.trustFile, 'utf8')); } 
            catch(e){ return { WEB_AI: 0.85 }; }
        }
        return { WEB_AI: 0.85 };
    }

    updateTrust(sourceName, success){
        let current = this.trustScores[sourceName] || 0.5;
        current = success ? Math.min(0.99, current*1.05) : Math.max(0.1, current*0.9);
        this.trustScores[sourceName] = current;
        fs.writeFileSync(this.trustFile, JSON.stringify(this.trustScores));
    }

    async scan(){
        const signals = [];
        for(const url of AI_SITES){
            try {
                const resp = await axios.get(url, { timeout: 4000 });
                const text = typeof resp.data === 'string' ? resp.data : JSON.stringify(resp.data);
                const analysis = this.sentiment.analyze(text);
                const tickers = text.match(/\$[A-Z]+/g);
                if(tickers && analysis.comparative > 0.1){
                    const ticker = tickers[0].replace('$','');
                    if(!signals.find(s=>s.ticker===ticker))
                        signals.push({ ticker, sentiment: analysis.comparative, source: "WEB_AI" });
                }
            } catch(e){ continue; }
        }
        return signals;
    }
}

module.exports = AIEngine;
