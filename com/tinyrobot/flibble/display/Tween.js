jingo.declare({
	require: [
		'util.Class',
		'com.tinyrobot.flibble.display.TweenFuncs'
	],
  name: 'com.tinyrobot.flibble.display.Tween',
  as: function() {
    Tween = Class.extend({
			init: function(ob,duration,props){
				this.start = new Date().getTime();
				this.cachedTime = this.start;
				this.duration = duration;
				this.onComplete = props.onComplete;
				this.props = props;
				this.tmp = {};
				this.ob = ob;
				this.done = false;
				for(var thing in this.props){
					if(thing != "ease" && thing != "onComplete"){
						this.tmp[thing] = this.ob[thing];
					}
				}
				this.fk = {};
				for(var thing in this.tmp){
					this.fk[thing] =  this.props[thing] - this.ob[thing];
				}
				this.easeType = props.ease || TweenFuncs.linearTween;
			},
			overwrite: function(ob,duration,props){
				this.start = this.cachedTime;
				this.props = props;
				this.ob = ob;
				for(var thing in this.props){
					if(thing != "ease" && thing != "onComplete"){
						this.tmp[thing] = this.ob[thing];
						this.fk[thing] =  this.props[thing] - this.ob[thing];
					}
				}
			},
			complete: function(){
				for(var thing in this.tmp){
					this.ob[thing]=this.props[thing];
				}
				this.done = true;
				if(this.onComplete) this.onComplete();
			},
			update: function(){
				var now = new Date().getTime();
				this.cachedTime = now;
				if(now - this.start >= this.duration){
					this.complete();
					return;
				}
				for(var thing in this.tmp){
					var t = now - this.start;
					var b = 0;
					var c = 1;
					var d = this.duration;
					var ratio = this.easeType(t,b,c,d);
					this.ob[thing]=this.tmp[thing] + (ratio * this.fk[thing]);
				}
			}
		});
	}
});
