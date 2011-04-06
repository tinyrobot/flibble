jingo.declare({
	require: [
		'util.Class'
	],
  name: 'com.tinyrobot.flibble.geom.Rectangle',
  as: function() {
    Rectangle = Class.extend({
			init: function(x,y,width,height){
				this.x = x||0;
				this.y = y||0;
				this.width = width||0;
				this.height = height||0;
			},
			intersectsPoint: function(point){
				return !(point.x < this.x || point.x > this.x+this.width || point.y < this.y || point.y > this.y+this.height);
			}
		});
	}
});
