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
  call
} from "ramda"

const { abs, max, min } = Math

/**
 * return top of the
 * block relative to window
 * @param maybe {Element}
 * @returns {number}
 * @sig Element -> Number
 */
const getTop = maybe => maybe.getBoundingClientRect().top

/**
 * add listener to dom and
 * returns function that removes it
 * @param x {string}
 * @param k {function}
 * @sig String -> (Event -> *) -> (* -> *)
 */
const listener = (x, k) => (
  document.addEventListener(x, k, { passive: false }),
  () => document.removeEventListener(x, k)
)

const fullpagescroll = (
  innerContainer,
  outerContainer = window
) => {
  /**
   * @sig Number -> *
   * @param y {number}
   */
  const scroller = y => outerContainer.scrollBy(0, y)

  /**
   * @pure
   * @sig * -> [Number]
   * @returns {number[]}
   */
  const position = () =>
    innerContainer
    |> prop("children")
    |> Array.from
    |> map(getTop)

  /** @type {number} */
  const len = position() |> length |> dec

  /**
   * @pure
   * @param x {number[]}
   * @sig [Number] -> Number
   * @returns {number}
   */
  const current = x => indexOf(min(...x), x)
  const limit = e => (e < 0 ? max(dec(e), 0) : min(e, len))
  const scroll = e => pipe(nth(e), scroller)(position())

  /**
   * Перелистывание на `n`
   * @param n - кол-во страниц
   * @sig Number -> *
   */
  const goto = n =>
    position()
    |> map(abs)
    |> current
    |> add(n)
    |> limit
    |> scroll

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
