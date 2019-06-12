(function(){this.Blurb||(this.Blurb={});(function(s){var h,a,k;this.Blurb.PartnerTracking=function(){function c(a){this.host=null!=a?a:"";this.query_params=this.processQueryParams(window.location.search)}c.prototype.track=function(){h.exists("ua_hash")||h.set("ua_hash",this.generateHash(),365);if(this.isSpecialView())return this.recordPageview()};c.prototype.isSpecialView=function(){return this.isFirstPageview()||this.partnerCode()||!this.isReferrerUnimportant(document.referrer)?!0:!1};c.prototype.recordPageview=
function(){var a;a=this.visitInfo();return this.sendToAPI(a)};c.prototype.visitInfo=function(){var a;(a=this.partnerCode())||(a=this.isReferrerUnimportant(document.referrer)?"blurb":this.isReferrerSocial(document.referrer)?"blurbsocial":this.isReferrerSearch(document.referrer)?"blurborganic":"blurbreferral");return{partner_code:a,ua_hash:h.get("ua_hash"),keywords:this.searchKeywords(document.referrer)}};c.prototype.partnerCode=function(){return this.query_params.ce};c.prototype.searchKeywords=function(a){var c,
b,f,e,h,k,l,m,n,p,q,r;b=a.indexOf("?");if(0<=b){b=a.substring(b);p=this.processQueryParams(b);r=[{domains:[".ask."],params:["q","a"]},{domains:[".msn.",".live.",".bing."],params:["q","text"]},{domains:[".yahoo."],params:["q","p"]},{domains:[".google."],params:["q","a"]},{domains:[".aol."],params:["q","query","encquery","k"]}];b=0;for(e=r.length;b<e;b++)for(q=r[b],m=q.domains,f=0,h=m.length;f<h;f++)if(c=m[f],0<=a.indexOf(c))for(n=q.params,c=0,k=n.length;c<k;c++)if(l=n[c],p[l])return p[l];return null}};
c.prototype.sendToAPI=function(a){return s.ajax(this.host+"/partner_tracking/track",{type:"GET",data:a,dataType:"jsonp"})};c.prototype.generateHash=function(){return a.create().hex};c.prototype.isFirstPageview=function(){if(h.exists("first_visit"))return!1;h.set("first_visit",!0,.5);return!0};c.prototype.isReferrerUnimportant=function(a){return""===a||0<=a.split("?")[0].indexOf(".blurb.")?!0:!1};c.prototype.isReferrerSocial=function(a){var c,b,f,e;e="facebook.com fb.me blogger.com blogspot.com twitter.com t.co tumblr.com flickr.com pinterest.com deviantart.com wordpress.com wordpress.org youtube.com linkedin.com lnkd.in stumbleupon.com livejournal.com reddit.com vk.com vkontakte.ru tinyurl.com squidoo.com vimeo.com weebly.com typepad.com disqus.com answers.yahoo.com ning.com naver.com meetup.com tripadvisor.com yelp.com ameblo.jp ravelry.com wikia.com caringbridge.org getpocket.com pocket.co netvibes.com paper.li secondlife.com flavors.me yuku.com apps.facebook.com virb.com myfamily.com stackexchange.com imageshack.us goodreads.com douban.com myspace.com askville.amazon.com cocolog-nifty.com blogher.com foursquare.com goo.gl quora.com academia.edu d.hatena.ne.jp bloglines.com viadeo.com cghub.com instapaper.com polyvore.com ustream.tv couchsurfing.org photobucket.com scribd.com weibo.com diigo.com last.fm slideshare.net spoke.com vampirefreaks.com buzzfeed.com care2.com dogster.com habbo.com hi5.com interpals.net netlog.com beforeitsnews.com bigtent.com blogster.com classmates.com cyworld.com dailymotion.com fark.com fetlife.com fotki.com gutefrage.net jigsaw.com justin.tv mubi.com my.opera.com plurk.com posterous.com renren.com reverbnation.com taringa.net wikihow.com wretch.cc bookmarks.yahoo.com bookmarks.yahoo.co.jp".split(" ");
b=0;for(f=e.length;b<f;b++)if(c=e[b],0<=a.indexOf(c))return!0;return!1};c.prototype.isReferrerSearch=function(a){var c,b,f,e;e=".ask. .msn. .live. .bing. .yahoo. .google. .aol.".split(" ");b=0;for(f=e.length;b<f;b++)if(c=e[b],0<=a.indexOf(c))return!0;return!1};c.prototype.processQueryParams=function(a){a=a.substr(1).split("&");var c,b,f,e;if(""===a)a={};else{c={};for(f=0;f<a.length;)e=a[f].split("="),b=e.shift(),c[b]=e.join("="),++f;a=c}return a};return c}();k=function(a,g){var d,b;for(d=0;d<a.length;){b=
new RegExp(g,"i");if(null!=a[d].match(b))return d;d++}return-1};h={set:function(a,g,d){var b,f,e;d||(d=365);b=new Date;b.setTime(b.getTime()+864E5*parseFloat(d));f="expires="+b.toGMTString();d="";b=document.domain.toLowerCase().split(".").reverse();for(e=k(b,"blurb");-1!==e;)d+="."+b[e],e--;a=encodeURIComponent(a)+"="+encodeURIComponent(g||"")+"; path=/; "+f+"; domain="+d+";";document.cookie=a},get:function(a){return(a=document.cookie.match(new RegExp("(^|;)\\s*"+encodeURIComponent(a)+"=([^;\\s]+)")))?
decodeURIComponent(a[2]):null},exists:function(a){return(a=h.get(a))?""!==a.toString():!1}};a=function(){};a.maxFromBits=function(a){return Math.pow(2,a)};a.limitUI04=a.maxFromBits(4);a.limitUI06=a.maxFromBits(6);a.limitUI08=a.maxFromBits(8);a.limitUI12=a.maxFromBits(12);a.limitUI14=a.maxFromBits(14);a.limitUI16=a.maxFromBits(16);a.limitUI32=a.maxFromBits(32);a.limitUI40=a.maxFromBits(40);a.limitUI48=a.maxFromBits(48);a.randomUI06=function(){return Math.floor(Math.random()*a.limitUI06)};a.randomUI08=
function(){return Math.floor(Math.random()*a.limitUI08)};a.randomUI12=function(){return Math.floor(Math.random()*a.limitUI12)};a.randomUI16=function(){return Math.floor(Math.random()*a.limitUI16)};a.randomUI32=function(){return Math.floor(Math.random()*a.limitUI32)};a.randomUI48=function(){return(0|1073741824*Math.random())+1073741824*(0|262144*Math.random())};a.paddedString=function(a,g,d){a=String(a);d=d?d:"0";for(g-=a.length;0<g;)g&1&&(a=d+a),g>>>=1,d+=d;return a};a.prototype.fromParts=function(c,
g,d,b,f,e){this.version=d>>12&15;this.hex=a.paddedString(c.toString(16),8)+"-"+a.paddedString(g.toString(16),4)+"-"+a.paddedString(d.toString(16),4)+"-"+a.paddedString(b.toString(16),2)+a.paddedString(f.toString(16),2)+"-"+a.paddedString(e.toString(16),12);return this};a.prototype.toString=function(){return this.hex};a._create4=function(){return(new a).fromParts(a.randomUI32(),a.randomUI16(),16384|a.randomUI12(),128|a.randomUI06(),a.randomUI08(),a.randomUI48())};a.create=function(a){return this["_create4"]()};
if(window.onBlurbPartnerTrackingReady)return window.onBlurbPartnerTrackingReady()})(jQuery)}).call(this);