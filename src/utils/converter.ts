import unrecognizedTokenIcon from '@/assets/img/icons/unrecognized-token.svg'

export function convertTokenSymbol(mint: string, tokenMetadata?: { [key: string]: any }) {
  if (!tokenMetadata) {
    return
  }
  return tokenMetadata[mint]?.symbol ?? ''
}

export function convertTokenIcon(icon?: string) {
  return icon ?? unrecognizedTokenIcon
}
