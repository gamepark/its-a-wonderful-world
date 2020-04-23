import {css} from '@emotion/core'
import {TFunction} from 'i18next'
import React from 'react'
import {Trans, useTranslation} from 'react-i18next'
import {useAnimations, useGame, usePlay, usePlayerId, useUndo} from 'tabletop-game-workshop'
import Animation from 'tabletop-game-workshop/dist/types/Animation'
import ItsAWonderfulWorld, {Phase} from './ItsAWonderfulWorld'
import Character from './material/characters/Character'
import EmpireName from './material/empires/EmpireName'
import {getEmpireName} from './material/empires/EmpireCard'
import Resource from './material/resources/Resource'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import {receiveCharacter} from './moves/ReceiveCharacter'
import {tellYourAreReady} from './moves/TellYouAreReady'
import ItsAWonderfulWorldRules, {getNextProductionStep, getScore, numberOfRounds} from './rules'
import IconButton from './util/IconButton'
import UndoIcon from './util/UndoIcon'

const headerStyle = css`
  position: absolute;
  width: 100%;
  height: 7%;
  text-align: center;
  background: rgba(255, 255, 255, 0.5);
`

const textStyle = css`
  color: #333333;
  padding: 1vh;
  margin: 0;
  line-height: 1.25;
  font-size: 4vh;
`

const undoButtonStyle = css`
  position: absolute;
  top: 1vh;
  left: 1vh;
  font-size: 3vh;
  padding: 0.33em;
`

const Header = () => {
  const game = useGame<ItsAWonderfulWorld>()
  const empire = usePlayerId<EmpireName>()
  const animations = useAnimations<Move>()
  const play = usePlay<Move>()
  const [undo, canUndo] = useUndo(ItsAWonderfulWorldRules)
  const {t} = useTranslation()
  return (
    <header css={headerStyle}>
      <IconButton css={undoButtonStyle} title={'Annuler mon dernier coup'} aria-label={'Annuler mon dernier coup'} onClick={undo} disabled={!canUndo}><UndoIcon/></IconButton>
      <h1 css={textStyle}>{getText(t, game, empire, animations, play)}</h1>
    </header>
  )
}

function getText(t: TFunction, game: ItsAWonderfulWorld, empire: EmpireName, animations: Animation<Move>[], play: (move: Move) => void) {
  const player = game.players.find(player => player.empire == empire)
  switch (game.phase) {
    case Phase.Draft:
      if (animations.some(animation => animation.move.type == MoveType.PassCards)) {
        return t('Les joueurs passent les cartes à gauche')
      } else if (player && player.chosenCard == undefined) {
        return t('Choisissez une carte et placez-la dans votre zone de draft')
      } else {
        const players = game.players.filter(player => player.chosenCard == undefined)
        if (players.length == 1) {
          return t('{player} doit choisir une carte développement', {player: getEmpireName(t, players[0].empire)})
        } else if (player) {
          return t('Les autres joueurs doivent choisir une carte développement')
        } else {
          return t('Les joueurs doivent choisir une carte développement')
        }
      }
    case Phase.Planning:
      if (!player) {
        return t('Les joueurs doivent faire leur planification')
      }
      if (player.draftArea.length) {
        return t('Vous devez mettre en construction ou recycler chacune des cartes draftées')
      } else if (player.availableResources.length) {
        return t('Placez vos ressources sur vos développements en construction ou votre carte Empire')
      } else if (!player.ready) {
        return <Trans values={{resource: Resource.Materials}}
                      defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                      components={[<a onClick={() => play(tellYourAreReady(empire))} css={buttonStyle}>Valider</a>]}>
          Cliquez sur <a onClick={() => play(tellYourAreReady(empire))} css={buttonStyle}>Valider</a> pour continuer
        </Trans>
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length == 1) {
          return t('{player} doit faire sa planification', {player: getEmpireName(t, players[0].empire)})
        } else {
          return t('Les autres joueurs doivent faire leur planification')
        }
      }
    case Phase.Production:
      if (player && !player.ready) {
        if (player.availableResources.length) {
          return t('Placez les ressources produites sur vos développements en construction ou votre carte Empire')
        } else if (player.bonuses.some(bonus => bonus == 'CHOOSE_CHARACTER')) {
          return <Trans>Vous pouvez récupérer un <a onClick={() => play(receiveCharacter(empire, Character.Financier))} css={buttonStyle}>Financier</a> ou un <a
            onClick={() => play(receiveCharacter(empire, Character.General))} css={buttonStyle}>Général</a></Trans>
        } else if (game.productionStep != Resource.Exploration) {
          return <Trans values={{resource: getNextProductionStep(game)}}
                        defaults="Cliquez sur <0>Valider</0> si vous êtes prêt à passer à la production {resource, select, Materials{de matériaux} Energy{d’énergie} Science{de science} Gold{d’or} other{d’exploration}}"
                        components={[<a onClick={() => play(tellYourAreReady(empire))} css={buttonStyle}>Valider</a>]}>
            Cliquez sur <a onClick={() => play(tellYourAreReady(empire))} css={buttonStyle}>Valider</a> pour continuer
          </Trans>
        } else if (game.round < numberOfRounds) {
          return <Trans>Cliquez sur <a onClick={() => play(tellYourAreReady(empire))}
                                       css={buttonStyle}>Valider</a> si vous êtes prêt à passer au tour suivant</Trans>
        } else {
          return <Trans>Cliquez sur <a onClick={() => play(tellYourAreReady(empire))} css={buttonStyle}>Valider</a> pour passer au calcul des scores</Trans>
        }
      } else {
        const players = game.players.filter(player => !player.ready)
        if (players.length) {
          if (players.length == 1) {
            return t('{player} doit utiliser les ressources produites', {player: getEmpireName(t, players[0].empire)})
          } else if (player) {
            return t('Les autres joueurs doivent utiliser les ressources produites')
          } else {
            return t('Les joueurs doivent utiliser les ressources produites')
          }
        } else if (game.productionStep == Resource.Exploration && game.round == numberOfRounds) {
          const scores = game.players.reduce<{ [key in EmpireName]?: number }>((map, player) => {
            map[player.empire] = getScore(player)
            return map
          }, {})
          const highestScore = Math.max(...Object.values(scores))
          const bestEmpire = Object.keys(scores).filter((empire: EmpireName) => scores[empire] == highestScore) as EmpireName[]
          if (bestEmpire.length == 1) {
            if (player.empire == bestEmpire[0]) {
              return t('Victoire ! Vous gagnez la partie avec {score} points', {score: highestScore})
            } else {
              return t('{player} gagne la partie avec {score} points', {player: getEmpireName(t, bestEmpire[0]), score: highestScore})
            }
          }
          return t('Égalité ! Les joueurs ont chacun {score} points', {score: highestScore})
        }
      }
  }
}

const buttonStyle = css`
  display: inline-block;
  position: relative;
  cursor: pointer;
  border: 2px solid darkcyan;
  color: darkcyan;
  font-size: 3.4vh;
  font-weight: bold;
  padding: 0 1vh;
  margin: 0 1vh;
  text-decoration: none;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px darkslategrey;
  transition: translate 0.2s ease-in-out;
  &:active {
    transform: translateY(1px);
  }
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 2vh cadetblue;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  &:hover:after {
    opacity: 1;
  }
`

export default Header