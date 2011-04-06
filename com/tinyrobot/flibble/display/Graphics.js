jingo.declare({
	require: [
		'util.Class'
	],
  name: 'com.tinyrobot.flibble.display.Graphics',
  as: function() {
  	//Classes that have a graphics object will need to recalculate their dimensions based on the data in here
    Graphics = Class.extend({
			init: function(){
				this.funcs = [];
				this.maskfuncs = [];
			},
			beginPath: function(){
				var f = function(){
						this.beginPath();
				};
				this.funcs.push(f);
				this.maskfuncs.push(f);
			},
			closePath: function(){
				var f = function(){
						this.closePath();
				};
				this.funcs.push(f);
				this.maskfuncs.push(f);
			},
			fillStyle: function(color){
				this.funcs.push(function(){
					//parse color & rebuild based on owner's alpha to specify the alpha value :/ - nah, globalalpha baby!
					this.fillStyle = color;
				});
			},
			beginFill: function(color){ //alias for fillstyle
				this.fillStyle(color);
			},
			endFill: function(){ //noop?
				
			},
			fillRect: function(x,y,width,height){
				var that = this.owner;
				this.funcs.push(function(){
					this.fillRect(x,y,width,height);
				});
				/*this.maskfuncs.push(function(){
						this.rect(x,y,width,height);
						//this.clip();
				});*/
				this.maskfuncs.push(function(){
					var ctx = this;
					//var tl = mx.transformPoint(new Point(x,y));
					//var tr = mx.transformPoint(new Point(x+width,y));
					//var br = mx.transformPoint(new Point(x+width,y+height));
					//var bl = mx.transformPoint(new Point(x,y+height));
					var tl = new Point(x,y);
					var tr = new Point(x+width,y);
					var br = new Point(x+width,y+height);
					var bl = new Point(x,y+height);
					//removing begin and close allows multiple clipping paths but kills everything!
					ctx.beginPath();
					ctx.moveTo(tl.x,tl.y);
					ctx.lineTo(tr.x,tr.y);
					ctx.lineTo(br.x,br.y);
					ctx.lineTo(bl.x,bl.y);
					ctx.lineTo(tl.x,tl.y);
					ctx.closePath();
				});
			},
			moveTo: function(x,y){
				var f = function(){
					this.moveTo(x,y);
				};
				this.funcs.push(f);
				this.maskfuncs.push(f);
			},
			lineTo: function(x,y){
				var f = function(){
					this.lineTo(x,y);
				};
				this.funcs.push(f);
				this.maskfuncs.push(f);
			},
			lineWidth: function(width){
				this.funcs.push(function(){
					this.lineWidth = width;
				});
			},
			strokeStyle: function(color){
				this.funcs.push(function(){
					//parse color & rebuild based on owner's alpha to specify the alpha value :/
					this.strokeStyle = color;
				});
			},
			stroke: function(){
				this.funcs.push(function(){
					this.stroke();
				});
			},
			scale: function(x,y){
				this.funcs.push(function(){
						this.scale(x,y);
				});
			},
			render: function(ctx){
				for(var i = 0; i < this.funcs.length; i++){
					var f = this.funcs[i];
					f.call(ctx);
				}
			},
			mask: function(ctx,mx){
				for(var i = 0; i < this.maskfuncs.length; i++){
					var f = this.maskfuncs[i];
					f.call(ctx);
				}
			},
			clear: function(){
				for(var i = 0; i < this.funcs.length; i++){
					this.funcs.splice(i,1);
				}
				this.funcs = [];
			}
		});
	}
});
