import {css} from '@emotion/core'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {usePlayer} from '@gamepark/workshop'
import {useTheme} from 'emotion-theming'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import EmpireCard, {getEmpireName} from './material/empires/EmpireCard'
import Theme, {LightTheme} from './Theme'
import Player from './types/Player'
import PlayerView from './types/PlayerView'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupPosition, popupStyle, showPopupOverlayStyle} from './util/Styles'

const WelcomePopup: FunctionComponent<{ player: Player | PlayerView, close: () => void }> = ({player, close}) => {
  const {t} = useTranslation()
  const theme = useTheme<Theme>()
  const playerInfo = usePlayer(player.empire)
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle, style]} onClick={close}>
      <div css={[popupStyle, popupPosition, css`width: 60%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={close}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('Bienvenue {playerName}', {playerName: playerInfo?.name})}</h2>
        <EmpireCard player={player} css={empireCardStyle}/>
        <p>{t('Vous jouez {empire}, face {letter}. Bon jeu !', {empire: getEmpireName(t, player.empire), letter: player.empireSide})}</p>
        <Button onClick={close}>{t('OK')}</Button>
      </div>
    </div>
  )
}

const style = css`
  background-color: transparent;
`

const empireCardStyle = css`
  display: inline-block;
  position: relative;
  font-size: 2em;
  height: 17.15em;
  width: 20em;
  margin-top: 1em;
`

export default WelcomePopup