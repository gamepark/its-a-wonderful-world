/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Empire } from '@gamepark/its-a-wonderful-world/Empire'
import { getPlayerName } from '@gamepark/its-a-wonderful-world/ItsAWonderfulWorldOptions'
import { getBestVictoryPointsCombo } from '@gamepark/its-a-wonderful-world/Scoring'
import { Avatar, PlayerTimer, useGame, usePlayer } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC, HTMLAttributes, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { empireAvatars, empireBackgrounds } from './Images'
import { PlayerConstructions } from './PlayerConstructions'
import { PlayerResourceProduction } from './PlayerResourceProduction'
import { usePlayerEliminated } from './usePlayerData'
import { VictoryPointsMultiplier } from './VictoryPointsMultiplier'

type Props = {
  playerId: Empire
  small?: boolean
  gameOver?: boolean
} & HTMLAttributes<HTMLDivElement>

export const PlayerPanel: FC<Props> = ({
  playerId,
  small = false,
  gameOver = false,
  ...props
}) => {
  const { t } = useTranslation()
  const playerInfo = usePlayer(playerId)
  const eliminated = usePlayerEliminated(playerId)
  const game = useGame<MaterialGame>()
  const bestCombo = useMemo(
    () => !small && game ? getBestVictoryPointsCombo(game, playerId) : undefined,
    [game, playerId, small]
  )

  return (
    <div css={panelStyle(playerId)} {...props}>
      <div css={contentScale}>
        {playerInfo?.avatar ? (
          <Avatar playerId={playerId} css={avatarStyle} />
        ) : (
          <img
            src={empireAvatars[playerId]}
            alt={t('Player avatar')}
            css={fallbackAvatarStyle}
          />
        )}
        <h3 css={titleStyle}>
          <span css={[nameStyle, eliminated && eliminatedStyle]}>
            {playerInfo?.name || getPlayerName(playerId, t)}
          </span>
          {!gameOver && <PlayerTimer playerId={playerId} css={timerStyle} />}
        </h3>
        <PlayerResourceProduction playerId={playerId} small={small} />
        {bestCombo && !gameOver && <VictoryPointsMultiplier combo={bestCombo} css={victoryPointsMultiplierStyle} />}
        <PlayerConstructions playerId={playerId} />
      </div>
    </div>
  )
}

const panelStyle = (empire: Empire) => css`
  position: absolute;
  z-index: 1;
  background-image: url(${empireBackgrounds[empire]});
  background-size: cover;
  background-position: center;
  border-radius: 3px;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }
`

// Scale internal content: GameTable em is ~2.14x larger than v2 viewport em
const contentScale = css`
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 0.48em;
`

const avatarStyle = css`
  position: absolute;
  width: 5em;
  height: 5em;
  top: 0.75em;
  left: 1em;
`

const fallbackAvatarStyle = css`
  position: absolute;
  width: 4.5em;
  height: 4.5em;
  top: 0.75em;
  left: 1em;
  border: 0.1em solid white;
  border-radius: 100%;
`

const titleStyle = css`
  color: #333333;
  position: absolute;
  top: 0.5em;
  left: 22%;
  right: 3%;
  margin: 0;
  font-size: 2.5em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`

const nameStyle = css`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

const eliminatedStyle = css`
  text-decoration: line-through;
`

const timerStyle = css`
  flex-shrink: 0;
`

const victoryPointsMultiplierStyle = css`
  position: absolute;
  top: 38%;
  left: 2%;
  height: 20%;
  & img {
    width: 2.4em;
    height: 2.4em;
  }
`
