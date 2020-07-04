import {css} from '@emotion/core'
import {faLightbulb, faPaintBrush, faWrench} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
// @ts-ignore
import PreloadImage from 'react-preload-image'
import Images from '../material/Images'
import IWWBox from '../material/IWW_BOX_3D.png'
import Theme from '../Theme'
import {backgroundColor, headerHeight, textColor} from './Styles'

const LoadingScreen: FunctionComponent<{ display: boolean }> = ({display}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  return (
    <div css={[loadingScreenStyle, textColor(theme), backgroundColor(theme), !display && css`opacity: 0`]}>
      <PreloadImage css={gameBox} src={IWWBox} alt={t('It’s a Wonderful World')}/>
      <h2 css={gameTitle}>{t('It’s a Wonderful World')}</h2>
      <p css={gamePeople}>
        <FontAwesomeIcon css={iconStyle} icon={faLightbulb}/>{t('Auteur : Frédéric Guérard')}
        <br/>
        <FontAwesomeIcon css={iconStyle} icon={faPaintBrush}/>{t('Artiste : Anthony Wolff')}
        <br/>
        <FontAwesomeIcon css={iconStyle} icon={faWrench}/>{t('Éditeurs : La Boite de Jeu, Origames')}</p>
    </div>
  )
}

const loadingScreenStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  padding-top: ${headerHeight}%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 2s;
  background-image: url(${Images.coverArtwork});
  background-size: cover;
  background-position: center;
  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  > * {
    z-index: 1;
  }
`

const gameBox = css`
  position: relative;
  width: 62vh;
  height: 66vh;
`

const gameTitle = css`
  font-size: 5vh;
  margin: 0;
`
const gamePeople = css`
  font-size: 3vh;
`
const iconStyle = css`
  min-width: 6vh;
  position: relative;
`
export default LoadingScreen