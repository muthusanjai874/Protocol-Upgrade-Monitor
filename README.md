# 🛡️ Protocol Upgrade Monitor

Protocol Upgrade Monitor is an advanced monitoring and risk assessment dashboard for DeFi protocol upgrades. It integrates real-time blockchain and market data with predictive models to provide traders and analysts with actionable insights.

The application assesses technical, market, liquidity, and governance risks associated with upcoming blockchain events and provides execution guidance for portfolio management.

---

## 🚀 Key Features

- **Multi-Factor Upgrade Risk Scoring**  
  Generates a comprehensive risk score (0–100) for protocol upgrades by analyzing:  
  - On-chain data  
  - Governance proposals  
  - Market conditions  
  - User-defined risk thresholds  

- **Volatility Impact Prediction**  
  Implements a GARCH(1,1) model to forecast asset volatility following protocol upgrades.  

- **Liquidity Shift Prediction**  
  Analyzes historical Total Value Locked (TVL) data to predict potential liquidity movements.  

- **Real-Time Sentiment Analysis**  
  Uses the Twitter API to analyze recent tweets for a given topic or asset and determine overall market sentiment.  

- **Live Network Metrics**  
  Displays live market data for major assets, including price, market cap, and 24-hour volume.  

- **Execution Guidance**  
  Provides recommendations for trading strategies, portfolio rebalancing, and risk mitigation.

---

## 🛠️ System Architecture

Protocol Upgrade Monitor uses a **decoupled frontend and backend architecture**:  

- **Frontend (Next.js)**  
  - React 18 with TypeScript  
  - Tailwind CSS for styling  
  - Server-Side Rendering (SSR) for fast, data-driven UI  

- **Backend (Python FastAPI)**  
  - Prediction endpoints for volatility and liquidity models  
  - Integrates blockchain and market APIs  

- **Data Sources**  
  - Blockchain: Etherscan, PolygonScan, Arbiscan  
  - Market: CoinGecko API  
  - DeFi Analytics: DeFi Llama  
  - Governance: Snapshot API  
  - Social Media: Twitter API  

---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js (v18 or later)  
- Python 3.9+ with `pip`  

### 🛠️ Setup

#### 1️⃣ Clone the repository
```bash
git clone https://github.com/muthusanjai874/Protocol-Upgrade-Monitor.git
cd Protocol-Upgrade-Monitor
```

#### 2️⃣ Install dependencies
```bash
# Frontend
npm install

# Backend
pip install -r backend/requirements.txt
```

#### 3️⃣ Configure Environment Variables
Copy the example file and set your API keys:
```bash
cp .env.example .env
```
Update `.env` with your credentials:
```
ETHERSCAN_API_KEY=your_etherscan_api_key
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
PYTHON_API_URL=http://127.0.0.1:8000
```

#### 4️⃣ Run the application
```bash
npm run dev
```
This starts the frontend on `http://localhost:9002` and backend on `http://127.0.0.1:8000`.

---

## 📖 Model Documentation

### Volatility Impact Model (GARCH)
Simulates a **GARCH(1,1)** model to forecast asset volatility post-upgrade.  

### Liquidity Shift Prediction
Predicts liquidity shifts using time series analysis on historical TVL data.  

### Governance Outcome Prediction
Classifies governance proposals as likely to pass, fail, or undecided based on voting data.  

### Sentiment Analysis
Analyzes social media posts to determine positive, negative, or neutral sentiment for upgrades.


