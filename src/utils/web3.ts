/* eslint-disable n/prefer-global/buffer */
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import type { Connection, PublicKeyInitData } from '@solana/web3.js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PROGRAM_ID as METADATA_PROGRAM_ID, Metadata } from '@metaplex-foundation/mpl-token-metadata'
import type { IUserToken } from '@/stores/user'

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
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
      if (isNFT) {
        return
      }
      const metadata = await Metadata.fromAccountAddress(solanaConnection, getMetadataPDA(data.parsed.info.mint))
      const symbol = sanitizeString(metadata.data.symbol)
      let name = sanitizeString(metadata.data.name)
      name = nameMapping[name] ?? name

      return {
        symbol,
        name,
        balance,
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
