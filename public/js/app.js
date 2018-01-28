$(function () {
	var postCommentBtn = $('#post-comment');
	var uploadForm = $('#upload-form-section');

	postCommentBtn.hide();
	uploadForm.hide();

	$('#new-upload-button').on('click', function (event) {
		event.preventDefault();
		if ($(this).data('toggle') === 'on') {
			uploadForm.hide();
			$(this).data('toggle', 'off');
			return;
		}
		uploadForm.show();
		$(this).data('toggle', 'on');
	});
	$('#btn-comment').on('click', function (event) {
		event.preventDefault();
		if ($(this).data('toggle') === 'on') {
			postCommentBtn.hide();
			$(this).data('toggle', 'off');
			return;
		}
		postCommentBtn.show();
		$(this).data('toggle', 'on');
	});

	$('#btn-like').on('click', function (event) {
		event.preventDefault();

		var imgID = $(this).data('id');

		$.post('/images/' + imgID + '/like').done(function (data) {
			$('.likes-count').text(data.likes);
		});
	});
});
