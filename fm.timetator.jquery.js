/*
 Timetator jQuery Plugin
 Timetator is a jQuery-based addon for input boxes, giving them a time sanitizer.
 version 1.1, Dec 11th, 2015
 by Ingi á Steinamørk

 The MIT License (MIT)

 Copyright (c) 2014 Qodio

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($) {
	$.timetator = function (element, options) {
		var defaults = {
			seperator:  ':',
			useSeconds: false,
			useCap:     true
		};

		var plugin = this;
		var $element = $(element);
		plugin.settings = {};


		// INITIALIZE PLUGIN
		plugin.init = function () {
			plugin.settings = $.extend({}, defaults, options);
			$element.addClass('timetator');
			$element.bind('blur', sanitize);
			$element.bind('mouseup', select);
			sanitize();
		};
		
		var sanitize = function () {
			$element.val(sanitizeTime($element.val(), plugin.settings.seperator, plugin.settings.useSeconds, plugin.settings.useCap));
		};
		
		var select = function () {
			$element.select();
		};
		
		var sanitizeTime = function (time, seperator, useSeconds, useCap) {
			useSeconds = useSeconds === undefined ? false : useSeconds;
			useCap = useCap === undefined ? true : useCap;
			seperator = seperator === undefined ? ':' : seperator;
			if (time !== '') {
				time = time.toString();
				time = time.replace(/\D/g,'');
				if (useCap) {
					time = time.substring(0, useSeconds ? 6 : 4);
				}

				switch(time.length) {
					case 0:
						time = '0000' + (useSeconds ? '00' : '');
						break;
					case 1:
						time = '0' + time + '00' + (useSeconds ? '00' : '');
						break;
					case 2:
						time = time + '00' + (useSeconds ? '00' : '');
						break;
					case 3:
						time = '0' + time + (useSeconds ? '00' : '');
						break;
					case 4:
						time = time + (useSeconds ? '00' : '');
						break;
					case 5:
						time = useCap ? '0' + time : time;
						break;
					case 6:
						break;
				}
				if (!useSeconds) {
					time = ((parseInt(time.substring(0, time.length - 2), 10) > 23 && useCap) ? '23' : time.substring(0, time.length - 2)) + (parseInt(time.substring(time.length - 2, time.length), 10) > 59 ? '59' : time.substring(time.length - 2, time.length));
				} else {
					time = ((parseInt(time.substring(0, time.length - 4), 10) > 23 && useCap) ? '23' : time.substring(0, time.length - 4)) + (parseInt(time.substring(time.length - 4, time.length - 2), 10) > 59 ? '59' : time.substring(time.length - 4, time.length - 2)) + (parseInt(time.substring(time.length - 2, time.length), 10) > 59 ? '59' : time.substring(time.length - 2, time.length));
				}
				if (!useSeconds) {
					time = time.substring(0, time.length -2) + seperator + time.substring(time.length - 2, time.length);
				} else {
					time = time.substring(0, time.length - 4) + seperator + time.substring(time.length - 4, time.length - 2) + seperator + time.substring(time.length - 2, time.length);
				}
			}
			return time;
		};


		// REMOVE PLUGIN AND REVERT INPUT ELEMENT TO ORIGINAL STATE
		plugin.destroy = function () {
			$element.removeClass('timetator');
			$.removeData(element, 'timetator');
			$element.unbind('blur', sanitize);
			$element.unbind('mouseup', select);
			$element.show();
		};
		
		// Initialize plugin
		plugin.init();
	};

	$.fn.timetator = function(options) {
		options = options !== undefined ? options : {};
		return this.each(function () {
			if (typeof(options) === 'object') {
				if (undefined === $(this).data('timetator')) {
					var plugin = new $.timetator(this, options);
					$(this).data('timetator', plugin);
				}
			} else if ($(this).data('timetator')[options]) {
				$(this).data('timetator')[options].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				$.error('Method ' + options + ' does not exist in $.timetator');
			}
		});
	};
}(jQuery));

$(function () {
	$('.timetator').each(function () {
		var $this = $(this);
		var options = {};
		$.each($this.data(), function (key, value) {
			if (key.substring(0, 9) == 'timetator') {
				var value_temp = value.toString().replace(/'/g, '"');
				value_temp = $.parseJSON(value_temp);
				if (typeof value_temp == 'object') {
					value = value_temp;
				}
				options[key.substring(9, 10).toLowerCase() + key.substring(10)] = value;
			}
		});
		$this.timetator(options);
	});
});