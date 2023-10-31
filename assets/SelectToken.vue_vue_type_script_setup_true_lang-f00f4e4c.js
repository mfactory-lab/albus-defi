import{H as ne,B as he,a6 as Qe,a7 as je,n as V,a8 as ze,a9 as We,aa as Ze,ab as $e,ac as Je,P as J,ad as Oe,R as X,Y as fe,L as Ke,W as Ve,Z as F,ae as pe,af as He,a4 as Fe,ag as ye,ah as H,a0 as we,ai as Ye,aj as qe,ak as De,u as Xe,X as Ge,al as et,am as tt,an as nt,ao as be,ap as at,$ as Se,aq as _e,m as Ie,o as ee,ar as ce,w as O,j as K,q as Te,as as oe,z as se,v as I,A as Le,i as me,x as ie,s as ve,t as ae,at as Me,Q as ot,au as ge,a3 as st,av as te,aw as it,ax as lt,C as rt,ay as ut,az as ct,aA as dt,aB as Ae,aC as ft,aD as xe,aE as mt,aF as vt,aG as gt,aH as kt,aI as ht,aJ as pt,aK as Ce,aL as Ee,aM as yt,aN as de,aO as wt,y as bt,aP as St,aQ as _t}from"./index-01da7810.js";import{T as Tt,d as Mt,D as $,g as At,u as ke,l as re,I as Re}from"./PolicyCard.vue_vue_type_script_setup_true_lang-59082963.js";const xt=ne("div",{class:"q-space"}),Ct=he({name:"QSpace",setup(){return()=>xt}}),Et=he({name:"QCardActions",props:{...Qe,vertical:Boolean},setup(e,{slots:t}){const i=je(e),c=V(()=>`q-card__actions ${i.value} q-card__actions--${e.vertical===!0?"vert column":"horiz row"}`);return()=>ne("div",{class:c.value},ze(t.default))}});function Be(e){if(e===!1)return 0;if(e===!0||e===void 0)return 1;const t=parseInt(e,10);return isNaN(t)?0:t}const le=We({name:"close-popup",beforeMount(e,{value:t}){const i={depth:Be(t),handler(c){i.depth!==0&&setTimeout(()=>{const l=Ze(e);l!==void 0&&$e(l,c,i.depth)})},handlerKey(c){Je(c,13)===!0&&i.handler(c)}};e.__qclosepopup=i,e.addEventListener("click",i.handler),e.addEventListener("keyup",i.handlerKey)},updated(e,{value:t,oldValue:i}){t!==i&&(e.__qclosepopup.depth=Be(t))},beforeUnmount(e){const t=e.__qclosepopup;e.removeEventListener("click",t.handler),e.removeEventListener("keyup",t.handlerKey),delete e.__qclosepopup}});function sn(e){const t=e.keyCode?e.keyCode:e.which;(t<48||t>57)&&t!==46&&e.preventDefault(),t===46&&String(e.target.value).includes(".")&&e.preventDefault()}const Rt=new J("EjCM3aozA6sFUzQQ7vXg2uTtjRydyuHSWRwvQX16pAS9");var Bt=(e=>(e.TOKEN_A="TOKEN_A",e.TOKEN_B="TOKEN_B",e))(Bt||{});const ln=Oe("swap",()=>{const e=X(),t=fe({loading:!1,slippageDialog:!1,status:void 0,poolBalance:{TOKEN_A:void 0,TOKEN_B:void 0,JPLU:void 0},userBalance:{TOKEN_A:void 0,TOKEN_B:void 0,JPLU:void 0},poolTokenSupply:0,rate:0}),i=Ke(),c=Ve();F(c,async m=>{m?l().then():d()},{immediate:!0}),F(e,async m=>{m&&await B()});async function l(){t.loading=!0;try{e.value=await Tt.loadTokenSwap(i.connection,Rt),await u()}catch(m){console.log(m),e.value=void 0}finally{t.loading=!1}console.log("Token SWAP: ",e.value)}async function u(){if(!e.value)return;const m=await pe(i.connection,e.value.authority);for(const A of m){const T=_(A.mint);T&&(t.poolBalance[T]=A.amount)}const N=await He(i.connection,e.value.poolToken);t.poolTokenSupply=Number(N.supply),t.rate=E()}async function B(){if(!e.value)return;const m=c.value?.publicKey;if(!m){console.log("Wallet is not connected...");return}const N=await pe(i.connection,m,[e.value.poolToken,e.value.mintA,e.value.mintB]),A={TOKEN_A:0,TOKEN_B:0};for(const T of N){const q=_(T.mint);q&&(A[q]=+T.amount)}t.userBalance=A,console.log("[Pool Balance]",t.poolBalance),console.log("[User Balance]",t.userBalance)}function E(){return Mt(k(Fe))}function _(m){if(e.value)switch(String(m)){case String(e.value.mintA):return"TOKEN_A";case String(e.value.mintB):return"TOKEN_B"}}function k(m){const N=new $(t.poolBalance.TOKEN_A),A=new $(m).div(N),T=new $(1),M=T.add(A).sqrt().sub(T);return new $(t.poolTokenSupply).mul(M).toNumber()}function p(m,N){const A=new $(t.poolBalance[N]??0),T=new $(m).div(A),q=new $(1),M=q.sub(T);if(M.isNeg())return 0;const U=q.sub(M.sqrt());return new $(t.poolTokenSupply).mul(U).toNumber()}async function y(m,N){const A=e.value?.mintA,T=e.value?.mintB;if(!A||!T)return;const q=A.toBase58()===m,M=await ye(i.connection,A.toBase58()),U=await ye(i.connection,T.toBase58()),z=10**(q?U:M),j=10**(q?M:U),f=N*j;return(q?t.userBalance.TOKEN_B/t.userBalance.TOKEN_A*f:t.userBalance.TOKEN_A/t.userBalance.TOKEN_B*f)/z}function d(){t.loading=!1,t.slippageDialog=!1,t.status=void 0,t.poolBalance={TOKEN_A:void 0,TOKEN_B:void 0,JPLU:void 0},t.userBalance={TOKEN_A:void 0,TOKEN_B:void 0,JPLU:void 0},t.poolTokenSupply=0,t.rate=0}return{state:t,tokenSwap:e,loadUserTokenAccounts:B,depositSingleTokenType:k,withdrawSingleTokenTypeExactOut:p,calculateDependentAmount:y}});var Nt=Object.defineProperty,Pt=(e,t,i)=>t in e?Nt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,Ot=(e,t,i)=>(Pt(e,typeof t!="symbol"?t+"":t,i),i);const Kt=new H.BeetArgsStruct([["instructionDiscriminator",H.uniformFixedSizeArray(H.u8,8)],["amount",H.u64]],"SplTransferInstructionArgs"),Vt=[67,186,237,99,235,243,166,198];function Ft(e,t,i=new J("J4pyN7p9dAovEQKoZJV1jUbM3FrCBPLCS2dyiRUnwi5c")){const[c]=Kt.serialize({instructionDiscriminator:Vt,...t}),l=[{pubkey:e.sender,isWritable:!0,isSigner:!0},{pubkey:e.receiver,isWritable:!0,isSigner:!1},{pubkey:e.tokenMint,isWritable:!1,isSigner:!1},{pubkey:e.source,isWritable:!0,isSigner:!1},{pubkey:e.destination,isWritable:!0,isSigner:!1},{pubkey:e.proofRequest,isWritable:!1,isSigner:!1},{pubkey:e.tokenProgram??Ye,isWritable:!1,isSigner:!1},{pubkey:e.systemProgram??qe.programId,isWritable:!1,isSigner:!1}];if(e.anchorRemainingAccounts!=null)for(const u of e.anchorRemainingAccounts)l.push(u);return new De({programId:i,keys:l,data:c})}const qt=new H.BeetArgsStruct([["instructionDiscriminator",H.uniformFixedSizeArray(H.u8,8)],["amount",H.u64]],"TransferInstructionArgs"),Dt=[163,52,200,231,140,3,69,186];function It(e,t,i=new J("J4pyN7p9dAovEQKoZJV1jUbM3FrCBPLCS2dyiRUnwi5c")){const[c]=qt.serialize({instructionDiscriminator:Dt,...t}),l=[{pubkey:e.sender,isWritable:!0,isSigner:!0},{pubkey:e.receiver,isWritable:!0,isSigner:!1},{pubkey:e.proofRequest,isWritable:!1,isSigner:!1},{pubkey:e.systemProgram??qe.programId,isWritable:!1,isSigner:!1}];if(e.anchorRemainingAccounts!=null)for(const u of e.anchorRemainingAccounts)l.push(u);return new De({programId:i,keys:l,data:c})}const Lt="J4pyN7p9dAovEQKoZJV1jUbM3FrCBPLCS2dyiRUnwi5c",Ut=new J(Lt);class Qt{constructor(t){Ot(this,"programId",Ut),this.provider=t}get connection(){return this.provider.connection}async transfer(t,i){const c=It({proofRequest:t.proofRequest,sender:this.provider.publicKey,receiver:t.receiver},{amount:t.amount}),l=new we().add(c);return this.provider.sendAndConfirm(l,[],i)}async transferToken(t,i){const c=Ft({proofRequest:t.proofRequest,sender:this.provider.publicKey,receiver:t.receiver,source:t.source,destination:t.destination,tokenMint:t.tokenMint},{amount:t.amount}),l=new we().add(c);return this.provider.sendAndConfirm(l,[],i)}}const rn=Oe("transfer",()=>{const e=Ke(),{tokens:t}=At(),i=ke(),{state:c,getUserTokens:l}=ke(),u=V(()=>i.certificate),B=V(()=>i.certificateValid),E=0,_=Ve(),{publicKey:k}=Xe(),{notify:p}=Ge(),y=fe(t[0]),d=fe({address:"",value:void 0,loading:!1,token:y,fee:E,valid:!1});function m(){d.value=void 0,d.fee=E}F(()=>d.token,()=>{m(),i.policySpec=d.token.name}),F(()=>_.value?.publicKey,f=>{f||(m(),d.address="")}),F(()=>d.address,async()=>{d.valid=await et(d.address)}),F([()=>d.valid,()=>d.value],async([f,b])=>{f&&Number(b)>0?A():d.fee=E});async function N(){const f=d.token.label,b=c.tokens.find(L=>re(L.symbol)===re(f));return f==="sol"?!0:!b||!b.mint?!1:!!at(b.mint)}async function A(){const f=await N(),b=await tt(_.value?.publicKey,d.address,Number(d.value),e.connection),L=await nt(b,e.connection);d.fee=f?L:L+.02}const T=V(()=>new Qt(new be(e.connection,_.value??{publicKey:J.default},be.defaultOptions())));async function q(){try{if(d.loading=!0,console.log("[debug] on transfer certificate === ",u.value),B.value){console.log(d.token);let f;d.token.label==="sol"?f=await M():f=await U(),p({type:"positive",message:"Transaction confirmed",actions:[{label:"Explore",color:"white",target:"_blank",href:`https://explorer.solana.com/tx/${f}?cluster=${e.cluster}`,onClick:()=>!1}]}),m(),await l()}else p({type:"info",position:"top-right",message:"You need a valid Certificate"})}catch(f){console.error("verifyTransfer error: ",f)}finally{d.loading=!1}}async function M(){const f=new Se(Number(d.value)*Fe),b=new J(d.address);return await T.value.transfer({amount:f,receiver:b,proofRequest:u.value.pubkey})}async function U(){if(!k.value||!d.token.mint)return;const f=c.tokens.find(o=>o.mint===d.token.mint);if(!f)return;const b=new J(d.token.mint),L=new J(d.address),s=await _e(b,k.value),a=await _e(b,L),r=new Se(Number(d.value)*10**f.decimals);return await T.value.transferToken({destination:a,source:s,tokenMint:b,amount:r,receiver:L,proofRequest:u.value.pubkey})}function z(f){d.value=f}function j(f){d.token=f}return{state:d,setMax:z,setToken:j,verifyTransfer:q}}),jt=ae("div",{class:"text-h6"}," Info ",-1),zt={key:0},Wt={key:1},Zt=["href"],$t=["href"],un=Ie({__name:"ZkpRequestDialog",setup(e){const t=ke(),i=X(!1),c=V(()=>Re.Empty===t.certificate?.data.status),l=V(()=>Re.Pending===t.certificate?.data.status);return(u,B)=>(ee(),ce(st,{modelValue:I(i),"onUpdate:modelValue":B[0]||(B[0]=E=>ge(i)?i.value=E:null)},{default:O(()=>[K(ot,{class:"zkp-dialog"},{default:O(()=>[K(Te,{class:"row items-center q-pb-none zkp-dialog__header"},{default:O(()=>[jt,K(Ct),oe(K(se,{icon:I(Le),flat:"",round:"",dense:""},null,8,["icon"]),[[le]])]),_:1}),K(Te,{class:"q-pt-none zkp-dialog__body"},{default:O(()=>[I(c)?(ee(),me("div",zt," To continue, you need to create a ZKP request ")):ie("",!0),I(l)?(ee(),me("div",Wt,[ve(' To continue, you need to "prove" the request. Follow this link. '),ae("a",{class:"prove-link",href:I(Me),target:"_blank"},"__Albus account__",8,Zt)])):ie("",!0)]),_:1}),K(Et,{align:"right",class:"zkp-dialog__actions"},{default:O(()=>[oe(K(se,{flat:"",label:"Cancel",class:"zkp-dialog__actions--cancel"},null,512),[[le]]),I(c)?oe((ee(),ce(se,{key:0,outline:"",label:"Create",color:"yellow"},null,512)),[[le]]):ie("",!0),I(l)?oe((ee(),ce(se,{key:1,color:"yellow",outline:""},{default:O(()=>[ae("a",{href:I(Me),target:"_blank"},"prove",8,$t)]),_:1})),[[le]]):ie("",!0)]),_:1})]),_:1})]),_:1},8,["modelValue"]))}});const Ne={date:"####/##/##",datetime:"####/##/## ##:##",time:"##:##",fulltime:"##:##:##",phone:"(###) ### - ####",card:"#### #### #### ####"},ue={"#":{pattern:"[\\d]",negate:"[^\\d]"},S:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]"},N:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]"},A:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleUpperCase()},a:{pattern:"[a-zA-Z]",negate:"[^a-zA-Z]",transform:e=>e.toLocaleLowerCase()},X:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleUpperCase()},x:{pattern:"[0-9a-zA-Z]",negate:"[^0-9a-zA-Z]",transform:e=>e.toLocaleLowerCase()}},Ue=Object.keys(ue);Ue.forEach(e=>{ue[e].regex=new RegExp(ue[e].pattern)});const Jt=new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|(["+Ue.join("")+"])|(.)","g"),Pe=/[.*+?^${}()|[\]\\]/g,R=String.fromCharCode(1),Ht={mask:String,reverseFillMask:Boolean,fillMask:[Boolean,String],unmaskedValue:Boolean};function Yt(e,t,i,c){let l,u,B,E,_,k;const p=X(null),y=X(m());function d(){return e.autogrow===!0||["textarea","text","search","url","tel","password"].includes(e.type)}F(()=>e.type+e.autogrow,A),F(()=>e.mask,s=>{if(s!==void 0)T(y.value,!0);else{const a=b(y.value);A(),e.modelValue!==a&&t("update:modelValue",a)}}),F(()=>e.fillMask+e.reverseFillMask,()=>{p.value===!0&&T(y.value,!0)}),F(()=>e.unmaskedValue,()=>{p.value===!0&&T(y.value)});function m(){if(A(),p.value===!0){const s=j(b(e.modelValue));return e.fillMask!==!1?L(s):s}return e.modelValue}function N(s){if(s<l.length)return l.slice(-s);let a="",r=l;const o=r.indexOf(R);if(o>-1){for(let g=s-r.length;g>0;g--)a+=R;r=r.slice(0,o)+a+r.slice(o)}return r}function A(){if(p.value=e.mask!==void 0&&e.mask.length!==0&&d(),p.value===!1){E=void 0,l="",u="";return}const s=Ne[e.mask]===void 0?e.mask:Ne[e.mask],a=typeof e.fillMask=="string"&&e.fillMask.length!==0?e.fillMask.slice(0,1):"_",r=a.replace(Pe,"\\$&"),o=[],g=[],v=[];let C=e.reverseFillMask===!0,h="",w="";s.replace(Jt,(P,n,x,W,Q)=>{if(W!==void 0){const D=ue[W];v.push(D),w=D.negate,C===!0&&(g.push("(?:"+w+"+)?("+D.pattern+"+)?(?:"+w+"+)?("+D.pattern+"+)?"),C=!1),g.push("(?:"+w+"+)?("+D.pattern+")?")}else if(x!==void 0)h="\\"+(x==="\\"?"":x),v.push(x),o.push("([^"+h+"]+)?"+h+"?");else{const D=n!==void 0?n:Q;h=D==="\\"?"\\\\\\\\":D.replace(Pe,"\\\\$&"),v.push(D),o.push("([^"+h+"]+)?"+h+"?")}});const Y=new RegExp("^"+o.join("")+"("+(h===""?".":"[^"+h+"]")+"+)?"+(h===""?"":"["+h+"]*")+"$"),Z=g.length-1,S=g.map((P,n)=>n===0&&e.reverseFillMask===!0?new RegExp("^"+r+"*"+P):n===Z?new RegExp("^"+P+"("+(w===""?".":w)+"+)?"+(e.reverseFillMask===!0?"$":r+"*")):new RegExp("^"+P));B=v,E=P=>{const n=Y.exec(e.reverseFillMask===!0?P:P.slice(0,v.length+1));n!==null&&(P=n.slice(1).join(""));const x=[],W=S.length;for(let Q=0,D=P;Q<W;Q++){const G=S[Q].exec(D);if(G===null)break;D=D.slice(G.shift().length),x.push(...G)}return x.length!==0?x.join(""):P},l=v.map(P=>typeof P=="string"?P:R).join(""),u=l.split(R).join(a)}function T(s,a,r){const o=c.value,g=o.selectionEnd,v=o.value.length-g,C=b(s);a===!0&&A();const h=j(C),w=e.fillMask!==!1?L(h):h,Y=y.value!==w;o.value!==w&&(o.value=w),Y===!0&&(y.value=w),document.activeElement===o&&te(()=>{if(w===u){const S=e.reverseFillMask===!0?u.length:0;o.setSelectionRange(S,S,"forward");return}if(r==="insertFromPaste"&&e.reverseFillMask!==!0){const S=o.selectionEnd;let P=g-1;for(let n=_;n<=P&&n<S;n++)l[n]!==R&&P++;M.right(o,P);return}if(["deleteContentBackward","deleteContentForward"].indexOf(r)>-1){const S=e.reverseFillMask===!0?g===0?w.length>h.length?1:0:Math.max(0,w.length-(w===u?0:Math.min(h.length,v)+1))+1:g;o.setSelectionRange(S,S,"forward");return}if(e.reverseFillMask===!0)if(Y===!0){const S=Math.max(0,w.length-(w===u?0:Math.min(h.length,v+1)));S===1&&g===1?o.setSelectionRange(S,S,"forward"):M.rightReverse(o,S)}else{const S=w.length-v;o.setSelectionRange(S,S,"backward")}else if(Y===!0){const S=Math.max(0,l.indexOf(R),Math.min(h.length,g)-1);M.right(o,S)}else{const S=g-1;M.right(o,S)}});const Z=e.unmaskedValue===!0?b(w):w;String(e.modelValue)!==Z&&(e.modelValue!==null||Z!=="")&&i(Z,!0)}function q(s,a,r){const o=j(b(s.value));a=Math.max(0,l.indexOf(R),Math.min(o.length,a)),_=a,s.setSelectionRange(a,r,"forward")}const M={left(s,a){const r=l.slice(a-1).indexOf(R)===-1;let o=Math.max(0,a-1);for(;o>=0;o--)if(l[o]===R){a=o,r===!0&&a++;break}if(o<0&&l[a]!==void 0&&l[a]!==R)return M.right(s,0);a>=0&&s.setSelectionRange(a,a,"backward")},right(s,a){const r=s.value.length;let o=Math.min(r,a+1);for(;o<=r;o++)if(l[o]===R){a=o;break}else l[o-1]===R&&(a=o);if(o>r&&l[a-1]!==void 0&&l[a-1]!==R)return M.left(s,r);s.setSelectionRange(a,a,"forward")},leftReverse(s,a){const r=N(s.value.length);let o=Math.max(0,a-1);for(;o>=0;o--)if(r[o-1]===R){a=o;break}else if(r[o]===R&&(a=o,o===0))break;if(o<0&&r[a]!==void 0&&r[a]!==R)return M.rightReverse(s,0);a>=0&&s.setSelectionRange(a,a,"backward")},rightReverse(s,a){const r=s.value.length,o=N(r),g=o.slice(0,a+1).indexOf(R)===-1;let v=Math.min(r,a+1);for(;v<=r;v++)if(o[v-1]===R){a=v,a>0&&g===!0&&a--;break}if(v>r&&o[a-1]!==void 0&&o[a-1]!==R)return M.leftReverse(s,r);s.setSelectionRange(a,a,"forward")}};function U(s){t("click",s),k=void 0}function z(s){if(t("keydown",s),it(s)===!0||s.altKey===!0)return;const a=c.value,r=a.selectionStart,o=a.selectionEnd;if(s.shiftKey||(k=void 0),s.keyCode===37||s.keyCode===39){s.shiftKey&&k===void 0&&(k=a.selectionDirection==="forward"?r:o);const g=M[(s.keyCode===39?"right":"left")+(e.reverseFillMask===!0?"Reverse":"")];if(s.preventDefault(),g(a,k===r?o:r),s.shiftKey){const v=a.selectionStart;a.setSelectionRange(Math.min(k,v),Math.max(k,v),"forward")}}else s.keyCode===8&&e.reverseFillMask!==!0&&r===o?(M.left(a,r),a.setSelectionRange(a.selectionStart,o,"backward")):s.keyCode===46&&e.reverseFillMask===!0&&r===o&&(M.rightReverse(a,o),a.setSelectionRange(r,a.selectionEnd,"forward"))}function j(s){if(s==null||s==="")return"";if(e.reverseFillMask===!0)return f(s);const a=B;let r=0,o="";for(let g=0;g<a.length;g++){const v=s[r],C=a[g];if(typeof C=="string")o+=C,v===C&&r++;else if(v!==void 0&&C.regex.test(v))o+=C.transform!==void 0?C.transform(v):v,r++;else return o}return o}function f(s){const a=B,r=l.indexOf(R);let o=s.length-1,g="";for(let v=a.length-1;v>=0&&o>-1;v--){const C=a[v];let h=s[o];if(typeof C=="string")g=C+g,h===C&&o--;else if(h!==void 0&&C.regex.test(h))do g=(C.transform!==void 0?C.transform(h):h)+g,o--,h=s[o];while(r===v&&h!==void 0&&C.regex.test(h));else return g}return g}function b(s){return typeof s!="string"||E===void 0?typeof s=="number"?E(""+s):s:E(s)}function L(s){return u.length-s.length<=0?s:e.reverseFillMask===!0&&s.length!==0?u.slice(0,-s.length)+s:s+u.slice(s.length)}return{innerValue:y,hasMask:p,moveCursorForPaste:q,updateMaskValue:T,onMaskedKeydown:z,onMaskedClick:U}}function Xt(e,t){function i(){const c=e.modelValue;try{const l="DataTransfer"in window?new DataTransfer:"ClipboardEvent"in window?new ClipboardEvent("").clipboardData:void 0;return Object(c)===c&&("length"in c?Array.from(c):[c]).forEach(u=>{l.items.add(u)}),{files:l.files}}catch{return{files:void 0}}}return t===!0?V(()=>{if(e.type==="file")return i()}):V(i)}const Gt=he({name:"QInput",inheritAttrs:!1,props:{...lt,...Ht,...rt,modelValue:{required:!1},shadowText:String,type:{type:String,default:"text"},debounce:[String,Number],autogrow:Boolean,inputClass:[Array,String,Object],inputStyle:[Array,String,Object]},emits:[...ut,"paste","change","keydown","click","animationend"],setup(e,{emit:t,attrs:i}){const{proxy:c}=ct(),{$q:l}=c,u={};let B=NaN,E,_,k=null,p;const y=X(null),d=dt(e),{innerValue:m,hasMask:N,moveCursorForPaste:A,updateMaskValue:T,onMaskedKeydown:q,onMaskedClick:M}=Yt(e,t,h,y),U=Xt(e,!0),z=V(()=>Ae(m.value)),j=ht(v),f=ft(),b=V(()=>e.type==="textarea"||e.autogrow===!0),L=V(()=>b.value===!0||["text","search","url","tel","password"].includes(e.type)),s=V(()=>{const n={...f.splitAttrs.listeners.value,onInput:v,onPaste:g,onChange:Y,onBlur:Z,onFocus:xe};return n.onCompositionstart=n.onCompositionupdate=n.onCompositionend=j,N.value===!0&&(n.onKeydown=q,n.onClick=M),e.autogrow===!0&&(n.onAnimationend=C),n}),a=V(()=>{const n={tabindex:0,"data-autofocus":e.autofocus===!0||void 0,rows:e.type==="textarea"?6:void 0,"aria-label":e.label,name:d.value,...f.splitAttrs.attributes.value,id:f.targetUid.value,maxlength:e.maxlength,disabled:e.disable===!0,readonly:e.readonly===!0};return b.value===!1&&(n.type=e.type),e.autogrow===!0&&(n.rows=1),n});F(()=>e.type,()=>{y.value&&(y.value.value=e.modelValue)}),F(()=>e.modelValue,n=>{if(N.value===!0){if(_===!0&&(_=!1,String(n)===B))return;T(n)}else m.value!==n&&(m.value=n,e.type==="number"&&u.hasOwnProperty("value")===!0&&(E===!0?E=!1:delete u.value));e.autogrow===!0&&te(w)}),F(()=>e.autogrow,n=>{n===!0?te(w):y.value!==null&&i.rows>0&&(y.value.style.height="auto")}),F(()=>e.dense,()=>{e.autogrow===!0&&te(w)});function r(){pt(()=>{const n=document.activeElement;y.value!==null&&y.value!==n&&(n===null||n.id!==f.targetUid.value)&&y.value.focus({preventScroll:!0})})}function o(){y.value!==null&&y.value.select()}function g(n){if(N.value===!0&&e.reverseFillMask!==!0){const x=n.target;A(x,x.selectionStart,x.selectionEnd)}t("paste",n)}function v(n){if(!n||!n.target)return;if(e.type==="file"){t("update:modelValue",n.target.files);return}const x=n.target.value;if(n.target.qComposing===!0){u.value=x;return}if(N.value===!0)T(x,!1,n.inputType);else if(h(x),L.value===!0&&n.target===document.activeElement){const{selectionStart:W,selectionEnd:Q}=n.target;W!==void 0&&Q!==void 0&&te(()=>{n.target===document.activeElement&&x.indexOf(n.target.value)===0&&n.target.setSelectionRange(W,Q)})}e.autogrow===!0&&w()}function C(n){t("animationend",n),w()}function h(n,x){p=()=>{k=null,e.type!=="number"&&u.hasOwnProperty("value")===!0&&delete u.value,e.modelValue!==n&&B!==n&&(B=n,x===!0&&(_=!0),t("update:modelValue",n),te(()=>{B===n&&(B=NaN)})),p=void 0},e.type==="number"&&(E=!0,u.value=n),e.debounce!==void 0?(k!==null&&clearTimeout(k),u.value=n,k=setTimeout(p,e.debounce)):p()}function w(){requestAnimationFrame(()=>{const n=y.value;if(n!==null){const x=n.parentNode.style,{scrollTop:W}=n,{overflowY:Q,maxHeight:D}=l.platform.is.firefox===!0?{}:window.getComputedStyle(n),G=Q!==void 0&&Q!=="scroll";G===!0&&(n.style.overflowY="hidden"),x.marginBottom=n.scrollHeight-1+"px",n.style.height="1px",n.style.height=n.scrollHeight+"px",G===!0&&(n.style.overflowY=parseInt(D,10)<n.scrollHeight?"auto":"hidden"),x.marginBottom="",n.scrollTop=W}})}function Y(n){j(n),k!==null&&(clearTimeout(k),k=null),p!==void 0&&p(),t("change",n.target.value)}function Z(n){n!==void 0&&xe(n),k!==null&&(clearTimeout(k),k=null),p!==void 0&&p(),E=!1,_=!1,delete u.value,e.type!=="file"&&setTimeout(()=>{y.value!==null&&(y.value.value=m.value!==void 0?m.value:"")})}function S(){return u.hasOwnProperty("value")===!0?u.value:m.value!==void 0?m.value:""}mt(()=>{Z()}),vt(()=>{e.autogrow===!0&&w()}),Object.assign(f,{innerValue:m,fieldClass:V(()=>`q-${b.value===!0?"textarea":"input"}`+(e.autogrow===!0?" q-textarea--autogrow":"")),hasShadow:V(()=>e.type!=="file"&&typeof e.shadowText=="string"&&e.shadowText.length!==0),inputRef:y,emitValue:h,hasValue:z,floatingLabel:V(()=>z.value===!0&&(e.type!=="number"||isNaN(m.value)===!1)||Ae(e.displayValue)),getControl:()=>ne(b.value===!0?"textarea":"input",{ref:y,class:["q-field__native q-placeholder",e.inputClass],style:e.inputStyle,...a.value,...s.value,...e.type!=="file"?{value:S()}:U.value}),getShadowControl:()=>ne("div",{class:"q-field__native q-field__shadow absolute-bottom no-pointer-events"+(b.value===!0?"":" text-no-wrap")},[ne("span",{class:"invisible"},S()),ne("span",e.shadowText)])});const P=gt(f);return Object.assign(c,{focus:r,select:o,getNativeElement:()=>y.value}),kt(c,"nativeEl",()=>y.value),P}}),en={class:"token-select"},tn=["src"],nn=["src"],cn=Ie({__name:"SelectToken",props:{options:Object,searchToken:String,direction:{type:Boolean,default:!1},token:Object,swapToken:String,disable:{type:Boolean,default:!1}},emits:["handleSearchToken","setToken"],setup(e,{emit:t}){const i=e,c=t,l=X(i.searchToken),u=X(i.token??i.options[0]);F(()=>i.token,_=>{u.value=_});function B(){l.value=""}const E=V(()=>i.options.map(_=>({..._,inactive:re(String(_.value))===re(i.swapToken)})));return F(l,_=>{c("handleSearchToken",_)}),F(u,_=>{c("setToken",_,i.direction)}),(_,k)=>(ee(),me("div",en,[K(_t,{modelValue:I(u),"onUpdate:modelValue":k[2]||(k[2]=p=>ge(u)?u.value=p:null),"option-disable":"inactive","popup-content-class":"transition-duration",outlined:"",options:I(E),dense:"","options-dense":!1,disable:e.disable,onPopupHide:B},{prepend:O(()=>[K(Ce,null,{default:O(()=>[ae("img",{src:I(u).image},null,8,tn)]),_:1})]),option:O(p=>[K(Ee,yt(p.itemProps,{class:"token-select__token"}),{default:O(()=>[K(de,{avatar:"",class:"token-select__token--item"},{default:O(()=>[K(Ce,null,{default:O(()=>[ae("img",{src:p.opt.image},null,8,nn)]),_:2},1024)]),_:2},1024),K(de,null,{default:O(()=>[K(wt,null,{default:O(()=>[ve(bt(p.opt.label),1)]),_:2},1024)]),_:2},1024)]),_:2},1040)]),"no-option":O(()=>[K(Gt,{modelValue:I(l),"onUpdate:modelValue":k[1]||(k[1]=p=>ge(l)?l.value=p:null),maxlength:8,outlined:"",class:"token-search"},{append:O(()=>[K(St,{name:I(Le),class:"cursor-pointer token-search__close",onClick:k[0]||(k[0]=p=>l.value="")},null,8,["name"])]),_:1},8,["modelValue"]),K(Ee,null,{default:O(()=>[K(de,{class:"text-grey"},{default:O(()=>[ve(" No results ")]),_:1})]),_:1})]),_:1},8,["modelValue","options","disable"])]))}});export{Bt as P,Gt as Q,un as _,cn as a,ln as b,sn as o,rn as u};