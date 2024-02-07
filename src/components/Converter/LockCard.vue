<script setup lang="ts">
import {
  type DataV2,
  PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
  createUpdateMetadataAccountV2Instruction,
} from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey, Transaction } from '@solana/web3.js'
import { createSetAuthorityInstruction } from '@solana/spl-token'
import { useAnchorWallet } from 'solana-wallets-vue'
import { formatBalance, onlyNumber, sendTransaction } from '@/utils'
import unrecognizedTokenIcon from '@/assets/img/icons/unrecognized-token.svg'

const { state } = useConverterStore()
const { options, setToken, handleSearchToken } = useConverter()

const { monitorTransaction } = useMonitorTransaction()
const wallet = useAnchorWallet()
const connectionStore = useConnectionStore()

const balanceFrom = computed(() => state.from.balance)
const balanceTo = computed(() => state.to.balance)

function setMaxAmount() {
  state.from.amount = balanceFrom.value
}

async function setMetadata() {
  const mint = new PublicKey('5d3vLM78TbzgjhHMZAtBWBteh8HS1fjkaNTiVBndJqP2')
  const payer = new PublicKey('9SwiEpL5AnkYC2SCYGvWVQ2VLhN55osuEprecAXUGuse')

  const metadata = PublicKey.findProgramAddressSync(
    [
      // eslint-disable-next-line n/prefer-global/buffer
      Buffer.from('metadata'),
      PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    PROGRAM_ID,
  )[0]

  const tokenMetadata = {
    name: 'securitySampleToken',
    symbol: 'SST',
    uri: 'https://arweave.net/eP7n7tNz5gjbJWMUP3t6uS80maOivJNFe6xEyISAzbE',
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2

  const tx = new Transaction()

  const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata,
      mint,
      mintAuthority: payer,
      payer,
      updateAuthority: payer,
    },
    {
      createMetadataAccountArgsV3: {
        data: tokenMetadata,
        isMutable: true,
        collectionDetails: null,
      },
    },
  )
  tx.add(createMetadataInstruction)

  const setAuthorityInstruction = createSetAuthorityInstruction(
    mint,
    payer,
    0,
    payer,
  )
  tx.add(setAuthorityInstruction)

  const updateMetadataInstruction = createUpdateMetadataAccountV2Instruction(
    {
      metadata,
      updateAuthority: payer,
    },
    {
      updateMetadataAccountArgsV2: {
        data: tokenMetadata,
        updateAuthority: payer,
        primarySaleHappened: true,
        isMutable: true,
      },
    },
  )
  tx.add(updateMetadataInstruction)

  await monitorTransaction(
    sendTransaction(connectionStore.connection, wallet.value!, tx.instructions, []),
    {
      onSuccess: () => {
        console.log('ADD METADATA!!!!!')
      },
    },
  )
  console.log(metadata)
}

function tokenIcon(icon?: string) {
  return icon ?? unrecognizedTokenIcon
}

const insufficientError = computed(() => {
  if (state.from.amount > balanceFrom.value) {
    return 'Insufficient funds'
  } else {
    return false
  }
})
</script>

<template>
  <q-card class="swap-card swap-widget">
    <q-card-section class="swap-card__body">
      <div class="swap-form">
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row items-end">
              <div class="col swap-field__label">
                FROM:
              </div>
              <div class="col-8 col-xs-10 row justify-end swap-field__balance">
                <div v-if="insufficientError" class="insufficient-error">
                  {{ insufficientError }}
                </div>
                Balance: {{ formatBalance(balanceFrom) }}
              </div>
            </div>
          </div>
          <q-input
            v-model="state.from.amount" :maxlength="14" outlined placeholder="0.0" class="swap-input"
            @keypress="onlyNumber"
          >
            <template #append>
              <q-btn dense unelevated :ripple="false" class="swap-input__max" @click="setMaxAmount">
                MAX
              </q-btn>
              <select-token
                v-if="state.from?.symbol" :options="options" :token="state.token"
                :swap-token="String(state.to.symbol)" @handle-search-token="handleSearchToken" @set-token="setToken"
              />
            </template>
          </q-input>
        </div>
        <div class="swap-change" />
        <div class="swap-field">
          <div class="swap-field__info">
            <div class="row">
              <div class="col swap-field__label">
                TO:
              </div>
              <div class="col swap-field__balance">
                Balance: {{ formatBalance(balanceTo) }}
              </div>
            </div>
          </div>
          <q-input v-model="state.to.amount" readonly :maxlength="14" outlined placeholder="0.0" class="swap-input">
            <template v-if="state.to?.symbol" #append>
              <div class="convert-to">
                <img :src="tokenIcon(state.to?.image)"> <span>{{ state.to?.symbol }}</span>
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <div class="swap-info q-mt-md q-pt-xs">
        <dl class="text-weight-medium">
          <dt>Received</dt>
          <dd>
            1
          </dd>
        </dl>
        <dl>
          <dt>Locked amount</dt>
          <dd>1 SOL</dd>
        </dl>
        <dl>
          <dt>Ratio</dt>
          <dd>1 SOL</dd>
        </dl>
        <dl>
          <dt>Lock fee</dt>
          <dd>1 SOL</dd>
        </dl>
      </div>
      <!--
      args.unlockFee,
      args.feeReceiver, -->
      <policy-card class="q-mt-md q-mx-auto" />

      <div class="swap-submit q-mt-md">
        <q-btn
          :loading="state.converting" rounded :ripple="false"
          :disable="!wallet?.publicKey || !state.from.amount || !!insufficientError" @click="() => console.log(11)"
        >
          Lock token
        </q-btn>
      </div>

      <div class="row q-mt-md text-center relative-position full-width">
        <div class="swap-rate q-mx-auto">
          1 token_a ≈ token_b
        </div>
      </div>
    </q-card-section>

    <q-inner-loading :showing="state?.loading" class="swap-loading" color="grey" />
  </q-card>
</template>

<style scoped>
.convert-to {
  width: 135px;
  padding: 0 0 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 11px;

  img {
    width: 35px;
    height: 35px;
    object-fit: contain;
  }

  span {
    width: 70px;
    text-transform: uppercase;
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
    color: #455A64;
  }

}
</style>
