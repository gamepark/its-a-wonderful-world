import {MouseEvent, Touch, TouchEvent, useCallback, useMemo, useRef} from 'react'

type PressEvent<T> = MouseEvent<T> | TouchEvent<T>

type Props<T> = {
  onClick?: (event: PressEvent<T>) => void
  onLongPress?: (event: PressEvent<T>) => void
  ms?: number
  moveTolerance?: number
}

export function useLongPress<T>({onClick, onLongPress, ms = 300, moveTolerance = 3}: Props<T>) {
  const timerRef = useRef<NodeJS.Timeout>()
  const eventRef = useRef<PressEvent<T>>()
  moveTolerance = moveTolerance * (window.devicePixelRatio || 1)

  const callback = useCallback(() => {
    if (timerRef.current) {
      onLongPress && eventRef.current && onLongPress(eventRef.current)
      eventRef.current = undefined
      timerRef.current = undefined
    }
  }, [onLongPress])

  const start = useCallback(
    (event: PressEvent<T>) => {
      event.persist()
      eventRef.current = event
      timerRef.current = setTimeout(callback, ms)
    }, [callback, ms]
  )

  const move = useCallback(
    (event: PressEvent<T>) => {
      if (timerRef.current && eventRef.current && distance(getLocation(eventRef.current), getLocation(event)) > moveTolerance) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
        eventRef.current = undefined
      }
    }, [moveTolerance]
  )

  const stop = useCallback(
    (event: PressEvent<T>) => {
      event.persist()
      event.preventDefault()
      eventRef.current = event
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        if (onClick) {
          onClick(eventRef.current)
        }
        timerRef.current = undefined
        eventRef.current = undefined
      }
    }, [onClick]
  )

  return useMemo(
    () => ({
      onMouseDown: start,
      onMouseMove: move,
      onMouseUp: stop,
      onMouseLeave: stop,
      onTouchStart: start,
      onTouchMove: move,
      onTouchEnd: stop
    }), [start, move, stop]
  )
}

type Point = MouseEvent<any> | Touch

function getLocation<T>(event: PressEvent<T>): Point {
  if (isMouseEvent(event)) {
    return event
  } else {
    return event.touches[0]
  }
}

function isMouseEvent<T>(event: PressEvent<T>): event is MouseEvent<T> {
  return (event as MouseEvent<T>).clientX !== undefined
}

function distance(pointA: Point, pointB: Point) {
  return Math.abs(pointA.clientX - pointB.clientX) + Math.abs(pointA.clientY - pointB.clientY)
}