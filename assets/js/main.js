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

	$('.view textarea').keydown(function(e) {
		if (e.keyCode == 9) {
			var myValue = "\t";
			var startPos = this.selectionStart;
			var endPos = this.selectionEnd;
			var scrollTop = this.scrollTop;
			this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos,this.value.length);
			this.focus();
			this.selectionStart = startPos + myValue.length;
			this.selectionEnd = startPos + myValue.length;
			this.scrollTop = scrollTop;
			return false;
		}
	});

	$('.view textarea').keyup(function(e) {
		var name = $(this).parent().attr('id').replace('view-', '');
		localStorage['fiddle-' + name] = $(this).val();
	});

	resize();
	$(window).bind('resize', resize);

	$('nav li:first').trigger('click');

	$('#view-html textarea').val(localStorage['fiddle-html']); 
	$('#view-css textarea').val(localStorage['fiddle-css']);
	$('#view-javascript textarea').val(localStorage['fiddle-javascript']);

});
