module.exports=function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=4)}({4:function(e,r,t){"use strict";t.r(r);var n=[{playerId:"Aztec Empire"},{playerId:"Federation of Asia"},{playerId:"Noram States"},{playerId:"Panafrican Union"},{playerId:"Republic of Europe"}];function o(e){for(var r,t=e.length-1;t>0;t--){var n=Math.floor(Math.random()*(t+1));r=[e[n],e[t]],e[t]=r[0],e[n]=r[1]}return e}var u={setup:function(){return{players:o(n).slice(2).reduce((function(e,r){return e[r.playerId]={},e}),{})}},getPlayerIds:function(e){return Object.keys(e.players)}};r.default=u}});