jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.geom.Point',
		'com.tinyrobot.flibble.geom.Matrix',
		'com.tinyrobot.flibble.geom.Rectangle',
		'com.tinyrobot.flibble.event.EventDispatcher'
	],
  name: 'com.tinyrobot.flibble.display.DisplayObject',
  as: function() {
    DisplayObject = EventDispatcher.extend({
			init: function(){
				this._super();
				
				this.alpha = 1;
				this.children = [];
				this.mouseEnabled = true;
				this.mask = null;
				this.masked = 0;
				
				//props that have getters/setters or are private
				this._matrix = new Matrix();
				this._width = null;
				this._height = null;
				this._origwidth;
				this._origheight;
				this._x = 0;
				this._y = 0;
				this._mousedover = false;
				this._rotation = 0;
				this._scalex = 1;
				this._scaley = 1;
			},
			//http://www.kirupa.com/forum/showthread.php?t=344978
			getOBB: function(){
				var matrix = this.matrix.clone();
				var p = this.parent;
				while(p){
					matrix.concat(p.matrix);
					p = p.parent;
				}
				var tl = {x:matrix.tx,y:matrix.ty};
				var tr = {x:matrix.tx + this._origwidth * matrix.a,y: matrix.ty + this._origwidth * matrix.b};
				var bl = {x:matrix.tx+this._origheight*matrix.c,y:matrix.ty+this._origheight*matrix.d};
				var br = {x:matrix.tx+this._origwidth*matrix.a+this._origheight*matrix.c,y:matrix.ty+this._origwidth*matrix.b+this._origheight*matrix.d};
				var r = new Rectangle();
				r.tl = tl;
				r.tr = tr;
				r.bl = bl;
				r.br = br;
				return r;
			},
			getAABB: function(){ //currently just gets real world coords but SHOULD get relative to point passed in.
				var r = this.getOBB();
				var left = Math.min(r.tl.x, r.tr.x, r.br.x, r.bl.x);
				var top = Math.min(r.tl.y, r.tr.y, r.br.y, r.bl.y);
				var right = Math.max(r.tl.x, r.tr.x, r.br.x, r.bl.x);
				var bottom = Math.max(r.tl.y, r.tr.y, r.br.y, r.bl.y);
				
				var box = new Rectangle(left, top, right - left, bottom - top);
				
				var x = box.x;
				var y = box.y;
				var width = box.x+box.width;
				var height = box.y+box.height;
				
				for(var i = 0; i < this.children.length; i++){
					var c = this.children[i];
					var b = c.getAABB();
					x = Math.min(x,b.x);
					y = Math.min(y,b.y);
					width = Math.max(width,b.x+b.width);
					height = Math.max(height,b.y+b.height);
				}
				width = Math.max(width-box.x,width-x);
				height = Math.max(height-box.y,height-y);
				box.width = width;
				box.height = height;
				box.x = x;
				box.y = y;
				return box;
			},
			get matrix(){
				if(!this._matrix) return;
				return this._matrix.clone(); //returns a *copy*
			},
			set matrix(mtx){
				if(!mtx) return;
				var bounds = this.getAABW(mtx);
				this._x = mtx.tx;
				this._y = mtx.ty;
				this._rotation = Math.atan2(-mtx.c,mtx.b);
				this._scalex = mtx.a;
				this._scaley = mtx.d;
				this._matrix = mtx;
			},
			set rotation(rot){ //review
				if(!this._matrix)return;
				var hm = rot * Math.PI/180;
				this._matrix.a = Math.cos( hm )*this._scalex;
				this._matrix.b = Math.sin( hm)*this._scalex;
				this._matrix.c = - Math.sin(hm)*this._scaley;
				this._matrix.d = Math.cos( hm )*this._scaley;
				this._rotation = rot;
			},
			get rotation(rot){
				return this._rotation;
			},
			set scalex(x){ //review
				if(!this._matrix)return;
				var mat = new Matrix();
				mat.scale(x,this._scaley);
				mat.rotate(this._rotation*Math.PI/180); //rotating breaks us
				mat.translate(this._x,this._y);
				this._scalex = x;
				this._width = x * this._origwidth;
				this._matrix = mat;
			},
			get scalex(){
				return this._scalex;
			},
			set scaley(y){ //review
				if(!this._matrix)return;
				var mat = new Matrix();
				mat.scale(this._scalex,y);
				mat.rotate(this._rotation*Math.PI/180); //rotating breaks us
				mat.translate(this._x,this._y);
				this._scaley = y;
				this._height = y * this._origheight;
				this._matrix = mat;
			},
			get scaley(){
				return this._scaley;
			},
			set width(num){
				if(!this._width){ //review
					this._origwidth = num;
					this._width = num;
				}else{
					var val = num / (this._origwidth);
					var m = new Matrix();
					m.scale(val,this._scaley);
					m.rotate(this._rotation*Math.PI/180);
					m.translate(this._x,this._y);
					this._matrix = m;
					this._scalex = val;
				}
				this._width = num;
			},
			get width(){
				return this._width;
			},
			set height(num){
				if(!this._height){ //review
					this._origheight = num;
					this._height = num;
				}else{
					var val = num / this._origheight;
					var m = new Matrix();
					m.scale(this._scalex,val);
					m.rotate(this._rotation*Math.PI/180);
					m.translate(this._x,this._y);
					this._matrix = m;
					this._scaley = val;
				}
				this._height = num;
			},
			get height(num){
				return this._height;
			},
			set x(x){
				this._x = x;
				this._matrix.tx = x;
			},
			get x(){
				return this._x;
			},
			get y(){
				return this._y;
			},
			set y(y){
				this._y = y;
				this._matrix.ty = y;
			},
			_update: function(){ //all this really does is tell all children to update..
				if(this.update) this.update();
				for(var i = 0; i < this.children.length; i++){
					this.children[i]._update();
				}
			},
			_mask: function(cx){
				var rm = this.matrix;
				cx.save();
				cx.transform(rm.a,rm.b,rm.c,rm.d,rm.tx,rm.ty);
				this.graphics.mask(cx);
				
				for(var i = 0; i < this.children.length; i++){
					if(this.children[i].graphics){
						this.children[i]._mask(cx);
					}
				}
				cx.restore();
			},
			render: function(cx){
				var rm = this.matrix;
				var a = this.alpha;
				
				/* here we use transform() to prevent having to recalculate the 
				transform matrix ourselves. because we don't call restore() til 
				after rendering our children, the canvas effectively concatenates the matrices.
				also alpha is multiplied directly but doesn't appear to work for text in chrome, a workaround is currently used for that (See TextField.js) */
				cx.save();
				
				cx.globalAlpha *= a; //im keeping it like this since chrome and firefox support global alpha and it's just easier this way.
				cx.transform(rm.a,rm.b,rm.c,rm.d,rm.tx,rm.ty);
				if(this.mask && this.mask.graphics){ //clipping/masking using displayobjects. if no graphics data, no masking should occur tho
					this.mask._mask(cx);
					cx.clip();
				}
				if(this._render) this._render(cx);
				
				for(var i = 0; i < this.children.length; i++){
					this.children[i].render(cx);
				}
				
				cx.restore();
				
			},
			addChild: function(child){
				var ind = this.children.indexOf(child);
				if(ind != -1) return;
				if(!this.root){
					child.root = this;
				}else{
					child.root = this.root;
				}
				child.parent = this;
				this.children.push(child);
			},
			removeChild: function(child){
				var ind = this.children.indexOf(child);
				if(ind == -1) return;
				child.parent = null;
				child.root = null;
				this.children.splice(ind,1);
			}
		});
  }
});
