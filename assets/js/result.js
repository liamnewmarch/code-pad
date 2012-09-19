$(function() {
	$('head').append('<style>' + localStorage['fiddle-css'] + '</style>');
	$('body').append(localStorage['fiddle-html']);
	$('body').append('<script>' + localStorage['fiddle-javascript'] + '</script>');
});
