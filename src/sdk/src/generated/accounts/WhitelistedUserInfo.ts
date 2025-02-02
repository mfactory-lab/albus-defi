/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beetSolana from '@metaplex-foundation/beet-solana'
import * as beet from '@metaplex-foundation/beet'

/**
 * Arguments used to create {@link WhitelistedUserInfo}
 * @category Accounts
 * @category generated
 */
export type WhitelistedUserInfoArgs = {
  user: web3.PublicKey
  pair: web3.PublicKey
}

export const whitelistedUserInfoDiscriminator = [
  17, 50, 115, 0, 10, 220, 15, 157,
]
/**
 * Holds the data for the {@link WhitelistedUserInfo} Account and provides de/serialization
 * functionality for that data
 *
 * @category Accounts
 * @category generated
 */
export class WhitelistedUserInfo implements WhitelistedUserInfoArgs {
  private constructor(
    readonly user: web3.PublicKey,
    readonly pair: web3.PublicKey
  ) {}

  /**
   * Creates a {@link WhitelistedUserInfo} instance from the provided args.
   */
  static fromArgs(args: WhitelistedUserInfoArgs) {
    return new WhitelistedUserInfo(args.user, args.pair)
  }

  /**
   * Deserializes the {@link WhitelistedUserInfo} from the data of the provided {@link web3.AccountInfo}.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static fromAccountInfo(
    accountInfo: web3.AccountInfo<Buffer>,
    offset = 0
  ): [WhitelistedUserInfo, number] {
    return WhitelistedUserInfo.deserialize(accountInfo.data, offset)
  }

  /**
   * Retrieves the account info from the provided address and deserializes
   * the {@link WhitelistedUserInfo} from its data.
   *
   * @throws Error if no account info is found at the address or if deserialization fails
   */
  static async fromAccountAddress(
    connection: web3.Connection,
    address: web3.PublicKey,
    commitmentOrConfig?: web3.Commitment | web3.GetAccountInfoConfig
  ): Promise<WhitelistedUserInfo> {
    const accountInfo = await connection.getAccountInfo(
      address,
      commitmentOrConfig
    )
    if (accountInfo == null) {
      throw new Error(
        `Unable to find WhitelistedUserInfo account at ${address}`
      )
    }
    return WhitelistedUserInfo.fromAccountInfo(accountInfo, 0)[0]
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
    return beetSolana.GpaBuilder.fromStruct(programId, whitelistedUserInfoBeet)
  }

  /**
   * Deserializes the {@link WhitelistedUserInfo} from the provided data Buffer.
   * @returns a tuple of the account data and the offset up to which the buffer was read to obtain it.
   */
  static deserialize(buf: Buffer, offset = 0): [WhitelistedUserInfo, number] {
    return whitelistedUserInfoBeet.deserialize(buf, offset)
  }

  /**
   * Serializes the {@link WhitelistedUserInfo} into a Buffer.
   * @returns a tuple of the created Buffer and the offset up to which the buffer was written to store it.
   */
  serialize(): [Buffer, number] {
    return whitelistedUserInfoBeet.serialize({
      accountDiscriminator: whitelistedUserInfoDiscriminator,
      ...this,
    })
  }

  /**
   * Returns the byteSize of a {@link Buffer} holding the serialized data of
   * {@link WhitelistedUserInfo}
   */
  static get byteSize() {
    return whitelistedUserInfoBeet.byteSize
  }

  /**
   * Fetches the minimum balance needed to exempt an account holding
   * {@link WhitelistedUserInfo} data from rent
   *
   * @param connection used to retrieve the rent exemption information
   */
  static async getMinimumBalanceForRentExemption(
    connection: web3.Connection,
    commitment?: web3.Commitment
  ): Promise<number> {
    return connection.getMinimumBalanceForRentExemption(
      WhitelistedUserInfo.byteSize,
      commitment
    )
  }

  /**
   * Determines if the provided {@link Buffer} has the correct byte size to
   * hold {@link WhitelistedUserInfo} data.
   */
  static hasCorrectByteSize(buf: Buffer, offset = 0) {
    return buf.byteLength - offset === WhitelistedUserInfo.byteSize
  }

  /**
   * Returns a readable version of {@link WhitelistedUserInfo} properties
   * and can be used to convert to JSON and/or logging
   */
  pretty() {
    return {
      user: this.user.toBase58(),
      pair: this.pair.toBase58(),
    }
  }
}

/**
 * @category Accounts
 * @category generated
 */
export const whitelistedUserInfoBeet = new beet.BeetStruct<
  WhitelistedUserInfo,
  WhitelistedUserInfoArgs & {
    accountDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['accountDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['user', beetSolana.publicKey],
    ['pair', beetSolana.publicKey],
  ],
  WhitelistedUserInfo.fromArgs,
  'WhitelistedUserInfo'
)
