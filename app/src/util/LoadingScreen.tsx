import {css} from '@emotion/core'
import {faLightbulb, faPaintBrush, faWrench} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {Trans, useTranslation} from 'react-i18next'
import Images from '../material/Images'
import IWWBox from '../material/IWW_BOX_3D.png'
import Theme from '../Theme'
import Picture from './Picture'
import {backgroundColor, textColor} from './Styles'

const LoadingScreen: FunctionComponent<{ display: boolean }> = ({display}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  return (
    <div css={[loadingScreenStyle, textColor(theme), backgroundColor(theme), !display && css`opacity: 0`]}>
      <Picture css={gameBox} src={IWWBox} alt={t('Name')}/>
      <h2 css={gameTitle}>{t('Name')}</h2>
      <p css={gamePeople}>
        <FontAwesomeIcon css={iconStyle} icon={faLightbulb}/>
        <Trans defaults="A game by <0>{author}</0>" values={{author: 'Frédéric Guérard'}} components={[<strong/>]}/>
        <br/>
        <FontAwesomeIcon css={iconStyle} icon={faPaintBrush}/>
        <Trans defaults="Illustrated by <0>{artist}</0>" values={{artist: 'Anthony Wolff'}} components={[<strong/>]}/>
        <br/>
        <FontAwesomeIcon css={iconStyle} icon={faWrench}/>
        <Trans defaults="Edited by <0>{editor1}</0> and <0>{editor2}</0>" values={{editor1: 'La Boite de Jeu', editor2: 'Origames'}} components={[<strong/>]}/>
      </p>
    </div>
  )
}

const loadingScreenStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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
  width: 62em;
  height: 66em;
  margin-top: 8em;
  margin-bottom: 3em;
`

const gameTitle = css`
  font-size: 5em;
  margin: 0;
`
const gamePeople = css`
  font-size: 3em;
`
const iconStyle = css`
  min-width: 6em;
  position: relative;
`
export default LoadingScreen