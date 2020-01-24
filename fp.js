import {
  dec,
  gt,
  ifElse,
  inc,
  includes,
  indexOf,
  nth,
  apply,
  compose,
  map,
  length,
  prop
} from "ramda"

const { abs, max, min } = Math

// getTopOfChild :: Element -> Number
const getTopOfChild = maybe => maybe.getBoundingClientRect().top

// offset :: [Number] -> Number
const offset = offsets => {
  const absed = map(abs, offsets)
  return indexOf(apply(min, absed), absed)
}

// incdec :: [Element] -> (* -> Boolean) -> Number
const incdec = (value, maximum) => predicate => {
  return ifElse(
    () => predicate,
    () => max(dec(value), 0),
    () => min(inc(value), dec(maximum))
  )(null)
}

// listener :: String -> (Event -> *) -> (* -> *)
const listener = (x, k) => {
  document.addEventListener(x, k, { passive: false })
  return () => document.removeEventListener(x, k)
}

const scroll = x => y => x.scrollBy(0, y)

const fullpagescroll = (innerContainer, outerContainer = window) => {
  const scroller = scroll(outerContainer)

  // getChildren :: Element -> [Element]
  const getChildren = compose(Array.from, prop("children"))
  const getChildrenLength = compose(length, getChildren)
  const getChild = x => compose(nth(x), getChildren)
  const current = getChildren(innerContainer) |> map(getTopOfChild) |> offset
  // getIndedx :: (* -> Boolean) -> Number
  const getIndex = incdec(current, getChildrenLength(innerContainer))
  const tfscroll = x => compose(scroller, getTopOfChild, compose(getChild, getIndex)(x))
  // emitter :: (* -> Boolean) -> Event -> *
  const emitter = predicate => event => {
    if (predicate(event) !== 0) {
      tfscroll(predicate(event))(innerContainer)
    }
  }

  const wheelEventHandler = emitter(e => {
    e.preventDefault()
    return gt(0, e.deltaY)
  })

  const keyboardEventHandler = emitter(e => {
    const i = includes(e.key),
      up = i(["PageUp", "ArrowUp"]),
      down = i(["PageDown", "ArrowDown"])
    return up || down ? e.preventDefault() || (up && !down) : 0
  })

  return () => {
    const listeners = [
      listener("wheel", wheelEventHandler),
      listener("keydown", keyboardEventHandler)
    ]
    return () => listeners |> map(x => x())
  }
}

export default fullpagescroll
