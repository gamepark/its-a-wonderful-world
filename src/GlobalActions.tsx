import {css} from '@emotion/core'
import {usePlay} from '@gamepark/workshop'
import React, {FunctionComponent} from 'react'
import {useTranslation} from 'react-i18next'
import Character from './material/characters/Character'
import CharacterToken from './material/characters/CharacterToken'
import Move from './moves/Move'
import {isReceiveCharacter, receiveCharacter} from './moves/ReceiveCharacter'
import {isTellYouAreReady} from './moves/TellYouAreReady'
import {getLegalMoves} from './Rules'
import GameView from './types/GameView'
import Player from './types/Player'
import Button from './util/Button'
import {glow, screenRatio} from './util/Styles'

type Props = {
  game: GameView
  player: Player
  validate: () => void
}

const GlobalActions: FunctionComponent<Props> = ({game, player, validate}) => {
  const {t} = useTranslation()
  const play = usePlay<Move>()
  const legalMoves = getLegalMoves(player, game.phase)
  const canValidate = legalMoves.some(isTellYouAreReady)
  const chooseCharacter = legalMoves.some(isReceiveCharacter)
  return (<>
    {canValidate && <Button onClick={validate} css={validateButtonStyle}>{t('Validate')}</Button>}
    {chooseCharacter && <>
      <CharacterToken character={Character.Financier} onClick={() => play(receiveCharacter(player.empire, Character.Financier))}
                      css={[characterTokenStyle, financierTokenPosition]}/>,
      <CharacterToken character={Character.General} onClick={() => play(receiveCharacter(player.empire, Character.General))}
                      css={[characterTokenStyle, generalTokenPosition]}/>
    </>}
  </>)
}

const validateButtonStyle = css`
  position: absolute;
  font-size: 5em;
  top: 10%;
  left: 50%;
`

const characterTokenStyle = css`
  position: absolute;
  top: 9%;
  width: ${10 / screenRatio}%;
  height: 10%;
  cursor: pointer;
  animation: ${glow('cyan', '0', '1em')} 1s ease-in-out infinite alternate;
  &:hover, &:active {
    transform: scale(1.1);
  }
`

const financierTokenPosition = css`
  left: 43%;
`

const generalTokenPosition = css`
  left: 51%;
`

export default GlobalActions