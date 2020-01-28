import {
  dec,
  includes,
  indexOf,
  nth,
  pipe,
  map,
  length,
  prop,
  add,
  call,
  negate,
  lastIndexOf,
  tap
} from "ramda"

import { Just } from "monet"

const { abs, max, min } = Math

const getTop = maybe => maybe.getBoundingClientRect().top

const listener = y => (x, k) => (
  y.addEventListener(x, k, { passive: false }),
  () => y.removeEventListener(x, k)
)

const fullpagescroll = (c = document.body) => {
  const container = Just(c)
  const scroller = y =>
    container.map(c => (c.scrollBy(0, y), c))

  const getOffset = map(x =>
    container
      .map(getTop)
      .map(negate)
      .map(add(x))
      .getOrElse(0)
  )

  const position = () =>
    container
      .map(prop("children"))
      .map(Array.from)
      .map(map(getTop))
      .map(getOffset)

  const len = position()
    .map(length)
    .map(dec)
    .getOrElse(0)

  const current = x => indexOf(min(...x), x)
  const limit = e => (e < 0 ? max(dec(e), 0) : min(e, len))
  const scroll = e =>
    position()
      .map(nth(e))
      .map(scroller)

  const goto = n =>
    position()
      .map(map(abs))
      .map(current)
      .map(add(n))
      .map(limit)
      .map(scroll)

  const [mouse, keyboard] = [
    event => goto(event.deltaY > 0 ? 1 : -1),
    event => {
      const i = includes(event.key)
      const u = i(["PageUp", "ArrowUp"])
      const d = i(["PageDown", "ArrowDown"])
      goto(u || d ? (u && !d ? -1 : 1) : 0)
    }
  ]

  return () => {
    const l1 = listener(c)("wheel", mouse)
    const l2 = listener(window)("keydown", keyboard)
    return () => [l1, l2] |> map(call)
  }
}

export default fullpagescroll
