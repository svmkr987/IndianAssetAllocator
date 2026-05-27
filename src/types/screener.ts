export interface ScoreResult {
    totalPoints: number;
    verdict: string;
    verdictColor: string;
    details: {
        category: string;
        metrics: {
            name: string;
            value: string | null;
            passed: boolean;
            description: string;
        }[];
    }[];
}

export interface Metric {
    name: string;
    value: string | number | null;
    label?: string;
    suffix?: string;
}

export interface StockData {
    symbol: string;
    ticker: string;
    error?: string;
    quote?: any;
    quoteSummary?: any;
    chart?: any;
}
