import * as BufferLayout from '@solana/buffer-layout'

/**
 * Layout for a public key
 */
export const publicKey = (property = 'publicKey') => {
  return BufferLayout.blob(32, property)
}

export const TokenSwapLayout = BufferLayout.struct<any>([
  BufferLayout.u8('version'),
  BufferLayout.u8('isInitialized'),
  BufferLayout.u8('bumpSeed'),
  publicKey('tokenProgramId'),
  publicKey('tokenAccountA'),
  publicKey('tokenAccountB'),
  publicKey('tokenPool'),
  publicKey('mintA'),
  publicKey('mintB'),
  publicKey('feeAccount'),
  BufferLayout.nu64('tradeFeeNumerator'),
  BufferLayout.nu64('tradeFeeDenominator'),
  BufferLayout.nu64('ownerTradeFeeNumerator'),
  BufferLayout.nu64('ownerTradeFeeDenominator'),
  BufferLayout.nu64('ownerWithdrawFeeNumerator'),
  BufferLayout.nu64('ownerWithdrawFeeDenominator'),
  BufferLayout.nu64('hostFeeNumerator'),
  BufferLayout.nu64('hostFeeDenominator'),
  BufferLayout.u8('curveType'),
  BufferLayout.blob(32, 'curveParameters'),
])

export const CurveType = Object.freeze({
  ConstantProduct: 0, // Constant product curve, Uniswap-style
  ConstantPrice: 1, // Constant price curve, always X amount of A token for 1 B token, where X is defined at init
  Offset: 3, // Offset curve, like Uniswap, but with an additional offset on the token B side
})
