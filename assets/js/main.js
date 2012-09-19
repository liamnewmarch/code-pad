if (!localStorage) alert('LocalStorage is not supported :(');

$(function() {
	function resize() {
		$('#view-container').height($(window).height() - 50);
	}

	$('nav li').click(function() {
		var id;
		$('nav li').removeClass('active');
		id = $(this).attr('class');
		$(this).addClass('active');
		$('.view').hide();
		$('#view-' + id).show();

		if (id === 'result') {
			$('#view-result').html('<iframe src="result.html"></iframe>');
		} else {
			$('iframe').remove();
		}
	});

	$('.view textarea').keyup(function() {
		var name = $(this).parent().attr('id').replace('view-', '')
		localStorage['fiddle-' + name] = $(this).val();
	});

	resize();
	$(window).bind('resize', resize);

	$('nav li:first').trigger('click');

	$('#view-html textarea').val(localStorage['fiddle-html']); 
	$('#view-css textarea').val(localStorage['fiddle-css']);
	$('#view-javascript textarea').val(localStorage['fiddle-javascript']);

});