import { dec, includes, indexOf, nth, pipe, map, length, prop, add, call } from "ramda"

import { Just } from "monet"

const { abs, max, min } = Math

// getTop :: Element -> Number
const getTop = maybe => maybe.getBoundingClientRect().top

// listener :: String -> (Event -> *) -> (* -> *)
const listener = (x, k) => {
  document.addEventListener(x, k, { passive: false })
  return () => document.removeEventListener(x, k)
}

const scroll = x => y => (x.scrollBy(0, y), y)

const fullpagescroll = (innerContainer, outerContainer = window) => {
  const scroller = scroll(outerContainer)

  const position = () =>
    Just(innerContainer)
      .map(prop("children"))
      .map(Array.from)
      .map(map(getTop))

  const len = dec(
    position()
      .map(length)
      .just()
  )

  const goto = n =>
    position()
      .map(map(abs))
      .map(x => indexOf(min(...x), x))
      .map(add(n))
      .map(e => (e < 0 ? max(dec(e), 0) : min(e, len)))
      .flatMap(e => position().map(pipe(nth(e), scroller)))

  const khandler = event => {
    const i = includes(event.key)
    const u = i(["PageUp", "ArrowUp"])
    const d = i(["PageDown", "ArrowDown"])
    goto(u || d ? (u && !d ? -1 : 1) : 0)
  }

  const mhandler = event => goto(event.deltaY > 0 ? 1 : -1)

  return () => {
    const l = [listener("wheel", mhandler), listener("keydown", khandler)]
    return () => l |> map(call)
  }
}

export default fullpagescroll
