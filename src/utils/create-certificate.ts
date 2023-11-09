const { emit } = useEmitter()

export const SHOW_CERTIFICATE_EVENT = Symbol('SHOW_CERTIFICATE_EVENT')

export function showCreateDialog() {
  console.log('SHOW_CERTIFICATE_EVENT')
  emit(SHOW_CERTIFICATE_EVENT)
}
