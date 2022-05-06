import '@emotion/react'
import {ContrastTheme} from '@gamepark/react-client'

declare module '@emotion/react' {
  export interface Theme extends ContrastTheme {
  }
}