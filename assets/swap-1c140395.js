import{_ as A,o as x,j as F,m as I,C as O,G as q,s as f,H as $,I as Y,J as H,B as S,K as Z,L as N,n as U,p as V,q as W,N as j,k as l,w as c,Q as M,A as n,O as P,F as Q,x as D,u as T,y as a,z as k,R}from"./index-503398f5.js";import{s as J,b as G,u as E,f as z,Q as L,o as X,a as ee,_ as te}from"./token-891f26d4.js";const oe={},ne={class:"swap-content"},ae=I('<div class="row"><div class="swap-content__title"> Compliant DeFi with KYC </div><div class="swap-content__details"><p> Compliant DeFi with KYC (Know Your Customer) and AML (Anti-Money Laundering) refers to a type of decentralized finance (DeFi) that incorporates customer identification and anti-money laundering measures to ensure compliance with regulatory requirements. </p><p> KYC refers to the process of verifying the identity of a customer to assess their risk profile and prevent illegal activities such as money laundering and financing of terrorism. In Compliant DeFi with KYC, users are required to provide personal information and undergo identity verification procedures before they can participate in DeFi activities. </p><p> AML refers to the set of policies, procedures, and regulations aimed at detecting and preventing money laundering. In Compliant DeFi with AML, transactions are monitored and analyzed to identify any suspicious or illegal activities. </p><p> By incorporating KYC and AML measures, Compliant DeFi aims to enhance the transparency and security of DeFi transactions while ensuring regulatory compliance. This helps to mitigate the risk of illegal activities in the DeFi ecosystem and enhance the trust and confidence of users, regulators, and other stakeholders. In conclusion, Compliant DeFi with KYC and AML is a new and evolving segment of the DeFi ecosystem that seeks to balance the benefits of decentralized finance with the need for regulatory compliance and security. </p></div></div><div class="row"><div class="swap-content__title"> What zKKYC? What are the benefits? </div><div class="swap-content__details"><p> zKKYC (Zero-Knowledge KYC) is a privacy-preserving technology that enables users to prove their identity without revealing their personal information. It is based on zero-knowledge proofs, a cryptographic technique that allows users to prove the validity of information without revealing the actual data. zKKYC provides a number of benefits over traditional KYC (Know Your Customer) methods that rely on sharing personal information with the platform or a third party: </p><ul class="swap-details"><li> Privacy: zKKYC allows users to prove their identity without revealing their personal information, providing greater privacy and control over their data. </li><li> Security: zKKYC eliminates the risk of personal information being stolen or misused, as the information is not stored or transmitted. </li><li> Convenience: zKKYC enables users to complete the KYC process quickly and easily, without having to provide personal information or wait for manual verification. </li><li> Compliance: zKKYC enables DeFi platforms to comply with regulatory requirements while still preserving user privacy and security. In conclusion, zKKYC is a cutting-edge technology that provides a solution to the challenges posed by traditional KYC methods and offers numerous benefits to both users and platforms in the DeFi ecosystem. </li></ul></div></div>',2),le=[ae];function se(t,e){return x(),F("div",ne,le)}const ie=A(oe,[["render",se]]),re=O({name:"QBtnToggle",props:{...q,modelValue:{required:!0},options:{type:Array,required:!0,validator:t=>t.every(e=>("label"in e||"icon"in e||"slot"in e)&&"value"in e)},color:String,textColor:String,toggleColor:{type:String,default:"primary"},toggleTextColor:String,outline:Boolean,flat:Boolean,unelevated:Boolean,rounded:Boolean,push:Boolean,glossy:Boolean,size:String,padding:String,noCaps:Boolean,noWrap:Boolean,dense:Boolean,readonly:Boolean,disable:Boolean,stack:Boolean,stretch:Boolean,spread:Boolean,clearable:Boolean,ripple:{type:[Boolean,Object],default:!0}},emits:["update:modelValue","clear","click"],setup(t,{slots:e,emit:s}){const p=f(()=>t.options.find(i=>i.value===t.modelValue)!==void 0),v=f(()=>({type:"hidden",name:t.name,value:t.modelValue})),m=N(v),C=f(()=>$(t)),h=f(()=>({rounded:t.rounded,dense:t.dense,...C.value})),y=f(()=>t.options.map((i,r)=>{const{attrs:w,value:g,slot:_,...o}=i;return{slot:_,props:{key:r,"aria-pressed":g===t.modelValue?"true":"false",...w,...o,...h.value,disable:t.disable===!0||o.disable===!0,color:g===t.modelValue?d(o,"toggleColor"):d(o,"color"),textColor:g===t.modelValue?d(o,"toggleTextColor"):d(o,"textColor"),noCaps:d(o,"noCaps")===!0,noWrap:d(o,"noWrap")===!0,size:d(o,"size"),padding:d(o,"padding"),ripple:d(o,"ripple"),stack:d(o,"stack")===!0,stretch:d(o,"stretch")===!0,onClick(b){B(g,i,b)}}}}));function B(i,r,w){t.readonly!==!0&&(t.modelValue===i?t.clearable===!0&&(s("update:modelValue",null,null),s("clear")):s("update:modelValue",i,r),s("click",w))}function d(i,r){return i[r]===void 0?t[r]:i[r]}function K(){const i=y.value.map(r=>Y(S,r.props,r.slot!==void 0?e[r.slot]:void 0));return t.name!==void 0&&t.disable!==!0&&p.value===!0&&m(i,"push"),Z(e.default,i)}return()=>Y(H,{class:"q-btn-toggle",...C.value,rounded:t.rounded,stretch:t.stretch,glossy:t.glossy,spread:t.spread},K)}}),de=`<svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="33.5" cy="33.5" r="33.5" fill="#23353D"/>
<path d="M20.1164 28.7648C20.9418 26.6177 22.5532 24.83 24.2297 23.3017C25.8591 21.8172 27.7401 20.6021 29.8029 19.8138C30.9966 19.3579 32.2408 19.0323 33.5041 18.8402C33.667 18.8155 33.8365 18.7998 34.0095 18.7875C33.7197 19.0592 33.4401 19.34 33.1684 19.6229C32.6799 20.1305 32.2285 20.6684 31.8163 21.24C31.4244 21.7835 31.0191 22.3719 31.1123 23.0176C31.092 23.6959 31.8231 24.2596 32.4104 23.743C32.4182 23.7396 32.425 23.7363 32.434 23.7329C32.5575 23.6925 32.6642 23.624 32.7551 23.5274C32.8742 23.4084 32.9662 23.2467 33.0617 23.1086C33.2481 22.8379 33.4165 22.5561 33.6029 22.2854C33.9567 21.7723 34.3486 21.2871 34.7607 20.82C35.5221 19.9565 36.3755 19.1783 37.0324 18.2372C37.12 18.1788 37.2031 18.1137 37.2828 18.0396C37.558 17.7836 37.5355 17.3232 37.2828 17.0649C36.7652 16.5348 36.0409 16.4035 35.2941 16.4181C35.2368 16.4113 35.1807 16.4046 35.1245 16.3978C34.4126 16.3125 33.6939 16.2788 32.9775 16.2496C32.252 16.2204 31.5311 16.1721 30.8079 16.1093C30.4823 16.0812 30.1578 16.0408 29.8321 16.0093C29.4773 15.9756 29.1494 16.0441 28.7968 16.0452C27.9501 16.0475 27.6019 17.2356 28.3599 17.6589C28.4868 17.7297 28.6059 17.8015 28.726 17.87C26.8091 18.6673 25.045 19.7802 23.4594 21.1322C21.5235 22.7795 19.6931 24.7851 18.6263 27.1152C17.5673 29.4285 17.0586 32.1089 17.0036 34.6445C16.9733 36.0381 17.1372 37.4418 17.3686 38.814C17.628 40.3536 18.0232 41.9392 18.8048 43.3047C18.9643 43.5832 19.3842 43.4518 19.3932 43.1452C19.4314 41.81 19.1911 40.4794 19.0406 39.1565C18.9104 38.0078 18.8194 36.8601 18.8385 35.7035C18.8767 33.3453 19.2675 30.9748 20.1164 28.7648Z" fill="white"/>
<path d="M41.8667 21.8756C43.3344 21.9598 44.637 20.7953 44.9615 19.4197C45.1356 18.6786 44.9896 17.8947 44.491 17.3018C43.879 16.5719 42.9178 16.3979 42.0059 16.4888C41.2041 16.5697 40.3945 16.81 39.9554 17.5399C39.7398 17.8992 39.6747 18.4147 39.7679 18.874C39.5175 20.2125 40.4102 21.7925 41.8667 21.8756ZM42.0845 18.5214C42.3091 18.4877 42.7942 18.4023 42.9896 18.5775C43.0491 18.6303 43.0896 18.7729 43.103 18.8369C43.0907 18.8156 43.075 19.0222 43.0626 19.0705C42.9458 19.5129 42.5247 20.0508 42.0014 20.0384C41.5601 20.0283 41.3692 19.5668 41.2558 19.1255C41.3187 19.0222 41.3793 18.9211 41.4501 18.8335C41.6185 18.6247 41.7398 18.573 42.0845 18.5214Z" fill="white"/>
<path d="M24.7688 44.8016C24.3477 44.5444 23.7952 44.3266 23.2921 44.3254C22.7857 44.3243 22.0557 44.5545 21.7829 45.0205C21.7582 45.0632 21.738 45.107 21.7211 45.1508C20.752 45.3945 20.277 46.4501 20.2579 47.3922C20.2388 48.3995 20.7093 49.3742 21.5515 49.9357C23.4437 51.1967 26.1882 49.6516 26.2814 47.4405C26.3285 46.3613 25.6694 45.3529 24.7688 44.8016ZM24.0411 47.6538C23.7312 48.2086 22.9058 48.4612 22.5599 48.048C22.1299 47.5337 22.213 46.8902 22.4263 46.2693C22.7284 46.3378 23.0641 46.349 23.3438 46.4388C23.949 46.6331 24.3117 47.1676 24.0411 47.6538Z" fill="white"/>
<path d="M49.4881 28.0079C49.3275 27.2151 49.1478 26.4212 48.9154 25.6453C48.6717 24.8334 48.382 24.1203 48.0114 23.3634C47.7397 22.8087 46.7694 23.0603 46.8245 23.6846C46.8829 24.3449 46.9413 24.967 47.0648 25.6228C47.1973 26.3269 47.3332 27.031 47.4522 27.7362C47.6577 28.9501 47.8003 30.182 47.8508 31.4127C47.9519 33.8809 47.6386 36.4008 46.6235 38.6714C44.8874 42.5545 41.4231 45.5831 37.5838 47.3023C35.7017 48.1445 33.6669 48.6083 31.6131 48.6521C31.9174 48.3893 32.2116 48.1165 32.498 47.8402C33.3188 47.0486 34.3486 46.0042 34.4305 44.8015C34.4485 44.5332 34.1386 44.2962 33.8837 44.3849C32.8214 44.7589 32.0308 45.8268 31.2627 46.605C30.4205 47.4584 29.4829 48.2119 28.6373 49.0586C28.5351 49.1608 28.4756 49.272 28.4486 49.3831C28.1791 49.5774 28.0343 49.9278 28.2701 50.2501C29.265 51.6144 30.7698 52.4218 32.4227 52.7295C33.2447 52.8822 34.0993 52.9586 34.9314 52.8463C35.6018 52.7553 36.7382 52.3825 36.901 51.6133C36.9347 51.4527 36.9089 51.2674 36.7797 51.1529C36.3272 50.7509 35.5355 50.7981 34.9639 50.8127C34.2879 50.8295 33.6321 50.8958 32.9572 50.7913C32.8663 50.7767 32.7753 50.761 32.6844 50.743C36.8089 50.4252 40.7516 48.5555 43.8801 45.8638C47.7734 42.5152 50.054 37.7382 49.999 32.5794C49.9822 31.0433 49.7935 29.5104 49.4881 28.0079Z" fill="white"/>
</svg>
`,ce=U("swap",()=>{const t=V({image:J,value:"sol",label:"sol"}),e=V({image:G,value:"usd-coin",label:"usdc"}),s=V({from:t,to:e,swapping:!1,active:!1,loading:!1,slippage:.01,slippageDialog:!1});function p(){const{from:C,to:h}=s;s.to=C,s.from=h}function v(){s.slippageDialog=!0}function m(){s.slippageDialog=!1}return{state:s,changeDirection:p,openSlippage:v,closeSlippage:m}}),ue={class:"swap-form"},pe={class:"swap-field"},fe={class:"swap-field__info"},Ce={class:"row items-end"},me=a("div",{class:"col swap-field__label"}," FROM: ",-1),he={class:"col swap-field__balance"},ge={class:"swap-change"},_e=["innerHTML"],ve={class:"swap-field"},we={class:"swap-field__info"},ye={class:"row"},be=a("div",{class:"col swap-field__label"}," TO: ",-1),ke={class:"col swap-field__balance"},Se={class:"swap-info"},Be=a("dl",null,[a("dt",null,"Minimum Received::"),a("dd",null,"1 SOL ")],-1),Ke=a("dt",null,"Slippage Tolerance:",-1),Ve=a("dl",null,[a("dt",null,"Swap fee:"),a("dd",null,"1 SOL")],-1),De={class:"swap-submit"},Te=a("div",{class:"swap-rate"}," 1 JPLT ≈ 0 JPLU ",-1),xe=W({__name:"SwapCard",setup(t){const{state:e,changeDirection:s,openSlippage:p,closeSlippage:v}=ce(),{handleSearchToken:m,options:C,tokenBalance:h}=E(),y=j(0),B=f(()=>`transform: rotate(${y.value*180}deg)`),d=f(()=>z(h(e.from.label))),K=f(()=>z(h(e.to.label)));function i(){s(),y.value++}function r(_,o){e[o?"to":"from"]=_}function w(_){console.log(_)}function g(){console.log("swapSubmit")}return(_,o)=>{const b=te;return x(),F(Q,null,[l(M,{class:"swap-card swap-widget"},{default:c(()=>[l(D,{class:"swap-card__header"},{default:c(()=>[T(" Swap ")]),_:1}),l(D,{class:"swap-card__body"},{default:c(()=>[a("div",ue,[a("div",pe,[a("div",fe,[a("div",Ce,[me,a("div",he," Balance: "+k(n(d)),1)])]),l(L,{modelValue:n(e).from.amount,"onUpdate:modelValue":o[1]||(o[1]=u=>n(e).from.amount=u),maxlength:14,outlined:"",placeholder:"0.0",class:"swap-input",onKeypress:n(X)},{append:c(()=>[l(S,{dense:"",unelevated:"",ripple:!1,class:"swap-input__max",onClick:o[0]||(o[0]=u=>w(n(e).from))},{default:c(()=>[T(" MAX ")]),_:1}),l(b,{options:n(C),token:n(e).from,onHandleSearchToken:n(m),onSetToken:r},null,8,["options","token","onHandleSearchToken"])]),_:1},8,["modelValue","onKeypress"])]),a("div",ge,[l(S,{ripple:!1,dense:"",unelevated:"",style:R(n(B)),onClick:i},{default:c(()=>[a("i",{innerHTML:n(de)},null,8,_e)]),_:1},8,["style"])]),a("div",ve,[a("div",we,[a("div",ye,[be,a("div",ke," Balance: "+k(n(K)),1)])]),l(L,{modelValue:n(e).to.amount,"onUpdate:modelValue":o[2]||(o[2]=u=>n(e).to.amount=u),readonly:"",maxlength:14,outlined:"",placeholder:"0.0",class:"swap-input"},{append:c(()=>[l(b,{options:n(C),direction:!0,token:n(e).to,onHandleSearchToken:n(m),onSetToken:r},null,8,["options","token","onHandleSearchToken"])]),_:1},8,["modelValue"])])]),a("div",Se,[Be,a("dl",null,[Ke,a("dd",null,[a("a",{href:"#",onClick:o[3]||(o[3]=(...u)=>n(p)&&n(p)(...u))},"0 SOL")])]),Ve]),a("div",De,[l(S,{loading:n(e).swapping,disable:!n(e).active,rounded:"",ripple:!1,onClick:g},{default:c(()=>[T(" Swap "+k(n(e).from.label)+" / "+k(n(e).to.label),1)]),_:1},8,["loading","disable"])]),Te]),_:1}),l(ee,{showing:n(e).loading,class:"swap-loading",color:"grey"},null,8,["showing"])]),_:1}),l(P,{modelValue:n(e).slippageDialog,"onUpdate:modelValue":o[5]||(o[5]=u=>n(e).slippageDialog=u),"transition-duration":"100","transition-show":"fade","transition-hide":"fade"},{default:c(()=>[l(M,null,{default:c(()=>[l(D,null,{default:c(()=>[l(re,{modelValue:n(e).slippage,"onUpdate:modelValue":[o[4]||(o[4]=u=>n(e).slippage=u),n(v)],spread:"","no-caps":"",unelevated:"",ripple:!1,"toggle-color":"secondary",color:"white","text-color":"dark",options:[{label:"0.1%",value:.001},{label:"0.5%",value:.005},{label:"1%",value:.01},{label:"5%",value:.05}]},null,8,["modelValue","onUpdate:modelValue"])]),_:1})]),_:1})]),_:1},8,["modelValue"])],64)}}}),Fe={};function Ye(t,e){const s=xe,p=ie;return x(),F(Q,null,[l(s),l(p)],64)}const Le=A(Fe,[["render",Ye]]);export{Le as default};
