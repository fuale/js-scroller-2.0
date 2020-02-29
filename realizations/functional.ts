import { dec, includes, indexOf, nth, map, length, add, negate } from "ramda"

const { abs, max, min } = Math

const getTop = (maybe: Element) => maybe.getBoundingClientRect().top

type listener = (y: EventTarget) => (x: string, k: EventListener) => () => void
const listener: listener = y => (x, k) => {
  y.addEventListener(x, k, { passive: false })
  return () => y.removeEventListener(x, k)
}

type call = (f: Function[]) => any
const call: call = f => f.map(x => x())

const fullpagescroll = (node: Element = document.body) => {
  const scrollBy = y => node.scrollBy(0, y)
  const getOffset = map((x: number) => add(x, negate(getTop(node))) || 0)
  const getPosition = () => getOffset(Array.from(node.children).map(getTop))
  const lenChildren = dec(length(getPosition())) || 0
  const current = x => indexOf(min(...x), x)
  const limit = e => (e < 0 ? max(dec(e), 0) : min(e, lenChildren))
  const scroll = to => scrollBy(nth(to, getPosition()))
  const goto = n => scroll(limit(add(n, current(getPosition().map(abs)))))

  const [mouseListener, keyboardListener] = [
    event => goto(event.deltaY > 0 ? 1 : -1),
    event => {
      const i = includes(event.key)
      const u = i(["PageUp", "ArrowUp"])
      const d = i(["PageDown", "ArrowDown"])
      goto(u || d ? (u && !d ? -1 : 1) : 0)
    }
  ]

  return () => {
    const remove = [
      listener(node)("wheel", mouseListener),
      listener(window)("keydown", keyboardListener)
    ]

    return () => call(remove)
  }
}

export default fullpagescroll
