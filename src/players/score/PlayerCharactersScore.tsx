import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {Player} from '../../ItsAWonderfulWorld'
import Character from '../../material/characters/Character'
import ScoreIcon from '../../material/score-icon.png'
import {getComboVictoryPoints} from '../../rules'

type Props = {
  player: Player
  character: Character
} & React.HTMLAttributes<HTMLDivElement>

const PlayerCharactersScore: FunctionComponent<Props> = ({player, character}) => {
  const score = getComboVictoryPoints(player, character)
  if (!score) {
    return null
  }
  return (
    <div css={style}>
      {score}
    </div>
  )
}

const style = css`
  &:not(:first-of-type) {
    &:before {
      content: '+';
    }
  }
`

const scoreStyle = css`
  background-image: url(${ScoreIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  font-size: 7vh;
  filter: drop-shadow(0.1vh 0.1vh 0.5vh black) drop-shadow(0.1vh 0.1vh 0.5vh black);
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black;
  padding: 1vh;
  width: 15vh;
  text-align: center;
`

export default PlayerCharactersScore