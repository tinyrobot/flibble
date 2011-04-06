jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.display.Sprite'
	],
  name: 'com.tinyrobot.flibble.display.Animation',
  as: function() {
    Animation = Sprite.extend({
			init: function(){
				this._super();
				this.frames = [];
				this.currentFrame = 0;
				this.onUpdate = this._update; //autoplay!
			},
			addFrame: function(frame){ //a frame can really be any displayobject (drawable Node)
				this.frames.push(frame);
			},
			//probably adding/removing child for each frame is inefficient, think about reworking this
			nextFrame: function(){
				this.removeChild(this.frames[this.currentFrame]);
				if(this.currentFrame + 1 > this.frames.length-1){
					this.currentFrame = 0;
				}else{
					this.currentFrame ++;
				}
				this.addChild(this.frames[this.currentFrame]);
			},
			gotoAndPlay: function(frame){
				this.gotoAndStop(frame);
				this.play();
			},
			gotoAndStop: function(frame){
				if(frame > this.frames.length-1) return;
				this.removeChild(this.frames[this.currentFrame]);
				this.addChild(this.frames[frame]);
				this.stop();
			},
			play: function(){
				this.onUpdate = this._update;
			},
			stop: function(){
				this.onUpdate = null;
			},
			_update: function(){
				this.nextFrame();
			}
		});
	}
});
