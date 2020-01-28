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
  negate
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
 * @sig Element -> String -> (Event -> *) -> (* -> *)
 */
const listener = y => (x, k) => (
  y.addEventListener(x, k, { passive: false }),
  () => y.removeEventListener(x, k)
)

/**
 * @param container {Element} - contains slides
 * @returns {function(): function(): *}
 * @sig Element -> (* -> (* -> *))
 */
const fullpagescroll = (container = document.body) => {
  /**
   * @sig Number -> *
   * @param y {number}
   */
  const scroller = y => container.scrollBy(0, y)

  const getOffset =
    container |> getTop |> negate |> add |> map

  /**
   * @sig * -> [Number]
   * @returns {number[]}
   */
  const position = () =>
    container
    |> prop("children")
    |> Array.from
    |> map(getTop)
    |> getOffset

  /** @type {number} */
  const len = position() |> length |> dec

  /**
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
    const l1 = listener(container)("wheel", mouse)
    const l2 = listener(window)("keydown", keyboard)
    return () => [l1, l2] |> map(call)
  }
}

export default fullpagescroll
