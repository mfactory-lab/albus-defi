/* eslint-disable n/prefer-global/buffer */
import type { ConfirmOptions, Connection, ParsedAccountData, PublicKeyInitData, Signer, TransactionInstruction } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

import { PROGRAM_ID as METADATA_PROGRAM_ID, Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { type AnchorWallet } from 'solana-wallets-vue'
import type { Address } from '@coral-xyz/anchor'
import { AnchorProvider } from '@coral-xyz/anchor'
import {
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  TokenInvalidAccountOwnerError,
  createAssociatedTokenAccountInstruction,
  getAccount, getAssociatedTokenAddress,
} from '@solana/spl-token'
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
      const decimals = data.parsed.info.tokenAmount.decimals

      try {
        const metadata = await Metadata.fromAccountAddress(solanaConnection, getMetadataPDA(data.parsed.info.mint))
        const symbol = sanitizeString(metadata.data.symbol)
        let name = sanitizeString(metadata.data.name)
        name = nameMapping[name] ?? name
        return {
          symbol,
          name,
          balance,
          decimals,
          mint: data.parsed.info.mint,
        }
      } catch (e) {
        return {
          balance,
          decimals,
          mint: data.parsed.info.mint,
        }
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

export async function createTransaction(
  pubkey: PublicKeyInitData,
  address: PublicKeyInitData,
  value: number,
  connection: Connection): Promise<Transaction> {
  const provider = new PublicKey(pubkey)
  const recieverWallet = new PublicKey(address)

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: provider,
      toPubkey: recieverWallet,
      lamports: Number(value) * LAMPORTS_PER_SOL,
    }),
  )

  const blockhash = (await connection.getLatestBlockhash('finalized')).blockhash
  transaction.recentBlockhash = blockhash
  transaction.feePayer = new PublicKey(pubkey)

  return transaction
}

export async function getTokensByOwner(connection: Connection, owner: PublicKey, mints?: Address[]): Promise<Array<{
  address: PublicKey
  mint: PublicKey
  amount: string
  balance: number
  decimals: number
}>> {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  })

  mints = mints?.map(a => String(a))
  return tokens.value.reduce((acc, t) => {
    const { tokenAmount, mint } = t.account.data.parsed?.info
    if (mints && !mints.includes(String(mint))) {
      return acc
    }
    acc.push({
      address: new PublicKey(t.pubkey),
      // amount: Number.parseInt(tokenAmount?.amount ?? 0, 10),
      amount: tokenAmount?.amount,
      balance: tokenAmount?.uiAmount,
      decimals: tokenAmount?.decimals,
      mint: new PublicKey(mint),
    })
    return acc
  }, [] as any)
}

export async function getOrInitAssociatedTokenAddress(
  connection: Connection,
  transaction: Transaction,
  mint: PublicKey,
  owner: PublicKey,
  payer?: PublicKey,
) {
  const associatedToken = await getAssociatedTokenAddress(mint, owner)
  try {
    await getAccount(connection, associatedToken)
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError || error instanceof TokenInvalidAccountOwnerError) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer ?? owner,
          associatedToken,
          owner,
          mint,
        ),
      )
    }
  }
  return associatedToken
}

export async function getNumberDecimals(connection: Connection, mintAddress: string): Promise<number> {
  const info = await connection.getParsedAccountInfo(new PublicKey(mintAddress))
  const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number
  return result
}
