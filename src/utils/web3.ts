/* eslint-disable n/prefer-global/buffer */
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import type { ConfirmOptions, Connection, PublicKeyInitData, Signer, TransactionInstruction } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'

import { PROGRAM_ID as METADATA_PROGRAM_ID, Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { type AnchorWallet } from 'solana-wallets-vue'
import type { Metaplex } from '@metaplex-foundation/js'
import { AnchorProvider } from '@project-serum/anchor'
import type { IUserToken } from '@/stores/user'

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export async function validateAddress(address: PublicKeyInitData): Promise<boolean> {
  try {
    const owner = new PublicKey(address)
    return PublicKey.isOnCurve(owner.toString())
  } catch (e) {
    return false
  }
}

export function getMetadataPDA(mint: PublicKeyInitData) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), new PublicKey(mint).toBuffer()],
    METADATA_PROGRAM_ID,
  )
  return publicKey
}

export async function getSolanaBalance(address: PublicKeyInitData, solanaConnection: Connection) {
  const solBalance = await solanaConnection.getBalance(new PublicKey(address))
  return solBalance / LAMPORTS_PER_SOL
}

/**
 * Get token balance by wallet
 */
export async function getTokenAccounts(wallet: PublicKeyInitData, solanaConnection: Connection): Promise<IUserToken[]> {
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    {
      filters: [
        { dataSize: 165 },
        { memcmp: { offset: 32, bytes: new PublicKey(wallet).toBase58() } },
      ],
    },
  )

  const nameMapping: any = { USDT: 'tether' }

  const result = await Promise.allSettled(
    accounts.map(async ({ account }) => {
      const data: any = account.data
      const balance = Number(data.parsed.info.tokenAmount.uiAmount)
      const isNFT = data.parsed.info.tokenAmount.decimals === 0

      const metadata = await Metadata.fromAccountAddress(solanaConnection, getMetadataPDA(data.parsed.info.mint))
      const symbol = sanitizeString(metadata.data.symbol)
      let name = sanitizeString(metadata.data.name)
      name = nameMapping[name] ?? name

      return {
        symbol,
        name,
        balance,
        mint: isNFT && data.parsed.info.mint,
      }
    }),
  ) as { status: 'fulfilled' | 'rejected'; value: IUserToken }[]

  const onlyFulfilled = (await result).filter(({ status, value }) => status === 'fulfilled' && value).map(({ value }) => value)
  return onlyFulfilled
}

/**
 * Remove all empty space, new line, etc. symbols
 * In some reason such symbols parsed back from Buffer looks weird
 * like "\x0000" instead of usual spaces.
 */
export function sanitizeString(str: string): string {
  return str.replace(/\0/g, '')
}

/**
 * Send and sign transaction
 */
export async function sendTransaction(
  connection: Connection,
  wallet: AnchorWallet,
  instructions: TransactionInstruction[],
  signers?: Signer[],
  opts?: ConfirmOptions,
) {
  if (!wallet?.publicKey) {
    throw new Error('Wallet is not connected')
  }

  let tx: Transaction = new Transaction().add(...instructions)
  tx.feePayer = wallet.publicKey
  tx.recentBlockhash = (
    await connection.getLatestBlockhash(opts?.preflightCommitment)
  ).blockhash

  tx = await wallet.signTransaction(tx)

  if (signers && signers.length > 0) {
    tx.partialSign(...signers)
  }

  // if (simulate) {
  // const simulation = await connection.simulateTransaction(tx)
  // console.log('TX Simulation:', simulation)
  // return simulation
  // }

  const rawTx = tx.serialize()

  const result = await connection.sendRawTransaction(rawTx, {
    skipPreflight: true,
    // preflightCommitment: DEFAULT_COMMITMENT,
  })

  console.log('TX(signature): ', result.toString())
  console.log('TX(base64): ', rawTx?.toString('base64'))

  return result
}

/**
 * get transaction fee
 */
export async function transactionFee(transaction: Transaction, connection: Connection) {
  const { value } = await connection.getFeeForMessage(
    transaction.compileMessage(),
    'confirmed',
  )
  return Number(value) / LAMPORTS_PER_SOL
}

export function newProvider(wallet: AnchorWallet, connection: Connection) {
  const opts = AnchorProvider.defaultOptions()
  return new AnchorProvider(
    connection,
    wallet,
    opts,
  )
}

/**
 * mint proof NFT
 */
export async function mintNFT(metaplex: Metaplex, symbol: string) {
  const { nft } = await metaplex.nfts().create({
    uri: 'http://localhost/metadata.json',
    name: 'ALBUS NFT',
    symbol,
    sellerFeeBasisPoints: 500,
  })
  return nft
}
