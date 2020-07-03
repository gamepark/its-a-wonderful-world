import React, {FunctionComponent} from 'react'
import IWWBox from '../material/IWW_BOX_3D.png'
import {useTranslation} from 'react-i18next'
import {css} from '@emotion/core'
import {headerHeight} from './Styles'
import {faLightbulb,faPaintBrush,faWrench} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTheme} from 'emotion-theming'
import Theme, {LightTheme} from '../Theme'
// @ts-ignore
import PreloadImage from 'react-preload-image'

const LoadingScreen: FunctionComponent = () => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  return (
    <div css={loadingScreenStyle(theme)}>
      <PreloadImage css={gameBox} src={IWWBox} alt={t('It’s a Wonderful World')} />
      <h2 css={gameTitle}>{t('It’s a Wonderful World')}</h2>
      <p css={gamePeople}><FontAwesomeIcon css={iconStyle} icon={faLightbulb}/>{t('Auteur : Frédéric Guérard')}
      <br/><FontAwesomeIcon css={iconStyle} icon={faPaintBrush}/>{t('Artiste : Anthony Wolff')}
      <br/><FontAwesomeIcon css={iconStyle} icon={faWrench}/>{t('Éditeurs : La Boite de Jeu, Origames')}</p>
    </div>
  )
}

const loadingScreenStyle = (theme:Theme) => css`
  z-index: 100;
  position:absolute;
  top:${headerHeight}%;
  left:0;
  height:${(100-headerHeight)}%;
  width:100%;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
  color:${theme.color === LightTheme ? 'black':'white'};
`

const gameBox = css`
  position:relative;
  width:62vh;
  height:66vh;
`

const gameTitle = css`
  font-size:5vh;
  margin:0;
`
const gamePeople = css`
  font-size:3vh;
`
const iconStyle = css`
  min-width: 6vh;
  position: relative;
`
export default LoadingScreen