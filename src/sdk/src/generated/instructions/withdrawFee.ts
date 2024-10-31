/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
export type WithdrawFeeInstructionArgs = {
  amount: beet.bignum
}
/**
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
export const withdrawFeeStruct = new beet.BeetArgsStruct<
  WithdrawFeeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u64],
  ],
  'WithdrawFeeInstructionArgs'
)
/**
 * Accounts required by the _withdrawFee_ instruction
 *
 * @property [_writable_] pair
 * @property [_writable_] pairAuthority
 * @property [_writable_] destination
 * @property [_writable_, **signer**] authority
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
export type WithdrawFeeInstructionAccounts = {
  pair: web3.PublicKey
  pairAuthority: web3.PublicKey
  destination: web3.PublicKey
  authority: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const withdrawFeeInstructionDiscriminator = [
  14, 122, 231, 218, 31, 238, 223, 150,
]

/**
 * Creates a _WithdrawFee_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category WithdrawFee
 * @category generated
 */
export function createWithdrawFeeInstruction(
  accounts: WithdrawFeeInstructionAccounts,
  args: WithdrawFeeInstructionArgs,
  programId = new web3.PublicKey('JDe51ZjpQ3tZzL6QTVPHt5VT5NzaDuJnrTmJJUFrC3vm')
) {
  const [data] = withdrawFeeStruct.serialize({
    instructionDiscriminator: withdrawFeeInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.pair,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.pairAuthority,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.destination,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}