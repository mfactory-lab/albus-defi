import{E as _,P as p,b as h}from"./index-f862f4d4.js";var u=globalThis&&globalThis.__awaiter||function(r,e,t,i){function s(n){return n instanceof t?n:new t(function(o){o(n)})}return new(t||(t=Promise))(function(n,o){function d(c){try{a(i.next(c))}catch(f){o(f)}}function l(c){try{a(i.throw(c))}catch(f){o(f)}}function a(c){c.done?n(c.value):s(c.value).then(d,l)}a((i=i.apply(r,e||[])).next())})};class y extends _{constructor(e,t){if(super(),this._network=t,this._publicKey=null,this._popup=null,this._handlerAdded=!1,this._nextRequestId=1,this._autoApprove=!1,this._responsePromises=new Map,this.handleMessage=i=>{var s;if(this._injectedProvider&&i.source===window||i.origin===((s=this._providerUrl)===null||s===void 0?void 0:s.origin)&&i.source===this._popup){if(i.data.method==="connected"){const n=new p(i.data.params.publicKey);(!this._publicKey||!this._publicKey.equals(n))&&(this._publicKey&&!this._publicKey.equals(n)&&this.handleDisconnect(),this._publicKey=n,this._autoApprove=!!i.data.params.autoApprove,this.emit("connect",this._publicKey))}else if(i.data.method==="disconnected")this.handleDisconnect();else if(i.data.result||i.data.error){const n=this._responsePromises.get(i.data.id);if(n){const[o,d]=n;i.data.result?o(i.data.result):d(new Error(i.data.error))}}}},this._beforeUnload=()=>{this.disconnect()},w(e))this._injectedProvider=e;else if(v(e))this._providerUrl=new URL(e),this._providerUrl.hash=new URLSearchParams({origin:window.location.origin,network:this._network}).toString();else throw new Error("provider parameter must be an injected provider or a URL string.")}handleConnect(){var e;return this._handlerAdded||(this._handlerAdded=!0,window.addEventListener("message",this.handleMessage),window.addEventListener("beforeunload",this._beforeUnload)),this._injectedProvider?new Promise(t=>{this.sendRequest("connect",{}),t()}):(window.name="parent",this._popup=window.open((e=this._providerUrl)===null||e===void 0?void 0:e.toString(),"_blank","location,resizable,width=460,height=675"),new Promise(t=>{this.once("connect",t)}))}handleDisconnect(){this._handlerAdded&&(this._handlerAdded=!1,window.removeEventListener("message",this.handleMessage),window.removeEventListener("beforeunload",this._beforeUnload)),this._publicKey&&(this._publicKey=null,this.emit("disconnect")),this._responsePromises.forEach(([,e],t)=>{this._responsePromises.delete(t),e(new Error("Wallet disconnected"))})}sendRequest(e,t){return u(this,void 0,void 0,function*(){if(e!=="connect"&&!this.connected)throw new Error("Wallet not connected");const i=this._nextRequestId;return++this._nextRequestId,new Promise((s,n)=>{var o,d,l,a;this._responsePromises.set(i,[s,n]),this._injectedProvider?this._injectedProvider.postMessage({jsonrpc:"2.0",id:i,method:e,params:Object.assign({network:this._network},t)}):((o=this._popup)===null||o===void 0||o.postMessage({jsonrpc:"2.0",id:i,method:e,params:t},(l=(d=this._providerUrl)===null||d===void 0?void 0:d.origin)!==null&&l!==void 0?l:""),this.autoApprove||(a=this._popup)===null||a===void 0||a.focus())})})}get publicKey(){return this._publicKey}get connected(){return this._publicKey!==null}get autoApprove(){return this._autoApprove}connect(){return u(this,void 0,void 0,function*(){this._popup&&this._popup.close(),yield this.handleConnect()})}disconnect(){return u(this,void 0,void 0,function*(){this._injectedProvider&&(yield this.sendRequest("disconnect",{})),this._popup&&this._popup.close(),this.handleDisconnect()})}sign(e,t){return u(this,void 0,void 0,function*(){if(!(e instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");const i=yield this.sendRequest("sign",{data:e,display:t}),s=h.decode(i.signature),n=new p(i.publicKey);return{signature:s,publicKey:n}})}signTransaction(e){return u(this,void 0,void 0,function*(){const t=yield this.sendRequest("signTransaction",{message:h.encode(e.serializeMessage())}),i=h.decode(t.signature),s=new p(t.publicKey);return e.addSignature(s,i),e})}signAllTransactions(e){return u(this,void 0,void 0,function*(){const t=yield this.sendRequest("signAllTransactions",{messages:e.map(n=>h.encode(n.serializeMessage()))}),i=t.signatures.map(n=>h.decode(n)),s=new p(t.publicKey);return e=e.map((n,o)=>(n.addSignature(s,i[o]),n)),e})}diffieHellman(e){return u(this,void 0,void 0,function*(){if(!(e instanceof Uint8Array))throw new Error("Data must be an instance of Uint8Array");return yield this.sendRequest("diffieHellman",{publicKey:e})})}}function v(r){return typeof r=="string"}function w(r){return g(r)&&"postMessage"in r&&typeof r.postMessage=="function"}function g(r){return typeof r=="object"&&r!==null}export{y as default};
