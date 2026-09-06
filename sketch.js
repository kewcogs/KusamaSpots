
import {Spot} from './spot.js';
import {Spring, Anchor, Attachment} from './spring.js';
import {Vector} from './vector2D.js'
const {Engine, Body, Bodies, Composite} = Matter;

const sketch  = (p) => {
    let engine;
    let spots;
    let selectedSpot = null

    p.setup = () => {
        engine = Engine.create({gravity:{scale: 0}})
        p.createCanvas(p.windowWidth -10, p.windowHeight-10);
        spots = arrangedSpots(11, 0.001/p.height);
        Composite.add(engine.world, spots.map((s) => s.body));
    }

    p.draw = () => {
        Engine.update(engine);
        p.background(60);
        spots.forEach((s) => {
            Body.applyForce(s.body, s.body.position, s.netForce())
            drawSpot(s)
        })
    }

    p.mousePressed = () => {
        selectedSpot = spotAt(spots, p.mouseX, p.mouseY)
        if(selectedSpot != null){
            Body.setStatic(selectedSpot.body, true)
        }
    }

    p.mouseReleased = () => {
        if(selectedSpot != null) {
            //p.print(forceReport(selectedSpot))
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


    const forceReport = (a) => {
        let report = `Forces on (${a.x().toFixed(1)},${a.y().toFixed(1)}): `
        // report = report.concat(`{${a.forces()}}`)
        let forces = a.forces() //a.springs.map((s) => s.forceOn(a))
        forces.forEach((f) => {
            report = report.concat(`{x: ${f.x.toFixed(3)}, y: ${f.y.toFixed(3)}] `)
        })
    
        // report = report.concat(forces)
        // a.springs.forEach((sp) => {
        //     let f = sp.forceOn(a)
        //     report = report.concat(`{x: ${f.x.toFixed(1)}, y: ${f.y.toFixed(1)}] `)
        // } )
        let netF = a.netForce()
        report = report.concat(`Net force: {x: ${netF.x.toFixed(3)}, y: ${netF.y.toFixed(3)}`)
        return report
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

    const  arrangedSpots = (majorCount, springStiffness) => {
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

            // connect top spot in column to anchor
            Spring.connect(s, new Anchor(s.x(), 0), springStiffness) 
            for(let cc = c; cc < spots.length; cc += cols){
                // connect spots to row above
                ss = spots[cc]
                Spring.connect(s, ss, springStiffness)
                s = ss
            }
            // Spring.connect(spots[c + cols*(rows - 1)], new Anchor(spots[c].x(), p.height), springStiffness)
            Spring.connect(s, new Anchor(s.x(), p.height), springStiffness)
        }

        // connect all spots in a row
        for(let r = 0; r < rows; r++) {
            let s = spots[r * cols]
            let ss 

            // connect left-most spot to anchor
            Spring.connect(s, new Anchor(0, s.y()), springStiffness) 
            for(let c = 0; c < cols; c++){
                ss = spots[r * cols + c]
                Spring.connect(s, ss, springStiffness)
                s = ss
            }
            // connect right-most spot to anchor
            Spring.connect(s, new Anchor(p.width, s.y()), springStiffness)
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
