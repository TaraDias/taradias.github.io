var authorSummary;

function ellipsizeTextBox(className) {
  if ($j(className).length > 0) {
    var el = $j(className)[0];
    var userProfileUrl = $j('.about-author--profile-view a').attr('href');
    var viewMoreTranslation = $j('.about-author--profile-view a').html();

    if (typeof(authorSummary) === 'undefined'){
      authorSummary = el.innerHTML;
    } else {
      $j(el).html(authorSummary);
    }

    var wordArray = authorSummary.split(' ');
    while(el.scrollHeight > el.offsetHeight) {
        wordArray.pop();
        el.innerHTML = wordArray.join(' ') + '...  ';
        $j('<a class="more-link" href="' +userProfileUrl+ '">' +viewMoreTranslation + '</a>').appendTo('.summary-text');
     }
    $j('.summary-text').css('margin-top', '10px'); //align summary text after truncating
  }
}

function adjustSeeMore() {
  var featureSectionViewSwitchWidth = 641;
  var paddingHeight = 40;
  var adjustHeight = 20;

  var aboutBookHeight = $j('.about-book').outerHeight() - adjustHeight;
  var aboutBookContentsHeight = $j('.book-description').outerHeight() +  $j('.author-website').outerHeight();

  var featureDetailSectionHeight = $j('.features-and-details-section').outerHeight();
  var aboutSectionHeight = aboutBookContentsHeight > featureDetailSectionHeight ? aboutBookContentsHeight : featureDetailSectionHeight;

  if ($j( window ).width() < featureSectionViewSwitchWidth) {
    aboutBookContentsHeight += $j('.features-and-details-section').outerHeight() + (paddingHeight * 2);
  } else {
    aboutBookContentsHeight = aboutSectionHeight;
  }

  if(aboutBookHeight < aboutBookContentsHeight){
    $j('.about-book .see-more').show();
  }
  else {
    $j('.about-book .see-more').hide();
  }

  var $commentsSection = $j('.comments-section');
  var $commentList = $j('#comment-list');

  if ($commentsSection.length) {
    var commentSectionBottom = $commentsSection.offset().top + $commentsSection.outerHeight();
    var commentListBottom = $commentList.offset().top + $commentList.outerHeight();
    if(commentSectionBottom < commentListBottom){
      $j('.comments-section .see-more').show();
    } else {
      $j('.comments-section .see-more').hide();
    }
  }
}

function renderConditionalSections() {
  var userInfo = JSON.parse($j.cookie('dm') || '{}');

  var loggedInUserId = userInfo.user_id;
  var loggedInUsername = userInfo.username;
  var authorUsername = window.BOOK_DATA.author_username;

  var conditions = {};
  function setConditions() {
    conditions = {
      'user': !!loggedInUsername,
      'user-is-author': loggedInUsername === authorUsername,
      'no-user': !loggedInUsername
    };
  }
  function updateConditionalElements() {
    if(conditions['user']) {
      $j('.show-on-user.hidden').removeClass('hidden');
    }
    if (conditions['no-user']) {
      $j('.show-on-no-user.hidden').removeClass('hidden');
    }
    if (conditions['user-is-author']) {
      $j('.show-on-user-is-author.hidden').removeClass('hidden');
    }

    // comments can be by any user, so we have to read the data.user_id in each element
    $j('.show-on-user-is-comment-user.hidden').each(function () {
      var $el = $j(this);
      var commentUserId = $el.data('user_id');
      if (commentUserId === loggedInUserId) $el.removeClass("hidden");
    })
  }

  setConditions();
  updateConditionalElements();
}

// Do this immediately (before document ready) since this is after all the html is rendered
// Also, since it's idempotent, it can run after the dom is loaded too. ^__^
renderConditionalSections();

// This needs to be idempotent, so responsive_comments can call it when it's
// loaded, to attach to the ajax loaded comments html, which could come in
// before or after this script is executed
function attachSeeMoreHandlers() {
  $j('.see-more-link')
    .off('click.see-more')
    .on('click.see-more', function (e) {
      $j(this).parent().siblings('.grid-construct').css({"overflow": "visible", "max-height": "100%"});
      $j(this).parent('.see-more').hide();
    })
  $j('.see-more')
    .off('click.see-more')
    .on('click.see-more', function (e) {
      $j(this).siblings('.grid-construct').css({"overflow": "visible", "max-height": "100%"});
      $j(this).hide();
    });
}


$j.fn.isInViewport = function() {
  var elementTop = $j(this).offset().top;
  var elementBottom = elementTop + $j(this).outerHeight();

  var viewportTop = $j(window).scrollTop();
  var viewportBottom = viewportTop + $j(window).height();

  return elementBottom > viewportTop && elementTop < viewportBottom;
};

var hasRenderedAuthorBookShelf = false;

function renderAuthorBookShelf() {
  if (hasRenderedAuthorBookShelf){
    return;
  }

  hasRenderedAuthorBookShelf = true;
  //exclude getting the current book
  var url = "/bookstore/bookshelf/" + window.BOOK_DATA.author_id + "?exclude=" + window.BOOK_DATA.id
  $j(".author-bookshelf").load(url);

}

function conditionallyRenderAuthorBookshelf() {
  if (window.BOOK_DATA.type == "Book" && $j('.author-bookshelf').isInViewport()) {
    renderAuthorBookShelf();
  }
}

$j(document).ready(function() {
  renderConditionalSections();

  conditionallyRenderAuthorBookshelf();

  //load books when scrolled close to the section
  $j(window).on('resize scroll', function() {
    conditionallyRenderAuthorBookshelf() ;
  });

  var clickCounter = 0;
  var $shareBtnsWidgets = $j('.share-btns--widget');

  $j(function(e){
    ellipsizeTextBox('.summary-text');
  });

  $j(window).resize(function(e){
    ellipsizeTextBox('.summary-text');
    adjustSeeMore();
  });

  var resetShareWidgets = function(){
    clickCounter = 0;
    $shareBtnsWidgets.hide()
  };
//make sure copy link has enough room underneath on tablet

  $j(document).click(function(){
    clickCounter++;
    if (clickCounter >= 3){
      resetShareWidgets();
    }
  });

  $j('.share-section__link').on('click', function(e){
    e.preventDefault();
  });

  $j('.facebook-icon').hover(function(){
    resetShareWidgets();
    $j('.like-btn').show();
  });

  $j('.link-icon').hover(function(){
    resetShareWidgets();
    $j('.manual-share').show();
  });

  $j('.twitter-icon').hover(function(){
    resetShareWidgets();
    $j('.twitter-btn').show();
  });

  $j('.pinterest-icon--filled').hover(function(){
    resetShareWidgets();
    $j('.pinterest-btn').show();
  });

  $j('.copy-button').click(function(e){
    $j('.share-link').select();
    document.execCommand('copy');
  });

  $j('.line-item').click(function(){
    $j('.radio-custom', this)[0].checked = true;
  });

  $j('.item-quantity').on("change keyup", function() {
     var quantity = $j(this).val();
     quantity = quantity.replace(/\D/g,'');
     $j(this).val(quantity == '0' ? '1' : quantity);
  });

  adjustSeeMore();
  attachSeeMoreHandlers();

  $j('#send-to-device').on('click', function(e) {
    $j('#ebk-email-dialog').toggleClass('hidden');
    $j(this).toggleClass('open');
  });
});
