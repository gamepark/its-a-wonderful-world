import {css} from '@emotion/core'
import {faUserSlash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {GameSpeed, useNow, useOptions, usePlayerId, usePlayers, useSound} from '@gamepark/workshop'
import React, {FC, useState} from 'react'
import {useTranslation} from 'react-i18next'
import EjectPopup from './EjectPopup'
import EmpireName from './material/empires/EmpireName'
import Images from './material/Images'
import toggleSound from './sounds/toggle.ogg'
import IconButton from './util/IconButton'

type Props = React.HTMLAttributes<HTMLButtonElement> & { subMenu?: boolean, disabled?: boolean }

const EjectButton: FC<Props> = ({subMenu, ...props}) => {
  const {t} = useTranslation()
  const playerId = usePlayerId<EmpireName>()
  const players = usePlayers<EmpireName>()
  const [toggle] = useSound(toggleSound)
  const [ejectPopupOpen, setEjectPopupOpen] = useState(false)
  const now = useNow()
  const options = useOptions()
  const playerTimeout = options?.speed === GameSpeed.RealTime && players.some(player => player.time?.playing && player.time.availableTime < now - Date.parse(player.time.lastChange))
  console.log(playerTimeout)
  if (!playerTimeout) {
    return null
  }
  return (
    <>
      <IconButton css={ejectButtonStyle} title={t('Expulser un joueur')} aria-label={t('Expulser un joueur')}
                  onClick={() => toggle.play() && setEjectPopupOpen(true)} {...props}>
        {subMenu && <span css={subMenuTitle}>{t('Expulser un joueur')}</span>}
        <FontAwesomeIcon icon={faUserSlash}/>
      </IconButton>
      {ejectPopupOpen && <EjectPopup playerId={playerId!} players={players} now={now} onClose={() => setEjectPopupOpen(false)}/>}
    </>
  )
}

const ejectButtonStyle = css`
  background-image: url(${Images.buttonRed});
  padding-left: 0.35em !important;
  padding-right: 0.35em !important;
`

const subMenuTitle = css`
  font-size: 0.9em;
  font-weight: lighter;
  text-shadow: 0 0 0.2em #000, 0 0 0.2em #000, 0 0 0.2em #000, 0 0 0.2em #000;
  text-transform: uppercase;
  margin-right: 1em;
`

export default EjectButton