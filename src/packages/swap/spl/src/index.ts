import { Buffer } from 'node:buffer'
import * as BufferLayout from '@solana/buffer-layout'
import type { Connection, Keypair } from '@solana/web3.js'
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import BN from 'bn.js'
import { TokenSwapLayout } from './layout'
import { loadAccount } from './util/account'

export * from './layout'

export const TOKEN_SWAP_PROGRAM_ID: PublicKey = new PublicKey(
  'SwapsVeCiPHMUAtzQWZw7RjsKjgCjhwU55QGu4U1Szw',
)

export const OLD_TOKEN_SWAP_PROGRAM_ID: PublicKey = new PublicKey(
  'SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8',
)

/**
 * A program to exchange tokens against a pool of liquidity
 */
export class TokenSwap {
  constructor(
    private readonly connection: Connection,
    public tokenSwap: PublicKey,
    public swapProgramId: PublicKey,
    public tokenProgramId: PublicKey,
    public poolToken: PublicKey,
    public feeAccount: PublicKey,
    public authority: PublicKey,
    public tokenAccountA: PublicKey,
    public tokenAccountB: PublicKey,
    public mintA: PublicKey,
    public mintB: PublicKey,
    public tradeFeeNumerator: number | BN,
    public tradeFeeDenominator: number | BN,
    public ownerTradeFeeNumerator: number | BN,
    public ownerTradeFeeDenominator: number | BN,
    public ownerWithdrawFeeNumerator: number | BN,
    public ownerWithdrawFeeDenominator: number | BN,
    public hostFeeNumerator: number | BN,
    public hostFeeDenominator: number | BN,
    public curveType: number,
  ) {
    this.connection = connection
    this.tokenSwap = tokenSwap
    this.swapProgramId = swapProgramId
    this.tokenProgramId = tokenProgramId
    this.poolToken = poolToken
    this.feeAccount = feeAccount
    this.authority = authority
    this.tokenAccountA = tokenAccountA
    this.tokenAccountB = tokenAccountB
    this.mintA = mintA
    this.mintB = mintB
    this.tradeFeeNumerator = tradeFeeNumerator
    this.tradeFeeDenominator = tradeFeeDenominator
    this.ownerTradeFeeNumerator = ownerTradeFeeNumerator
    this.ownerTradeFeeDenominator = ownerTradeFeeDenominator
    this.ownerWithdrawFeeNumerator = ownerWithdrawFeeNumerator
    this.ownerWithdrawFeeDenominator = ownerWithdrawFeeDenominator
    this.hostFeeNumerator = hostFeeNumerator
    this.hostFeeDenominator = hostFeeDenominator
    this.curveType = curveType
  }

  /**
   * Get the minimum balance for the token swap account to be rent exempt
   *
   * @return Number of lamports required
   */
  static async getMinBalanceRentForExemptTokenSwap(
    connection: Connection,
  ): Promise<number> {
    return await connection.getMinimumBalanceForRentExemption(
      TokenSwapLayout.span,
    )
  }

  static async createTokenSwap(
    connection: Connection,
    tokenSwapAccount: Keypair,
    payer: PublicKey,
    authority: PublicKey,
    tokenAccountA: PublicKey,
    tokenAccountB: PublicKey,
    poolToken: PublicKey,
    feeAccount: PublicKey,
    tokenAccountPool: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    tradeFeeNumerator: number,
    tradeFeeDenominator: number,
    ownerTradeFeeNumerator: number,
    ownerTradeFeeDenominator: number,
    ownerWithdrawFeeNumerator: number,
    ownerWithdrawFeeDenominator: number,
    hostFeeNumerator: number,
    hostFeeDenominator: number,
    curveType: number,
    curveParameters?: BN,
  ): Promise<Transaction> {
    // Allocate memory for the account
    const balanceNeeded = await TokenSwap.getMinBalanceRentForExemptTokenSwap(
      connection,
    )

    const transaction = new Transaction()
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: tokenSwapAccount.publicKey,
        lamports: balanceNeeded,
        space: TokenSwapLayout.span,
        programId: swapProgramId,
      }),
    )

    const instruction = TokenSwap.createInitSwapInstruction(
      tokenSwapAccount.publicKey,
      authority,
      tokenAccountA,
      tokenAccountB,
      poolToken,
      feeAccount,
      tokenAccountPool,
      tokenProgramId,
      swapProgramId,
      tradeFeeNumerator,
      tradeFeeDenominator,
      ownerTradeFeeNumerator,
      ownerTradeFeeDenominator,
      ownerWithdrawFeeNumerator,
      ownerWithdrawFeeDenominator,
      hostFeeNumerator,
      hostFeeDenominator,
      curveType,
      curveParameters,
    )

    transaction.add(instruction)

    return transaction
  }

  static createInitSwapInstruction(
    tokenSwapAccount: PublicKey,
    authority: PublicKey,
    tokenAccountA: PublicKey,
    tokenAccountB: PublicKey,
    tokenPool: PublicKey,
    feeAccount: PublicKey,
    tokenAccountPool: PublicKey,
    tokenProgramId: PublicKey,
    swapProgramId: PublicKey,
    tradeFeeNumerator: number | BN,
    tradeFeeDenominator: number | BN,
    ownerTradeFeeNumerator: number | BN,
    ownerTradeFeeDenominator: number | BN,
    ownerWithdrawFeeNumerator: number | BN,
    ownerWithdrawFeeDenominator: number | BN,
    hostFeeNumerator: number | BN,
    hostFeeDenominator: number | BN,
    curveType: number,
    curveParameters: BN = new BN(0),
  ): TransactionInstruction {
    const keys = [
      { pubkey: tokenSwapAccount, isSigner: false, isWritable: true },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: tokenAccountA, isSigner: false, isWritable: false },
      { pubkey: tokenAccountB, isSigner: false, isWritable: false },
      { pubkey: tokenPool, isSigner: false, isWritable: true },
      { pubkey: feeAccount, isSigner: false, isWritable: false },
      { pubkey: tokenAccountPool, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ]
    const commandDataLayout = BufferLayout.struct<any>([
      BufferLayout.u8('instruction'),
      BufferLayout.nu64('tradeFeeNumerator'),
      BufferLayout.nu64('tradeFeeDenominator'),
      BufferLayout.nu64('ownerTradeFeeNumerator'),
      BufferLayout.nu64('ownerTradeFeeDenominator'),
      BufferLayout.nu64('ownerWithdrawFeeNumerator'),
      BufferLayout.nu64('ownerWithdrawFeeDenominator'),
      BufferLayout.nu64('hostFeeNumerator'),
      BufferLayout.nu64('hostFeeDenominator'),
      BufferLayout.u8('curveType'),
      BufferLayout.blob(32, 'curveParameters'),
    ])
    let data = Buffer.alloc(1024)

    // package curve parameters
    // NOTE: currently assume all curves take a single parameter, u64 int
    //       the remaining 24 of the 32 bytes available are filled with 0s
    const curveParamsBuffer = Buffer.alloc(32)
    Buffer(curveParameters).copy(curveParamsBuffer)
    {
      const encodeLength = commandDataLayout.encode(
        {
          instruction: 0, // InitializeSwap instruction
          tradeFeeNumerator,
          tradeFeeDenominator,
          ownerTradeFeeNumerator,
          ownerTradeFeeDenominator,
          ownerWithdrawFeeNumerator,
          ownerWithdrawFeeDenominator,
          hostFeeNumerator,
          hostFeeDenominator,
          curveType,
          curveParameters: curveParamsBuffer,
        },
        data,
      )
      data = data.slice(0, encodeLength)
    }
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    })
  }

  static async loadTokenSwap(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey = TOKEN_SWAP_PROGRAM_ID,
  ): Promise<TokenSwap> {
    const data = await loadAccount(connection, address, programId)
    const tokenSwapData = TokenSwapLayout.decode(data)
    if (!tokenSwapData.isInitialized) {
      throw new Error('Invalid token swap state')
    }

    const [authority] = await PublicKey.findProgramAddress(
      [address.toBuffer()],
      programId,
    )

    const poolToken = new PublicKey(tokenSwapData.tokenPool)
    const feeAccount = new PublicKey(tokenSwapData.feeAccount)
    const tokenAccountA = new PublicKey(tokenSwapData.tokenAccountA)
    const tokenAccountB = new PublicKey(tokenSwapData.tokenAccountB)
    const mintA = new PublicKey(tokenSwapData.mintA)
    const mintB = new PublicKey(tokenSwapData.mintB)
    const tokenProgramId = new PublicKey(tokenSwapData.tokenProgramId)

    const tradeFeeNumerator = new BN(tokenSwapData.tradeFeeNumerator)
    const tradeFeeDenominator = new BN(tokenSwapData.tradeFeeDenominator)
    const ownerTradeFeeNumerator = new BN(tokenSwapData.ownerTradeFeeNumerator)
    const ownerTradeFeeDenominator = new BN(tokenSwapData.ownerTradeFeeDenominator)
    const ownerWithdrawFeeNumerator = new BN(tokenSwapData.ownerWithdrawFeeNumerator)
    const ownerWithdrawFeeDenominator = new BN(tokenSwapData.ownerWithdrawFeeDenominator)
    const hostFeeNumerator = new BN(tokenSwapData.hostFeeNumerator)
    const hostFeeDenominator = new BN(tokenSwapData.hostFeeDenominator)
    const curveType = tokenSwapData.curveType

    return new TokenSwap(
      connection,
      address,
      programId,
      tokenProgramId,
      poolToken,
      feeAccount,
      authority,
      tokenAccountA,
      tokenAccountB,
      mintA,
      mintB,
      tradeFeeNumerator,
      tradeFeeDenominator,
      ownerTradeFeeNumerator,
      ownerTradeFeeDenominator,
      ownerWithdrawFeeNumerator,
      ownerWithdrawFeeDenominator,
      hostFeeNumerator,
      hostFeeDenominator,
      curveType,
    )
  }

  /**
   * Swap token A for token B
   *
   * @param userSource User's source token account
   * @param poolSource Pool's source token account
   * @param poolDestination Pool's destination token account
   * @param userDestination User's destination token account
   * @param hostFeeAccount Host account to gather fees
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param amountIn Amount to transfer from source account
   * @param minimumAmountOut Minimum amount of tokens the user will receive
   */
  swap(
    userSource: PublicKey,
    poolSource: PublicKey,
    poolDestination: PublicKey,
    userDestination: PublicKey,
    hostFeeAccount: PublicKey | null,
    userTransferAuthority: PublicKey,
    amountIn: number | string | bigint | BN,
    minimumAmountOut: number | string | bigint | BN,
  ) {
    return new Transaction().add(
      TokenSwap.swapInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority,
        userSource,
        poolSource,
        poolDestination,
        userDestination,
        this.poolToken,
        this.feeAccount,
        hostFeeAccount,
        this.swapProgramId,
        this.tokenProgramId,
        amountIn,
        minimumAmountOut,
      ),
    )
  }

  static swapInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    userSource: PublicKey,
    poolSource: PublicKey,
    poolDestination: PublicKey,
    userDestination: PublicKey,
    poolMint: PublicKey,
    feeAccount: PublicKey,
    hostFeeAccount: PublicKey | null,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    amountIn: number | string | bigint | BN,
    minimumAmountOut: number | string | bigint | BN,
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct<any>([
      BufferLayout.u8('instruction'),
      BufferLayout.nu64('amountIn'),
      BufferLayout.nu64('minimumAmountOut'),
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 1, // Swap instruction
        amountIn: String(amountIn),
        minimumAmountOut: String(minimumAmountOut),
      },
      data,
    )

    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
      { pubkey: userSource, isSigner: false, isWritable: true },
      { pubkey: poolSource, isSigner: false, isWritable: true },
      { pubkey: poolDestination, isSigner: false, isWritable: true },
      { pubkey: userDestination, isSigner: false, isWritable: true },
      { pubkey: poolMint, isSigner: false, isWritable: true },
      { pubkey: feeAccount, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ]
    if (hostFeeAccount !== null) {
      keys.push({ pubkey: hostFeeAccount, isSigner: false, isWritable: true })
    }
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    })
  }

  /**
   * Deposit tokens into the pool
   * @param userAccountA User account for token A
   * @param userAccountB User account for token B
   * @param poolAccount User account for pool token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param poolTokenAmount Amount of pool tokens to mint
   * @param maximumTokenA The maximum amount of token A to deposit
   * @param maximumTokenB The maximum amount of token B to deposit
   */
  depositAllTokenTypes(
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    poolAccount: PublicKey,
    userTransferAuthority: Keypair,
    poolTokenAmount: number | string | bigint | BN,
    maximumTokenA: number | string | bigint | BN,
    maximumTokenB: number | string | bigint | BN,
  ): Transaction {
    return new Transaction().add(
      TokenSwap.depositAllTokenTypesInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority.publicKey,
        userAccountA,
        userAccountB,
        this.tokenAccountA,
        this.tokenAccountB,
        this.poolToken,
        poolAccount,
        this.swapProgramId,
        this.tokenProgramId,
        poolTokenAmount,
        maximumTokenA,
        maximumTokenB,
      ),
    )
  }

  static depositAllTokenTypesInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    sourceA: PublicKey,
    sourceB: PublicKey,
    intoA: PublicKey,
    intoB: PublicKey,
    poolToken: PublicKey,
    poolAccount: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    poolTokenAmount: number | string | bigint | BN,
    maximumTokenA: number | string | bigint | BN,
    maximumTokenB: number | string | bigint | BN,
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct<any>([
      BufferLayout.u8('instruction'),
      BufferLayout.nu64('poolTokenAmount'),
      BufferLayout.nu64('maximumTokenA'),
      BufferLayout.nu64('maximumTokenB'),
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 2, // Deposit instruction
        poolTokenAmount: String(poolTokenAmount),
        maximumTokenA: String(maximumTokenA),
        maximumTokenB: String(maximumTokenB),
      },
      data,
    )

    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
      { pubkey: sourceA, isSigner: false, isWritable: true },
      { pubkey: sourceB, isSigner: false, isWritable: true },
      { pubkey: intoA, isSigner: false, isWritable: true },
      { pubkey: intoB, isSigner: false, isWritable: true },
      { pubkey: poolToken, isSigner: false, isWritable: true },
      { pubkey: poolAccount, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    })
  }

  withdrawAllTokenTypes(
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    poolAccount: PublicKey,
    userTransferAuthority: Keypair,
    poolTokenAmount: number | BN,
    minimumTokenA: number | BN,
    minimumTokenB: number | BN,
  ) {
    return new Transaction().add(
      TokenSwap.withdrawAllTokenTypesInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority.publicKey,
        this.poolToken,
        this.feeAccount,
        poolAccount,
        this.tokenAccountA,
        this.tokenAccountB,
        userAccountA,
        userAccountB,
        this.swapProgramId,
        this.tokenProgramId,
        poolTokenAmount,
        minimumTokenA,
        minimumTokenB,
      ),
    )
  }

  static withdrawAllTokenTypesInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    poolMint: PublicKey,
    feeAccount: PublicKey,
    sourcePoolAccount: PublicKey,
    fromA: PublicKey,
    fromB: PublicKey,
    userAccountA: PublicKey,
    userAccountB: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    poolTokenAmount: number | BN,
    minimumTokenA: number | BN,
    minimumTokenB: number | BN,
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct<any>([
      BufferLayout.u8('instruction'),
      BufferLayout.nu64('poolTokenAmount'),
      BufferLayout.nu64('minimumTokenA'),
      BufferLayout.nu64('minimumTokenB'),
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 3, // Withdraw instruction
        poolTokenAmount: new BN(poolTokenAmount),
        minimumTokenA: new BN(minimumTokenA),
        minimumTokenB: new BN(minimumTokenB),
      },
      data,
    )

    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
      { pubkey: poolMint, isSigner: false, isWritable: true },
      { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
      { pubkey: fromA, isSigner: false, isWritable: true },
      { pubkey: fromB, isSigner: false, isWritable: true },
      { pubkey: userAccountA, isSigner: false, isWritable: true },
      { pubkey: userAccountB, isSigner: false, isWritable: true },
      { pubkey: feeAccount, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    })
  }

  /**
   * Deposit one side of tokens into the pool
   * @param userAccount User account to deposit token A or B
   * @param poolAccount User account to receive pool tokens
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param sourceTokenAmount The amount of token A or B to deposit
   * @param minimumPoolTokenAmount Minimum amount of pool tokens to mint
   */
  depositSingleTokenTypeExactAmountIn(
    userAccount: PublicKey,
    poolAccount: PublicKey,
    userTransferAuthority: PublicKey,
    sourceTokenAmount: number | BN,
    minimumPoolTokenAmount: number | BN,
  ) {
    return new Transaction().add(
      TokenSwap.depositSingleTokenTypeExactAmountInInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority,
        userAccount,
        this.tokenAccountA,
        this.tokenAccountB,
        this.poolToken,
        poolAccount,
        this.swapProgramId,
        this.tokenProgramId,
        sourceTokenAmount,
        minimumPoolTokenAmount,
      ),
    )
  }

  static depositSingleTokenTypeExactAmountInInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    source: PublicKey,
    intoA: PublicKey,
    intoB: PublicKey,
    poolToken: PublicKey,
    poolAccount: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    sourceTokenAmount: number | BN,
    minimumPoolTokenAmount: number | BN,
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct<any>([
      BufferLayout.u8('instruction'),
      BufferLayout.nu64('sourceTokenAmount'),
      BufferLayout.nu64('minimumPoolTokenAmount'),
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 4, // depositSingleTokenTypeExactAmountIn instruction
        sourceTokenAmount: new BN(sourceTokenAmount),
        minimumPoolTokenAmount: new BN(minimumPoolTokenAmount),
      },
      data,
    )

    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
      { pubkey: source, isSigner: false, isWritable: true },
      { pubkey: intoA, isSigner: false, isWritable: true },
      { pubkey: intoB, isSigner: false, isWritable: true },
      { pubkey: poolToken, isSigner: false, isWritable: true },
      { pubkey: poolAccount, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    })
  }

  /**
   * Withdraw tokens from the pool
   *
   * @param userAccount User account to receive token A or B
   * @param poolAccount User account to burn pool token
   * @param userTransferAuthority Account delegated to transfer user's tokens
   * @param destinationTokenAmount The amount of token A or B to withdraw
   * @param maximumPoolTokenAmount Maximum amount of pool tokens to burn
   */
  withdrawSingleTokenTypeExactAmountOut(
    userAccount: PublicKey,
    poolAccount: PublicKey,
    userTransferAuthority: Keypair,
    destinationTokenAmount: number | BN,
    maximumPoolTokenAmount: number | BN,
  ) {
    return new Transaction().add(
      TokenSwap.withdrawSingleTokenTypeExactAmountOutInstruction(
        this.tokenSwap,
        this.authority,
        userTransferAuthority.publicKey,
        this.poolToken,
        this.feeAccount,
        poolAccount,
        this.tokenAccountA,
        this.tokenAccountB,
        userAccount,
        this.swapProgramId,
        this.tokenProgramId,
        destinationTokenAmount,
        maximumPoolTokenAmount,
      ),
    )
  }

  static withdrawSingleTokenTypeExactAmountOutInstruction(
    tokenSwap: PublicKey,
    authority: PublicKey,
    userTransferAuthority: PublicKey,
    poolMint: PublicKey,
    feeAccount: PublicKey,
    sourcePoolAccount: PublicKey,
    fromA: PublicKey,
    fromB: PublicKey,
    userAccount: PublicKey,
    swapProgramId: PublicKey,
    tokenProgramId: PublicKey,
    destinationTokenAmount: number | BN,
    maximumPoolTokenAmount: number | BN,
  ): TransactionInstruction {
    const dataLayout = BufferLayout.struct<any>([
      BufferLayout.u8('instruction'),
      BufferLayout.nu64('destinationTokenAmount'),
      BufferLayout.nu64('maximumPoolTokenAmount'),
    ])

    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
      {
        instruction: 5, // withdrawSingleTokenTypeExactAmountOut instruction
        destinationTokenAmount: new BN(destinationTokenAmount),
        maximumPoolTokenAmount: new BN(maximumPoolTokenAmount),
      },
      data,
    )

    const keys = [
      { pubkey: tokenSwap, isSigner: false, isWritable: false },
      { pubkey: authority, isSigner: false, isWritable: false },
      { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
      { pubkey: poolMint, isSigner: false, isWritable: true },
      { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
      { pubkey: fromA, isSigner: false, isWritable: true },
      { pubkey: fromB, isSigner: false, isWritable: true },
      { pubkey: userAccount, isSigner: false, isWritable: true },
      { pubkey: feeAccount, isSigner: false, isWritable: true },
      { pubkey: tokenProgramId, isSigner: false, isWritable: false },
    ]
    return new TransactionInstruction({
      keys,
      programId: swapProgramId,
      data,
    })
  }
}
