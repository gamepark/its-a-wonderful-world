import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import Character from './Character'
import CharacterToken from './CharacterToken'

type Props = { character: Character, quantity: number } & React.HTMLAttributes<HTMLDivElement>

const CharacterTokenPile: FunctionComponent<Props> = ({character, quantity, ...props}) => {
  const children = []
  for (let i = 0; i < quantity; i++) {
    children.push(<CharacterToken key={i} character={character} css={tokenStyle(i)}/>)
  }
  return (
    <div {...props}>
      {children}
    </div>
  )
}

const tokenStyle = (index: number) => css`
  position: absolute;
  width: 100%;
  left: ${index * 10}%;
  top: 0;
`

export default CharacterTokenPile