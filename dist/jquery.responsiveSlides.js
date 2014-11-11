/*
 *  jQuery responsiveSlides Plugin - v0.9.0
 *  Simple & lightweight responsive slider plugin.
 *  
 *
 *  Made by Nery Orellana
 *  Under MIT License
 */
// This is based off http://responsiveslides.com by @viljamis

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function($, window, document, undefined) {

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Check for transition support only once
	function supportsTransitions() {
		var property = 'transition',
			prop, i,
			doc = document.body || document.documentElement,
			styles = doc.style,
			vendor = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];

		if (typeof styles[prop] === 'string') {
			return true;
		}
		// Tests for vendor specific prop
		prop = property.charAt(0).toUpperCase() + property.substr(1);

		for (i = 0; i < vendor.length; i++) {
			if (typeof styles[vendor[i] + prop] === 'string') {
				return true;
			}
		}
		return false;
	}

	// Create the defaults once
	var pluginName = 'responsiveSlides',
		id = 0,
		defaults = {
			debug: false,
			transitions: supportsTransitions(), // check if transitions are support, allow overide in options
			auto: true, // Boolean: Animate automatically, true or false,
			delay: null, // Defaults to the timeout for the first slide
			speed: 500, // Integer: Speed of the transition, in milliseconds
			timeout: 5000, // Integer: Time between slide transitions, in milliseconds
			namespace: 'rslides', // String: change the default namespace used
			easing: 'ease-in-out', // String: easing option as per CSS spec
			before: $.noop, // Function: Before callback
			after: $.noop // Function: After callback
		};

	// The actual plugin constructor
	function responsiveSlides(element, options) {
		id += 1;
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this.options.id = this.options.namespace + '_' + id;
		this.options.activeClass = this.options.namespace + '--active';
		this.options.visibleClass = this.options.namespace + '--on';
		this.options.slideClass = this.options.namespace + '--slide';
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	responsiveSlides.prototype = {
		init: function() {

			if (this.options.debug) {
				console.log('responsiveSlides - timeout', this.options.timeout);
				console.log('responsiveSlides - transitions supported', this.options.transitions);
			}

			// cache element lookup and children
			var $this = $(this.element),
				$slide = $this.children();

			// store index and options in data
			$this.data('index', 0);
			$this.data('options', this.options);

			$slide
				.css({
					'-webkit-transition': 'opacity ' + this.options.speed + 'ms ' + this.options.easing,
					'-moz-transition': 'opacity ' + this.options.speed + 'ms ' + this.options.easing,
					'-o-transition': 'opacity ' + this.options.speed + 'ms ' + this.options.easing,
					'transition': 'opacity ' + this.options.speed + 'ms ' + this.options.easing
				})
				.addClass(this.options.slideClass)
				.show()
				.eq(0)
				.addClass(this.options.activeClass)
				.addClass(this.options.visibleClass);

			// Don't animate if less then 2 slides
			if ($slide.length > 1)
				this.start($this);

		},
		start: function(el) {
			el.start();
		}
	};

	$.fn.extend({
		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		responsiveSlides: function(options) {
			return this.each(function() {
				if (!$.data(this, 'plugin_' + responsiveSlides)) {
					$.data(this, 'plugin_' + responsiveSlides, new responsiveSlides(this, options));
				}
			});
		},
		// Public methods
		start: function() {
			var $this = $(this),
				options = $this.data('options');

			$this.data('loop', setInterval(function() {
				$this.loopSlides();
			}, options.timeout));

			if (options.debug)
				console.log('start');

			return $this;
		},
		stop: function() {
			var $this = $(this),
				options = $this.data('options');

			clearInterval($this.data('loop'));

			if (options.debug)
				console.log('stop');

			return $this;
		},
		loopSlides: function() {
			var $this = $(this),
				$slide = $this.children(),
				options = $this.data('options'),
				total = $slide.length, // Query each loop since this allows to add/remove slides
				idx = $this.data('index'),
				index = idx + 1 < total ? idx + 1 : 0;

			// update index
			$this.data('index', index);
			// Pre/before slide callback
			options.before(index, options.id);
			// Slide handler
			$this.transitionTo(index);

			if (options.debug)
				console.log(options.id + ' looping @', options.timeout);

			return $this;
		},
		transitionTo: function(index) {
			var $this = $(this),
				$slide = $this.children(),
				options = $this.data('options');

			$slide
				.removeClass(options.activeClass)
				.eq(index)
				.addClass(options.activeClass);

			setTimeout(function() {
				$slide
					.removeClass(options.visibleClass)
					.eq(index)
					.addClass(options.visibleClass);
				// Post/after slide callback
				options.after(index, options.id);
			}, options.speed);

			return true;
		},
		destroy: function() {
			var $this = $(this),
				options = $this.data('options');

			if (options.debug)
				console.log('destroy', options.id);

			clearInterval($this.data('loop'));
			$this.unbind().remove();

			return true;
		}
	});

})(jQuery, window, document);