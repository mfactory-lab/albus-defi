/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import { Ratio, ratioBeet } from '../types/Ratio'

/**
 * Arguments used to create {@link Pair}
 * @category Accounts
 * @category generated
 */
export type PairArgs = {
  authority: web3.PublicKey
  tokenA: web3.PublicKey
  tokenB: web3.PublicKey
  lockedAmount: beet.bignum
  ratio: Ratio
  isPaused: boolean
  lockFee: number
  unlockFee: number
  feeReceiver: web3.PublicKey
  policy: beet.COption<web3.PublicKey>
}

export const pairDiscriminator = [85, 72, 49, 176, 182, 228, 141, 82]
/**
 * Holds the data for the {@link Pair} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class Pair implements PairArgs {
  private constructor(
    readonly authority: web3.PublicKey,
    readonly tokenA: web3.PublicKey,
    readonly tokenB: web3.PublicKey,
    readonly lockedAmount: beet.bignum,
    readonly ratio: Ratio,
    readonly isPaused: boolean,
    readonly lockFee: number,
    readonly unlockFee: number,
    readonly feeReceiver: web3.PublicKey,
    readonly policy: beet.COption<web3.PublicKey>
  ) {}

  /**
   * Creates a {@link Pair} instance from the provided args.
   */
  static fromArgs(args: PairArgs) {
    return new Pair(
      args.authority,
      args.tokenA,
      args.tokenB,
      args.lockedAmount,
      args.ratio,
      args.isPaused,
      args.lockFee,
      args.unlockFee,
      args.feeReceiver,
      args.policy
    )
  }

  /**
   * Deserializes the {@link Pair} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [Pair, number] {
    return Pair.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link Pair} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<Pair> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(`Unable to find Pair account at ${address}`)
    }
    return Pair.fromAccountInfo(accountInfo, 0)[0]
  }

  /**
   * Provides a {@link web3.Connection.getProgramAccounts} config builder,
   * to fetch accounts matching filters that can be specified via that builder.
   *
   * @param programId - the program that owns the accounts we are filtering
   */
  static gpaBuilder(
    programId: web3.PublicKey = new web3.PublicKey(
      'JDe51ZjpQ3tZzL6QTVPHt5VT5NzaDuJnrTmJJUFrC3vm'
    )
  ) {
    return beetSolana.GpaBuilder.fromStruct(programId, pairBeet)
  }

  /**
   * Deserializes the {@link Pair} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [Pair, number] {
    return pairBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link Pair} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return pairBeet.serialize({
      accountDiscriminator: pairDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link Pair} for the provided args.
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   */
  static byteSize(args: PairArgs) {
    const instance = Pair.fromArgs(args)
    return pairBeet.toFixedFromValue({
      accountDiscriminator: pairDiscriminator,
      ...instance,
    }).byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link Pair} data from rent
   *
   * @param args need to be provided since the byte size for this account
   * depends on them
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    args: PairArgs,
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      Pair.byteSize(args),
      commitment
    )
  }

  /**
   * Returns a readable version of {@link Pair} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      authority: this.authority.toBase58(),
      tokenA: this.tokenA.toBase58(),
      tokenB: this.tokenB.toBase58(),
      lockedAmount: (() => {
        const x = <{ toNumber: () => number }>this.lockedAmount
        if (typeof x.toNumber === 'function') {
          try {
            return x.toNumber()
          } catch (_) {
            return x
          }
        }
        return x
      })(),
      ratio: this.ratio,
      isPaused: this.isPaused,
      lockFee: this.lockFee,
      unlockFee: this.unlockFee,
      feeReceiver: this.feeReceiver.toBase58(),
      policy: this.policy,
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const pairBeet = new beet.FixableBeetStruct<
  Pair,
  PairArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['authority', beetSolana.publicKey],
    ['tokenA', beetSolana.publicKey],
    ['tokenB', beetSolana.publicKey],
    ['lockedAmount', beet.u64],
    ['ratio', ratioBeet],
    ['isPaused', beet.bool],
    ['lockFee', beet.u16],
    ['unlockFee', beet.u16],
    ['feeReceiver', beetSolana.publicKey],
    ['policy', beet.coption(beetSolana.publicKey)],
  ],
  Pair.fromArgs,
  'Pair'
)
