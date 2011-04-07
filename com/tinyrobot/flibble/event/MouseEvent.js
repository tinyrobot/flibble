jingo.declare({
	require: [
		'util.Class'
	],
  name: 'com.tinyrobot.flibble.event.MouseEvent',
  as: function() {
    MouseEvent = Class.extend({
    		init: function(type,stageX,stageY){
    			this.type = type;
    			this.stageX = stageX;
    			this.stageY = stageY;
    		}
    });
    MouseEvent.CLICK= "CLICK",
		MouseEvent.MOUSE_MOVE= "MOUSE_MOVE";
		MouseEvent.MOUSE_OVER= "MOUSE_OVER";
		MouseEvent.MOUSE_UP = "MOUSE_UP";
		MouseEvent.MOUSE_DOWN = "MOUSE_DOWN";
		MouseEvent.MOUSE_OUT = "MOUSE_OUT";
  }
});
