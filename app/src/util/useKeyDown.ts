import {useEffect} from 'react'

export default function useKeyDown(key: string, callback: () => void) {
  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.key === key) callback()
    }

    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [key, callback])
}