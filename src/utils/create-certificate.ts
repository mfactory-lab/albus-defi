const { emit } = useEmitter()

export const CREATE_CERTIFICATE_EVENT = Symbol('CREATE_CERTIFICATE_EVENT')

export function startCreteCertificate() {
  console.log('CREATE_CERTIFICATE_EVENT')
  emit(CREATE_CERTIFICATE_EVENT)
}