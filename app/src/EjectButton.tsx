/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {faUserSlash} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {useOpponentWithMaxTime, useSound} from '@gamepark/react-client'
import {HTMLAttributes} from 'react'
import {useTranslation} from 'react-i18next'
import Images from './material/Images'
import toggleSound from './sounds/toggle.mp3'
import IconButton from './util/IconButton'

type Props = HTMLAttributes<HTMLButtonElement> & {
  openEjectPopup: () => void
  subMenu?: boolean
  disabled?: boolean
}

export default function EjectButton({subMenu, openEjectPopup, ...props}: Props) {
  const {t} = useTranslation()
  const opponentWithNegativeTime = useOpponentWithMaxTime(0)
  const toggle = useSound(toggleSound)
  if (!opponentWithNegativeTime) {
    return null
  }
  return (
    <>
      <IconButton css={ejectButtonStyle} title={t('Eject a player')} aria-label={t('Eject a player')}
                  onClick={() => toggle.play() && openEjectPopup()} {...props}>
        {subMenu && <span css={subMenuTitle}>{t('Eject a player')}</span>}
        <FontAwesomeIcon icon={faUserSlash}/>
      </IconButton>
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