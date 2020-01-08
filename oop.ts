interface Options {
  container: Element
}

export default class FullPageScroll {
  private top: number
  private readonly container: Element

  constructor(options: Options) {
    this.container = options.container
  }

  private getTopOffset(element: Element) {
    return element.getBoundingClientRect().top
  }

  public start() {
    this.enableEventListeners()
  }

  private wheelEventHandler(event: WheelEvent) {
    event.preventDefault()
    this.top = this.getTopOffset(this.container)
    const offsets = Array.from(this.container.children).map(
      child => this.top + this.getTopOffset(child)
    )
    const abs = offsets.reduce((a, c) => (Math.abs(c) < Math.abs(a) ? c : a), Math.max(...offsets))
    const current = offsets.indexOf(abs)
    if (event.deltaY > 0) {
      console.log((current + 1) % (this.container.children.length - 1))
      this.scrollTo((current + 1) % (this.container.children.length - 1))
    } else {
      this.scrollTo((current - 1) % (this.container.children.length - 1))
    }
  }

  private scrollTo(i: number) {
    window.scrollBy(0, this.getTopOffset(this.container.children[i]))
  }

  private keyboardEventHandler() {}

  private enableEventListeners() {
    document.addEventListener("wheel", this.wheelEventHandler.bind(this), { passive: false })
    document.addEventListener("wheel", this.keyboardEventHandler.bind(this))
  }

  private disableEventListeners() {
    document.removeEventListener("wheel", this.wheelEventHandler.bind(this))
    document.removeEventListener("keydown", this.keyboardEventHandler.bind(this))
  }

  public stop() {
    this.disableEventListeners()
  }
}
