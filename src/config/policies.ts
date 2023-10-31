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
    serviceCode: 'leoAlbus',
    policy: {
      transfer: {
        // age 18 - 100
        default: '6U2y9mwzH8afwmNzHZaa4Rwe5TTV7TRdrAnSybAQeWt',
        usdc: '6U2y9mwzH8afwmNzHZaa4Rwe5TTV7TRdrAnSybAQeWt',
        usdt: '6U2y9mwzH8afwmNzHZaa4Rwe5TTV7TRdrAnSybAQeWt',
      },
      swap: {
        // age 1 - 40
        default: 'Co3VdBNFXxDJETPfijaokRGKnKWw5RvHFmCocgRRgL7N',
      },
      stake: {
        // age 40 - 70
        default: '69tnNVTHMwvmG9W8s68EtgAXthhqwT112KJxp2sTSH7v',
      },
    },
  },
}
