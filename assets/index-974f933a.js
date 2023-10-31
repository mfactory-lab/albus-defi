import{P as T,b as d,a as S}from"./index-01da7810.js";import{E as A,v as M}from"./v4-ae53bbcc.js";var O=globalThis&&globalThis.__extends||function(){var c=function(a,r){return c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])},c(a,r)};return function(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");c(a,r);function t(){this.constructor=a}a.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}}(),P=function(c){O(a,c);function a(){return c!==null&&c.apply(this,arguments)||this}return a}(A),K=globalThis&&globalThis.__extends||function(){var c=function(a,r){return c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])},c(a,r)};return function(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");c(a,r);function t(){this.constructor=a}a.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}}(),x=globalThis&&globalThis.__assign||function(){return x=Object.assign||function(c){for(var a,r=1,t=arguments.length;r<t;r++){a=arguments[r];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(c[n]=a[n])}return c},x.apply(this,arguments)},m=globalThis&&globalThis.__awaiter||function(c,a,r,t){function n(e){return e instanceof r?e:new r(function(o){o(e)})}return new(r||(r=Promise))(function(e,o){function s(l){try{i(t.next(l))}catch(f){o(f)}}function u(l){try{i(t.throw(l))}catch(f){o(f)}}function i(l){l.done?e(l.value):n(l.value).then(s,u)}i((t=t.apply(c,a||[])).next())})},w=globalThis&&globalThis.__generator||function(c,a){var r={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},t,n,e,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(i){return function(l){return u([i,l])}}function u(i){if(t)throw new TypeError("Generator is already executing.");for(;r;)try{if(t=1,n&&(e=i[0]&2?n.return:i[0]?n.throw||((e=n.return)&&e.call(n),0):n.next)&&!(e=e.call(n,i[1])).done)return e;switch(n=0,e&&(i=[i[0]&2,e.value]),i[0]){case 0:case 1:e=i;break;case 4:return r.label++,{value:i[1],done:!1};case 5:r.label++,n=i[1],i=[0];continue;case 7:i=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!(e=e.length>0&&e[e.length-1])&&(i[0]===6||i[0]===2)){r=0;continue}if(i[0]===3&&(!e||i[1]>e[0]&&i[1]<e[3])){r.label=i[1];break}if(i[0]===6&&r.label<e[1]){r.label=e[1],e=i;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(i);break}e[2]&&r.ops.pop(),r.trys.pop();continue}i=a.call(c,r)}catch(l){i=[6,l],n=0}finally{t=e=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},E=globalThis&&globalThis.__read||function(c,a){var r=typeof Symbol=="function"&&c[Symbol.iterator];if(!r)return c;var t=r.call(c),n,e=[],o;try{for(;(a===void 0||a-- >0)&&!(n=t.next()).done;)e.push(n.value)}catch(s){o={error:s}}finally{try{n&&!n.done&&(r=t.return)&&r.call(t)}finally{if(o)throw o.error}}return e},R=function(c){K(a,c);function a(r,t){var n=c.call(this)||this;if(n._handleMessage=function(e){if(n._injectedProvider&&e.source===window||e.origin===n._providerUrl.origin&&e.source===n._popup){if(e.data.method==="connected"){var o=new T(e.data.params.publicKey);(!n._publicKey||!n._publicKey.equals(o))&&(n._publicKey&&!n._publicKey.equals(o)&&n._handleDisconnect(),n._publicKey=o,n._autoApprove=!!e.data.params.autoApprove,n.emit("connect",n._publicKey))}else if(e.data.method==="disconnected")n._handleDisconnect();else if((e.data.result||e.data.error)&&n._responsePromises.has(e.data.id)){var s=E(n._responsePromises.get(e.data.id),2),u=s[0],i=s[1];e.data.result?u(e.data.result):i(new Error(e.data.error))}}},n._handleConnect=function(){return n._handlerAdded||(n._handlerAdded=!0,window.addEventListener("message",n._handleMessage),window.addEventListener("beforeunload",n.disconnect)),n._injectedProvider?new Promise(function(e){n._sendRequest("connect",{}),e()}):(window.name="parent",n._popup=window.open(n._providerUrl.toString(),"_blank","location,resizable,width=460,height=675"),new Promise(function(e){n.once("connect",e)}))},n._handleDisconnect=function(){n._handlerAdded&&(n._handlerAdded=!1,window.removeEventListener("message",n._handleMessage),window.removeEventListener("beforeunload",n.disconnect)),n._publicKey&&(n._publicKey=null,n.emit("disconnect")),n._responsePromises.forEach(function(e,o){var s=E(e,2);s[0];var u=s[1];n._responsePromises.delete(o),u("Wallet disconnected")})},n._sendRequest=function(e,o){return m(n,void 0,void 0,function(){var s,u=this;return w(this,function(i){if(e!=="connect"&&!this.connected)throw new Error("Wallet not connected");return s=this._nextRequestId,++this._nextRequestId,[2,new Promise(function(l,f){u._responsePromises.set(s,[l,f]),u._injectedProvider?u._injectedProvider.postMessage({jsonrpc:"2.0",id:s,method:e,params:x({network:u._network},o)}):(u._popup.postMessage({jsonrpc:"2.0",id:s,method:e,params:o},u._providerUrl.origin),u.autoApprove||u._popup.focus())})]})})},n.connect=function(){return n._popup&&n._popup.close(),n._handleConnect()},n.disconnect=function(){return m(n,void 0,void 0,function(){return w(this,function(e){switch(e.label){case 0:return this._injectedProvider?[4,this._sendRequest("disconnect",{})]:[3,2];case 1:e.sent(),e.label=2;case 2:return this._popup&&this._popup.close(),this._handleDisconnect(),[2]}})})},n.sign=function(e,o){return m(n,void 0,void 0,function(){var s,u,i;return w(this,function(l){switch(l.label){case 0:if(!(e instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");return[4,this._sendRequest("sign",{data:e,display:o})];case 1:return s=l.sent(),u=d.decode(s.signature),i=new T(s.publicKey),[2,{signature:u,publicKey:i}]}})})},n.signTransaction=function(e){return m(n,void 0,void 0,function(){var o,s,u;return w(this,function(i){switch(i.label){case 0:return[4,this._sendRequest("signTransaction",{message:d.encode(e.serializeMessage())})];case 1:return o=i.sent(),s=d.decode(o.signature),u=new T(o.publicKey),e.addSignature(u,s),[2,e]}})})},n.signAllTransactions=function(e){return m(n,void 0,void 0,function(){var o,s,u;return w(this,function(i){switch(i.label){case 0:return[4,this._sendRequest("signAllTransactions",{messages:e.map(function(l){return d.encode(l.serializeMessage())})})];case 1:return o=i.sent(),s=o.signatures.map(function(l){return d.decode(l)}),u=new T(o.publicKey),e=e.map(function(l,f){return l.addSignature(u,s[f]),l}),[2,e]}})})},W(r))n._injectedProvider=r;else if(k(r))n._providerUrl=new URL(r),n._providerUrl.hash=new URLSearchParams({origin:window.location.origin,network:t}).toString();else throw new Error("provider parameter must be an injected provider or a URL string.");return n._network=t,n._publicKey=null,n._autoApprove=!1,n._popup=null,n._handlerAdded=!1,n._nextRequestId=1,n._responsePromises=new Map,n}return Object.defineProperty(a.prototype,"publicKey",{get:function(){return this._publicKey},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"connected",{get:function(){return this._publicKey!==null},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"autoApprove",{get:function(){return this._autoApprove},enumerable:!1,configurable:!0}),a}(A);function k(c){return typeof c=="string"}function W(c){return q(c)&&H(c.postMessage)}function q(c){return typeof c=="object"&&c!==null}function H(c){return typeof c=="function"}var C=globalThis&&globalThis.__extends||function(){var c=function(a,r){return c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])},c(a,r)};return function(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");c(a,r);function t(){this.constructor=a}a.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}}(),_=globalThis&&globalThis.__awaiter||function(c,a,r,t){function n(e){return e instanceof r?e:new r(function(o){o(e)})}return new(r||(r=Promise))(function(e,o){function s(l){try{i(t.next(l))}catch(f){o(f)}}function u(l){try{i(t.throw(l))}catch(f){o(f)}}function i(l){l.done?e(l.value):n(l.value).then(s,u)}i((t=t.apply(c,a||[])).next())})},v=globalThis&&globalThis.__generator||function(c,a){var r={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},t,n,e,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(i){return function(l){return u([i,l])}}function u(i){if(t)throw new TypeError("Generator is already executing.");for(;o&&(o=0,i[0]&&(r=0)),r;)try{if(t=1,n&&(e=i[0]&2?n.return:i[0]?n.throw||((e=n.return)&&e.call(n),0):n.next)&&!(e=e.call(n,i[1])).done)return e;switch(n=0,e&&(i=[i[0]&2,e.value]),i[0]){case 0:case 1:e=i;break;case 4:return r.label++,{value:i[1],done:!1};case 5:r.label++,n=i[1],i=[0];continue;case 7:i=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!(e=e.length>0&&e[e.length-1])&&(i[0]===6||i[0]===2)){r=0;continue}if(i[0]===3&&(!e||i[1]>e[0]&&i[1]<e[3])){r.label=i[1];break}if(i[0]===6&&r.label<e[1]){r.label=e[1],e=i;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(i);break}e[2]&&r.ops.pop(),r.trys.pop();continue}i=a.call(c,r)}catch(l){i=[6,l],n=0}finally{t=e=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},U=function(c){C(a,c);function a(r,t,n){var e=c.call(this)||this;return e._instance=null,e.handleMessage=function(o){},e._sendRequest=function(o,s){return _(e,void 0,void 0,function(){return v(this,function(u){switch(u.label){case 0:return this._instance.sendRequest?[4,this._instance.sendRequest(o,s)]:[3,2];case 1:return[2,u.sent()];case 2:return this._instance._sendRequest?[4,this._instance._sendRequest(o,s)]:[3,4];case 3:return[2,u.sent()];case 4:throw new Error("Unsupported version of `@project-serum/sol-wallet-adapter`")}})})},e._handleConnect=function(){e.emit("connect")},e._handleDisconnect=function(){window.clearInterval(e._pollTimer),e.emit("disconnect")},e._network=t,e._provider=n,e}return Object.defineProperty(a.prototype,"publicKey",{get:function(){return this._instance.publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"connected",{get:function(){return this._instance.connected||!1},enumerable:!1,configurable:!0}),a.prototype.connect=function(){return _(this,void 0,void 0,function(){var r=this;return v(this,function(t){switch(t.label){case 0:return this._instance=new R(this._provider,this._network),this._instance.on("connect",this._handleConnect),this._instance.on("disconnect",this._handleDisconnect),this._pollTimer=window.setInterval(function(){var n,e;((e=(n=r._instance)===null||n===void 0?void 0:n._popup)===null||e===void 0?void 0:e.closed)!==!1&&r._handleDisconnect()},200),[4,this._instance.connect()];case 1:return t.sent(),[2]}})})},a.prototype.disconnect=function(){return _(this,void 0,void 0,function(){return v(this,function(r){switch(r.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return this._instance.removeAllListeners("connect"),this._instance.removeAllListeners("disconnect"),[4,this._instance.disconnect()];case 1:return r.sent(),[2]}})})},a.prototype.signTransaction=function(r){return _(this,void 0,void 0,function(){var t;return v(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._sendRequest("signTransaction",{message:d.encode(r)})];case 1:return t=n.sent(),[2,d.decode(t.signature)]}})})},a.prototype.signAllTransactions=function(r){return _(this,void 0,void 0,function(){var t;return v(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._sendRequest("signAllTransactions",{messages:r.map(function(e){return d.encode(e)})})];case 1:return t=n.sent(),[2,t.signatures.map(function(e){return d.decode(e)})]}})})},a.prototype.signAndSendTransaction=function(r,t){return _(this,void 0,void 0,function(){var n;return v(this,function(e){switch(e.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._sendRequest("signAndSendTransaction",{transaction:d.encode(r),options:t})];case 1:return n=e.sent(),[2,n.signature]}})})},a.prototype.signMessage=function(r,t){return t===void 0&&(t="hex"),_(this,void 0,void 0,function(){var n;return v(this,function(e){switch(e.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._instance.sign(r,t)];case 1:return n=e.sent().signature,[2,Uint8Array.from(n)]}})})},a}(P),z=globalThis&&globalThis.__extends||function(){var c=function(a,r){return c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])},c(a,r)};return function(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");c(a,r);function t(){this.constructor=a}a.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}}(),I=globalThis&&globalThis.__assign||function(){return I=Object.assign||function(c){for(var a,r=1,t=arguments.length;r<t;r++){a=arguments[r];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(c[n]=a[n])}return c},I.apply(this,arguments)},g=globalThis&&globalThis.__awaiter||function(c,a,r,t){function n(e){return e instanceof r?e:new r(function(o){o(e)})}return new(r||(r=Promise))(function(e,o){function s(l){try{i(t.next(l))}catch(f){o(f)}}function u(l){try{i(t.throw(l))}catch(f){o(f)}}function i(l){l.done?e(l.value):n(l.value).then(s,u)}i((t=t.apply(c,a||[])).next())})},y=globalThis&&globalThis.__generator||function(c,a){var r={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},t,n,e,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(i){return function(l){return u([i,l])}}function u(i){if(t)throw new TypeError("Generator is already executing.");for(;o&&(o=0,i[0]&&(r=0)),r;)try{if(t=1,n&&(e=i[0]&2?n.return:i[0]?n.throw||((e=n.return)&&e.call(n),0):n.next)&&!(e=e.call(n,i[1])).done)return e;switch(n=0,e&&(i=[i[0]&2,e.value]),i[0]){case 0:case 1:e=i;break;case 4:return r.label++,{value:i[1],done:!1};case 5:r.label++,n=i[1],i=[0];continue;case 7:i=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!(e=e.length>0&&e[e.length-1])&&(i[0]===6||i[0]===2)){r=0;continue}if(i[0]===3&&(!e||i[1]>e[0]&&i[1]<e[3])){r.label=i[1];break}if(i[0]===6&&r.label<e[1]){r.label=e[1],e=i;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(i);break}e[2]&&r.ops.pop(),r.trys.pop();continue}i=a.call(c,r)}catch(l){i=[6,l],n=0}finally{t=e=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},j=function(c){z(a,c);function a(r,t){var n=this,e;return n=c.call(this)||this,n._publicKey=null,n._messageHandlers={},n.handleMessage=function(o){if(n._messageHandlers[o.id]){var s=n._messageHandlers[o.id],u=s.resolve,i=s.reject;delete n._messageHandlers[o.id],o.error?i(o.error):u(o.result)}},n._sendMessage=function(o){if(!n.connected)throw new Error("Wallet not connected");return new Promise(function(s,u){var i,l,f=M();n._messageHandlers[f]={resolve:s,reject:u},(l=(i=n._iframe)===null||i===void 0?void 0:i.contentWindow)===null||l===void 0||l.postMessage({channel:"solflareWalletAdapterToIframe",data:I({id:f},o)},"*")})},n._iframe=r,n._publicKey=new T((e=t?.toString)===null||e===void 0?void 0:e.call(t)),n}return Object.defineProperty(a.prototype,"publicKey",{get:function(){return this._publicKey||null},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"connected",{get:function(){return!0},enumerable:!1,configurable:!0}),a.prototype.connect=function(){return g(this,void 0,void 0,function(){return y(this,function(r){return[2]})})},a.prototype.disconnect=function(){return g(this,void 0,void 0,function(){return y(this,function(r){switch(r.label){case 0:return[4,this._sendMessage({method:"disconnect"})];case 1:return r.sent(),[2]}})})},a.prototype.signTransaction=function(r){var t;return g(this,void 0,void 0,function(){var n,e;return y(this,function(o){switch(o.label){case 0:if(!this.connected)throw new Error("Wallet not connected");o.label=1;case 1:return o.trys.push([1,3,,4]),[4,this._sendMessage({method:"signTransaction",params:{message:d.encode(r)}})];case 2:return n=o.sent().signature,[2,d.decode(n)];case 3:throw e=o.sent(),new Error(((t=e?.toString)===null||t===void 0?void 0:t.call(e))||"Failed to sign transaction");case 4:return[2]}})})},a.prototype.signAllTransactions=function(r){var t;return g(this,void 0,void 0,function(){var n,e;return y(this,function(o){switch(o.label){case 0:if(!this.connected)throw new Error("Wallet not connected");o.label=1;case 1:return o.trys.push([1,3,,4]),[4,this._sendMessage({method:"signAllTransactions",params:{messages:r.map(function(s){return d.encode(s)})}})];case 2:return n=o.sent().signatures,[2,n.map(function(s){return d.decode(s)})];case 3:throw e=o.sent(),new Error(((t=e?.toString)===null||t===void 0?void 0:t.call(e))||"Failed to sign transactions");case 4:return[2]}})})},a.prototype.signAndSendTransaction=function(r,t){var n;return g(this,void 0,void 0,function(){var e,o;return y(this,function(s){switch(s.label){case 0:if(!this.connected)throw new Error("Wallet not connected");s.label=1;case 1:return s.trys.push([1,3,,4]),[4,this._sendMessage({method:"signAndSendTransaction",params:{transaction:d.encode(r),options:t}})];case 2:return e=s.sent(),[2,e];case 3:throw o=s.sent(),new Error(((n=o?.toString)===null||n===void 0?void 0:n.call(o))||"Failed to sign and send transaction");case 4:return[2]}})})},a.prototype.signMessage=function(r,t){var n;return t===void 0&&(t="hex"),g(this,void 0,void 0,function(){var e,o;return y(this,function(s){switch(s.label){case 0:if(!this.connected)throw new Error("Wallet not connected");s.label=1;case 1:return s.trys.push([1,3,,4]),[4,this._sendMessage({method:"signMessage",params:{data:r,display:t}})];case 2:return e=s.sent(),[2,Uint8Array.from(d.decode(e))];case 3:throw o=s.sent(),new Error(((n=o?.toString)===null||n===void 0?void 0:n.call(o))||"Failed to sign message");case 4:return[2]}})})},a}(P);function b(c){return c.version===void 0}var F=globalThis&&globalThis.__extends||function(){var c=function(a,r){return c=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])},c(a,r)};return function(a,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");c(a,r);function t(){this.constructor=a}a.prototype=r===null?Object.create(r):(t.prototype=r.prototype,new t)}}(),h=globalThis&&globalThis.__awaiter||function(c,a,r,t){function n(e){return e instanceof r?e:new r(function(o){o(e)})}return new(r||(r=Promise))(function(e,o){function s(l){try{i(t.next(l))}catch(f){o(f)}}function u(l){try{i(t.throw(l))}catch(f){o(f)}}function i(l){l.done?e(l.value):n(l.value).then(s,u)}i((t=t.apply(c,a||[])).next())})},p=globalThis&&globalThis.__generator||function(c,a){var r={label:0,sent:function(){if(e[0]&1)throw e[1];return e[1]},trys:[],ops:[]},t,n,e,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(i){return function(l){return u([i,l])}}function u(i){if(t)throw new TypeError("Generator is already executing.");for(;o&&(o=0,i[0]&&(r=0)),r;)try{if(t=1,n&&(e=i[0]&2?n.return:i[0]?n.throw||((e=n.return)&&e.call(n),0):n.next)&&!(e=e.call(n,i[1])).done)return e;switch(n=0,e&&(i=[i[0]&2,e.value]),i[0]){case 0:case 1:e=i;break;case 4:return r.label++,{value:i[1],done:!1};case 5:r.label++,n=i[1],i=[0];continue;case 7:i=r.ops.pop(),r.trys.pop();continue;default:if(e=r.trys,!(e=e.length>0&&e[e.length-1])&&(i[0]===6||i[0]===2)){r=0;continue}if(i[0]===3&&(!e||i[1]>e[0]&&i[1]<e[3])){r.label=i[1];break}if(i[0]===6&&r.label<e[1]){r.label=e[1],e=i;break}if(e&&r.label<e[2]){r.label=e[2],r.ops.push(i);break}e[2]&&r.ops.pop(),r.trys.pop();continue}i=a.call(c,r)}catch(l){i=[6,l],n=0}finally{t=e=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}},L=globalThis&&globalThis.__values||function(c){var a=typeof Symbol=="function"&&Symbol.iterator,r=a&&c[a],t=0;if(r)return r.call(c);if(c&&typeof c.length=="number")return{next:function(){return c&&t>=c.length&&(c=void 0),{value:c&&c[t++],done:!c}}};throw new TypeError(a?"Object is not iterable.":"Symbol.iterator is not defined.")},G=function(c){F(a,c);function a(r){var t=c.call(this)||this;return t._network="mainnet-beta",t._provider=null,t._adapterInstance=null,t._element=null,t._iframe=null,t._connectHandler=null,t._flutterHandlerInterval=null,t._handleEvent=function(n){var e,o,s,u;switch(n.type){case"connect_native_web":{t._collapseIframe(),t._adapterInstance=new U(t._iframe,t._network,((e=n.data)===null||e===void 0?void 0:e.provider)||t._provider||"https://solflare.com/provider"),t._adapterInstance.on("connect",t._webConnected),t._adapterInstance.on("disconnect",t._webDisconnected),t._adapterInstance.connect(),t._setPreferredAdapter("native_web");return}case"connect":{t._collapseIframe(),t._adapterInstance=new j(t._iframe,((o=n.data)===null||o===void 0?void 0:o.publicKey)||""),t._adapterInstance.connect(),t._setPreferredAdapter((s=n.data)===null||s===void 0?void 0:s.adapter),t._connectHandler&&(t._connectHandler.resolve(),t._connectHandler=null),t.emit("connect",t.publicKey);return}case"disconnect":{t._connectHandler&&(t._connectHandler.reject(),t._connectHandler=null),t._disconnected(),t.emit("disconnect");return}case"accountChanged":{!((u=n.data)===null||u===void 0)&&u.publicKey?(t._adapterInstance=new j(t._iframe,n.data.publicKey),t._adapterInstance.connect(),t.emit("accountChanged",t.publicKey)):t.emit("accountChanged",void 0);return}case"collapse":{t._collapseIframe();return}default:return}},t._handleResize=function(n){n.resizeMode==="full"?n.params.mode==="fullscreen"?t._expandIframe():n.params.mode==="hide"&&t._collapseIframe():n.resizeMode==="coordinates"&&t._iframe&&(t._iframe.style.top=isFinite(n.params.top)?"".concat(n.params.top,"px"):"",t._iframe.style.bottom=isFinite(n.params.bottom)?"".concat(n.params.bottom,"px"):"",t._iframe.style.left=isFinite(n.params.left)?"".concat(n.params.left,"px"):"",t._iframe.style.right=isFinite(n.params.right)?"".concat(n.params.right,"px"):"",t._iframe.style.width=isFinite(n.params.width)?"".concat(n.params.width,"px"):n.params.width,t._iframe.style.height=isFinite(n.params.height)?"".concat(n.params.height,"px"):n.params.height)},t._handleMessage=function(n){var e;if(((e=n.data)===null||e===void 0?void 0:e.channel)==="solflareIframeToWalletAdapter"){var o=n.data.data||{};o.type==="event"?t._handleEvent(o.event):o.type==="resize"?t._handleResize(o):o.type==="response"&&t._adapterInstance&&t._adapterInstance.handleMessage(o)}},t._removeElement=function(){t._flutterHandlerInterval!==null&&(clearInterval(t._flutterHandlerInterval),t._flutterHandlerInterval=null),t._element&&(t._element.remove(),t._element=null)},t._removeDanglingElements=function(){var n,e,o=document.getElementsByClassName("solflare-wallet-adapter-iframe");try{for(var s=L(o),u=s.next();!u.done;u=s.next()){var i=u.value;i.parentElement&&i.remove()}}catch(l){n={error:l}}finally{try{u&&!u.done&&(e=s.return)&&e.call(s)}finally{if(n)throw n.error}}},t._injectElement=function(){t._removeElement(),t._removeDanglingElements();var n="".concat(a.IFRAME_URL,"?cluster=").concat(encodeURIComponent(t._network),"&origin=").concat(encodeURIComponent(window.location.origin),"&version=1"),e=t._getPreferredAdapter();e&&(n+="&adapter=".concat(encodeURIComponent(e))),t._provider&&(n+="&provider=".concat(encodeURIComponent(t._provider))),t._element=document.createElement("div"),t._element.className="solflare-wallet-adapter-iframe",t._element.innerHTML=`
      <iframe src='`.concat(n,`' referrerPolicy='strict-origin-when-cross-origin' style='position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; z-index: 99999; color-scheme: auto;' allowtransparency='true'></iframe>
    `),document.body.appendChild(t._element),t._iframe=t._element.querySelector("iframe"),window.fromFlutter=t._handleMobileMessage,t._flutterHandlerInterval=setInterval(function(){window.fromFlutter=t._handleMobileMessage},100),window.addEventListener("message",t._handleMessage,!1)},t._collapseIframe=function(){t._iframe&&(t._iframe.style.top="",t._iframe.style.right="",t._iframe.style.height="2px",t._iframe.style.width="2px")},t._expandIframe=function(){t._iframe&&(t._iframe.style.top="0px",t._iframe.style.bottom="0px",t._iframe.style.left="0px",t._iframe.style.right="0px",t._iframe.style.width="100%",t._iframe.style.height="100%")},t._getPreferredAdapter=function(){return localStorage&&localStorage.getItem("solflarePreferredWalletAdapter")||null},t._setPreferredAdapter=function(n){localStorage&&n&&localStorage.setItem("solflarePreferredWalletAdapter",n)},t._clearPreferredAdapter=function(){localStorage&&localStorage.removeItem("solflarePreferredWalletAdapter")},t._webConnected=function(){t._connectHandler&&(t._connectHandler.resolve(),t._connectHandler=null),t.emit("connect",t.publicKey)},t._webDisconnected=function(){t._connectHandler&&(t._connectHandler.reject(),t._connectHandler=null),t._disconnected(),t.emit("disconnect")},t._disconnected=function(){window.removeEventListener("message",t._handleMessage,!1),t._removeElement(),t._clearPreferredAdapter(),t._adapterInstance=null},t._handleMobileMessage=function(n){var e,o;(o=(e=t._iframe)===null||e===void 0?void 0:e.contentWindow)===null||o===void 0||o.postMessage({channel:"solflareMobileToIframe",data:n},"*")},r?.network&&(t._network=r?.network),r?.provider&&(t._provider=r?.provider),t}return Object.defineProperty(a.prototype,"publicKey",{get:function(){var r;return((r=this._adapterInstance)===null||r===void 0?void 0:r.publicKey)||null},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"isConnected",{get:function(){var r;return!!(!((r=this._adapterInstance)===null||r===void 0)&&r.connected)},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"connected",{get:function(){return this.isConnected},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"autoApprove",{get:function(){return!1},enumerable:!1,configurable:!0}),a.prototype.connect=function(){return h(this,void 0,void 0,function(){var r=this;return p(this,function(t){switch(t.label){case 0:return this.connected?[2]:(this._injectElement(),[4,new Promise(function(n,e){r._connectHandler={resolve:n,reject:e}})]);case 1:return t.sent(),[2]}})})},a.prototype.disconnect=function(){return h(this,void 0,void 0,function(){return p(this,function(r){switch(r.label){case 0:return this._adapterInstance?[4,this._adapterInstance.disconnect()]:[2];case 1:return r.sent(),this._disconnected(),this.emit("disconnect"),[2]}})})},a.prototype.signTransaction=function(r){return h(this,void 0,void 0,function(){var t,n,e,o,s=this;return p(this,function(u){switch(u.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return t=b(r)?r.serializeMessage():r.message.serialize(),[4,this._adapterInstance.signTransaction(t)];case 1:return n=u.sent(),b(r)?r.addSignature(this.publicKey,S.Buffer.from(n)):(e=r.message.staticAccountKeys.slice(0,r.message.header.numRequiredSignatures),o=e.findIndex(function(i){return i.equals(s.publicKey)}),o>=0&&(r.signatures[o]=n)),[2,r]}})})},a.prototype.signAllTransactions=function(r){return h(this,void 0,void 0,function(){var t,n,e,o,s,u,i=this;return p(this,function(l){switch(l.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return t=r.map(function(f){return b(f)?f.serializeMessage():f.message.serialize()}),[4,this._adapterInstance.signAllTransactions(t)];case 1:for(n=l.sent(),e=0;e<r.length;e++)o=r[e],b(o)?o.addSignature(this.publicKey,S.Buffer.from(n[e])):(s=o.message.staticAccountKeys.slice(0,o.message.header.numRequiredSignatures),u=s.findIndex(function(f){return f.equals(i.publicKey)}),u>=0&&(o.signatures[u]=n[e]));return[2,r]}})})},a.prototype.signAndSendTransaction=function(r,t){return h(this,void 0,void 0,function(){var n;return p(this,function(e){switch(e.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return n=b(r)?r.serialize({verifySignatures:!1,requireAllSignatures:!1}):r.serialize(),[4,this._adapterInstance.signAndSendTransaction(n,t)];case 1:return[2,e.sent()]}})})},a.prototype.signMessage=function(r,t){return t===void 0&&(t="utf8"),h(this,void 0,void 0,function(){return p(this,function(n){switch(n.label){case 0:if(!this.connected)throw new Error("Wallet not connected");return[4,this._adapterInstance.signMessage(r,t)];case 1:return[2,n.sent()]}})})},a.prototype.sign=function(r,t){return t===void 0&&(t="utf8"),h(this,void 0,void 0,function(){return p(this,function(n){switch(n.label){case 0:return[4,this.signMessage(r,t)];case 1:return[2,n.sent()]}})})},a.prototype.detectWallet=function(r){var t;return r===void 0&&(r=10),h(this,void 0,void 0,function(){return p(this,function(n){return window.SolflareApp||!((t=window.solflare)===null||t===void 0)&&t.isSolflare?[2,!0]:[2,new Promise(function(e){var o,s;o=setInterval(function(){var u;(window.SolflareApp||!((u=window.solflare)===null||u===void 0)&&u.isSolflare)&&(clearInterval(o),clearTimeout(s),e(!0))},500),s=setTimeout(function(){clearInterval(o),e(!1)},r*1e3)})]})})},a.IFRAME_URL="https://connect.solflare.com/",a}(A);export{G as default};