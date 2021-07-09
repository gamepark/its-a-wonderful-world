/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import CharacterTokenNumber from '../material/characters/CharacterTokenNumber'

type Props = { player: Player | PlayerView }

export default function PlayerConstructions({player}: Props) {
  return <div css={[extraInfoPosition, player.characters[Character.General] > player.characters[Character.Financier] && reverseOrder]}>
    <CharacterTokenNumber character={Character.Financier} quantity={player.characters[Character.Financier]} css={itemPosition}/>
    <CharacterTokenNumber character={Character.General} quantity={player.characters[Character.General]} css={itemPosition}/>
  </div>
}

const extraInfoPosition = css`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  left: 2%;
  bottom: 1em;
  width: 24%;
  height: 30%;
  transition: width 0.5s ease-out, height 0.5s ease-in;
`

const reverseOrder = css`
  flex-direction: row-reverse;
`

const itemPosition = css`
  position: relative;
  width: 48%;
  height: auto;
  margin-right: 4%;
`