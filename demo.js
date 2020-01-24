import fullpagescroll from "./fp"
import FullPageScroll from "./oop"

/**
 * OOP Realization
 * @type {FullPageScroll}
 */
new FullPageScroll({
  container: document.querySelector("#oop"),
  scroll: document.querySelector("#oop")
}).enableEventListeners()

/**
 * FP Realization
 * @type {function(): function(): *}
 */
const container = document.querySelector("#fp")
const start = fullpagescroll(container, container)
const stop = start()
