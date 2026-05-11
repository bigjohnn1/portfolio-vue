export const useScene = () => {
  const isOpen = useState('about-scene-open', () => false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
