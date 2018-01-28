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
    var $this = $(this);
    var imgID = $this.data('id');
    var action = $this.data('action');
    $.post('/images/' + imgID + '/like', { action }).done(function (data) {
      if (data.success) {
        var currentAction = action;
        var nextAction = action === 'like' ? 'unlike' : 'like';
        $('.likes-count').text(data.likes);
        $this.data('action', nextAction);
        $this.toggleClass('text-danger');
      } else {
        alert('an error occured');
      }
    });
  });

  $('#btn-delete').on('click', function (event) {
    event.preventDefault();
    var $this = $(this);

    var remove = confirm('Are you sure you want to delete this image?');
    if (remove) {
      var imgID = $(this).data('id');
      $.ajax({
        url: '/images/' + imgID,
        type: 'DELETE',
        statusCode: {
          404: function () {
            alert('not found');
          },
          500: function () {
            alert('internal server error');
          },
        },
      }).done(function (result) {
        if (result) {
          $this.removeClass('btn-danger').addClass('btn-success');
          $this.find('i').removeClass('fa-times').addClass('fa-check');
          $this.append('<span> Deleted Succesfully!<span>');
          window.location.href = '/';
        }
      });
    }
  });
});
