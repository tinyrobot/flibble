jingo.declare({
	require: [
		'util.Class'
	],
  name: 'com.tinyrobot.flibble.geom.Point',
  as: function() {
    Point = Class.extend({
			init: function(x,y){
				this.x = x;
				this.y = y;
			},
			normalize: function(val){
				var n = Math.sqrt((this.x*this.x)+(this.y*this.y));
				this.x/=n;
				this.y/=n;
				this.x > val? this.x = val : this.x = this.x;
				this.y > val ? this.y = val : this.y = this.y;
			},
			subtract: function(pt){
				return new Point(this.x - pt.x,this.y - pt.y);
			}
		})
  }
});
