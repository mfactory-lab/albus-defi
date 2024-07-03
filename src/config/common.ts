export const TELEGRAM_OFICIAL_URL = ''
export const TELEGRAM_URL = 'https://t.me/albusprotocol'
export const TWITTER_URL = 'https://twitter.com/AlbusProtocol'
export const DISCORD_URL = ''

export const API_COLLECTOR_URL = 'https://api.thevalidators.io'
export const ALBUS_APP_URL = import.meta.env.VITE_ALBUS_APP_URL || (import.meta.env.DEV && 'https://dev.app.albus.finance') || 'https://app.albus.finance'
export const DEV_POOLS_API_URL = 'https://api.dev.defi.albus.finance'
export const MAIN_POOLS_API_URL = 'https://api.defi.albus.finance'

export const RENT_FEE = 0.00203928
export const MIN_TRANSFER_FEE = 0.00203928
// TODO: where from 0.0000016
export const TRANSFER_FEE_CONST = 0.0000016
export const MIN_FEE = 0.000005
// LP token decimals; TODO: in calculate get from pool mint
export const LP_DECIMALS = 9

export const PASSWORD_PROTECT = import.meta.env.VITE_PASSWORD_PROTECT
