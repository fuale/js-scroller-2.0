import setup from "./fp"
import FullPageScroll from "./oop"

const fullPageScroll = new FullPageScroll({
  container: document.querySelector("#container")
})

//fullPageScroll.start()
const teardown = setup(document.querySelector("#container"))
