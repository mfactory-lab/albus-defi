export const formatPct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
})

export function formatBalance(balance: number, precision = 5) {
  return balance > 0 ? balance.toFixed(precision) : 0
}
