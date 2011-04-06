jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.geom.Point'
	],
  name: 'com.tinyrobot.flibble.geom.Matrix',
  as: function() {
  	//written from:
  	//http://www.senocular.com/flash/tutorials/transformmatrix/
    Matrix = Class.extend({
			init: function(a,b,c,d,tx,ty){
				this.a = a || 1;
				this.b = b || 0;
				this.c = c || 0;
				this.d = d || 1;
				this.u = 0;
				this.v = 0;
				this.w = 1;
				this.tx = tx || 0;
				this.ty = ty || 0;
			},
			identity: function(){
				this.a = 1;
				this.b = 0;
				this.c = 0;
				this.d = 1;
				this.u = 0;
				this.v = 0;
				this.w = 1;
				this.tx = 0;
				this.ty = 0;
			},
			translate: function(x,y){
				this.tx += x;
				this.ty += y;
			},
			scale: function(x,y){
				this.a *= x;
				this.d *= y;
				this.tx *= x;
				this.ty *= y;
			},
			rotate: function(rads){
				var cos = Math.cos(rads);
				var sin = Math.sin(rads);
				var a = this.a,b = this.b,c = this.c,d = this.d,tx = this.tx,ty = this.ty;// = this.a,this.b,this.c,this.d,this.tx,this.ty;
				this.a = a*cos-b*sin;
				this.b = a*sin+b*cos;
				this.c = c*cos-d*sin;
				this.d = c*sin+d*cos;
				this.tx = tx*cos-ty*sin;
				this.ty = tx*sin+ty*cos;
			},
			clone: function(){
				return new Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
			},
			concat: function(m2){
				var a = this.a,b=this.b,c=this.c,d=this.d,tx=this.tx,ty=this.ty;// = this.a,this.b,this.c,this.d,this.tx,this.ty;
				this.a = a*m2.a+b*m2.c;
				this.b = a*m2.b+b*m2.d;
				this.c = c*m2.a+d*m2.c;
				this.d = c*m2.b+d*m2.d;
				this.tx = tx*m2.a+ty*m2.c+m2.tx;
				this.ty = tx*m2.b+ty*m2.d+m2.ty;
			},
			transformPoint: function(point){
				return new Point(point.x*this.a + point.y*this.c + this.tx,point.x*this.b + point.y*this.d + this.ty);
			}
		});
  }
});
