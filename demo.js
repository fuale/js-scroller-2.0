import fullpagescroll from "./realizations/functional"
import FullPageScroll from "./realizations/object-oriented"

const [oop, fp] = ["oop", "fp"].map(e => document.getElementById(e))

/**
 * OOP Realization
 * @type {FullPageScroll}
 */
new FullPageScroll({
  container: oop
})
  .enableEventListeners()
  .disableEventListeners()
  .enableEventListeners()

/**
 * FP Realization
 * @type {function(): function(): *}
 */
const start = fullpagescroll(fp),
  stop = start()

stop()
start()
