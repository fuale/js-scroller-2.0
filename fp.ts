import { compose, dec, gt, ifElse, inc, includes, indexOf, map } from "ramda"

const { abs, max, min } = Math

// Any HTML element which is scrollable
interface Scrollable {
  scrollBy(x: number, y: number): void
}

const getTopOf = (e: Element): number => e.getBoundingClientRect().top

const offset = (offsets: number[]) => {
  const absed = map(abs, offsets)
  return indexOf(min(...absed), absed)
}

const current = compose(
  offset,
  map(getTopOf)
)

// returned index of closest element to viewport
const setup = (container: Element, scrollable: Scrollable = window) => {
  const children = Array.from(container.children)
  const scroll = k => scrollable.scrollBy(0, getTopOf(children[k()]))

  const incdec = predicate =>
    ifElse(
      () => predicate,
      () => max(dec(current(children)), 0),
      () => min(inc(current(children)), dec(children.length))
    )

  const emit = compose(
    scroll,
    incdec
  )

  const emitter = a => e => a(e) !== 0 && emit(a(e))
  const wheelEventHandler = emitter(e => e.preventDefault() || gt(0, e.deltaY))

  const keyboardEventHandler = emitter(e => {
    const up = includes(e.key, ["PageUp", "ArrowUp"])
    const down = includes(e.key, ["PageDown", "ArrowDown"])
    return up || down ? e.preventDefault() || (up && !down) : 0
  })

  document.addEventListener("wheel", wheelEventHandler, { passive: false })
  document.addEventListener("keydown", keyboardEventHandler)
  return () => {
    document.removeEventListener("wheel", wheelEventHandler)
    document.removeEventListener("keydown", keyboardEventHandler)
  }
}

export default setup
