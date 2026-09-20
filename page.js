import {runSketch, restartSketch} from "./sketch.js"

function toggleDisplay(id){
  return () => {
    let elt = document.getElementById(id)
    if(elt.style.display === "block"){
      elt.style.display = "none"
    } else {
      elt.style.display = "block"
    }
  }
}

const toggleBlurb = toggleDisplay("blurb")
const toggleQR = toggleDisplay("qrcode")
// function toggleBlurb() {
//   let blurb = document.getElementById("blurb")
//   if (blurb.style.display === "block"){
//     blurb.style.display = "none"
//   } else {
//     blurb.style.display = "block"
//   }
// }

function toggleMore() {
  let controlbar = document.getElementById("controlbar")
  let showButton = document.getElementById("showmore")
  if (controlbar.style.display === "block"){
    controlbar.style.display = "none"
    showButton.textContent = "more_horiz"
  } else {
    controlbar.style.display = "block"
    showButton.textContent = "more_vert"
  }
}

function getNumSpots() {
    return Number(document.getElementById("numspots").value)
}

window.addEventListener ("load", (evt) => {

  document.getElementById("refreshbtn").onclick = () => {
    // let n = document.getElementById("numspots").value
    toggleMore()
    // restartSketch(Number(n))
    restartSketch(getNumSpots())
  }

  document.getElementById("blurbclose").onclick = toggleBlurb
  document.getElementById("blurbshow").onclick = toggleBlurb
  document.getElementById("showmore").onclick = toggleMore
  document.getElementById("qrbutton").onclick = toggleQR
  document.getElementById("qrclose").onclick = toggleQR

  let sbx =  document.getElementById("sketch-box")
  let rect = sbx.getBoundingClientRect()
  runSketch(rect.width, rect.height * 0.99, getNumSpots(), sbx)
})
