//tealium universal tag - utag.78 ut4.0.201809181340, Copyright 2018 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u=utag.o[loader].sender[id]={};if(utag.ut===undefined){utag.ut={};}
if(utag.ut.loader===undefined){u.loader=function(o){var b,c,l,a=document;if(o.type==="iframe"){b=a.createElement("iframe");o.attrs=o.attrs||{"height":"1","width":"1","style":"display:none"};for(l in utag.loader.GV(o.attrs)){b.setAttribute(l,o.attrs[l]);}b.setAttribute("src",o.src);}else if(o.type=="img"){utag.DB("Attach img: "+o.src);b=new Image();b.src=o.src;return;}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";for(l in utag.loader.GV(o.attrs)){b[l]=o.attrs[l];}b.src=o.src;}if(o.id){b.id=o.id};if(typeof o.cb=="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb()},false);}else{b.onreadystatechange=function(){if(this.readyState=='complete'||this.readyState=='loaded'){this.onreadystatechange=null;o.cb()}};}}l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l=="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b)}}}}else{u.loader=utag.ut.loader;}
u.ev={'view':1};u.initialized=false;u.map={};u.extend=[];u.send=function(a,b){if(u.ev[a]||typeof u.ev.all!="undefined"){var c,d,e,f;u.data={"projectId":"2513470821","eventName":"purchase","orderId":"","revenue":""};for(d in utag.loader.GV(u.map)){if(typeof b[d]!=="undefined"&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){u.data[e[f]]=b[d];}}}
if(u.data.orderId===""&&b._corder!==undefined){u.data.orderId=b._corder;}
if(u.data.revenue===""&&b._csubtotal!==undefined){u.data.revenue=b._csubtotal;}
u.opt_callback=function(){u.initialized=true;window.optimizely=window.optimizely||[];if(u.data.orderId!==""){window.optimizely.push(["trackEvent",u.data.eventName,{"revenue":u.data.revenue.replace(".","")}]);}else if(u.data.eventName&&u.data.eventName!=="purchase"){window.optimizely.push(["trackEvent",u.data.eventName]);}};u.base_url="//cdn.optimizely.com/js/"+u.data.projectId+".js";if(!u.initialized){u.loader({src:u.base_url,cb:u.opt_callback});}else{u.opt_callback();}
}};utag.o[loader].loader.LOAD(id);})('78','blurb.main');}catch(e){}