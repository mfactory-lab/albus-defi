import { defineStore } from 'pinia'
import { debounce } from 'lodash-es'
import { type PoolData, type TxData, getCoinsPrice, getPoolsStats, getPoolsTransactions, lamportsToSol } from '@/utils'
import { TOKENS_PRICE_NAME } from '@/config'

export interface PoolStats {
  tokenAMint: string
  tokenBMint: string
  amountTokenA: number
  amountTokenB: number
  tvl: number
  volume24: number
  fees24: number
  apr24: number
}

export const usePoolsStatsStore = defineStore('pools-stats', () => {
  const poolsData = ref<PoolData[]>([])
  const poolsLoading = ref(true)
  const txData = ref<TxData[]>([])
  const txLoading = ref(true)
  const priceData = ref<Record<string, number>>({})
  const priceLoading = ref(true)
  const poolsStats = ref<Record<string, PoolStats>>({})

  const connectionStore = useConnectionStore()
  const tokenStore = useTokenStore()
  const swapStore = useSwapStore()
  const swapPools = computed(() => swapStore.tokenSwapsAllFiltered)

  const getPoolsData = debounce(async () => {
    poolsLoading.value = true
    try {
      poolsData.value = await getPoolsStats()
    } catch (e) {
      console.error('get pools data: ', e)
    } finally {
      poolsLoading.value = false
    }
  }, 500)

  watch(swapPools, getPoolsData, { immediate: true })

  const getTxData = debounce(async () => {
    txLoading.value = true
    try {
      txData.value = await getPoolsTransactions()
    } catch (e) {
      console.error('get tx data: ', e)
    } finally {
      txLoading.value = false
    }
  }, 500)

  watch(() => connectionStore.cluster, getTxData, { immediate: true })
  setInterval(getTxData, 60000)

  const getPriceData = debounce(async () => {
    priceLoading.value = true
    try {
      priceData.value = await getCoinsPrice()
    } catch (e) {
      console.error('get tx data: ', e)
    } finally {
      priceLoading.value = false
    }
  }, 500)

  getPriceData()
  setInterval(getPriceData, 60000)

  watch([poolsData, txData, priceData], () => {
    // console.log('[pools stats] start: ', new Date())
    if (poolsLoading.value || txLoading.value || priceLoading.value) {
      return
    }
    const list: Record<string, PoolStats> = swapPools.value.reduce((acc, cur) => {
      acc[cur.pubkey.toBase58()] = {
        tokenAMint: cur.data.tokenAMint.toBase58(),
        tokenBMint: cur.data.tokenBMint.toBase58(),
        amountTokenA: 0,
        amountTokenB: 0,
        tvl: 0,
        volume24: 0,
        fees24: 0,
        apr24: 0,
      }
      return acc
    }, {} as Record<string, PoolStats>)

    poolsData.value?.forEach((p) => {
      if (list[p.address]) {
        list[p.address].amountTokenA = Number(p.tokenABalance)
        list[p.address].amountTokenB = Number(p.tokenBBalance)
      }
    })

    txData.value?.forEach((t) => {
      if (list[t.poolAddress]) {
        const tokenA = tokenStore.tokenByMint(list[t.poolAddress].tokenAMint)
        const tokenB = tokenStore.tokenByMint(list[t.poolAddress].tokenBMint)
        if (Number(t.amountTokenA) > 0) {
          list[t.poolAddress].volume24 += lamportsToSol(Number(t.amountTokenA), tokenA?.decimals) * t.priceTokenA
          list[t.poolAddress].fees24 += lamportsToSol(Number(t.feeTokenB), tokenB?.decimals) * t.priceTokenB
        }
        if (Number(t.amountTokenB) > 0) {
          list[t.poolAddress].volume24 += lamportsToSol(Number(t.amountTokenB), tokenB?.decimals) * t.priceTokenB
          list[t.poolAddress].fees24 += lamportsToSol(Number(t.feeTokenA), tokenA?.decimals) * t.priceTokenA
        }
      }
    })

    Object.keys(list).forEach((k) => {
      const tokenA = tokenStore.tokenByMint(list[k].tokenAMint)
      const tokenB = tokenStore.tokenByMint(list[k].tokenBMint)

      list[k].tvl = (
        lamportsToSol(list[k].amountTokenA, tokenA?.decimals) * (priceData.value[TOKENS_PRICE_NAME[list[k].tokenAMint]] ?? 0)
        + lamportsToSol(list[k].amountTokenB, tokenB?.decimals) * (priceData.value[TOKENS_PRICE_NAME[list[k].tokenBMint]] ?? 0)
      )

      list[k].apr24 = list[k].fees24 / list[k].tvl * 365
    })
    // console.log('[pools stats] end: ', new Date())
    console.log('[pools stats]: ', list)
  })

  return {
    poolsLoading,
    txLoading,
    priceLoading,
    poolsStats,
  }
})
