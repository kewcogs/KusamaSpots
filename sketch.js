
import {Spot} from './spot.js';
import {Spring, Anchor} from './spring.js';
const {Engine, Body, Composite} = Matter;

let spots = []
let dim = 11  // number of spots along long side 

const StiffnessCoefficient = 2e-9   // base number for calculating spring stiffness 'k'

export function restartSketch(n) {
    dim = n
    spots = []    // trigger regeneration of spots on next draw()
}

export function runSketch(w, h, n, parentNode = null){
    
    const sketch  = (p) => {
        let engine;
        let selectedSpot = null

        p.setup = () => {
            dim = n
            engine = Engine.create({gravity:{scale: 0}})
            if (parentNode != null){
                let canv = p.createCanvas(w, h);
                canv.parent(parentNode)
            } else {
                p.createCanvas(p.windowWidth, p.windowHeight);
            }
        }

        p.draw = () => {
            // check if new spots need to be generated, either after startup or a restart
            if (spots.length == 0){
                Composite.clear(engine.world, false)
                spots = spotGrid(dim, 0.001/p.height);
                Composite.add(engine.world, spots.map((s) => s.body));
            }

            Engine.update(engine);   
            p.background(60);
            spots.forEach((s) => {
                Body.applyForce(s.body, s.body.position, s.netForce())
                drawSpot(s)
            })
        }

        p.mousePressed = () => {
            // try to select closest spot - but only if the mouse pointer is within the canvas
            if(p.mouseX >= 0 && p.mouseY >= 0 && p.mouseX < p.width && p.mouseY < p.height){
                selectedSpot = closestSpotTo(spots, p.mouseX, p.mouseY)
            }

            if(selectedSpot != null){
                Body.setStatic(selectedSpot.body, true)
            }
        }

        p.mouseReleased = () => {
            if(selectedSpot != null) {
                Body.setStatic(selectedSpot.body, false)
            }
            selectedSpot = null
        }

        p.mouseDragged = (event) => {
            if(selectedSpot != null){
                // selectedSpot.move(event.movementX, event.movementY);
                selectedSpot.moveTo(p.mouseX, p.mouseY);
            }
        }

        // returns the first spot in 'spots' which covers position (x,y)
        //  or null if no such spot
        const spotAt = (spots, x, y) => {
            for (const s in spots) {
                let spot = spots[s];
                if (p.dist(x, y, spot.x(), spot.y()) <= spot.size / 2){
                    return spot;
                }
            }
            return null;
        }

        // returns the spot whose centre is closest to position (x, y)
        const closestSpotTo = (spots, x, y) => {
            let closestDist = Infinity
            let closestSpot = null
            for(const s in spots){
                let spot = spots[s];
                let dist = p.dist(x, y, spot.x(), spot.y())
                if(dist < closestDist){
                    closestDist = dist
                    closestSpot = spot
                }
            }
            return closestSpot
        }

        const  spotGrid = (majorCount) => {

            let k

            let rows,cols;
            if (p.width > p.height ) {
                cols = majorCount;
                rows = Math.max (1, 
                                Math.floor (majorCount * p.height / p.width));
            } else {
                rows = majorCount;
                cols = Math.max(1,
                                Math.floor (majorCount * p.width / p.height));
            }
            const spotSize = p.width / (2*cols + 1);
            const rowOffset = (p.height - 2*spotSize*(rows - 1)) / 2;
            const colOffset = (p.width - 2*spotSize*(cols - 1)) / 2;
            const spacing = spotSize * 2


            k = StiffnessCoefficient * spotSize**2

            let spots = [];
            for(let r = 0; r < rows; r++){
                for(let c = 0; c < cols; c++){
                spots.push(new Spot(spotSize/2 + spotSize/2 * p.random(), 
                                    colOffset + spacing * c, 
                                    rowOffset + spacing * r));
                }
            }

            // connect all spots in a column
            for(let c = 0; c < cols; c++){
                let s = spots[c]
                let ss

                // connect top spot in column to anchor along top edge
                Spring.connect(s, new Anchor(s.x(), 0), k) 
                for(let cc = c; cc < spots.length; cc += cols){
                    // connect spots to row above
                    ss = spots[cc]
                    Spring.connect(s, ss, k)
                    s = ss
                }
                // connect bottom spot to anchor below on bottom edge
                Spring.connect(s, new Anchor(s.x(), p.height), k)
            }

            // connect all spots in a row
            for(let r = 0; r < rows; r++) {
                let s = spots[r * cols]
                let ss 

                // connect left-most spot to anchor
                Spring.connect(s, new Anchor(0, s.y()), k) 
                for(let c = 0; c < cols; c++){
                    ss = spots[r * cols + c]
                    Spring.connect(s, ss, k)
                    s = ss
                }
                // connect right-most spot to anchor
                Spring.connect(s, new Anchor(p.width, s.y()), k)
            }
            return spots;
        }

        const drawSpot = (s) => {
            p.push()
            p.fill('red');
            p.noStroke();
            p.ellipse (s.x(), s.y(), s.size, s.size)
            p.pop()
        }
    }


    new p5(sketch)
}