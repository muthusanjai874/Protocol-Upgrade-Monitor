# Protocol Upgrade Monitor

Protocol Upgrade Monitor is an advanced monitoring and risk assessment dashboard for DeFi protocol upgrades. It leverages a powerful AI agent integrated with multiple real-time data sources to provide sophisticated traders and analysts with actionable insights. The application can assess technical, market, liquidity, and governance risks associated with upcoming blockchain events.

## Key Features

- **Multi-Factor Upgrade Risk Scoring**: Generates a comprehensive risk score (0-100) for protocol upgrades by analyzing on-chain data, governance proposals, market conditions, and user-defined risk tolerance.
- **Volatility Impact Prediction**: Simulates a GARCH model to forecast asset volatility in the days following a protocol upgrade, complete with confidence intervals.
- **Liquidity Shift Prediction**: Analyzes historical Total Value Locked (TVL) from DeFi Llama to predict potential liquidity movements and associated risks.
- **Real-time Sentiment Analysis**: Fetches and analyzes live tweets for any given topic or asset to determine market sentiment (Positive, Negative, Neutral) and provides a summary of key themes.
- **Live Network Metrics**: Displays live, auto-refreshing market data for major assets like Ethereum, including price, market cap, and 24-hour volume.
- **Data-Driven Execution Guidance**: Provides qualitative, actionable recommendations for trading strategies, portfolio rebalancing, and risk mitigation based on the AI's comprehensive analysis.

## System Architecture

Protocol Upgrade Monitor is a Next.js web application using a modern, server-centric architecture. The frontend (React Server and Client Components) interacts with a powerful AI backend built with Google's Genkit framework. This provides a robust and scalable solution for handling complex data analysis and user interactions.

### Frontend

- **Framework**: Next.js with React 18
- **Language**: TypeScript
- **UI Components**: ShadCN UI for a consistent and modern design system.
- **Styling**: Tailwind CSS for utility-first styling.
- **State Management**: React `useActionState` for handling form submissions and server-side state.

### AI Orchestration & Backend

- **AI Framework**: Genkit is used to define and orchestrate AI flows, manage prompts, and integrate external tools.
- **AI Model**: Google's Gemini model serves as the core reasoning engine.
- **Server Actions**: Next.js Server Actions act as the bridge between the client-side forms and the backend AI flows, handling data validation with `zod`.
- **External Services**: The application connects to various external APIs through a dedicated services layer to fetch real-time data for analysis.

## Data Sources

The AI agent is equipped with tools to connect to the following real-time data sources:

- **Blockchain Data**: Etherscan, PolygonScan, Arbiscan
- **Market Data**: CoinGecko API
- **DeFi Analytics**: DeFi Llama
- **Governance**: Snapshot API
- **Social Media**: Twitter API (with a sample data fallback)

## Getting Started

Follow these instructions to get a local copy of Protocol Upgrade Monitor up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- `npm` or `yarn` package manager

### 1. Installation

Clone the repository and install the dependencies.

```bash
git clone <repository-url>
cd protocol-upgrade-monitor
npm install
```

### 2. Environment Variables

This application requires API keys for some of its data sources. Create a `.env` file in the root of your project by copying the example:

```bash
cp .env.example .env
```

Now, open the `.env` file and add the following keys:

```
# Get a free key from https://etherscan.io/myapikey
# This key will work for Ethereum, Polygon, and Arbitrum.
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Get a Bearer Token from the Twitter/X Developer Portal with access to the v2 Recent Search endpoint.
# See: https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens
TWITTER_BEARER_TOKEN=YOUR_TWITTER_BEARER_TOKEN
```

**Note**: The DeFi Llama and Snapshot integrations do not require API keys. The Twitter integration will return sample data if no key is provided.

### 3. Running the Application

Once your environment variables are set, you can run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
