/*
 * This file is part of Solana Reference Stake Pool code.
 *
 * Copyright © 2023, mFactory GmbH
 *
 * Solana Reference Stake Pool is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Solana Reference Stake Pool is distributed in the hope that it
 * will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 * If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 *
 * You can be released from the requirements of the Affero GNU General Public License
 * by purchasing a commercial license. The purchase of such a license is
 * mandatory as soon as you develop commercial activities using the
 * Solana Reference Stake Pool code without disclosing the source code of
 * your own applications.
 *
 * The developer of this program can be contacted at <info@mfactory.ch>.
 */

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useIntervalFn, useLocalStorage } from '@vueuse/core'
import { getCoinStats } from '@/utils'

export interface PriceData {
  price: number
  vol24: number
  change24: number
  changePercent24: number
}

const defaultPriceData = {
  price: 200,
  vol24: 0,
  change24: 0,
  changePercent24: 0,
}
export const useCoinRateStore = defineStore('coin-rate', () => {
  const solana = useLocalStorage<PriceData>('solana-price', { ...defaultPriceData })
  const loading = ref(false)

  async function load() {
    try {
      loading.value = true
      const resp = await getCoinStats()
      console.log('[CoinRate]', resp)
      if (resp.solana) {
        solana.value.price = resp.solana.current_price
        solana.value.vol24 = resp.solana.total_volume
        solana.value.change24 = resp.solana.price_change_24h
        solana.value.changePercent24 = resp.solana.price_change_percentage_24h_in_currency
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  useIntervalFn(load, 300000, { immediateCallback: true })

  return {
    solana,
    loading,
    load,
  }
})
