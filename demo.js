import fullpagescroll from "./fp"
import FullPageScroll from "./oop"

const [oop, fp] = ["oop", "fp"].map(e =>
  document.getElementById(e)
)

/**
 * OOP Realization
 * @type {FullPageScroll}
 */
new FullPageScroll({
  container: oop,
  scroll: oop
}).enableEventListeners()

/**
 * FP Realization
 * @type {function(): function(): *}
 */
const start = fullpagescroll(fp),
  stop = start()
