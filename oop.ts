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

  private getTopOffset(element: Element): number {
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
    const children = Array.from(this.container.children)
    const offsets = children.map(this.getTopOffset)
    const { abs, max } = Math
    return offsets.indexOf(
      offsets.reduce((a, c) => (abs(c) < abs(a) ? c : a), max(...offsets))
    )
  }

  private scrollTo(i: number) {
    this.scroll.scrollBy(0, this.getTopOffset(this.container.children.item(i)))
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
