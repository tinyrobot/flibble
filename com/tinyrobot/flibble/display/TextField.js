jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.display.DisplayObject'
	],
  name: 'com.tinyrobot.flibble.display.TextField',
  as: function() {
    TextField = DisplayObject.extend({
			init: function(){
				this._super();
				this.fontSize = 10;
				this.font = "Arial";
				this._text = "";
				this.strokeColor = "rgb(0,255,0)";
				this.fillColor = "rgb(0,255,0)";
				this.fill = true;
				this.stroke = true;
				this.textAlign = "left"; //defatult
				this.chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
			},
			getRGBA: function(rgb,a){ //this is just horrible. i wish chrome would support global alpha! Also it's a crap solution, rewrite
				if(!a) return rgb;
				if(rgb.indexOf("rgba") == -1) rgb = rgb.replace("rgb","rgba");
				var comps = rgb.split(",");
				
				if(comps.length < 2) return rgb;
				if(comps.length == 4){
					var alpha = comps[3].replace(")","");
					comps[3] = a+")";
					return comps.join(",");
				}
				var blah = comps[2].replace(")","");
				comps.splice(2,2,blah,a+")");
				return comps.join(",");
			},
			get text(){
				return this._text;
			},
			set text(text){
				//I'd much rather set width/height stuff here.
				this._text = text;
			},
			_render: function(ctx){
				var txtMeasure = ctx.measureText(this.text);
				this.width = txtMeasure.width;
				this.height = txtMeasure.height*20||this.fontSize;
				
				//workaround color alpha for chrome. it will not work in browsers supporting globalalpha for text as this alpha will be multiplied by globalalpha.
				if(this.chrome){
					this.strokeColor = this.getRGBA(this.strokeColor,ctx.globalAlpha);
					this.fillColor = this.getRGBA(this.fillColor,ctx.globalAlpha);
				}
				
				ctx.strokeStyle = this.strokeColor;
				ctx.fillStyle = this.fillColor;
				ctx.textAlign = this.textAlign;
				ctx.font = this.fontSize + "px "+this.font;
				if(this.stroke) ctx.strokeText(this.text,0,this.height); //workaround for text getting rendered at -height, look into why/
				if(this.fill) ctx.fillText(this.text,0,this.height);
			}
		});
	}
});
