import {Vector} from '../vector2D.js'
import {assert} from 'chai'

describe('Vector', () => {
  it('should have zero magnitude for zero vector',() => {
    assert.equal(Vector.mag(Vector.zero),0)
  })

});
