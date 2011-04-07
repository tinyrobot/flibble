jingo.declare({
	require: [
		'util.Class'
	],
  name: 'com.tinyrobot.flibble.event.EventDispatcher',
  as: function() {
    EventDispatcher = Class.extend({
			init: function(){
				this.listeners = {};
			},
			addEventListener: function(type,callback){
				if(!this.listeners[type]) this.listeners[type] = [];
				if(this.listeners[type].indexOf(callback) == -1){
					this.listeners[type].push(callback);
				}
			},
			dispatchEvent: function(type,data){
				for(var i = 0; i < this.listeners[type].length; i++){
					var cb = this.listeners[type][i];
					cb(data);
				}
			},
			removeEventListener: function(){
				
			}
		})
  }
});
