import { Vector } from './vector2D.js'

export class Attachment {
  constructor() {
    this.springs = []
  }

  connect (spring) {
    this.springs.push(spring)
  }

  forces (){
    return this.springs.map((s) => s.forceOn(this))
  }

  netForce (){
    return Vector.sum(this.forces())
  }
}

export class Anchor extends Attachment {
  constructor (x, y) {
    super()
    this.x_ = x
    this.y_ = y
  }

  x(){ return this.x_}
  y(){ return this.y_}

  setPosition (x, y) { 
    this.x = () => x
    this.y = () => y
  }

  
}

export class Spring {
  constructor (attachment1, attachment2, stiffness) {
    this.k = stiffness;
    this.at1 = attachment1;
    this.at2 = attachment2;
    this.restLen =  Vector.vector(this.at2.x() - this.at1.x(), 
                                   this.at2.y() - this.at1.y())
  }

  forceOn_(attachment) {
    let len = Vector.vector(this.at2.x() - this.at1.x(), 
                            this.at2.y() - this.at1.y())
    switch (attachment){
      case this.at1: 
        return Vector.scale(Vector.sub(len, this.restLen), this.k)
      case this.at2: 
        return Vector.scale(Vector.sub(len, this.restLen), -this.k)
      default: return Vector.vector(0,0)
    }      
  }

  forceOn(at){
    let f = this.forceOn_(at)
    return f
  }

  static connect (att1, att2, stiffness) {
    let spring = new Spring(att1, att2, stiffness)
    att1.connect(spring)
    att2.connect(spring)

    return spring
  }
}