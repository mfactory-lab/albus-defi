export const APP_CONFIG = {
  'mainnet-beta': {
    serviceCode: '',
    policy: {
      transfer: {
        default: '',
      },
      swap: {
        default: '',
      },
      stake: {
        default: '',
      },
    },
  },
  'devnet': {
    serviceCode: 'grigoriyApp',
    policy: {
      transfer: {
        // attendance sb2023a
        default: 'FQZfvRxA3hCTy5VLfUSHBXWKCRvSFu7xGfSaJrBEVjm7',
        // attendance cacf
        usdc: '4BaEGwdWUvdFiCpG5s816H1rjkEiRtynoQbUDosxwJg4',
        // attendance sbbd
        usdt: '6i9NHjoQvMXJy8wSoc1TGvwxzzEY1Poo8N3EZVDXZhZy',
      },
      swap: {
        // liveness
        default: '4ARkb5StiDU67sYXpER8PqWvKTdHzK7KvCR83EJknG7T',
      },
      stake: {
        // age
        default: '5q6MCuMrdc5yzGJkarC8PKWqN5JY2i7eEVBdxy7ei74T',
      },
    },
  },
}
