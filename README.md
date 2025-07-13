# 🛡️ Protocol Upgrade Monitor

Protocol Upgrade Monitor is an advanced monitoring and risk assessment dashboard for DeFi protocol upgrades. It integrates real-time blockchain and market data with predictive models to provide sophisticated traders and analysts with actionable insights.

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
  Uses a GARCH(1,1) model to forecast asset volatility in the days following a protocol upgrade.  

- **Liquidity Shift Prediction**  
  Fetches and analyzes historical Total Value Locked (TVL) data to predict potential liquidity movements and risks.  

- **Real-Time Sentiment Analysis**  
  Integrates with the Twitter API to analyze recent tweets for any given topic or asset and determine market sentiment (Positive, Negative, Neutral).  

- **Live Network Metrics**  
  Displays live, auto-refreshing market data for major assets like Ethereum, including price, market cap, and 24-hour volume.  

- **Data-Driven Execution Guidance**  
  Provides actionable recommendations for trading strategies, portfolio rebalancing, and risk mitigation based on backend analysis.

---

## 🛠️ System Architecture

Protocol Upgrade Monitor uses a **decoupled frontend and backend architecture** for scalability and performance:  

- **Frontend (Next.js)**  
  - Built with React 18 and TypeScript  
  - Server-Side Rendering (SSR) and Server Actions for a fast, data-driven UI  
  - Tailwind CSS for modern styling  

- **AI Orchestration (Google Genkit)**
  - Manages prompts and calls to the AI model (Gemini).
  - Orchestrates calls to external data sources and the application's own Python backend via tools.

- **Backend (Python FastAPI)**  
  - Handles specialized computational tasks.
  - Implements a simulated GARCH model for volatility forecasting.

- **Data Sources**  
  - Blockchain Data: Etherscan, PolygonScan, Arbiscan  
  - Market Data: CoinGecko API  
  - DeFi Analytics: DeFi Llama  
  - Governance: Snapshot API  
  - Social Media: Twitter API  

---

## 📁 Project Structure

.
├── backend/ # Python FastAPI backend
│ ├── main.py # Prediction endpoints
│ └── requirements.txt # Python dependencies
│
├── src/ # Next.js frontend
│ ├── app/
│ │ ├── page.tsx # Dashboard entry point
│ │ └── actions.ts # Server actions for backend API calls
│ │
│ ├── ai/
│ │ ├── flows/ # Genkit AI flows
│ │ ├── services/ # External API service wrappers
│ │ └── tools/ # Genkit tools
│ │
│ ├── components/ # UI components (dashboard, charts, forms)
│ └── lib/ # Utility functions
│
├── .env.example # Environment variables template
├── README.md # Project documentation
└── ...

---

## ⚙️ Getting Started

### 📦 Prerequisites

- Node.js (v18 or later)
- Python 3.9+ with `pip`
- npm or yarn

### 🛠️ Setup

#### 1️⃣ Clone the repository

```bash
git clone <repository-url>
cd protocol-upgrade-monitor
```

#### 2️⃣ Install Dependencies

Install both the Node.js and Python dependencies.

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r backend/requirements.txt
```

#### 3️⃣ Environment Variables
Create a `.env` file in the root of your project by copying the example:

```bash
cp .env.example .env
```
Now, open the `.env` file and add the following API keys. This application requires at least an Etherscan API key to assess technical risk. The Twitter integration will return sample data if no key is provided.

```
# Get a free key from https://etherscan.io/myapikey
# This key will work for Ethereum, Polygon, and Arbitrum.
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Get a Bearer Token from the Twitter/X Developer Portal with access to the v2 Recent Search endpoint.
# See: https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens
TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER_TOKEN

# This variable is used by the frontend to connect to the Python backend.
# The default value is for local development and usually does not need to be changed.
PYTHON_API_URL=http://127.0.0.1:8000
```

#### 4️⃣ Run the Application
Start both the frontend and backend servers concurrently.

```bash
npm run dev
```
This will start the Next.js app on `http://localhost:9002` and the Python backend on `http://localhost:8000`.

---

## 📖 Model Documentation

This section provides the mathematical formulations and implementation details for the predictive models used within the application.

### 1. Volatility Impact Model (GARCH)

**Mathematical Formulation:**

The application simulates a **GARCH(1,1)** model (Generalized Autoregressive Conditional Heteroskedasticity) to forecast asset volatility. The GARCH(1,1) model is defined by the following equations:

1.  **Mean Equation:**  
    *   *r*<sub>t</sub> = *μ* + *ε*<sub>t</sub>  
    where *r*<sub>t</sub> is the asset return at time *t*, *μ* is the average return, and *ε*<sub>t</sub> is the error term.

2.  **Error Term:**  
    *   *ε*<sub>t</sub> = *σ*<sub>t</sub> *z*<sub>t</sub>  
    where *z*<sub>t</sub> is a standard normal random variable (mean 0, variance 1).

3.  **Variance Equation:**  
    *   *σ*<sub>t</sub><sup>2</sup> = *ω* + *α* *ε*<sub>t-1</sub><sup>2</sup> + *β* *σ*<sub>t-1</sub><sup>2</sup>  
    where:
    *   *σ*<sub>t</sub><sup>2</sup> is the conditional variance (volatility) at time *t*.
    *   *ω* is the long-run average variance.
    *   *α* is the "ARCH" term, representing the weight given to the previous period's squared error (market shock).
    *   *β* is the "GARCH" term, representing the weight given to the previous period's variance (volatility persistence).

**Implementation Details:**

*   **File:** `backend/main.py`
*   **Endpoint:** `/predict_volatility`
*   **Logic:** The Python FastAPI backend implements a **simulation** of the GARCH(1,1) process. Instead of fitting the model to historical data (which would require a large dataset and statistical libraries), it generates a realistic volatility forecast based on user inputs.
*   The `upgradeDescription` provided by the user is used to set a `base_volatility` (*ω*). Contentious terms like "hard fork" result in a higher base volatility.
*   The model then iteratively generates a series of `predictionWindow` daily volatility forecasts, simulating market shocks and the persistence of volatility, which are characteristic of GARCH models.
*   The output includes the predicted volatility series, simulated model accuracy, and confidence intervals.

### 2. Liquidity Shift Prediction (Time Series Analysis)

**Conceptual Model:**

Liquidity prediction is modeled as a time series forecasting problem, conceptually similar to **ARIMA** (Autoregressive Integrated Moving Average) or **Prophet** models. The goal is to predict future Total Value Locked (TVL) based on its historical trends and seasonality.

**Implementation Details:**

*   **File:** `src/ai/flows/liquidity-shift-prediction.ts`
*   **Tool:** `getHistoricalTvlTool` (which calls the DeFi Llama API).
*   **Logic:** This prediction is handled entirely by the Genkit AI flow.
    1.  The `predictLiquidityShift` flow calls the `getHistoricalTvlTool` to fetch the last 30 days of TVL data for a given protocol from DeFi Llama.
    2.  This historical data is passed to the Gemini AI model.
    3.  The AI is prompted to act as a financial analyst performing time series analysis. It identifies trends, seasonality, and key turning points in the historical TVL data to generate a qualitative forecast for the user-specified timeframe.

### 3. Governance Outcome Prediction (Classification)

**Conceptual Model:**

This is treated as a **binary or multi-class classification problem**, similar to what could be solved with **Logistic Regression** or a **Random Forest** model. The model predicts a proposal's outcome ("Likely to Pass", "Likely to Fail", "Too Close to Call") based on various features.

**Implementation Details:**

*   **File:** `src/ai/flows/governance-outcome-prediction.ts`
*   **Tool:** `getSnapshotProposalTool` (which calls the Snapshot API).
*   **Logic:** This is an AI-driven classification.
    1.  The `predictGovernanceOutcome` flow uses the `getSnapshotProposalTool` to fetch live data for a specific proposal ID from Snapshot.org.
    2.  The data (current votes, vote distribution, time remaining, etc.) is passed to the Gemini AI model.
    3.  The AI is prompted to act as a governance analyst. It weighs the input features (e.g., high total voting power for "For" vs. "Against") to classify the proposal's likely outcome and provide a confidence score and reasoning.

### 4. Sentiment Analysis (NLP)

**Conceptual Model:**

This feature uses Natural Language Processing (NLP) models, conceptually similar to **BERT** or other transformers, to perform sentiment analysis on text data. The model classifies text as "positive", "negative", or "neutral".

**Implementation Details:**

*   **File:** `src/ai/flows/sentiment-analysis-integration.ts`
*   **Tool:** `getTweetsTool` (which calls the Twitter API).
*   **Logic:** This is an AI-driven NLP task.
    1.  The `analyzeTweetSentiment` flow calls the `getTweetsTool` to fetch recent tweets related to a topic.
    2.  The text of these tweets is passed to the Gemini AI model.
    3.  The AI is prompted to analyze each tweet, classify its sentiment, and provide a brief justification.
    4.  Finally, it aggregates the individual sentiments into an overall sentiment score for the topic, along with a summary of key themes.
