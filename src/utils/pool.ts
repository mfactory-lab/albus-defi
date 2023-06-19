import { AnchorProvider } from '@coral-xyz/anchor'
import { PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token'
import type { Connection } from '@solana/web3.js'
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import type { AnchorWallet } from 'solana-wallets-vue'

import { TOKEN_SWAP_PROGRAM_ID, TokenSwap } from '@/packages/swap/spl/src'

const keypair
  = Uint8Array.from([])

const decimals = 9

const initialSourceB = 1_000_000_000 * LAMPORTS_PER_SOL

let tokenSwap: TokenSwap

function newProvider(connection: Connection, wallet: AnchorWallet) {
  return new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions(),
  )
}

export async function initPool(
  connection: Connection,
  wallet: AnchorWallet,
) {
  const tokenSwapAccount = Keypair.generate()

  const _wallet = { ...wallet, secretKey: keypair }

  const provider = newProvider(connection, wallet)

  const initialSwapB = 10 ** decimals
  const initialSwapA = 10 * initialSwapB

  const tokenA = await createMint(
    connection,
    _wallet,
    _wallet.publicKey,
    null,
    decimals,
  )

  const tokenB = await createMint(
    connection,
    _wallet,
    _wallet.publicKey,
    null,
    6,
  )

  // PDA of tokenSwapAccount for token swap program
  const [swapAuthority] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    TOKEN_SWAP_PROGRAM_ID,
  )

  const tokenPool = await createMint(connection, _wallet, swapAuthority, null, decimals)

  const feeAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    _wallet,
    tokenPool,
    _wallet.publicKey,
  )

  const swapTokenPool = await getOrCreateAssociatedTokenAccount(
    connection,
    _wallet,
    tokenPool,
    _wallet.publicKey,
  )

  const swapTokenA = await getOrCreateAssociatedTokenAccount(
    connection,
    _wallet,
    tokenA,
    swapAuthority,
    true,
  )

  const swapTokenB = await getOrCreateAssociatedTokenAccount(
    connection,
    _wallet,
    tokenB,
    swapAuthority,
    true,
  )

  if (initialSwapA > 0) {
    console.log(`Minting ${initialSwapA} A tokens to "token_a"...`)
    await mintTo(connection, _wallet, tokenA, swapTokenA.address, _wallet, initialSwapA)
  }

  if (initialSwapB > 0) {
    console.log(`Minting ${initialSwapB} A tokens to "token_b"...`)
    await mintTo(connection, _wallet, tokenB, swapTokenB.address, _wallet, initialSwapB)
  }

  // Program signer authority
  const [authority] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    PROGRAM_ID,
  )

  await getOrCreateAssociatedTokenAccount(
    connection,
    _wallet,
    tokenA,
    authority,
    true,
  )

  const sourceTokenB = await getOrCreateAssociatedTokenAccount(
    connection,
    _wallet,
    tokenB,
    authority,
    true,
  )

  if (initialSourceB > 0) {
    console.log(`Minting ${initialSourceB} B tokens to "source_token_b"...`)
    await mintTo(connection, _wallet, tokenB, sourceTokenB.address, _wallet, initialSourceB)
  }

  try {
    const tx = await TokenSwap.createTokenSwap(
      connection,
      tokenSwapAccount,
      _wallet.publicKey,
      swapAuthority,
      swapTokenA.address,
      swapTokenB.address,
      tokenPool,
      feeAccount.address,
      swapTokenPool.address,
      TOKEN_SWAP_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    )

    try {
      await provider.sendAndConfirm(tx, [tokenSwapAccount])
    } catch (e) {
      console.log(e)
    }

    tokenSwap = await TokenSwap.loadTokenSwap(provider.connection, tokenSwapAccount.publicKey)

    console.log(`Token swap: ${tokenSwap.tokenSwap}`)
    console.log(`Token Pool mint: ${tokenPool}`)
    console.log(`Token A mint: ${tokenA}`)
    console.log(`Token B mint: ${tokenB}`)
    console.log(`Token A account: ${swapTokenA.address}`)
    console.log(`Token B account: ${swapTokenB.address}`)
    console.log(`Token pool account: ${swapTokenPool.address}`)
  } catch (e) {
    console.log(e)
  }
}

export async function mintToken(connection: Connection, wallet: AnchorWallet, mint: PublicKey) {
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from([]),
  )

  const sourceToken = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    mint,
    wallet.publicKey,
    true,
  )

  await mintTo(connection, keypair, mint, sourceToken.address, wallet.publicKey, 50 * LAMPORTS_PER_SOL)
}
