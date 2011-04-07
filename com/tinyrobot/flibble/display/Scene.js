jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.geom.Point',
		'com.tinyrobot.flibble.display.DisplayObject',
		'com.tinyrobot.flibble.event.MouseEvent'
	],
  name: 'com.tinyrobot.flibble.display.Scene',
  as: function() {
  	function getOffset( el ) {
			var _x = 0;
			var _y = 0;
			while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
					_x += el.offsetLeft - el.scrollLeft;
					_y += el.offsetTop - el.scrollTop;
					el = el.offsetParent;
			}
			return { top: _y, left: _x };
		}
    Scene = Class.extend({
			init: function(name){
				this.canvas = document.getElementById(name);
				this.context = canvas.getContext("2d");
				this.root = new DisplayObject();
				this.root.color = "red";
				this.root.width = this.canvas.width;
				this.root.height = this.canvas.height;
				
				var that = this;
				this.intv = setInterval(function(){
						that.update();
						that.render();
				},1000/100);
				
				this.canvas.onmousemove = function(e){
					var offset = getOffset(that.canvas);
					var pt = {x:e.clientX - offset.left,y:e.clientY-offset.top};
					that.root.mousex = pt.x;
					that.root.mousey = pt.y;
					that.propagate(that.root,MouseEvent.MOUSE_MOVE);
				}
				
				this.canvas.onclick = function(e){
					that.propagate(that.root,MouseEvent.CLICK);
				}
				this.canvas.onmousedown = function(e){
					that.propagate(that.root,MouseEvent.MOUSE_DOWN);
				}
				this.canvas.onmouseup = function(e){
					that.propagate(that.root,MouseEvent.MOUSE_UP);
				}
				
			},
			propagate: function(node,method){
				if(!node) return;
				if(!(node instanceof DisplayObject)) return;
				if(!node.mouseEnabled) return;
				//if node not in viewport return
				
				var pt = new Point(this.root.mousex,this.root.mousey);
				var bounds = node.getAABB();
				
				if(pt.x > bounds.x && pt.x < bounds.x+bounds.width&&pt.y>bounds.y&&pt.y<bounds.y+bounds.height){
					if(method == MouseEvent.MOUSE_MOVE){
						if(!node._mousedover){
							node._mousedover = true;
							if(node.listeners[MouseEvent.MOUSE_OVER]) node.dispatchEvent(MouseEvent.MOUSE_OVER,new MouseEvent(MouseEvent.MOUSE_OVER,this.root.mousex,this.root.mousey));
						}
					}
					
					if(node.listeners[method]) node.dispatchEvent(method,new MouseEvent(method,this.root.mousex,this.root.mousey));
					
					for(var i = 0; i < node.children.length; i++){
						this.propagate(node.children[i],method);
					}
				}else{
					if(method == MouseEvent.MOUSE_MOVE){
						if(node._mousedover){
							node._mousedover = false;
							if(node.listeners[MouseEvent.MOUSE_OUT]) node.dispatchEvent(MouseEvent.MOUSE_OUT,new MouseEvent(MouseEvent.MOUSE_OUT,this.root.mousex,this.root.mousey));
						}
					}
				}
			},
			update: function(){
				this.root._update();
			},
			render: function(){
				this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
				this.root.render(this.context);
			},
			addChild: function(child){
				this.root.addChild(child);
			},
			removeChild: function(child){
				this.root.removeChild(child);
			}
		});
  }
});
