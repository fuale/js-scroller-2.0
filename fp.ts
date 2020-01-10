import {
  compose,
  curry,
  dec,
  gt,
  ifElse,
  inc,
  includes,
  indexOf,
  map,
  nth,
  tap
} from "ramda"
import { log } from "util"
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
const incdec = curry((predicate, children) =>
  ifElse(
    predicate,
    () => max(dec(current(children)), 0),
    () => min(inc(current(children)), dec(children.length))
  )(null)
)

// Effect
const listener = (x, k): (() => void) => {
  document.addEventListener(x, k, { passive: false })
  return (): void => document.removeEventListener(x, k)
}

const fullpagescroll = (container: Element, scrollable: Scrollable = window) => {
  const children = Array.from(container.children)
  const scroll = y => scrollable.scrollBy(0, y)
  const emit = compose(scroll, getTopOf, nth, incdec)

  console.log(emit(() => false, children))

  return
  const emitter = a => e => a(e) !== 0 && emit(() => a(e))
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
