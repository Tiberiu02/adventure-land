function Geometry() {}

module.exports = Geometry;

Geometry.dist = function( p1, p2 ) {
  return Math.sqrt( ( p1.x - p2.x ) * ( p1.x - p2.x ) + ( p1.y - p2.y ) * ( p1.y - p2.y ) );
}

Geometry.intCircleSegment = function( circle, segment ) {
  var tri = new Geometry.Triangle( circle.center, segment.p1, segment.p2 );
  var h = tri.area / segment.size * 2;

  return h <= circle.radius;
}

// Point

Geometry.Point = function( x, y ) {
  this.type = "point";

  this.x = x;
  this.y = y;
}

// Segment

Geometry.Segment = function( p1, p2 ) {
  this.type = "segment";

  this.p1 = p1;
  this.p2 = p2;
}

Geometry.Segment.prototype.getY = function( x ) {
  if ( x < this.p1.x && x < this.p2.x || x > this.p1.x && x > this.p2.x )
    return undefined;
  else
    return ( this.p1.y * Math.abs( x - this.p2.x ) + this.p2.y * Math.abs( x - this.p1.x ) ) / Math.abs( this.p2.x - this.p1.x );
}

Geometry.Segment.prototype.isAbove = function( p ) {
  return p.y < this.getY( p.x );
}

Geometry.Segment.prototype.size = function() {
  return Geometry.dist( this.p1, this.p2 );
}

// Triangle

Geometry.Triangle = function( p1, p2, p3 ) {
  this.type = "triangle";

  this.p1 = p1;
  this.p2 = p2;
  this.p3 = p3;

  this.l1 = Geometry.dist( p2, p3 );
  this.l2 = Geometry.dist( p1, p3 );
  this.l3 = Geometry.dist( p1, p2 );

  this.p = ( this.l1 + this.l2 + this.l3 ) / 2;
  this.area = Math.sqrt( this.p * ( this.p - this.l1 ) * ( this.p - this.l2 ) * ( this.p - this.l3 ) );
}

// Circle

Geometry.Circle = function( p, r ) {
  this.type = "circle";

  this.center = p;
  this.radius = r;
}

Geometry.Circle.prototype.isInside = function( p ) {
  return Geometry.dist( p, this.center ) < this.radius;
}

// Polygon

Geometry.Polygon = function( points ) {
  this.type = "polygon";
  this.points = points;
}

Geometry.Polygon.prototype.isInside = function( p ) {
  var inInside = false;

  for ( var i = 1; i < this.point.length; i ++ ) {
    var seg = new Geometry.Segment( this.points[i], this.points[i - 1] );

    if ( seg.isAbove( p ) )
      isInside = !isInside;
  }

  return isInside;
}
