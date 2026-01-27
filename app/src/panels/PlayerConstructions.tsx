/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { Character } from '@gamepark/its-a-wonderful-world/material/Character'
import { FC } from 'react'
import { characterIcons } from './Images'
import { usePlayerCharacters } from './usePlayerData'

type Props = {
  playerId: Empire
}

export const PlayerConstructions: FC<Props> = ({ playerId }) => {
  const characters = usePlayerCharacters(playerId)
  const reverseOrder = characters[Character.General] > characters[Character.Financier]

  return (
    <div css={[extraInfoPosition, reverseOrder && reverseOrderStyle]}>
      <CharacterTokenNumber
        character={Character.Financier}
        quantity={characters[Character.Financier]}
        css={itemPosition}
      />
      <CharacterTokenNumber
        character={Character.General}
        quantity={characters[Character.General]}
        css={itemPosition}
      />
    </div>
  )
}

type CharacterTokenNumberProps = {
  character: Character
  quantity: number
  className?: string
}

const CharacterTokenNumber: FC<CharacterTokenNumberProps> = ({ character, quantity, className }) => {
  if (quantity === 0) return null

  return (
    <div css={tokenContainer} className={className}>
      <img src={characterIcons[character]} alt="" css={tokenImage} />
      {quantity > 1 && <span css={quantityStyle}>{quantity}</span>}
    </div>
  )
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

const reverseOrderStyle = css`
  flex-direction: row-reverse;
`

const itemPosition = css`
  position: relative;
  width: 48%;
  height: auto;
  margin-right: 4%;
`

const tokenContainer = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`

const tokenImage = css`
  width: 100%;
  height: auto;
  filter: drop-shadow(1px 1px 2px black);
  border-radius: 50%;
`

const quantityStyle = css`
  position: absolute;
  font-size: 2.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black;
`
