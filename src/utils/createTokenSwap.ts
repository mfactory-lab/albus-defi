import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { NodeWallet } from '@albus-finance/sdk'
import { AnchorProvider } from '@coral-xyz/anchor'
import { AlbusSwapClient, CurveType } from '@albus-finance/swap-sdk'

export enum PoolTokenSymbol {
  TOKEN_A = 'TOKEN_AA',
  TOKEN_B = 'TOKEN_BB',
}

const connection = new Connection('https://polished-damp-dust.solana-devnet.quiknode.pro/e3fdb5a9915e3c3c47709465b4b5fa9f0153b674')

function newProvider(keypair: Keypair) {
  const opts = AnchorProvider.defaultOptions()
  return new AnchorProvider(
    connection,
    new NodeWallet(keypair),
    opts,
  )
}

export async function createTokenSwap() {
  const payer = Keypair.fromSecretKey(bs58.decode(''))
  const provider = newProvider(payer)

  const user = Keypair.fromSecretKey(bs58.decode(''))

  const swapClient = new AlbusSwapClient(provider)

  const tokenSwap = Keypair.generate()
  console.log('[create swap] token swap pk = ', tokenSwap.publicKey.toBase58())
  console.log('[create swap] token swap sk = ', tokenSwap.secretKey.toString())
  const swapAuthority = swapClient.swapAuthority(tokenSwap.publicKey)
  console.log('[create swap] swapAuthority = ', swapAuthority.toBase58())

  // create mint accounts
  const tokenA = await createMint(provider.connection, payer, payer.publicKey, null, 9)
  console.log('[create swap] tokenA = ', tokenA.toBase58())
  const tokenB = await createMint(provider.connection, payer, payer.publicKey, null, 9)
  console.log('[create swap] tokenB = ', tokenB.toBase58())
  const poolMint = await createMint(provider.connection, payer, swapAuthority, null, 9)
  console.log('[create swap] poolMint = ', poolMint.toBase58())

  // create associated token accounts
  const poolFeeAccount = await getOrCreateAssociatedTokenAccount(provider.connection, payer, poolMint, payer.publicKey)
  console.log('[create swap] poolFeeAccount = ', poolFeeAccount)
  const swapTokenA = await getOrCreateAssociatedTokenAccount(provider.connection, payer, tokenA, swapAuthority, true)
  console.log('[create swap] swapTokenA = ', swapTokenA)
  const swapTokenB = await getOrCreateAssociatedTokenAccount(provider.connection, payer, tokenB, swapAuthority, true)
  console.log('[create swap] swapTokenB = ', swapTokenB)
  const userTokenA = await getOrCreateAssociatedTokenAccount(provider.connection, user, tokenA, user.publicKey)
  console.log('[create swap] userTokenA = ', userTokenA)
  const userTokenB = await getOrCreateAssociatedTokenAccount(provider.connection, user, tokenB, user.publicKey)
  console.log('[create swap] userTokenB = ', userTokenB)

  // initial balances
  await mintTo(provider.connection, payer, tokenA, swapTokenA.address, payer, 100_000_000_000)
  await mintTo(provider.connection, payer, tokenB, swapTokenB.address, payer, 100_000_000_000)
  await mintTo(provider.connection, payer, tokenA, userTokenA.address, payer, 13_000_000_000)

  const tokenSwapRes = await swapClient.createTokenSwap({
    tokenSwap,
    poolMint,
    poolFee: poolFeeAccount.address,
    destination: poolFeeAccount.address,
    tokenA: swapTokenA.address,
    tokenB: swapTokenB.address,
    policy: new PublicKey('CjnpmL6Svfr3Vhpp1jVWCcNbJRxbyPY5ZQF8QiNXWXtT'),
    curveType: CurveType.ConstantProduct,
    curveParameters: [],
    fees: {
      tradeFeeNumerator: 0,
      tradeFeeDenominator: 0,
      ownerTradeFeeNumerator: 0,
      ownerTradeFeeDenominator: 0,
      ownerWithdrawFeeNumerator: 0,
      ownerWithdrawFeeDenominator: 0,
      hostFeeNumerator: 0,
      hostFeeDenominator: 0,
    },
  })
  console.log('[create swap] tokenSwap result = ', tokenSwapRes)
}
