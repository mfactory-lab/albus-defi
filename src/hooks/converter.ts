import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import type { TokenData } from '@/config'
import type { ConvertToken } from '@/stores/convertet'
import { convertTokenSymbol } from '@/utils/converter'

export function useConverter() {
  const converterStore = useConverterStore()
  const userStore = useUserStore()
  const connectionStore = useConnectionStore()

  const { notify } = useQuasar()

  function setToken(t: ConvertToken) {
    console.log('set token ======== ', t)
    converterStore.state.selectedPair = converterStore.state.pairs.find(p => p.publicKey.toBase58() === t?.publicKey?.toBase58())
    converterStore.state.token = t
  }

  function handleSearchToken(token: string) {
    converterStore.state.searchToken = token
  }

  const options = computed<any>(() => {
    const tokens: TokenData[] = converterStore.state.pairs.map((p) => {
      const token = Object.entries(p.tokensMetadata)[converterStore.state.isLock ? 0 : 1]
      return { ...token[1], mint: token[0], publicKey: p.publicKey }
    })
    const filterTokens = tokens.flat().filter(_t => _t.symbol.toLowerCase().includes(converterStore.state.searchToken.toLowerCase()))
    return filterTokens
  })

  const pairAccount = computed(() => converterStore.state.selectedPair?.account)
  const pairRatio = computed(() => pairAccount.value?.ratio?.num?.toNumber() ?? 1)
  const pairLockedAmount = computed(() => pairAccount.value?.lockedAmount
    ? pairAccount.value?.lockedAmount?.toNumber() / LAMPORTS_PER_SOL
    : 0)
  const pairLockFee = computed(() => pairAccount.value?.lockFee)

  const tokenASymbol = computed(() => {
    const mint = pairAccount.value?.tokenA?.toString()
    return convertTokenSymbol(mint, converterStore.state.selectedPair?.tokensMetadata)
  })

  const tokenBSymbol = computed(() => {
    const mint = pairAccount.value?.tokenB?.toString()
    return convertTokenSymbol(mint, converterStore.state.selectedPair?.tokensMetadata)
  })

  const isDisabledInputs = computed(() => converterStore.state.pairs.length === 0)

  const isHaveCertificate = computed(() => {
    return !!userStore.state.certificates?.find(c => c.data?.policy.toBase58() === String(userStore.requiredPolicy))
  })

  async function lockUnlockToken(lock = true) {
    const proofRequest = userStore.state.certificates?.find(c => c.data?.policy.toBase58() === String(userStore.requiredPolicy))?.pubkey

    if (!pairAccount.value || !proofRequest) {
      return
    }
    try {
      converterStore.state.converting = true
      const tokenA = pairAccount.value.tokenA
      const tokenB = pairAccount.value.tokenB
      const amount = Number(converterStore.state.from.amount * LAMPORTS_PER_SOL) / (converterStore.state.isLock ? 1 : pairRatio.value)

      let res

      if (lock) {
        res = await converterStore.converterClient.lockTokens({
          tokenA,
          tokenB,
          amount,
          proofRequest,
        })
      } else {
        res = await converterStore.converterClient.unlockTokens({
          tokenA,
          tokenB,
          amount,
          proofRequest,
        })
      }

      notify({
        message: 'Transaction confirmed',
        type: 'positive',
        actions: [{
          label: 'Explore',
          color: 'white',
          target: '_blank',
          href: `https://explorer.solana.com/tx/${res.signature}?cluster=${connectionStore.cluster}`,
          onClick: () => false,
        }],
      })

      setTimeout(async () => {
        Promise.all([
          await converterStore.getAllTokens(),
          await converterStore.updatePairData(converterStore.state.selectedPair!.publicKey.toBase58()),
        ])
      }, 1000)
    } catch (err) {
      console.error('lockedToken error: ', err)
      notify({
        type: 'negative',
        message: `${err}`,
      })
    } finally {
      converterStore.state.converting = false
    }
  }

  watchDebounced(options, (o) => {
    if (o.length !== 0 && !converterStore.state.token) {
      setToken(o[0])
    }
  }, { immediate: true, debounce: 100, maxWait: 1000 })

  watch(() => converterStore.state.from.amount, (amount) => {
    if (!amount) {
      converterStore.state.to.amount = undefined
      return
    }
    converterStore.state.to.amount = converterStore.state.isLock
      ? amount * pairRatio.value
      : amount / pairRatio.value
  })

  return {
    options,
    setToken,
    handleSearchToken,
    pairRatio,
    pairLockedAmount,
    pairLockFee,
    tokenASymbol,
    tokenBSymbol,
    isHaveCertificate,
    lockUnlockToken,
    isDisabledInputs,
  }
}
