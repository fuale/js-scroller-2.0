import fullpagescroll from "./fp"
import FullPageScroll from "./oop"

const fullPageScroll = new FullPageScroll({
  container: document.querySelector("#container")
})

//fullPageScroll.start()
const start = fullpagescroll(document.querySelector("#container"))
const stop = start()

