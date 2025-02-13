/* 
 * AJAX Terminal (0.5)
 * by Sagie Maoz (n0nick.net)
 * n0nick@php.net
 *
 * jQuery plugin to create a web-based console-like behavior that posts user input commands
 * to an AJAX server, and prints the result text.
 * Designed to be utterly simple and highly customizable.
 *
 * Copyright (c) 2009 Sagie Maoz <n0nick@php.net>
 * Licensed under the GPL license, see http://www.gnu.org/licenses/gpl-3.0.html 
 *
 *
 * NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 *
 */
 
(function($) {

	$.fn.terminal = function(callback, options) {

		settings = $.extend({
			'max_height'		: '100%',
			'form_method'		: 'post',
			'input_name'		: 'input',
			'post_vars'			: {},
			'custom_prompt'	: false,
	 		'focus_on_load'	: true,
			'submit_on_load'	: false,
			'grab_focus_on_click' : true,
			'hello_message'	: false,
			'unix_theme'		: true,
			'allow_empty_input' : false,
			'tab_width'			: 4,
			'disable_input'	: false,
			'onload'				: null
		}, options);

		if (settings.custom_prompt)
		{
			settings.custom_prompt = $.trim(settings.custom_prompt) + ' ';
		}

		return this.each(function()
		{
			var terminal_container = $(this);

			terminal_container.append('<div></div>');
			var terminal = terminal_container.find('div:last');

			if (settings.max_height == '100%')
			{
				settings.max_height = terminal_container.innerHeight();
			}

			terminal.css({
				'display'	: 'block',
				'overflow-x'	: 'hidden',
				'overflow-y'	: 'auto',
				'padding'	: '0',
				'max-height': settings.max_height + 'px',
			});

			terminal.append('<span></span');
			var terminal_output = terminal.find('span:last');

			terminal.append('<form></form>');
			var terminal_form = $(this).find('form:last');

			if (settings.custom_prompt)
			{
				terminal_form.append('<span>' + settings.custom_prompt + '</span>');
			}

			terminal_form.css('display', 'inline');
			terminal_form.attr('onsubmit', 'return false;');

			var tabString = "";
			for (var i=0; i<settings.tab_width; i++)
			{
				tabString+= "&nbsp;";
			}

			var terminal_append = function(data)
			{
				var formattedData = $('<span/>').html(data.replace('\n', '<br/>'));
				var dataRows = formattedData.html().split(/\n/);
				data = '';
				for (row in dataRows)
				{
					data += '<span>' + dataRows[row].replace(/\t/g, tabString);
					if (!(row == dataRows.length-1 && (!dataRows[row] || !settings.custom_prompt)))
					{
						data+= '<br />';
					}
					data += '</span>';
				}

				terminal_output.append('<span>' + data + '</span>');

				terminal_form.show();
				terminal_input.val('').focus();
				
				// if input is disabled, we trick a focus so the scrolling will be ok
				if (settings.disable_input)
				{
					terminal_input.removeAttr('disabled').focus().attr('disabled', 'disabled');
				}
			}
			// outsource this function for misc. implementations
			terminal_container[0].append = terminal_append; //TODO bad [0]
			
			var terminal_clear = function()
			{
				terminal_output.text('');
			}
			terminal_container[0].clear = terminal_clear; //TODO bad [0] again!
			
			var terminal_command = function(e, first)
			{
				var first = first || false;
				var val = $.trim(terminal_input.val());

				// encode html entities in input
				val = $('<i/>').text(val).html();

				if ("" == val && !first)
				{
		 			if (!settings.allow_empty_input)
		 		 		return;
				}

	 			terminal_form.hide();
		 		if ("" != val || settings.allow_empty_input)
				{
					var last_command = '<span>';
	 		 		last_command+= settings.custom_prompt? settings.custom_prompt : '';
		 	 		last_command+= val + '<br />';
		 			terminal_output.append(last_command);
	 			}

	 			post_vars = settings.post_vars;
	 			post_vars[settings.input_name] = val;

				callback({ write: terminal_append }, val);

				if (typeof e == 'object' && typeof e['preventDefault'] == 'function')
				{
					e.preventDefault();
				}

			}
			terminal_form.submit(terminal_command);

			terminal_form.append('<input type="text" name="'+settings.input_name+'" />');
			var terminal_input = terminal_form.find('input:last');
			terminal_input.css('width', '80%');
			terminal_input.attr('autocomplete', 'off');

			$(document).ready(function()
			{
				if (settings.grab_focus_on_click)
				{
					terminal_container.mouseup(function()
					{
						if ("" == document.getSelection())
						{
							$(terminal_input.focus());
						}
					});
				}

				if (settings.hello_message)
					terminal_output.append('<span>' + settings.hello_message + '<br /></span>');

				if (settings.submit_on_load)
					terminal_command(null, true);

				if (settings.focus_on_load)
					terminal_input.focus();

				if (settings.disable_input)
					terminal_input.attr('disabled', 'disabled');

				if (settings.onload)
					settings.onload();

			});
		});

	}

}(jQuery));
