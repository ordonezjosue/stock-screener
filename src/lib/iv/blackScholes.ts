/**
 * Black-Scholes Options Pricing Model
 * Implements pricing and implied volatility calculation for European options
 */

export interface OptionParams {
  spot: number;      // Current stock price
  strike: number;    // Option strike price
  timeToExpiry: number; // Time to expiry in years
  riskFreeRate: number; // Risk-free interest rate (annual)
  volatility: number;   // Implied volatility
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionPrice {
  callPrice: number;
  putPrice: number;
  greeks: OptionGreeks;
}

/**
 * Calculate cumulative normal distribution
 */
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

/**
 * Error function approximation
 */
function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Calculate option price using Black-Scholes formula
 */
export function calculateOptionPrice(params: OptionParams): OptionPrice {
  const { spot, strike, timeToExpiry, riskFreeRate, volatility } = params;
  
  if (timeToExpiry <= 0) {
    throw new Error('Time to expiry must be positive');
  }

  const d1 = (Math.log(spot / strike) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
  const d2 = d1 - volatility * Math.sqrt(timeToExpiry);

  const callPrice = spot * normalCDF(d1) - strike * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2);
  const putPrice = strike * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2) - spot * normalCDF(-d1);

  // Calculate Greeks
  const greeks: OptionGreeks = {
    delta: {
      call: normalCDF(d1),
      put: normalCDF(d1) - 1
    },
    gamma: normalCDF(d1) / (spot * volatility * Math.sqrt(timeToExpiry)),
    theta: {
      call: (-spot * normalCDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) - riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2),
      put: (-spot * normalCDF(d1) * volatility) / (2 * Math.sqrt(timeToExpiry)) + riskFreeRate * strike * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2)
    },
    vega: spot * Math.sqrt(timeToExpiry) * normalCDF(d1),
    rho: {
      call: strike * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(d2),
      put: -strike * timeToExpiry * Math.exp(-riskFreeRate * timeToExpiry) * normalCDF(-d2)
    }
  };

  return {
    callPrice,
    putPrice,
    greeks
  };
}

/**
 * Calculate implied volatility using Newton-Raphson method
 */
export function calculateIV(
  optionPrice: number,
  params: Omit<OptionParams, 'volatility'>,
  optionType: 'call' | 'put',
  tolerance: number = 0.0001,
  maxIterations: number = 100
): number {
  let volatility = 0.5; // Initial guess
  let iteration = 0;

  while (iteration < maxIterations) {
    const currentParams: OptionParams = { ...params, volatility };
    const currentPrice = calculateOptionPrice(currentParams);
    
    const targetPrice = optionType === 'call' ? currentPrice.callPrice : currentPrice.putPrice;
    const priceDiff = targetPrice - optionPrice;

    if (Math.abs(priceDiff) < tolerance) {
      return volatility;
    }

    // Calculate vega for Newton-Raphson step
    const vega = currentPrice.greeks.vega;
    
    if (Math.abs(vega) < 1e-10) {
      throw new Error('Vega too small, cannot calculate IV');
    }

    // Newton-Raphson update
    volatility = volatility - priceDiff / vega;

    // Ensure volatility stays positive
    if (volatility <= 0) {
      volatility = 0.01;
    }

    // Ensure volatility doesn't explode
    if (volatility > 5) {
      volatility = 5;
    }

    iteration++;
  }

  throw new Error(`Failed to converge after ${maxIterations} iterations`);
}

/**
 * Calculate implied volatility for put options (most common for credit spreads)
 */
export function calculatePutIV(
  putPrice: number,
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: number = 0.05
): number {
  return calculateIV(putPrice, { spot, strike, timeToExpiry, riskFreeRate }, 'put');
}

/**
 * Calculate implied volatility for call options
 */
export function calculateCallIV(
  callPrice: number,
  spot: number,
  strike: number,
  timeToExpiry: number,
  riskFreeRate: number = 0.05
): number {
  return calculateIV(callPrice, { spot, strike, timeToExpiry, riskFreeRate }, 'call');
}

/**
 * Calculate days to expiry from expiration date
 */
export function calculateDTE(expirationDate: Date): number {
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Convert days to years for Black-Scholes calculation
 */
export function daysToYears(days: number): number {
  return days / 365.25;
}

/**
 * Calculate probability of profit for a put credit spread
 */
export function calculatePOP(
  shortStrike: number,
  longStrike: number,
  currentPrice: number,
  volatility: number,
  timeToExpiry: number
): number {
  const d1 = (Math.log(currentPrice / shortStrike) + (0.05 + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * Math.sqrt(timeToExpiry));
  return normalCDF(d1);
}

/**
 * Calculate maximum risk and reward for a put credit spread
 */
export function calculateSpreadRiskReward(
  shortStrike: number,
  longStrike: number,
  credit: number
): { maxRisk: number; maxReward: number; riskRewardRatio: number } {
  const spreadWidth = shortStrike - longStrike;
  const maxRisk = spreadWidth - credit;
  const maxReward = credit;
  const riskRewardRatio = maxRisk / maxReward;

  return {
    maxRisk,
    maxReward,
    riskRewardRatio
  };
}
