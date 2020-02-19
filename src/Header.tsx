import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {useAnimation, useGame, usePlayerId} from 'tabletop-game-workshop'
import Animation from 'tabletop-game-workshop/dist/types/Animation'
import ItsAWonderfulWorld, {Phase} from './ItsAWonderfulWorld'
import Empire from './material/empires/Empire'
import {getEmpireName} from './material/empires/EmpireCard'
import Move from './moves/Move'
import MoveType from './moves/MoveType'

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
  const animation = useAnimation<Move>()
  const {t} = useTranslation()
  return (
    <header css={headerStyle}>
      <h1 css={textStyle}>{getText(t, game, empire, animation)}</h1>
    </header>
  )
}

function getText(t: TFunction, game: ItsAWonderfulWorld, empire: Empire, animation: Animation<Move>) {
  const player = game.players.find(player => player.empire == empire)
  switch (game.phase) {
    case Phase.Draft:
      if (animation && animation.move.type == MoveType.PassCards) {
        return t('Les joueurs passent les cartes à gauche')
      } else if (player && !player.chosenCard) {
        return t('Choisissez une carte et placez-la dans votre zone de draft')
      } else {
        const players = game.players.filter(player => !player.chosenCard)
        if (players.length == 1) {
          return t('{player} doit choisir une carte dévelopement', {player: getEmpireName(t, players[0].empire)})
        } else if (player) {
          return t('Les autres joueurs doivent choisir une carte développment')
        } else {
          return t('Les joueurs doivent choisir une carte développment')
        }
      }
    case Phase.Planning:
      return 'Fin de la démo, merci de l’avoir testée !'
  }
}

export default Header