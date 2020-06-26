export const LightTheme = 'light'
export const DarkTheme = 'dark'

type Color = typeof LightTheme | typeof DarkTheme
type Theme = {
  color: Color
  switchThemeColor:() => void
}

export default Theme