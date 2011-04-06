jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.display.DisplayObject',
		'com.tinyrobot.flibble.display.Graphics'
	],
  name: 'com.tinyrobot.flibble.display.Sprite',
  as: function() {
    Sprite = DisplayObject.extend({
			init: function(){
				this._super();
				this.graphics = new Graphics();
			},
			_render: function(cx){
				this.graphics.render(cx);
			}
		});
  }
});
