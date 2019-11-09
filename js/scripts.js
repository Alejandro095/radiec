"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}var dispatch=function(e){var t=new CustomEvent(e.Type,{detail:e.message});document.dispatchEvent(t)},servers_production=[{Prioridad:1,NameServer:"UANL",src:"http://148.234.33.156/stream-he?type=.aac"},{Prioridad:2,NameServer:"Global",src:"http://us4.internet-radio.com:8066/stream?type=.aac"},{Prioridad:3,NameServer:"Respaldo 1",src:"http://beta-radiec.ddns.net:80/live"},{Prioridad:4,NameServer:"Respaldo 2",src:"http://beta-radiec.ddns.net:8077/live"}],connectionErrors=[],players=[],player_master=!1,counter={start:!1},connect=function(e){document.getElementById("LOADER").classList.remove("hidde"),document.getElementById("BTN-play").classList.add("hidde"),connectionErrors=[],e.map(function(e){var t=new Audio;t.Prioridad=e.Prioridad,t.NameServer=e.NameServer,t.src=e.src,t.load(),t.addEventListener("error",function(e){dispatch({Type:"CONNECTION_ERROR",message:t.src})}),t.addEventListener("pause",function(e){dispatch({Type:"PAUSE_PLAYER",message:e})}),t.addEventListener("play",function(e){dispatch({Type:"PLAY_PLAYER",message:t.NameServer})}),t.addEventListener("loadeddata",function(){dispatch({Type:"LOAD_DATA",message:t})})})};function fancyTimeFormat(e){var t=~~(e/3600),n=~~(e%3600/60),r=~~e%60,a="";return t>0&&(a+=t+":"+(n<10?"0":"")),a+=n+":"+(r<10?"0":""),a+=""+r}document.addEventListener("LOAD_DATA",function(e){players.push(e.detail),players.sort(function(e,t){return(e=e.Prioridad)<(t=t.Prioridad)?-1:e>t?1:0}),player_master||(player_master=players[0]).play(),player_master&&player_master.src!=e.detail.src&&(players.map(function(e){e.pause()}),player_master.pause(),(player_master=players[0]).play())}),document.addEventListener("CONNECTION_ERROR",function(e){connectionErrors.push(e),connectionErrors.length>=4&&setTimeout(function(){document.getElementById("SERVER-NAME").innerText="Reconectando",connect(servers_production)},1e3)}),document.addEventListener("PLAY_PLAYER",function(e){document.getElementById("LOADER").classList.add("hidde"),document.getElementById("BTN-play").classList.remove("hidde"),document.getElementById("BTN-play").innerText="stop",document.getElementById("SERVER-NAME").innerText=player_master.NameServer,0==counter.start&&(counter.start=!0,counter.setInterval=setInterval(function(){document.getElementById("PLAYER-counter").innerText=fancyTimeFormat(Math.ceil(player_master.currentTime))},1e3))}),document.addEventListener("PAUSE_PLAYER",function(e){player_master.paused&&(document.getElementById("BTN-play").innerText="play_arrow")}),document.getElementById("BTN-play").addEventListener("click",function(e){!1===player_master?connect(servers_production):(player_master&&3===player_master.readyState&&(player_master.paused?player_master.play():player_master.pause()),"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",function(){return player_master.play()}),navigator.mediaSession.setActionHandler("pause",function(){return player_master.pause()})))}),_toConsumableArray(document.getElementsByClassName("BTN-aside")).map(function(e){e.addEventListener("click",function(){document.getElementById("navbar").classList.toggle("show-navbar");var e=document.getElementById("navbar").offsetWidth;document.querySelector("#page").style.transform?document.querySelector("#page").style.transform="":document.querySelector("#page").style.transform="translateX(-".concat(e,"px)")})});var getSongData=function(){return fetch("https://control.internet-radio.com:2199/rpc/rdiec/streaminfo.get",{cache:"no-store"}).then(function(e){return e.json()}).then(function(e){return e.data[0].track}).catch(function(e){return console.log(e)})},createElement=function(e,t,n){var r=n.type,a=n.data,s=document.createElement(e);return s.setAttribute(r,a),s.innerText=t,s};!function(){var e=[],t=document.getElementById("Song-display"),n=async function(){var n=await getSongData();0!==e.length&&n.title==e[0].title||(0===e.length&&(t.innerHTML=""),e.unshift(n),"mediaSession"in navigator&&(navigator.mediaSession.metadata=new MediaMetadata({title:e[0].title,artist:e[0].artist,artwork:[{src:"https://yt3.ggpht.com/a/AGF-l7_AL0YQcz-w0XNV2vcuBysd-pxhlRn5ojyPIQ=s900-c-k-c0xffffffff-no-rj-mo",sizes:"96x96",type:"image/jpg"},{src:"https://yt3.ggpht.com/a/AGF-l7_AL0YQcz-w0XNV2vcuBysd-pxhlRn5ojyPIQ=s900-c-k-c0xffffffff-no-rj-mo",sizes:"128x128",type:"image/jpg"},{src:"https://yt3.ggpht.com/a/AGF-l7_AL0YQcz-w0XNV2vcuBysd-pxhlRn5ojyPIQ=s900-c-k-c0xffffffff-no-rj-mo",sizes:"192x192",type:"image/jpg"},{src:"https://yt3.ggpht.com/a/AGF-l7_AL0YQcz-w0XNV2vcuBysd-pxhlRn5ojyPIQ=s900-c-k-c0xffffffff-no-rj-mo",sizes:"256x256",type:"image/jpg"},{src:"https://yt3.ggpht.com/a/AGF-l7_AL0YQcz-w0XNV2vcuBysd-pxhlRn5ojyPIQ=s900-c-k-c0xffffffff-no-rj-mo",sizes:"384x384",type:"image/jpg"},{src:"https://yt3.ggpht.com/a/AGF-l7_AL0YQcz-w0XNV2vcuBysd-pxhlRn5ojyPIQ=s900-c-k-c0xffffffff-no-rj-mo",sizes:"512x512",type:"image/jpg"}]})),t.insertBefore(createElement("p","".concat(e[0].artist," - ").concat(e[0].title),{type:"class",data:"animated fadeInLeft"}),t.firstChild)),e.length>4&&(e.pop(),t.lastElementChild.classList.add("fadeOut"),t.lastElementChild.addEventListener("animationend",function(e){t.removeChild(t.lastElementChild)}))};n(),setInterval(function(){return n()},3e4)}();