
/**
 * Vector class
 * @param       {Number} x
 * @param       {Number} y
 * @constructor
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
    this.add = function(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    this.copy = function() {
        return new Vector(this.x, this.y);
    }
    this.mult = function(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
}
