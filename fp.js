import { dec, gt, ifElse, inc, includes, indexOf, map, nth, apply, flip } from "ramda"

const { abs, max, min } = Math

// getTopOfChild :: Element -> Number
const getTopOfChild = e => e.getBoundingClientRect().top

// offset :: [Number] -> Number
const offset = offsets => {
  const absed = map(abs, offsets)
  return indexOf(apply(min, absed), absed)
}

// incdec :: [Element] -> (* -> Boolean) -> Number
const incdec = children => predicate => {
  const current = children |> map(getTopOfChild) |> offset
  return ifElse(
    () => predicate,
    () => max(dec(current), 0),
    () => min(inc(current), dec(children.length))
  )(null)
}

// listener :: String -> (Event -> *) -> (* -> *)
const listener = (x, k) => {
  document.addEventListener(x, k, { passive: false })
  return () => document.removeEventListener(x, k)
}

const fullpagescroll = (container, scrollable = window) => {
  // children :: [Element]
  const children = Array.from(container.children)
  // scroll :: Number -> *
  const scroll = y => scrollable.scrollBy(0, y)
  // getChild :: Number -> Element
  const getChild = flip(nth)(children)
  // getIndedx :: (* -> Boolean) -> Number
  const getIndex = incdec(children)
  // emitter :: (* -> Boolean) -> Event -> *
  const emitter = predicate => event => {
    if (predicate(event) !== 0) {
      event |> predicate |> getIndex |> getChild |> getTopOfChild |> scroll
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
