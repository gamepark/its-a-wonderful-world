import GameView from '@gamepark/its-a-wonderful-world/GameView'
import EmpireName from '@gamepark/its-a-wonderful-world/material/EmpireName'
import {isActive} from '@gamepark/its-a-wonderful-world/Rules'
import {useOptions, usePlayerId, usePlayers, useSound} from '@gamepark/workshop'
import {useEffect, useState} from 'react'
import bellSound from '../sounds/bell.mp3'

//const REMINDER_FREQUENCY = 30000

export function useBellAlert(game: GameView) {
  const playerId = usePlayerId<EmpireName>()
  const options = useOptions()
  const players = usePlayers<EmpireName>()
  const [sound] = useSound(bellSound)
  const [playerWasActive, setPlayerWasActive] = useState(false)
  //const [reminders, setReminders] = useState<NodeJS.Timeout[]>([])

  useEffect(() => {
    if (!playerId) return
    const active = isActive(game, playerId)
    if (!active) {
      //reminders.forEach(timeout => clearTimeout(timeout))
      //setReminders([])
    } else if (!playerWasActive) {
      if (!document.hasFocus()) {
        sound.play().catch((error) => console.warn('Sound could not be played', error))
      }
      /*const time = players.find(player => player.id === playerId)?.time
      if (options?.speed === GameSpeed.RealTime && time) {
        setReminders(setupReminders(time, sound))
      }*/
    }
    setPlayerWasActive(active)
  }, [game, playerId, players, sound, playerWasActive, options])
}

// TODO: buy Envato Market account on black friday, pick a clock sound, and setup that.
/*function setupReminders(time: PlayerTime, sound: HTMLAudioElement) {
  const timeLeft = time.availableTime - Date.now() + Date.parse(time.lastChange)
  const reminders = []
  for (let i = 0; i <= 6; i++) {
    if (timeLeft > (i + 1) * REMINDER_FREQUENCY) {
      reminders.push(setTimeout(() => {
        sound.play()
      }, timeLeft - i * REMINDER_FREQUENCY))
    }
  }
  return reminders
}*/

