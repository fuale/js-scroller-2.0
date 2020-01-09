import { compose, dec, gt, ifElse, inc, includes, indexOf, map } from "ramda"
const { abs, max, min } = Math

// getTopOf :: Element -> number
const getTopOf = e => e.getBoundingClientRect().top

// offset :: [number] -> number
const offset = offsets => {
  const absed = map(abs, offsets)
  return indexOf(min(...absed), absed)
}

const current = compose(offset, map(getTopOf))

// incdec :: number -> number -> (a -> bool) -> number
const incdec = children => predicate =>
  ifElse(
    () => predicate,
    () => max(dec(current(children)), 0),
    () => min(inc(current(children)), dec(children.length))
  )

// Effect
const listener = (x, k): (() => void) => {
  document.addEventListener(x, k, { passive: false })
  return (): void => document.removeEventListener(x, k)
}

const fullpagescroll = (container: Element, scrollable: Scrollable = window) => {
  const children = Array.from(container.children)
  const scroll = k => scrollable.scrollBy(0, getTopOf(children[k()]))
  const emit = compose(scroll, incdec(children))
  const emitter = a => e => a(e) !== 0 && emit(a(e))
  const wheelEventHandler = emitter(e => e.preventDefault() || gt(0, e.deltaY))
  const keyboardEventHandler = emitter(e => {
    const up = includes(e.key, ["PageUp", "ArrowUp"])
    const down = includes(e.key, ["PageDown", "ArrowDown"])
    return up || down ? e.preventDefault() || (up && !down) : 0
  })

  return () => {
    const listeners = [
      listener("wheel", wheelEventHandler),
      listener("keydown", keyboardEventHandler)
    ]
    return () => map(x => x(), listeners)
  }
}

interface Scrollable {
  scrollBy(x: number, y: number): void
}

export default fullpagescroll
