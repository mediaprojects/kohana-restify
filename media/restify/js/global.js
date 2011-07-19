$(document).ready(function(){
	
	$('#method').buttonset();	

	$('#config .tabs').tabs();	
	
	$('input:submit, #setting_html, #cookie_faq').button();
	
	$('#add_data, #add_header').button({
		icons: {
    		primary: "ui-icon-plusthick"
		}
	});
	
	$('#settings').click(function(){
		
		$('#config, #settings span').toggle();
		
		return false;
	});

	$('#add_data').click(function(){
		
		$('#config_data ul').append(restify.template.data);
		
		$('.delete_row').button({
			icons: {
            	primary: "ui-icon-circle-close"
			}
        });
		
		return false;
	}).click();		
	
	$('#add_header').click(function(){
		
		$('#config_headers ul').append(restify.template.header);
		
		$('.delete_row').button({
			icons: {
            	primary: "ui-icon-circle-close"
			}
        });
		
		return false;
	}).click();		
	
	$('.delete_row').live('click', function(){

		$(this).parent().remove();
		
		return false;
	});
	
	$response = $('#response .tabs').tabs();
	
	$('form').submit(function(){
		
		$('#submit').hide();
		$('#loader').show();

		$('#message').empty().hide();
		
		$.ajax({
			'url'		: restify.controller,
			'type'		: 'POST',
			'data'		: $(this).serialize(),
			'success'	: function(data){
			
				$('#response_content').empty();

				$('#response_content').prepend('<pre class="prettyprint"><code>' + data.content + '</code></pre>');
				
				$('#response_headers').empty().prepend('<pre>' + data.headers + '</pre>');
				
				$('#response_headers_out').empty().prepend('<pre>' + data.headers_out + '</pre>');
				
				var response_cookies = $('#response_cookies table tbody');
				
				response_cookies.empty();
				
				if (data.cookies.length > 0)
				{
					response_cookies.html(array_to_rows(data.cookies));
				}
				else
				{
					response_cookies.html('<tr><td colspan="7" class="empty">No cookies for this response.</td></tr>');
				}
				
				prettyPrint();
				
				$('#response').show();
				
				resize_url();
			},
			'complete'	: function(){
				$('#loader').hide();
				$('#submit').show();	
			},
			'error'		: function(jq, status){
				
				var message = 'There is a problem. It relates to "' + status + '".';
				
				if (status == 'error')
				{
					message = 'There was an API error: "' + jQuery.parseJSON(jq.responseText).error + '"';
				}
				
				$('#message').show().prepend(template_error(message));				
			}
		});
			
		return false;
	});
	
	$controls = $('#request').width() - $('#url').width() + 31;

	resize_url();
	
	$(window).resize(resize_url);	
});

function array_to_rows(array)
{
	var rows = [];
	
	for (var row = 0; row < array.length; row++)
	{
		var columns = [];
		
		for (var column = 0; column < array[row].length; column++)
		{
			columns.push('<td>' + array[row][column] + '</td>');
		}

		rows.push('<tr>' + columns.join('') + '</tr>');
	}
	
	return rows.join('');
}

function template_error(message)
{
	return '<div class="ui-widget"><div class="ui-state-error ui-corner-all"><p><span class="ui-icon ui-icon-alert"></span><strong>Alert: </strong>' + message + '</p></div></div>';
}

function resize_url()
{
	$('#url').width($(window).width() - $controls);
}