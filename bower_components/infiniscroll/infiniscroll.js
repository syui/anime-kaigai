/*
 * Infiniscroll v1.0
 * https://github.com/gilbitron/Infiniscroll
 *
 * Copyright 2014, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://opensource.org/licenses/MIT
 */

;(function($, window, document, undefined){

	var pluginName = 'infiniscroll',
		defaults = {
			navSelector: 'nav#page-nav',
			nextSelector: 'nav#page-nav a.extend.next',
			loadingSelector: '.loading',
			pageFragment: 'section#main',
			scrollBuffer: 200,
			scrollOnLoad: true,
			scrollOnLoadDistance: 200,
			scrollOnLoadSpeed: 0,
			onInit: function(){},
			beforeContentLoaded: function(link){},
			afterContentLoaded: function(html){}
		};

	function Infiniscroll(element, options){
		this.el = element;
		this.$el = $(this.el);

		this.options = $.extend({}, defaults, options);

		this._isLoading = false;
		this._nextLink = null;

		this.init();
	}

	Infiniscroll.prototype = {

		init: function(){
			var $this = this;
			$(this.options.navSelector).hide();
			$(window).on('scroll', function(){
				$this.doScroll.apply($this);
			});

			this.options.onInit.call(this);
		},

		doScroll: function(){
			if(this._isLoading) return;

			if($(window).scrollTop() >= ($(document).height() - $(window).height() - this.options.scrollBuffer)){
				this._isLoading = true;

				if(!this._nextLink){
					this._nextLink = $(this.options.nextSelector);
				}

				if(this._nextLink.attr('href')){
					this.options.beforeContentLoaded.call(this, this._nextLink);
					$(this.options.loadingSelector).show();

					var iscroll = this,
						url = this._nextLink.attr('href');

					if(this.options.pageFragment)
						url += ' '+ this.options.pageFragment;

					$('<div/>').load(url, function(){
						var html = $(this).children(),
							shouldScroll = false;

						if(iscroll.options.scrollOnLoad && $(window).scrollTop() === $(document).height() - $(window).height())
							shouldScroll = true;

						html.find(iscroll.options.navSelector).hide();
						iscroll._nextLink = html.find(iscroll.options.nextSelector);

						$(iscroll.options.loadingSelector).hide();
						html.appendTo(iscroll.el);

						if(shouldScroll){
							$('html, body').animate({
								scrollTop: $(window).scrollTop() + iscroll.options.scrollOnLoadDistance
							}, iscroll.options.scrollOnLoadSpeed);
						}

						iscroll._isLoading = false;
						iscroll.options.afterContentLoaded.call(iscroll, html);
					});
				}
			}
		}

	};

	$.fn[pluginName] = function(options){
		return this.each(function(){
			if(!$.data(this, pluginName)){
				$.data(this, pluginName, new Infiniscroll(this, options));
			}
		});
	};

})(jQuery, window, document);
