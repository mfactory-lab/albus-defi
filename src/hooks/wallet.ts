import { useQuasar } from 'quasar'
import debounce from 'lodash-es/debounce'
import { useWallet } from 'solana-wallets-vue'
import { watch } from 'vue'
import type { PublicKey } from '@solana/web3.js'
import { useEmitter } from './emitter'
import { shortenAddress } from '~/utils/web3'

export const WALLET_CONNECT_EVENT = Symbol('WALLET_CONNECT_EVENT')
export const WALLET_DISCONNECT_EVENT = Symbol('WALLET_DISCONNECT_EVENT')
export const ACCOUNT_CHANGE_EVENT = Symbol('ACCOUNT_CHANGE_EVENT')

const noticeTimeout = 5000

export function initWallet() {
  const { connection } = useConnectionStore()
  const { emit } = useEmitter()
  const { notify } = useQuasar()
  const { wallet, publicKey } = useWallet()
  const subscriptionId = ref<number | undefined>()
  const subscriptionLogsId = ref<number | undefined>()

  const removeSubscriptions = async () => {
    if (subscriptionId.value !== undefined) {
      await connection.removeAccountChangeListener(subscriptionId.value)
      subscriptionId.value = undefined
    }
    if (subscriptionLogsId.value !== undefined) {
      await connection.removeOnLogsListener(subscriptionLogsId.value)
      subscriptionLogsId.value = undefined
    }
  }

  const createSubscriptions = async (pk?: PublicKey) => {
    if (!pk) {
      pk = publicKey.value!
    }
    await removeSubscriptions()
    console.log('onConnect subscript: ', pk?.toBase58())
    await Promise.all([
      subscriptionId.value = connection.onAccountChange(pk, (acc) => {
        console.log('ACCOUNT_CHANGE_EVENT', acc)
        emit(ACCOUNT_CHANGE_EVENT, acc)
      }),
      subscriptionLogsId.value = connection.onLogs(pk, (logs) => {
        console.log(logs)
      }),
    ])
  }

  watch(
    [wallet, publicKey],
    debounce(([w, _pk], [_wOld, _pkOld]) => {
      if (!w) {
        return
      }
      createSubscriptions()

      const onConnect = () => {
        const publicKey = w.adapter.publicKey!
        // createSubscriptions(publicKey)

        notify({
          message: 'Wallet update',
          caption: `Connected to wallet ${shortenAddress(publicKey?.toBase58() ?? '', 7)}`,
          timeout: noticeTimeout,
        })
        emit(WALLET_CONNECT_EVENT, w)
      }

      const onDisconnect = () => {
        notify({
          message: 'Wallet update',
          caption: 'Disconnected from wallet',
          timeout: noticeTimeout,
        })
        removeSubscriptions()
        emit(WALLET_DISCONNECT_EVENT, w)
      }

      const onError = (e: any) => {
        if (!e?.message) {
          return
        }
        notify({
          type: 'negative',
          message: 'Wallet update',
          caption: e.message,
          timeout: noticeTimeout,
        })
      }

      w.adapter.once('connect', onConnect)
      w.adapter.once('disconnect', onDisconnect)

      w.adapter.removeAllListeners('error')
      w.adapter.on('error', onError)
    }, 200),
    { immediate: true },
  )
}
