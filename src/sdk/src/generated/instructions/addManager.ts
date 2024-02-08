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
 * @category Instructions
 * @category AddManager
 * @category generated
 */
export type AddManagerInstructionArgs = {
  key: web3.PublicKey
}
/**
 * @category Instructions
 * @category AddManager
 * @category generated
 */
export const addManagerStruct = new beet.BeetArgsStruct<
  AddManagerInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['key', beetSolana.publicKey],
  ],
  'AddManagerInstructionArgs'
)
/**
 * Accounts required by the _addManager_ instruction
 *
 * @property [_writable_, **signer**] authority
 * @property [] admin
 * @property [_writable_] manager
 * @category Instructions
 * @category AddManager
 * @category generated
 */
export type AddManagerInstructionAccounts = {
  authority: web3.PublicKey
  admin: web3.PublicKey
  manager: web3.PublicKey
  systemProgram?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const addManagerInstructionDiscriminator = [
  125, 38, 192, 212, 101, 91, 179, 16,
]

/**
 * Creates a _AddManager_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AddManager
 * @category generated
 */
export function createAddManagerInstruction(
  accounts: AddManagerInstructionAccounts,
  args: AddManagerInstructionArgs,
  programId = new web3.PublicKey('JDe51ZjpQ3tZzL6QTVPHt5VT5NzaDuJnrTmJJUFrC3vm')
) {
  const [data] = addManagerStruct.serialize({
    instructionDiscriminator: addManagerInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.authority,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: accounts.admin,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.manager,
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
