import {
  compose,
  converge,
  dec,
  gt,
  ifElse,
  inc,
  includes,
  indexOf,
  map,
  prop,
  reduce
} from "ramda"
const { abs, max, min } = Math

// Any HTML element which is scrollable
interface Scrollable {
  scrollBy(x: number, y: number): void
}

const getTopOf = (e: Element): number => prop("top", e.getBoundingClientRect())

// returned index of closest element to viewport
const current = (top: number, children: Element[]) => {
  const list = compose(map(abs), map(getTopOf))
  const get = compose(indexOf, reduce(min, Infinity), list)

  console.log (
      get(children)(list(children))
  )

  return get(children)(list(children))
}

const eventHandler = (current: number, maximum: number) => (predicate: boolean) =>
  ifElse(
    () => predicate,
    () => max(dec(current), 0),
    () => min(inc(current), dec(maximum))
  )

const setup = (container: Element, scrollable: Scrollable = window) => {
  const childs = Array.from(container.children)
  const scroll = k => scrollable.scrollBy(0, getTopOf(childs[k()]))
  const incdec = x => eventHandler(current(container.scrollTop, childs), childs.length)(x)
  const emitter = a => e => a(e) !== 0 && compose(scroll, incdec)(a(e))
  const wheelEventHandler = emitter(event => event.preventDefault() || gt(0, event.deltaY))
  const keyboardEventHandler = emitter(event => {
    const up = includes(event.key, ["PageUp", "ArrowUp"])
    const down = includes(event.key, ["PageDown", "ArrowDown"])
    return up || down ? event.preventDefault() || (up && !down) : 0
  })

  document.addEventListener("wheel", wheelEventHandler, { passive: false })
  document.addEventListener("keydown", keyboardEventHandler)
  return () => {
    document.removeEventListener("wheel", wheelEventHandler)
    document.removeEventListener("keydown", keyboardEventHandler)
  }
}

export default setup
