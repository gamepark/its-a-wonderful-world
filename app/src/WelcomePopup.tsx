/** @jsxImportSource @emotion/react */
import {css, useTheme} from '@emotion/react'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {getPlayerName} from '@gamepark/its-a-wonderful-world/Options'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {usePlayer} from '@gamepark/react-client'
import {useTranslation} from 'react-i18next'
import EmpireCard from './material/empires/EmpireCard'
import {LightTheme} from './Theme'
import Button from './util/Button'
import {closePopupStyle, popupDarkStyle, popupLightStyle, popupOverlayStyle, popupPosition, popupStyle, showPopupOverlayStyle} from './util/Styles'

type Props = {
  player: Player | PlayerView
  close: () => void
}

export default function WelcomePopup({player, close}: Props) {
  const {t} = useTranslation()
  const theme = useTheme()
  const playerInfo = usePlayer(player.empire)
  return (
    <div css={[popupOverlayStyle, showPopupOverlayStyle, style]} onClick={close}>
      <div css={[popupStyle, popupPosition, css`width: 60%`, theme.color === LightTheme ? popupLightStyle : popupDarkStyle]}
           onClick={event => event.stopPropagation()}>
        <div css={closePopupStyle} onClick={close}><FontAwesomeIcon icon={faTimes}/></div>
        <h2>{t('Welcome {playerName}', {playerName: playerInfo?.name})}</h2>
        <EmpireCard player={player} css={empireCardStyle}/>
        <p>{t('You play {empire}, face {letter}. Have fun!', {empire: getPlayerName(player.empire, t), letter: String.fromCharCode(64 + player.empireSide)})}</p>
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