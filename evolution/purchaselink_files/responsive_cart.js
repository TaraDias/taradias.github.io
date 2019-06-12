$j(document).ready(function() {
  // this is a safety measure to ensure that
  // the add_to_cart dialog isn't left open on
  // the  responsive book detail page
  closeAddToCart();

  $body = $j('body');

  // User closes the cart dialog via "Continue shopping" link or the dialog X.
  $body.on('click', '#continue_shopping a, #exit-button a', function(e) {
    e.stopPropagation();
    e.preventDefault();
    closeAddToCart();
    location.reload();
  });

  $body.on('change', '.add_to_cart_wrapper .line-item-qty', function(e) {
    setOldQuantity();
  });

  // if the pdf radio button gets pushed
  // reset the quantity to one, and disable
  // the quantity textfield (to avoid confusion)
  $body.on('click', '.line-item-purchase', function(e) {
    if ($j(this).val() == 'pdf'){
      var $qtyEl = $j('.item-quantity:visible')
      oldBookQuantity = $qtyEl.val();
      $qtyEl.val('1');
      $qtyEl.attr('disabled','disabled');
    }
  });


  // update quantity button is pushed in the cart.
  $body.on('click', '#update-quantity-button', function(e) {
    e.preventDefault();

    var form = $j(this.form);
    var params = form.serialize(true);

    $j.ajax({
      url: '/carts/update_cart',
      type: 'POST',
      dataType: 'script',
      data: params
    });
  });

  // Remove an item from an open cart.
  $body.on('click', ".remove-button", function(e) {
    e.preventDefault();
    var url = $j(this).attr('href');

    $j.ajax({
      url: url,
      type: 'POST',
      dataType: 'script',
      success: function(){
        // remove checkout/update buttons if
        // no items are in the cart
        if ($j('.remove-button').size() == 0){
          $j('#update_quantity').hide();
          $j('#checkout_button').hide();
        }
      }
    });
  });

  // add to cart button is pushed
  $j('#add_to_cart_button, .proline-add-to-cart, #add_to_cart_submit').on('click', function(e) {
    e.preventDefault();
    $this = $j(this)

    var form = $j(this.form);
    var params = form.serialize(true);
    var loadingText = $this.closest(".add_to_cart").data("cart-message")

    if ($this.attr('class').indexOf('pro-cart-button') != -1) {
      Dialog.dismiss();
    }

    if (shouldPreloadFlash()) {
      var loadingMessage = loadingMessageHtml(loadingText);
      $j('#message-content').empty();
      $j('#cart-message').html(loadingMessage).fadeIn(500);
      resetQuantity();
    }

    cartUrl = form.attr('action');
    var ebook = getParams('ebook')

    $j.ajax({
      url: cartUrl,
      type: 'POST',
      data: params,
      dataType: 'json'
    })
    .done(function(response) {
      // ebooks
      if (response.cart) {
        return successfulAddToCart(response.cart.html);
      }
      successfulAddToCart(response.success);
    })
    .fail(function(xhr) {
      var response = JSON.parse(xhr.responseText);
      var responseMsg;
    
      // ebooks
      if (response.errors) {
        responseMsg = response.errors[0][1];
      } else {
        responseMsg = response.error
      }
    
      var notice = '<div id="exit-button"><a href="#">×</a></div><div class="error">' + responseMsg + '</div>'
      $j('#cart-message').html(notice).fadeIn(150);
    
      scrollIfNeeded('#cart-message');
    });
  });
});

function successfulAddToCart(html) {
  var form = $j('.add_to_cart_wrapper form');
  var fadeDuration = 150;
  var notificationDuration = 11000;

  $j('#cart-message').html(html).fadeIn(fadeDuration);

  updateShoppingCartMenu(fadeDuration);

  scrollIfNeeded('#shopping-cart-header');

  if (window.utag && window.utag.link) {
    window.utag.view({'event_name':'add to cart success','page_virtual':'/bookstore/cart-overlay'});
  } else {
    console.error('window.utag.link undefined');
  }

}

function closeAddToCart() {
  $j('#cart-message').fadeOut();
}

function shouldPreloadFlash() {
  shouldPreload = false;
  $j('.pro-quantity, .item-quantity').each(function() {
    if ( $j(this).attr('value') > 0 && $j(this).is(':visible'))
      shouldPreload = true;
  });
  if ($j('.line-item-purchase').attr('checked'))
    shouldPreload = true;

  return shouldPreload;
}

function resetQuantity() {
  $j('.item-quantity').each(function() {
    $j(this).val("1");
    oldBookQuantity = 1;
  });
}


function successfulUpdateCart(html) {
  $j('#cart-message').html(html);
  updateShoppingCartMenu(150);

  if (!$j('#notification-div').size() == 0) {
    scrollIfNeeded('#notification-div');
  }
}

function updateShoppingCartMenu(fadeDuration) {
  if ($j('header nav.nav-account').length === -1){
    var as = new Blurb.Menu($j, Blurb.Hostnames.www_url, Blurb.locale);
    as.render('account_setting', '.nav-account');
  }
}


// to retain the old book count
// if a user switches back and forth
// between the ebook and regular book
// options
var oldBookQuantity;

function setOldQuantity() {
  var $itemQtyEl = $j('.item-quantity:visible');
  $itemQtyEl.removeAttr('disabled','disabled');
  if (oldBookQuantity != null) {
    $itemQtyEl.val(oldBookQuantity);
  }
}

// returns false if element isn't completely in
// view
function isInView(element) {
  var viewTop = $j(window).scrollTop();
  var viewBottom = viewTop + $j(window).height();

  var elementTop = $j(element).offset().top;
  var elementBottom = elementTop + $j(element).height();

  return ((elementTop >= viewTop) && (elementBottom <= viewBottom));
}

function getParams(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function scrollToTop() {
  $j('body,html').animate({
    scrollTop: 0
  }, 1000);
  return false;
}

function scrollIfNeeded(element) {
  if (!(isInView(element))) {
    scrollToTop();
  }
  return false;
}

function loadingMessageHtml(message){
  if (message === undefined) {
    message = "Adding item..."
  }
  return "<img src='/images/book_detail/loading-small.gif' /> <span id='cart-loading-message'>" + message + "</span>";
}
