import {css, keyframes} from '@emotion/core'
import Character from '@gamepark/its-a-wonderful-world/material/Character'
import Resource from '@gamepark/its-a-wonderful-world/material/Resource'
import {isCompleteConstruction} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import Move from '@gamepark/its-a-wonderful-world/moves/Move'
import {isProduce} from '@gamepark/its-a-wonderful-world/moves/Produce'
import {isReceiveCharacter} from '@gamepark/its-a-wonderful-world/moves/ReceiveCharacter'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useAnimation} from '@gamepark/react-client'
import React, {FunctionComponent} from 'react'
import {DragPreviewImage, useDrag} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import {characterTokenFromEmpire} from '../../drag-objects/CharacterTokenFromEmpire'
import {
  areasX, boardHeight, boardTop, boardWidth, cardHeight, cardWidth, charactersPilesY, constructedCardLeftMargin, constructedCardY, developmentCardVerticalShift,
  financiersPileX, generalsPileX, tokenHeight, tokenWidth
} from '../../util/Styles'
import {circleCharacterTopPosition, getCircleCharacterLeftPosition} from '../board/ResourceArea'
import Images from '../Images'
import CharacterToken, {getDescription, images as characterTokenImages} from './CharacterToken'

type Props = {
  player: Player | PlayerView
  character: Character
  quantity: number
  gameOver: boolean
  draggable?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const maxDisplayedTokens = 5

const CharacterTokenPile: FunctionComponent<Props> = ({player, character, quantity, gameOver, draggable = false, ...props}) => {
  const {t} = useTranslation()
  const animation = useAnimation<Move>(animation => isReceiveCharacter(animation.move) && animation.move.character === character
    && animation.move.playerId === player.empire)
  const [, ref, preview] = useDrag({
    item: characterTokenFromEmpire(character),
    canDrag: isPlayer(player) && quantity > 0 && !gameOver,
    collect: monitor => ({
      dragging: monitor.isDragging()
    })
  })
  const tokens = []
  const tokensToDisplay = Math.min(quantity, maxDisplayedTokens)
  for (let i = 0; i < tokensToDisplay; i++) {
    tokens.push(<CharacterToken key={i} character={character} css={tokenStyle(i)}/>)
  }
  if (animation) {
    if (animation.action.consequences.some(isCompleteConstruction)) {
      tokens.push(<CharacterToken key={quantity} character={character} css={[tokenStyle(Math.min(quantity + 1, maxDisplayedTokens - 1)),
        animateFromConstructedCard(character, player.constructedDevelopments.length - 1, animation.duration)]}/>)
    } else {
      const produce = animation.action.consequences.find(isProduce)
      const productionBonusOrigin = produce?.resource || Resource.Science
      tokens.push(<CharacterToken key={quantity} character={character} css={[tokenStyle(Math.min(quantity + 1, maxDisplayedTokens - 1)),
        animateFromBoard(character, productionBonusOrigin, animation.duration)]}/>)
    }
  }
  return (
    <div ref={ref} {...props}>
      {quantity === 0 && <img alt={getDescription(t, character)} src={emptySpaceImages[character]} draggable={false} css={tokenStyle(0)}/>}
      {tokens}
      <div css={tokenQuantityStyle}>{quantity}</div>
      <DragPreviewImage connect={preview} src={characterTokenImages[character]}/>
    </div>
  )
}

const tokenStyle = (index: number) => css`
  position: absolute;
  width: 100%;
  transform: translate(${(index * 3)}%, ${-(index * 5)}%);
`

const emptySpaceImages = {
  [Character.Financier]: Images.financierShadowed,
  [Character.General]: Images.generalShadowed
}

const animateFromConstructedCard = (character: Character, index: number, duration: number) => {
  const pileX = character === Character.Financier ? financiersPileX : generalsPileX
  const x = (constructedCardLeftMargin + cardWidth / 2 - pileX) * 100 / tokenWidth
  const y = (constructedCardY(index) + cardHeight - charactersPilesY - developmentCardVerticalShift * 1.8) * 100 / tokenHeight
  const keyframe = keyframes`
    from {
      transform: translate(${x - 50}%, ${y - 50}%) scale(0.3);
    }
  `
  return css`
    animation: ${keyframe} ${duration}s ease-in-out forwards;
    z-index: 10;
  `
}

const animateFromBoard = (character: Character, resource: Resource, duration: any) => {
  const pileX = character === Character.Financier ? financiersPileX : generalsPileX
  const x = (areasX + getCircleCharacterLeftPosition(resource) * boardWidth / 100 - pileX) * 100 / tokenWidth
  const y = (boardTop + circleCharacterTopPosition * boardHeight / 100 - charactersPilesY) * 100 / tokenHeight
  const keyframe = keyframes`
    from {
      transform: translate(${x - 50}%, ${y - 50}%) scale(0.4) translate(50%, 50%);
    }
  `
  return css`
    animation: ${keyframe} ${duration}s ease-in-out forwards;
    z-index: 10;
  `
}

const tokenQuantityStyle = css`
  position: absolute;
  font-size: 3.5em;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black, 0 0 0.2em black;
  top: 0.4em;
  left: 0.2em;
`

export default CharacterTokenPile