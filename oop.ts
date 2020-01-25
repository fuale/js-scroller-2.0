interface Options {
  container: Element
  scroll: Scrollable
}

interface Scrollable {
  scrollBy(x: number, y: number): void
}

export default class FullPageScroll {
  private readonly container: Element
  private readonly scroll: Scrollable

  constructor(options: Options) {
    this.container = options.container
    this.scroll = options.scroll || options.container
  }

  private static getTopOffset(element: Element): number {
    return element.getBoundingClientRect().top
  }

  private wheelEventHandler(event: WheelEvent): void {
    event.preventDefault()
    const current = this.getCurrent()
    const max = this.container.children.length - 1
    event.deltaY > 0
      ? this.scrollTo(Math.min(current + 1, max))
      : this.scrollTo(Math.max(current - 1, 0))
  }

  private getCurrent(): number {
    const { abs } = Math
    const children = Array.from(this.container.children)
    let offsets = []
    for (let i = children.length; i--; ) {
      offsets[i] = FullPageScroll.getTopOffset(children[i])
    }
    const minimum = offsets.reduce((a, c) => (abs(c) < abs(a) ? c : a), Infinity)
    return offsets.indexOf(minimum)
  }

  private scrollTo(i: number) {
    const child = this.container.children.item(i)
    const range = FullPageScroll.getTopOffset(child)
    this.scroll.scrollBy(0, range)
  }

  private keyboardEventHandler(event: KeyboardEvent): void {
    const max = this.container.children.length - 1
    const current = this.getCurrent()
    const up = ["PageUp", "ArrowUp"].includes(event.key)
    const down = ["PageDown", "ArrowDown"].includes(event.key)
    if (up || down) {
      event.preventDefault()
      up && this.scrollTo(Math.max(current - 1, 0))
      down && this.scrollTo(Math.min(current + 1, max))
    }
  }

  public enableEventListeners(): void {
    document.addEventListener("wheel", this.wheelEventHandler.bind(this), {
      passive: false
    })
    document.addEventListener("keydown", this.keyboardEventHandler.bind(this))
  }

  public disableEventListeners(): void {
    document.removeEventListener("wheel", this.wheelEventHandler.bind(this))
    document.removeEventListener("keydown", this.keyboardEventHandler.bind(this))
  }
}
