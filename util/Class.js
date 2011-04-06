/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
jingo.declare({
  name: 'util.Class',
  as: function() {
  	//some modifications from below:
		//http://www.codefornuts.com/2010/09/inheritance-member-attributes-and.html
    Class = (function() {
			var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
			Class = function(){};
			Class.extend = function(prop, typeName) 
			{
					var _super = this.prototype;
					initializing = true;
					var prototype = new this();
					initializing = false;
					for (var name in prop) 
					{
							if (typeof prop[name] === "function" &&
									typeof _super[name] === "function" &&
									fnTest.test(prop[name]))
							{
									prototype[name] = (function(name, fn) {
													return function() {
															var tmp = this._super;
															this._super = _super[name];
															var ret = fn.apply(this, arguments);
															this._super = tmp;
															return ret;
													};
											})(name, prop[name]);
							}
							else
							{
									if (typeof prop[name] == "function") prototype[name] = prop[name];
									else if (typeof prop.__lookupGetter__ === "function" &&
													 (typeof prop.__lookupGetter__(name) !== "undefined" ||
														typeof prop.__lookupSetter__(name) !== "undefined" ||
														typeof _super.__lookupGetter__(name) !== "undefined" ||
														typeof _super.__lookupSetter__(name) !== "undefined"))
									{
											if (typeof (getter = prop.__lookupGetter__(name)) !== "undefined") prototype.__defineGetter__(name, getter);
											else if (typeof (getter = _super.__lookupGetter__(name)) !== "undefined") prototype.__defineGetter__(name, getter);
											if (typeof (setter = prop.__lookupSetter__(name)) !== "undefined") prototype.__defineSetter__(name, setter);
											else if (typeof (setter = _super.__lookupSetter__(name)) !== "undefined") prototype.__defineSetter__(name, setter);
									}
									else prototype[name] = prop[name];
							}
					}
	 
					function Class() 
					{
							if (!initializing)
							{
									if (this.init)
									{
											var args = arguments;
											this.init.apply(this, args);
									}
							}
					}
					Class.prototype = prototype;
					Class.constructor = Class;
					Class.extend = arguments.callee;
					return Class;
			};
			return Class;
    })();
  }
});
