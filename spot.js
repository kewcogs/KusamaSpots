import {Attachment} from './spring.js';

export class Spot extends Attachment{
  constructor (size, x, y) {
    super()
    this.size = size;
    this.body = Matter.Bodies.circle(x, y, size/2, {frictionAir: 0});
  }

  x () {
    return this.body.position.x;
  }

  y (){
    return this.body.position.y;
  }

  move (deltaX, deltaY){
    const pos = this.body.position
    this.moveTo(pos.x + deltaX, pos.y + deltaY);
  }
  
  moveTo (newX, newY) {
    Matter.Body.setPosition(this.body, {x: newX, y: newY})
  }

  covers (x, y) {
    
  }

  
}