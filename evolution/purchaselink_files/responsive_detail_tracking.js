(function($j){
  // Tealium scripts are tracking all other social events, only fb app id needs to be identified by telium
  window.fbAsyncInit = function() {
    var fbId = $j('.fb-app-id').attr('data-fb-appid');

    FB.init({
      appId : fbId,
      status : true, // check login status
      cookie : true, // enable cookies to allow the server to access the session
      xfbml : true, // parse XFBML
      channelUrl: '/misc/fb_channel',
      version: 'v2.7'
    });
    $j('#fb-root').trigger('facebookloaded');

    utag.link({'event_name':'social_facebook_loaded'});
  };

})(jQuery);
