import { dec, includes, indexOf, nth, pipe, map, length, prop, add, call } from "ramda"

const { abs, max, min } = Math
const getTop = maybe => maybe.getBoundingClientRect().top
const scroll = x => y => (x.scrollBy(0, y), y)
const listener = (x, k) => (
  document.addEventListener(x, k, { passive: false }),
  () => document.removeEventListener(x, k)
)

const fullpagescroll = (innerContainer, outerContainer = window) => {
  const scroller = scroll(outerContainer)
  const position = () => innerContainer |> prop("children") |> Array.from |> map(getTop)
  const len = position() |> length |> dec
  const current = x => indexOf(min(...x), x)
  const limit = e => (e < 0 ? max(dec(e), 0) : min(e, len))
  const doe = e => pipe(nth(e), scroller)(position())
  const goto = n => position() |> map(abs) |> current |> add(n) |> limit |> doe

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
    const m = listener("wheel", mouse)
    const k = listener("keydown", keyboard)
    return () => [m, k] |> map(call)
  }
}

export default fullpagescroll
