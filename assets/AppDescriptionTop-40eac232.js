import{_ as g,o as t,i as a,a1 as i,$ as w,U as C,v as V,t as m,F as A,x as F,aI as L,X as B,Y as $,j as s,a8 as N,a2 as e,a3 as k,av as j,a4 as h,ax as S,aw as z,Z as Q,aJ as T,aK as U,aL as I,aM as K}from"./index-e93a9c8d.js";const R={},Z={class:"warning-disclaimer"},E=i("div",{class:"warning-disclaimer__bar"},null,-1),J=i("div",{class:"warning-disclaimer__text"},` Albus DeFi's services and its associated features, including smart contracts, are provided "as is". The smart contracts have not undergone external audits. By using Albus DeFi, you acknowledge and understand that the utilization of the website, software, smart contracts, and all associated services is wholly at your discretion and risk. `,-1),M=[E,J];function O(c,n){return t(),a("div",Z,M)}const ge=g(R,[["render",O]]),W={},X={class:"app-description"},Y=i("div",{class:"app-description__title"}," DeFi with built-in verification ",-1),G=i("div",{class:"app-description__details"},[w(" Conduct quick and efficient transactions while benefitting from built-in verification. Albus DeFi is powered by Albus Protocol, which performs verification based on pre-defined requirements and relies on Zero-Knowledge Proofs to keep your personal information private throughout the verification process. For details, please visit "),i("a",{class:"app-description__link",href:"https://albus.finance/",target:"_blanc"},"Albus Protocol's landing page"),w(". ")],-1),H=[Y,G];function ee(c,n){return t(),a("div",X,H)}const ye=g(W,[["render",ee]]),ie={key:0,class:"certificate-card__info__title q-mt-sm text-center"},te={key:1,class:"row nowrap full-height"},ae={class:"certificate-card__info row"},ce={class:"certificate-card__info__status column row justify-between"},se=i("div",{class:"certificate-card__info__title"}," Required certificate ",-1),ne={key:0,class:"row"},oe={class:"certificate-card__policy-name full-height"},re={key:0,class:"certificate-card__end"},le={key:0,class:"certificate-card__action"},_e=["href"],be=C({__name:"PolicyCardView",props:{requiredPolicy:String,requiredPolicyData:Object},setup(c){const n=c,u=V(),y=m(()=>u.serviceData),o=m(()=>u.serviceLoading),r=m(()=>u.state?.certificateLoading),l=A(!1),{connected:_}=F(),{certificate:p,certificateLink:v,certificateValid:d}=L(n.requiredPolicy);return(me,f)=>{const q=T,x=U,D=I,P=K;return t(),B(Q,{flat:"",class:"certificate-card"},{default:$(()=>[s(N,{showing:e(o)||e(_)&&e(r),"label-class":"text-teal","label-style":"font-size: 1.1em"},null,8,["showing"]),!e(o)&&!c.requiredPolicy?(t(),a("div",ie," No certificate required ")):(t(),a("div",te,[i("div",ae,[i("div",{class:"policy-info q-mr-sm",onClick:f[0]||(f[0]=b=>l.value=!0)}," i "),i("div",ce,[se,e(_)&&!e(o)&&!e(r)?(t(),a("div",ne,[s(q,{certificate:e(p),"certificate-valid":!!e(d)},null,8,["certificate","certificate-valid"])])):k("",!0)]),i("div",oe,[i("span",{class:j(["certificate-card__info__status-line",e(_)?e(d)?"certificate-card__info__status-line--positive":"certificate-card__info__status-line--negative":"certificate-card__info__status-line--gray"])},null,2),i("span",null,h(e(y)?.name)+" "+h(e(y)?.name&&c.requiredPolicyData?.name&&",")+" "+h(c.requiredPolicyData?.name),1)])]),e(_)&&!e(o)&&!e(r)?(t(),a("div",re,[e(d)?(t(),a("a",{key:1,href:e(v),class:"certificate-card__certificate certificate",target:"_blank"},[s(D)],8,_e)):(t(),a("div",le,[s(x,{certificate:e(p),"certificate-link":e(v)},null,8,["certificate","certificate-link"])]))])):k("",!0)])),s(S,{modelValue:e(l),"onUpdate:modelValue":f[1]||(f[1]=b=>z(l)?l.value=b:null),"transition-duration":"100","transition-show":"fade","transition-hide":"fade"},{default:$(()=>[s(P,{"required-policy-data":c.requiredPolicyData,certificate:e(p),"certificate-valid":!!e(d),"certificate-loading":e(r),"certificate-link":e(v)},null,8,["required-policy-data","certificate","certificate-valid","certificate-loading","certificate-link"])]),_:1},8,["modelValue"])]),_:1})}}}),de={},fe={class:"app-description"},ue=i("div",{class:"app-description__details"}," All services provided by Albus DeFi are subject to verification. To become eligible for a service, pass secure and privacy-preserving verification with Albus Protocol and obtain a Compliance Certificate. ",-1),pe=[ue];function ve(c,n){return t(),a("div",fe,pe)}const we=g(de,[["render",ve]]);export{we as _,ye as a,ge as b,be as c};