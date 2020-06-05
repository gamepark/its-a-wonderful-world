import {css} from '@emotion/core'
import React, {FunctionComponent} from 'react'
import {useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentFromConstructionArea from '../drag-objects/DevelopmentFromConstructionArea'
import DragObjectType from '../drag-objects/DragObjectType'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import {developmentCards} from '../material/developments/Developments'
import {completeConstruction} from '../moves/CompleteConstruction'
import {canBuild} from '../Rules'
import Player from '../types/Player'
import PlayerView from '../types/PlayerView'
import {isPlayer} from '../types/typeguards'
import {cardHeight, cardRatio, cardStyle, cardWidth, constructedCardX, constructedCardY, empireCardBottomMargin, empireCardVerticalShift} from '../util/Styles'

const ConstructedCardsArea: FunctionComponent<{ player: Player | PlayerView }> = ({player}) => {
  const {t} = useTranslation()
  const [{dragging, isValidTarget, isOver}, ref] = useDrop({
    accept: DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA,
    canDrop: (item: DevelopmentFromConstructionArea) => isPlayer(player) && canBuild(player, item.card),
    collect: (monitor) => ({
      dragging: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA,
      isValidTarget: monitor.getItemType() === DragObjectType.DEVELOPMENT_FROM_CONSTRUCTION_AREA && isPlayer(player) && canBuild(player, monitor.getItem().card),
      isOver: monitor.isOver()
    }),
    drop: (item: DevelopmentFromConstructionArea) => completeConstruction(player.empire, item.card)
  })
  return (
    <>
      {player.constructedDevelopments.map((card, index) =>
        <DevelopmentCard key={card} development={developmentCards[card]} css={[style, cardStyle, transform(index)]}/>
      )}
      {dragging &&
      <div ref={ref} css={[buildDropArea, isValidTarget ? validDropAreaColor(isOver) : invalidDropAreaColor]}>
        <span css={[dropAreaText, isValidTarget ? validDropTextColor : invalidDropTextColor]}>
          {isValidTarget ? t('Construire') : t('Construction impossible')}
        </span>
      </div>
      }
    </>
  )
}

const style = css`
  position:absolute;
`

const transform = (index: number) => css`
  transform: translate(${constructedCardX * 100 / cardWidth}%, ${constructedCardY(index) * 100 / cardHeight}%);
`

const buildDropArea = css`
  position: absolute;
  left: ${constructedCardX}%;
  width: ${cardWidth}%;
  top: 8%;
  bottom: ${empireCardBottomMargin + cardHeight * cardRatio * empireCardVerticalShift}%;
  border-radius: 1vh;
`

const validDropAreaColor = (isOver: boolean) => css`
  background-color: rgba(0, 255, 0, ${isOver ? 0.5 : 0.3});
  border: 0.3vh dashed green;
`

const invalidDropAreaColor = css`
  background-color: rgba(255, 0, 0, 0.3);
  border: 0.3vh dashed red;
`

const dropAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 0 1vh;
  text-align: center;
  font-size: 2.5vh;
`

const validDropTextColor = css`
  color: darkgreen;
`

const invalidDropTextColor = css`
  color: red;
`

export default ConstructedCardsArea