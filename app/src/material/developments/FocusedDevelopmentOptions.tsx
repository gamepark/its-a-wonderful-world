/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {faQuestion, faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import DevelopmentDetails from '@gamepark/its-a-wonderful-world/material/DevelopmentDetails'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {cardWidth} from '../../util/Styles'

type Props = {
  development: DevelopmentDetails
  onClose: () => void
}

export default function FocusedDevelopmentOptions({development, onClose}: Props) {
  const {t} = useTranslation()
  const [help, setHelp] = useState(false)
  return (
    <>
      <button css={[button, closeButton]} onClick={onClose}>
        <FontAwesomeIcon icon={faTimes}/>
        {t('Close')}
      </button>
      <button css={[button, helpButton, help && toggled]} onClick={() => setHelp(!help)}>
        <FontAwesomeIcon icon={faQuestion}/>
        {t('Help')}
      </button>
      {help && <>
        <span css={[helpText, css`top: 8%;
          left: 28%`]}>{t('Construction cost')}</span>
        <hr css={[helpLine, css`width: 2%;
          top: 15%;
          left: 38.3%;
          transform: rotate(59deg);`]}/>
        {development.constructionBonus && <>
          <span css={[helpText, css`top: 74%;
            right: 66%`]}>{t('Construction bonus')}</span>
          <hr css={[helpLine, css`width: 15%;
            top: 74%;
            left: 33.3%;
            transform: rotate(-7deg);`]}/>
        </>}
        {development.victoryPoints && <>
          <span css={[helpText, css`top: 87%;
            right: 66%`]}>{t('Victory points')}</span>
          <hr css={[helpLine, css`width: 5.5%;
            top: 85.8%;
            left: 32.7%;
            transform: rotate(-31deg);`]}/>
        </>}
        {development.production && <>
          <span css={[helpText, css`top: 87%;
            left: 50%;
            transform: translateX(-50%)`]}>{t('Production')}</span>
          <hr css={[helpLine, css`width: 1.5%;
            top: 85.5%;
            left: 49.4%;
            transform: rotate(-90deg);`]}/>
        </>}
        <span css={[helpText, css`top: 85%;
          left: 66%`]}>{t('Development type')}</span>
        <hr css={[helpLine, css`width: 5%;
          top: 84.8%;
          left: 62.1%;
          transform: rotate(28deg);`]}/>
        <span css={[helpText, css`top: 75%;
          left: 66%`]}>{t('Recycling bonus')}</span>
        <hr css={[helpLine, css`width: 5.2%;
          top: 73.7%;
          left: 61.3%;
          transform: rotate(28deg);`]}/>
        <span css={[helpText, css`top: 8%;
          left: 58%`]}>{t('Number of copies in the game')}</span>
        <hr css={[helpLine, css`width: 2%;
          top: 15%;
          left: 61.3%;
          transform: rotate(-59deg);`]}/>
      </>}
    </>
  )
}

const button = css`
  position: absolute;
  z-index: 100;
  left: ${51 + cardWidth * 1.5}%;
  font-size: 3.2em;
  font-weight: lighter;
  color: #EEE;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1em;
  padding: 0.3em 0.6em;

  & svg {
    margin-right: 0.3em;
  }

  &:hover, &:focus {
    outline: 0;
    transform: translateY(1px) scale(1.05);
    cursor: pointer;
  }

  &:active {
    border-style: inset;
    transform: translateY(1px);
  }
`

const closeButton = css`
  top: ${16.5}%;
`

const helpButton = css`
  top: ${24.5}%;
`

const toggled = css`
  border-style: inset;
`

const helpText = css`
  position: absolute;
  z-index: 150;
  font-size: 3.2em;
  font-weight: lighter;
  color: #EEE;
  background: black;
  border-radius: 1em;
  padding: 0.3em 0.6em;
  border: 0.1em solid #EEE;
`

const helpLine = css`
  position: absolute;
  z-index: 120;
  background-color: white;
  border-color: #EEE;
  border-width: 0.1em;
  border-style: solid;
`