'use server';

import fetch from 'node-fetch';

const API_URLS: Record<string, string> = {
    'Ethereum': 'https://api.etherscan.io/api',
    'Polygon': 'https://api.polygonscan.com/api',
    'Arbitrum': 'https://api.arbiscan.io/api',
    'Bitcoin': '',
    'Solana': '',
};

export async function getContractInfo(network: string, address: string) {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
        return { error: 'ETHERSCAN_API_KEY environment variable not set. Please add it to your .env file.' };
    }

    const baseUrl = API_URLS[network];
    if (!baseUrl) {
        return { error: `The network "${network}" is not supported by this tool.` };
    }

    try {
        const sourceCodeResponse = await fetch(`${baseUrl}?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`);
        const sourceCodeData: any = await sourceCodeResponse.json();

        if (sourceCodeData.status === '0') {
             throw new Error(sourceCodeData.result || 'Failed to fetch contract source code.');
        }

        const txCountResponse = await fetch(`${baseUrl}?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=${apiKey}`);
        const txCountData: any = await txCountResponse.json();
        
        const txCount = txCountData.result ? parseInt(txCountData.result, 16) : 0;

        const isVerified = sourceCodeData.result[0].SourceCode !== '';

        return {
            address: address,
            isVerified: isVerified,
            contractName: sourceCodeData.result[0].ContractName || 'N/A',
            transactionCount: txCount,
        };

    } catch (error: any) {
        console.error("Error fetching from Etherscan API:", error);
        return {
            error: error.message || `An unknown error occurred while fetching contract info for ${address} on ${network}.`
        };
    }
}
