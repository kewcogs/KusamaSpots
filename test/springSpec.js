// const chai = require('chai'),
// import { expect } from 'chai'
import {assert, expect} from 'chai'
import { Spring, Anchor } from '../spring.js'
import { Vector} from '../vector2D.js'

function moveBallBy (ball, deltaX, deltaY) {
  ball.setPosition(ball.x() + deltaX, ball.y() + deltaY)
}

describe('moveBallBy function', () => {
  let ball

  beforeEach(() => {
    ball = new Anchor(0,0)
  })

  it('should shift in x direction by deltaX', () => {
    moveBallBy(ball, 42, 0)
    assert.equal(ball.x(), 42, "shift in x direction")
    assert.equal(ball.y(), 0, "shift in y direction")
  })

  it('should shift in y direction by deltaY', () => {
    moveBallBy(ball, 0, 1.23)
    assert.equal(ball.x(), 0, "shift in x direction")
    assert.equal(ball.y(), 1.23, "shift in y direction")
  })

})

describe('Springs', () => {

  let anchorTop, anchorBottom, ball, springTop, springBottom

  beforeEach(() => {
    anchorTop = new Anchor(0, -1);
    anchorBottom = new Anchor(0, 1);
    ball = new Anchor(0, 0);
    springTop = Spring.connect(anchorTop, ball, 1);
    springBottom = Spring.connect(anchorBottom, ball, 1);
  })


  it("should have zero force at initial position", () => {
    assert.equal(springTop.forceOn(ball).x, 0)
    assert.equal(springTop.forceOn(ball).y, 0)
    assert.equal(springBottom.forceOn(ball).x, 0)
    assert.equal(springBottom.forceOn(ball).y, 0)
  });

  it("should have zero force in x direction when moved in y direction only", () => {
    moveBallBy(ball, 0, 0.5);
    assert.equal(springTop.forceOn(ball).x, 0);
    assert.equal(springBottom.forceOn(ball).x, 0);
  });

  it("should have non-zero force in direction ball is moved", () => {
    moveBallBy(ball, 0, 0.5);
    assert.notEqual(springTop.forceOn(ball).y, 0);
    assert.notEqual(springBottom.forceOn(ball).y, 0);
  });

  it('should oppose positive y move with negative y force', () => {
    moveBallBy(ball, 0, 0.5)
    assert.isBelow(springTop.forceOn(ball).y, 0);
    assert.isBelow(springBottom.forceOn(ball).y, 0);
  });
  
  it('should oppose negative y move with positive y force', () => {
    moveBallBy(ball, 0, -0.5)
    assert.isAbove(springTop.forceOn(ball).y, 0);
    assert.isAbove(springBottom.forceOn(ball).y, 0);
  });
  
  it('should oppose positive x move with negative x force', () => {
    moveBallBy(ball, 0.5, 0)
    assert.isBelow(springTop.forceOn(ball).x, 0);
    assert.isBelow(springBottom.forceOn(ball).x, 0);
  });
  
  it('should oppose negative x move with positive x force', () => {
    moveBallBy(ball, -0.5, 0)
    assert.isAbove(springTop.forceOn(ball).x, 0);
    assert.isAbove(springBottom.forceOn(ball).x, 0);
  });
  
})