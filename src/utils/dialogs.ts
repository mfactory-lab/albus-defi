const { emit } = useEmitter()

export const SHOW_CERTIFICATE_EVENT = Symbol('SHOW_CERTIFICATE_EVENT')

export function showCreateDialog() {
  emit(SHOW_CERTIFICATE_EVENT)
}

export const SHOW_TRANSACTION_RESULT = Symbol('SHOW_CERTIFICATE_EVENT')

export function showTransactionResultDialog(link = '') {
  emit(SHOW_TRANSACTION_RESULT, link)
}
