$(function () {
  var postCommentBtn = $('#post-comment');
  var commentBtn = postCommentBtn.hide();
  var commentList = $('#comment-list');

  var commentTemplate = `
  <li class="media mb-2" id="{{id}}">
    <a class="pull-left" href="#">
      <img
        class="media-object img-circle mr-2"
        src="{{user.avatar_url}}"
      />
    </a>
    <div class="media-body">
      <strong class="media-heading">{{user.username}}</strong>
      <small class="text-muted">{{time}}</small>
      <br />
      <p>{{ comment }}</p>
    </div>
  </li>
`;

  var alertTemplate = `
  <div class="alert alert-success alert-dismissible fade show" role="alert">
    <strong>Your comment has been added.</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  `;

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

  $('#comment-form').on('submit', function (ev) {
    ev.preventDefault();
    var $this = $(this);
    var inputs = $this.serializeArray();
    const data = inputs.reduce(function (acc, val) {
      acc[val.name] = val.value;
      return acc;
    }, {});
    if (data.comment === '') {
      alert('Comment must not be empty');
      return false;
    }
    $.ajax('/images/' + data.image_id + '/comment', {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (resp) {
        if (!resp.success) {
          alert('Error ' + resp.message);
          return false;
        }
        var comment = resp.newComment;
        var formattedTime = moment(comment.timestamp)
          .startOf('minute')
          .fromNow();
        var html = Mustache.render(commentTemplate, {
          id: comment._id,
          comment: comment.comment,
          time: formattedTime,
          user: comment.user,
        });
        commentList.append(html);
        window.location.hash = comment._id;
        html = Mustache.render(alertTemplate, {});
        var al = $('<div>');
        $('main').append(al);
        al.append(html);
        al.fadeOut(6000);
        $('textarea[name="comment"]').val('');
      },
      error: function () {
        alert('failed to add comment');
      },
    });
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
