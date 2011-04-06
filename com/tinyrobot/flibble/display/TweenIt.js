jingo.declare({
	require: [
		'com.tinyrobot.flibble.display.DisplayObject',
		'com.tinyrobot.flibble.display.Tween'
	],
  name: 'com.tinyrobot.flibble.display.TweenIt',
  as: function() {
    TweenIt = {
			//http://www.gizma.com/easing/#quint2
			init: function(scene){
				this.scene = scene;
				this.timer = new DisplayObject();
				this.scene.addChild(this.timer);
				var that = this;
				this.timer._update = function(){that.update();};
				this.timer.render = function(){}
				this.tweens = [];
			},
			update: function(){
				for(var i = 0; i < this.tweens.length; i++){
					var t = this.tweens[i];
					if(t.done){
						this.tweens.splice(i,1);
					}else{
						this.tweens[i].update();
					}
				}
			},
			to: function(ob,duration,props){
				for(var i = 0; i <this.tweens.length; i++){ //overwrites any active tweens' properties and sets their start time to their last update time.
					if(this.tweens[i].ob == ob){
						var tw = this.tweens[i];
						if(!tw.done){ //should change this so it only overwrites individual properties instead of nuking the whole tween?
							tw.overwrite(ob,duration,props);
							return;
						}
					}
				}
				this.tweens.push(new Tween(ob,duration,props));
			}
		}
	}
});
