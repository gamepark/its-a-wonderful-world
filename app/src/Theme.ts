export const LightTheme = 'light'
export const DarkTheme = 'dark'

export type Color = typeof LightTheme | typeof DarkTheme

declare module '@emotion/react' {
  export interface Theme {
    color: Color
    switchThemeColor: () => void
  }
}