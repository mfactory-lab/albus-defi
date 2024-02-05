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
 * @category RemovePair
 * @category generated
 */
export const removePairStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number[] /* size: 8 */
}>(
  [['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)]],
  'RemovePairInstructionArgs',
)
/**
 * Accounts required by the _removePair_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] manager
 * @property [_writable_] pair
 * @property [_writable_] tokenA
 * @property [_writable_] tokenB
 * @category Instructions
 * @category RemovePair
 * @category generated
 */
export interface RemovePairInstructionAccounts {
  authority: web3.PublicKey
  manager: web3.PublicKey
  pair: web3.PublicKey
  tokenA: web3.PublicKey
  tokenB: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const removePairInstructionDiscriminator = [
  181, 42, 154, 249, 167, 123, 20, 81,
]

/**
 * Creates a _RemovePair_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RemovePair
 * @category generated
 */
export function createRemovePairInstruction(
  accounts: RemovePairInstructionAccounts,
  programId = new web3.PublicKey('BSP9GP7vACnCKxEXdqsDpGdnqMBafc6rtQozGwRkKqKH'),
) {
  const [data] = removePairStruct.serialize({
    instructionDiscriminator: removePairInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.manager,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.pair,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenA,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.tokenB,
      isWritable: true,
      isSigner: false,
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