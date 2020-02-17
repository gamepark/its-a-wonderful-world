import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useGame, usePlayerId} from 'tabletop-game-workshop'
import ItsAWonderfulWorld, {Phase} from './ItsAWonderfulWorld'
import Empire from './material/Empire'

const headerStyle = css`
  height: 7vh;
  padding: 0.5vh;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
`

const textStyle = css`
    margin: 1vh;
    font-size: 4vh;
`

const Header = () => {
  const game = useGame<ItsAWonderfulWorld>()
  const empire = usePlayerId<Empire>()
  const {t} = useTranslation()
  return (
    <header css={headerStyle}>
      <h1 css={textStyle}>{getText(t, game, empire)}</h1>
    </header>
  )
}

function getText(t: TFunction, game: ItsAWonderfulWorld, empire: Empire) {
  const player = game.players.find(player => player.empire == empire)
  switch (game.phase) {
    case Phase.Draft:
      if (player && !player.chosenCard) {
        return t('Choisissez une carte et placez-la dans votre zone de draft')
      } else {
        const players = game.players.filter(player => !player.chosenCard)
        if (players.length > 1) {
          if (player) {
            return t('Les autres joueurs doivent choisir une carte développment')
          } else {
            return t('Les joueurs doivent choisir une carte développment')
          }
        } else {
          return t('{player} doit choisir une carte dévelopement', {player: getEmpireName(t, players[0].empire)})
        }
      }
  }
}

function getEmpireName(t: TFunction, empire: Empire) {
  switch (empire) {
    case Empire.AztecEmpire:
      return t('Empire d’Azteca')
    case Empire.FederationOfAsia:
      return t('Fédération d’Asie')
    case Empire.NoramStates:
      return t('États du Noram')
    case Empire.PanafricanUnion:
      return t('Union Panafricaine')
    case Empire.RepublicOfEurope:
      return t('République d’Europa')
  }
}

export default Header