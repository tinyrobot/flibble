jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.display.DisplayObject'
	],
  name: 'com.tinyrobot.flibble.display.Bitmap',
  as: function() {
    Bitmap = DisplayObject.extend({
			init: function(image){
				this._super();
				this.image = image;
				this.width = this.image.width;
				this.height = this.image.height;
			},
			_render: function(cx){
				cx.drawImage(this.image,0,0);
			}
		});
  }
});
