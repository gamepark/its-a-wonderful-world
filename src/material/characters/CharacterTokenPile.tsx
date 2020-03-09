import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from './Character'
import CharacterToken from './CharacterToken'

type Props = { character: Character, quantity: number } & React.HTMLAttributes<HTMLDivElement>

const CharacterTokenPile: FunctionComponent<Props> = ({character, quantity, ...props}) => {
  const tokens = []
  const tokensToDisplay = Math.min(quantity, 5)
  for (let i = 0; i < tokensToDisplay; i++) {
    tokens.push(<CharacterToken key={i} character={character} css={tokenStyle(i)}/>)
  }
  return (
    <div {...props}>
      {tokens}
      {quantity > 5 && <div css={tokenQuantityStyle}>{quantity}</div>}
    </div>
  )
}

const tokenStyle = (index: number) => css`
  position: absolute;
  width: 100%;
  left: ${index * 10}%;
  top: 0;
`

const tokenQuantityStyle = css`
  position: absolute;
  font-size: 3vh;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 3px black, 0 0 3px black, 0 0 3px black;
  left: 3px;
`

export default CharacterTokenPile