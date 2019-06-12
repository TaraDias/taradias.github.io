(function($j){

  // https://developers.google.com/recaptcha/docs/display#explicit_render
  function grecaptchaBefore(fnSuccess, fnError) {
    if (!window.onRecaptchaLoaded) {
      fnError && fnError();
      return;
    }
    window.onRecaptchaLoaded(function () {
      var $container = $j('.g-recaptcha');
      if (!$container.length) {
        fnError && fnError();
        return;
      }
      fnSuccess && fnSuccess($container);
    });
  }
  // These functions will only run if i've injected the recaptcha code, which
  //  is only inserted if the current user is not the author
  function grecaptchaInit() {
    grecaptchaBefore(function ($container) {
      grecaptcha.render($container[0], { sitekey: $container.data('sitekey') });
    })
  }
  function grecaptchaReset() {
    grecaptchaBefore(function () {
      grecaptcha.reset();
    })
  }
  function grecaptchaGetresponse(callback) {
    grecaptchaBefore(
      function () {
        callback(grecaptcha.getResponse());
      },
      function () {
        callback(null)
      }
    )
  }

  // These can load and execute (on dev) before responsive_book_detail.js, which defines adjustSeeMore
  //  so we need to only call it if it exists
  // They both get called when responsive_book_detail.js loads, so i don't need to deal with a queued call
  function tryAdjustSeeMore() {
    if (typeof adjustSeeMore !== "undefined") {
      adjustSeeMore();
    }
  }
  function tryAttachSeeMoreHandlers() {
    if (typeof attachSeeMoreHandlers !== "undefined") {
      attachSeeMoreHandlers();
    }
  }

  var initedResponsiveComments = false;
  window.initResponsiveComments = function () {
    if (initedResponsiveComments) return;
    initedResponsiveComments = true;
    
    var commentHelpers = {};

    commentHelpers.updateConditionalElements = function () {
      var userInfo = JSON.parse(Cookies.get('dm') || '{}');
      var loggedInUserId = userInfo.user_id;
      // comments can be by any user, so we have to read the data.user_id in each element
      $j('.show-on-user-is-comment-user').each(function () {
        var $el = $j(this);
        var commentUserId = $el.data('user_id');
        if (commentUserId === loggedInUserId) {
          $el.removeClass("hidden");
        }
      })
    };

    commentHelpers.increaseCounter = function(increase){
      var count = parseInt($j('#comment-count').html());

      if (increase) {
        count += 1;
      } else {
        count -=1;
      }
      $j('#comment-count').html(count);
    };

    commentHelpers.disableCommentSubmission = function(){
      if ($j('.recaptcha-wrap').is(':visible')){
        grecaptchaReset();
        $j('.recaptcha-wrap').hide();
      }
      $j('.comment-submit').removeClass("btn--black-on-white").addClass('btn--gray-on-white').attr('disabled', true);
    };

    commentHelpers.checkCommentSubmittable = function(listener){
      if ($j(listener).val().length > 0){
        $j('.comment-submit').removeClass("btn--gray-on-white").addClass('btn--black-on-white').attr('disabled', false);
      } else {
        commentHelpers.disableCommentSubmission();
      }
    };

    commentHelpers.createDeleteCoverDiv = function($commentBody) {
      var height = $commentBody.height() + 10; // Increase div to handle extra padding added by responsive-comment-body
      var width = $commentBody.width();
      var commentId = $commentBody.attr('id');
      var id = 'delete_' + commentId;
      var noticeTextHtml = $j('.notice-text').html();
      var deleteTranslationHtml = $j('.delete-confirmation-text').html();
      var cancelTranslationHtml = $j('.delete-cancellation-text').html();
      return $j('<li>')
        .addClass('responsive-comment-body')
        .addClass('delete-confirmation')
        .attr("id", id)
        .css({
          height: height,
          width: width,
          marginTop: -1 * (height + 15)
        })
        .append(
          $j('<div>')
          .addClass("double-check-notice")
          .html(noticeTextHtml)
        )
        .append(
          $j('<div>')
          .addClass("control-wrapper")
          .append(
            $j('<div>')
            .addClass("control-wrapper--inner")
            .append(
              $j('<a href=#>')
              .addClass("btn")
              .addClass("btn--white-on-black--sm")
              .addClass("btn--inline")
              .addClass("delete-control")
              .addClass("delete-cancel")
              .html(cancelTranslationHtml)
            )
            .append(
              $j('<a href="#">')
              .addClass("btn")
              .addClass("btn--white-on-black--sm")
              .addClass("btn--inline")
              .addClass("delete-control")
              .addClass("delete-confirm")
              .html(deleteTranslationHtml)

            )
          )
        );
    }

    //adding comments section
    $j('#comment-input').on('keyup', function(){
      $j('.recaptcha-wrap').show();
      var max = 2000;
      if($j(this).val().length > max){
       $j(this).val($j(this).val().substr(0, max));
      }
      if ((max - $j(this).val().length) < 200) {
        $j('.comment-form--character-count').html('You have ' + (max - $j(this).val().length) + ' characters remaining.');
      }
      commentHelpers.checkCommentSubmittable(this);
     });

     $j('#comment-input').on('blur', function(){
       $j('.comment-form--character-count').html('');
       commentHelpers.checkCommentSubmittable(this);
     });


    $j('#comment-form').on('submit', function(e) {
      e.preventDefault();
      $j('.comment-submit').attr('disabled', true);

      var form = $j(this);
      var url = form.attr('action');
      var data = {};

      form.find(':input[type!=submit]').each(function() {
        var el = $j(this);
        data[el.attr('name')] = el.val();
        data["responsive_comment"] = true;
      });

      grecaptchaGetresponse(function(grecaptchaResponse) {
        if (grecaptchaResponse) {
          data['g-recaptcha-response'] = grecaptchaResponse;
        }

        $j.ajax({
          url: url,
          type: 'POST',
          data: data,
          success: function(data, status, request) {
            commentHelpers.disableCommentSubmission();

            $j('.form__control--invalid').hide();

            $j('#comment-input').val("");
            $j('.comment-list').replaceWith(data);
            var newElement = $j('li.clearfix')[0];

            $j(newElement).hide().fadeIn(1000, function(){
              commentHelpers.increaseCounter(true);
              $j('#comment-heading h4').hide().fadeIn('slow');
            });
            commentHelpers.updateConditionalElements();
            utag.link({'event_name':'form_submit','form':'comment-form','form_status':'success'});
            tryAdjustSeeMore();

          },
          error: function(data, status, error) {
            $j('.comment-submit').attr('disabled', false);
            if ($j('.recaptcha-wrap').is(':visible')){
              grecaptchaReset()
            }
            $j('#add_comment-error').show().html(data.responseText);
            utag.link({'event_name':'form_submit','form':'comment-form','form_status':'error','form_error':data.responseText});
            tryAdjustSeeMore();
          }
        });
      })

    });

     // deleting comments section
    $j('#book_comments').on('click', '.responsive-comment-delete', function(e){
      var $button = $j(e.currentTarget);
      var $commentBody = $button.closest('.responsive-comment-body');
      var $coverDiv = commentHelpers.createDeleteCoverDiv($commentBody)
      var url = $button.attr('id');

      $coverDiv.insertAfter($commentBody);

      $j('.delete-confirm').on('click', function(e){
        e.preventDefault();
        $j.ajax({
          url: url,
          type: 'DELETE',
          success: function(data, status, request) {
            $coverDiv.fadeOut('fast');

            $commentBody.fadeOut(1000, function(){
              commentHelpers.increaseCounter(false);
              $j('#comment-heading h4').hide().fadeIn('slow');
            });
            tryAdjustSeeMore();
          },
          error: function(data, status, error) {
            console.log(error);
          }
        });
      });

      $j('.delete-confirmation').on('click', '.delete-cancel',  function(e){
        e.preventDefault();
        $j(e.delegateTarget).fadeOut('fast');
      });

      tryAdjustSeeMore();
    });
    grecaptchaInit()

    // Initially hide the see-more. adjustSeeMore will fix it if it's wrong, but
    // it might not be available yet...and it'll do it's thing later, regardless
    $j('.comments-section .see-more').hide();
    tryAdjustSeeMore();
    tryAttachSeeMoreHandlers()
  }
})(jQuery);
