/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {canBuild, canPay, getCost} from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorld'
import {developmentCards} from '@gamepark/its-a-wonderful-world/material/Developments'
import {completeConstructionMove} from '@gamepark/its-a-wonderful-world/moves/CompleteConstruction'
import Player from '@gamepark/its-a-wonderful-world/Player'
import PlayerView from '@gamepark/its-a-wonderful-world/PlayerView'
import {isPlayer} from '@gamepark/its-a-wonderful-world/typeguards'
import {useCallback, useState} from 'react'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import {useTranslation} from 'react-i18next'
import DevelopmentCard from '../material/developments/DevelopmentCard'
import DevelopmentCardsCatalogs from '../material/developments/DevelopmentCardsCatalog'
import DragItemType from '../material/DragItemType'
import {
  cardHeight, cardStyle, cardWidth, constructedCardBottomMargin, constructedCardLeftMargin, constructedCardY, empireCardLeftMargin, empireCardWidth,
  headerHeight, topMargin
} from '../util/Styles'

type DropItem = { card: number }
type Props = {
  player: Player | PlayerView
  moveUp: boolean
}

export default function ConstructedCardsArea({player, moveUp = false}: Props) {
  const {t} = useTranslation()
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>()

  const canDrop = useCallback((monitor: DropTargetMonitor<DropItem>, card: number = monitor.getItem().card) => {
    if (!isPlayer(player)) return false
    if (monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA) {
      return canBuild(player, card)
    } else {
      return canPay(player, getCost(card))
    }
  }, [player])

  const [{dragging, isValidTarget, isOver}, ref] = useDrop({
    accept: [DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA, DragItemType.DEVELOPMENT_FROM_DRAFT_AREA],
    canDrop: (item, monitor) => canDrop(monitor, item.card),
    collect: (monitor) => ({
      dragging: monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA || monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_DRAFT_AREA,
      isValidTarget: (monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_CONSTRUCTION_AREA
        || monitor.getItemType() === DragItemType.DEVELOPMENT_FROM_DRAFT_AREA) && canDrop(monitor),
      isOver: monitor.isOver()
    }),
    drop: (item: DropItem) => completeConstructionMove(player.empire, item.card)
  })

  return (
    <>
      {typeof focusedCardIndex === 'number' &&
      <DevelopmentCardsCatalogs initialIndex={focusedCardIndex} onClose={() => setFocusedCardIndex(undefined)}
                                developments={player.constructedDevelopments.map(card => developmentCards[card])}/>
      }
      {player.constructedDevelopments.map((card, index) =>
        <DevelopmentCard key={card} development={developmentCards[card]} onClick={() => setFocusedCardIndex(index)}
                         css={[style, cardStyle, transform(index, moveUp)]}/>
      )}
      {dragging &&
      <div ref={ref} css={[buildDropArea, isValidTarget ? validDropAreaColor(isOver) : invalidDropAreaColor]}>
        <span css={dropAreaText}>
          {isValidTarget ? t('Build') : t('Construction is impossible')}
        </span>
      </div>
      }
    </>
  )
}

const style = css`
  position: absolute;
  transition: transform 0.2s ease-in-out;
`

const transform = (index: number, moveUp = false) => css`
  transform: translate(${constructedCardLeftMargin * 100 / cardWidth}%, ${constructedCardY(index) * 100 / cardHeight}%) ${moveUp ? 'translateY(-27em)': ''};
`

const buildDropArea = css`
  position: absolute;
  left: ${empireCardLeftMargin}%;
  width: ${empireCardWidth}%;
  top: ${headerHeight + topMargin}%;
  bottom: ${constructedCardBottomMargin}%;
  border-radius: 1em;
  z-index: 10;
`

const validDropAreaColor = (isOver: boolean) => css`
  background-color: rgba(0, 255, 0, ${isOver ? 0.5 : 0.3});
  border: 0.3em dashed green;
`

const invalidDropAreaColor = css`
  background-color: rgba(255, 0, 0, 0.3);
  border: 0.3em dashed red;
`

const dropAreaText = css`
  position: absolute;
  width: 100%;
  margin: 0;
  padding: 4em 0.4em;
  text-align: center;
  font-size: 2.5em;
  color: white;
`