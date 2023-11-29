import{k as a,aO as v,P as m,m as D,aC as $e,S as Ge,N as f,n as N,q as C,s as Xe,u as Ye,w as qe,x as Ze,y as He,z as et,v as x,H as Ne,F as q,A as tt,aP as ot,aQ as nt,B as M,aR as rt,aS as at,ak as Ce,a2 as it,aT as _,L as st,aU as L,Q as ct,t as ut,aV as lt,$ as w,o as U,U as pt,V as O,j as b,Y as dt,Z as y,a1 as z,i as be,a0 as V,ah as mt,a3 as Re,ac as kt,ab as ft,W as Ke,X as Q,aW as ve,ao as wt,aX as yt}from"./index-0ef340ca.js";import{g as ht,T as St,a as gt,c as At,k as Tt,b as Oe,e as bt}from"./AppDescriptionTop-1c27b1ad.js";var vt=Object.defineProperty,Bt=(t,e,n)=>e in t?vt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,r=(t,e,n)=>(Bt(t,typeof e!="symbol"?e+"":e,n),n);const _e=new a.BeetArgsStruct([["tradeFeeNumerator",a.u64],["tradeFeeDenominator",a.u64],["ownerTradeFeeNumerator",a.u64],["ownerTradeFeeDenominator",a.u64],["ownerWithdrawFeeNumerator",a.u64],["ownerWithdrawFeeDenominator",a.u64],["hostFeeNumerator",a.u64],["hostFeeDenominator",a.u64]],"FeesInfo"),Le=new a.BeetArgsStruct([["curveType",a.u8],["curveParameters",a.uniformFixedSizeArray(a.u8,32)]],"CurveInfo"),Be=[135,144,215,161,140,125,41,96];class T{constructor(e,n,c,i,l,h,g,u,o,F,A,E){this.isInitialized=e,this.bumpSeed=n,this.tokenProgramId=c,this.tokenA=i,this.tokenB=l,this.poolMint=h,this.tokenAMint=g,this.tokenBMint=u,this.poolFeeAccount=o,this.fees=F,this.curve=A,this.policy=E}static fromArgs(e){return new T(e.isInitialized,e.bumpSeed,e.tokenProgramId,e.tokenA,e.tokenB,e.poolMint,e.tokenAMint,e.tokenBMint,e.poolFeeAccount,e.fees,e.curve,e.policy)}static fromAccountInfo(e,n=0){return T.deserialize(e.data,n)}static async fromAccountAddress(e,n,c){const i=await e.getAccountInfo(n,c);if(i==null)throw new Error(`Unable to find TokenSwap account at ${n}`);return T.fromAccountInfo(i,0)[0]}static gpaBuilder(e=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){return v.GpaBuilder.fromStruct(e,J)}static deserialize(e,n=0){return J.deserialize(e,n)}serialize(){return J.serialize({accountDiscriminator:Be,...this})}static byteSize(e){const n=T.fromArgs(e);return J.toFixedFromValue({accountDiscriminator:Be,...n}).byteSize}static async getMinimumBalanceForRentExemption(e,n,c){return n.getMinimumBalanceForRentExemption(T.byteSize(e),c)}pretty(){return{isInitialized:this.isInitialized,bumpSeed:this.bumpSeed,tokenProgramId:this.tokenProgramId.toBase58(),tokenA:this.tokenA.toBase58(),tokenB:this.tokenB.toBase58(),poolMint:this.poolMint.toBase58(),tokenAMint:this.tokenAMint.toBase58(),tokenBMint:this.tokenBMint.toBase58(),poolFeeAccount:this.poolFeeAccount.toBase58(),fees:this.fees,curve:this.curve,policy:this.policy}}}const J=new a.FixableBeetStruct([["accountDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["isInitialized",a.bool],["bumpSeed",a.u8],["tokenProgramId",v.publicKey],["tokenA",v.publicKey],["tokenB",v.publicKey],["poolMint",v.publicKey],["tokenAMint",v.publicKey],["tokenBMint",v.publicKey],["poolFeeAccount",v.publicKey],["fees",_e],["curve",Le],["policy",a.coption(v.publicKey)]],T.fromArgs,"TokenSwap"),p=new Map,d=new Map;class j extends Error{constructor(){super("Swap account already in use"),r(this,"code",6e3),r(this,"name","AlreadyInUse"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,j)}}p.set(6e3,()=>new j);d.set("AlreadyInUse",()=>new j);class $ extends Error{constructor(){super("Invalid program address generated from bump seed and key"),r(this,"code",6001),r(this,"name","InvalidProgramAddress"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,$)}}p.set(6001,()=>new $);d.set("InvalidProgramAddress",()=>new $);class G extends Error{constructor(){super("Input account owner is not the program address"),r(this,"code",6002),r(this,"name","InvalidOwner"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,G)}}p.set(6002,()=>new G);d.set("InvalidOwner",()=>new G);class X extends Error{constructor(){super("Output pool account owner cannot be the program address"),r(this,"code",6003),r(this,"name","InvalidOutputOwner"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,X)}}p.set(6003,()=>new X);d.set("InvalidOutputOwner",()=>new X);class Y extends Error{constructor(){super("Deserialized account is not an SPL Token mint"),r(this,"code",6004),r(this,"name","ExpectedMint"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,Y)}}p.set(6004,()=>new Y);d.set("ExpectedMint",()=>new Y);class Z extends Error{constructor(){super("Deserialized account is not an SPL Token account"),r(this,"code",6005),r(this,"name","ExpectedAccount"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,Z)}}p.set(6005,()=>new Z);d.set("ExpectedAccount",()=>new Z);class H extends Error{constructor(){super("Input token account empty"),r(this,"code",6006),r(this,"name","EmptySupply"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,H)}}p.set(6006,()=>new H);d.set("EmptySupply",()=>new H);class ee extends Error{constructor(){super("Pool token mint has a non-zero supply"),r(this,"code",6007),r(this,"name","InvalidSupply"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ee)}}p.set(6007,()=>new ee);d.set("InvalidSupply",()=>new ee);class te extends Error{constructor(){super("Token account has a delegate"),r(this,"code",6008),r(this,"name","InvalidDelegate"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,te)}}p.set(6008,()=>new te);d.set("InvalidDelegate",()=>new te);class oe extends Error{constructor(){super("InvalidInput"),r(this,"code",6009),r(this,"name","InvalidInput"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,oe)}}p.set(6009,()=>new oe);d.set("InvalidInput",()=>new oe);class ne extends Error{constructor(){super("Address of the provided swap token account is incorrect"),r(this,"code",6010),r(this,"name","IncorrectSwapAccount"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ne)}}p.set(6010,()=>new ne);d.set("IncorrectSwapAccount",()=>new ne);class re extends Error{constructor(){super("Address of the provided pool token mint is incorrect"),r(this,"code",6011),r(this,"name","IncorrectPoolMint"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,re)}}p.set(6011,()=>new re);d.set("IncorrectPoolMint",()=>new re);class ae extends Error{constructor(){super("InvalidOutput"),r(this,"code",6012),r(this,"name","InvalidOutput"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ae)}}p.set(6012,()=>new ae);d.set("InvalidOutput",()=>new ae);class ie extends Error{constructor(){super("General calculation failure due to overflow or underflow"),r(this,"code",6013),r(this,"name","CalculationFailure"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ie)}}p.set(6013,()=>new ie);d.set("CalculationFailure",()=>new ie);class se extends Error{constructor(){super("Invalid instruction"),r(this,"code",6014),r(this,"name","InvalidInstruction"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,se)}}p.set(6014,()=>new se);d.set("InvalidInstruction",()=>new se);class ce extends Error{constructor(){super("Swap input token accounts have the same mint"),r(this,"code",6015),r(this,"name","RepeatedMint"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ce)}}p.set(6015,()=>new ce);d.set("RepeatedMint",()=>new ce);class ue extends Error{constructor(){super("Swap instruction exceeds desired slippage limit"),r(this,"code",6016),r(this,"name","ExceededSlippage"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ue)}}p.set(6016,()=>new ue);d.set("ExceededSlippage",()=>new ue);class le extends Error{constructor(){super("Token account has a close authority"),r(this,"code",6017),r(this,"name","InvalidCloseAuthority"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,le)}}p.set(6017,()=>new le);d.set("InvalidCloseAuthority",()=>new le);class pe extends Error{constructor(){super("Pool token mint has a freeze authority"),r(this,"code",6018),r(this,"name","InvalidFreezeAuthority"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,pe)}}p.set(6018,()=>new pe);d.set("InvalidFreezeAuthority",()=>new pe);class de extends Error{constructor(){super("Pool fee token account incorrect"),r(this,"code",6019),r(this,"name","IncorrectFeeAccount"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,de)}}p.set(6019,()=>new de);d.set("IncorrectFeeAccount",()=>new de);class me extends Error{constructor(){super("Given pool token amount results in zero trading tokens"),r(this,"code",6020),r(this,"name","ZeroTradingTokens"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,me)}}p.set(6020,()=>new me);d.set("ZeroTradingTokens",()=>new me);class ke extends Error{constructor(){super("Fee calculation failed due to overflow, underflow, or unexpected 0"),r(this,"code",6021),r(this,"name","FeeCalculationFailure"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ke)}}p.set(6021,()=>new ke);d.set("FeeCalculationFailure",()=>new ke);class fe extends Error{constructor(){super("Conversion to u64/u128 failed with an overflow or underflow"),r(this,"code",6022),r(this,"name","ConversionFailure"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,fe)}}p.set(6022,()=>new fe);d.set("ConversionFailure",()=>new fe);class we extends Error{constructor(){super("The provided fee does not match the program owner's constraints"),r(this,"code",6023),r(this,"name","InvalidFee"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,we)}}p.set(6023,()=>new we);d.set("InvalidFee",()=>new we);class ye extends Error{constructor(){super("The provided token program does not match the token program expected by the swap"),r(this,"code",6024),r(this,"name","IncorrectTokenProgramId"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ye)}}p.set(6024,()=>new ye);d.set("IncorrectTokenProgramId",()=>new ye);class he extends Error{constructor(){super("The provided curve type is not supported by the program owner"),r(this,"code",6025),r(this,"name","UnsupportedCurveType"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,he)}}p.set(6025,()=>new he);d.set("UnsupportedCurveType",()=>new he);class Se extends Error{constructor(){super("The provided curve parameters are invalid"),r(this,"code",6026),r(this,"name","InvalidCurve"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,Se)}}p.set(6026,()=>new Se);d.set("InvalidCurve",()=>new Se);class ge extends Error{constructor(){super("The operation cannot be performed on the given curve"),r(this,"code",6027),r(this,"name","UnsupportedCurveOperation"),typeof Error.captureStackTrace=="function"&&Error.captureStackTrace(this,ge)}}p.set(6027,()=>new ge);d.set("UnsupportedCurveOperation",()=>new ge);const Ft=new a.BeetArgsStruct([["instructionDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["poolTokenAmount",a.u64],["maximumTokenAAmount",a.u64],["maximumTokenBAmount",a.u64]],"DepositAllTokenTypesInstructionArgs"),Et=[32,95,69,60,75,79,205,238];function It(t,e,n=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){const[c]=Ft.serialize({instructionDiscriminator:Et,...e}),i=[{pubkey:t.tokenSwap,isWritable:!1,isSigner:!1},{pubkey:t.authority,isWritable:!1,isSigner:!1},{pubkey:t.userTransferAuthority,isWritable:!1,isSigner:!0},{pubkey:t.userTokenA,isWritable:!0,isSigner:!1},{pubkey:t.userTokenB,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenA,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenB,isWritable:!0,isSigner:!1},{pubkey:t.poolMint,isWritable:!0,isSigner:!1},{pubkey:t.destination,isWritable:!0,isSigner:!1},{pubkey:t.tokenProgram??N,isWritable:!1,isSigner:!1}];if(t.anchorRemainingAccounts!=null)for(const l of t.anchorRemainingAccounts)i.push(l);return new C({programId:n,keys:i,data:c})}const Wt=new a.BeetArgsStruct([["instructionDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["sourceTokenAmount",a.u64],["minimumPoolTokenAmount",a.u64]],"DepositSingleTokenTypeInstructionArgs"),Mt=[175,0,152,41,199,0,148,43];function xt(t,e,n=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){const[c]=Wt.serialize({instructionDiscriminator:Mt,...e}),i=[{pubkey:t.tokenSwap,isWritable:!1,isSigner:!1},{pubkey:t.authority,isWritable:!1,isSigner:!1},{pubkey:t.userTransferAuthority,isWritable:!1,isSigner:!0},{pubkey:t.source,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenA,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenB,isWritable:!0,isSigner:!1},{pubkey:t.poolMint,isWritable:!0,isSigner:!1},{pubkey:t.destination,isWritable:!0,isSigner:!1},{pubkey:t.tokenProgram??N,isWritable:!1,isSigner:!1}];if(t.anchorRemainingAccounts!=null)for(const l of t.anchorRemainingAccounts)i.push(l);return new C({programId:n,keys:i,data:c})}const Pt=new a.FixableBeetArgsStruct([["instructionDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["feesInput",_e],["curveInput",Le],["policy",a.coption(v.publicKey)]],"InitializeInstructionArgs"),Dt=[175,175,109,31,13,152,155,237];function zt(t,e,n=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){const[c]=Pt.serialize({instructionDiscriminator:Dt,...e}),i=[{pubkey:t.authority,isWritable:!1,isSigner:!1},{pubkey:t.tokenSwap,isWritable:!0,isSigner:!0},{pubkey:t.poolMint,isWritable:!0,isSigner:!1},{pubkey:t.tokenA,isWritable:!0,isSigner:!1},{pubkey:t.tokenB,isWritable:!0,isSigner:!1},{pubkey:t.poolFee,isWritable:!0,isSigner:!1},{pubkey:t.destination,isWritable:!0,isSigner:!1},{pubkey:t.tokenProgram??N,isWritable:!1,isSigner:!1}];if(t.anchorRemainingAccounts!=null)for(const l of t.anchorRemainingAccounts)i.push(l);return new C({programId:n,keys:i,data:c})}const Nt=new a.BeetArgsStruct([["instructionDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["amountIn",a.u64],["minimumAmountOut",a.u64]],"SwapInstructionArgs"),Ct=[248,198,158,145,225,117,135,200];function Rt(t,e,n=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){const[c]=Nt.serialize({instructionDiscriminator:Ct,...e}),i=[{pubkey:t.proofRequest??n,isWritable:!1,isSigner:!1},{pubkey:t.tokenSwap,isWritable:!1,isSigner:!1},{pubkey:t.authority,isWritable:!1,isSigner:!1},{pubkey:t.userTransferAuthority,isWritable:!1,isSigner:!0},{pubkey:t.userSource,isWritable:!0,isSigner:!1},{pubkey:t.userDestination,isWritable:!0,isSigner:!1},{pubkey:t.poolSource,isWritable:!0,isSigner:!1},{pubkey:t.poolDestination,isWritable:!0,isSigner:!1},{pubkey:t.poolMint,isWritable:!0,isSigner:!1},{pubkey:t.poolFee,isWritable:!0,isSigner:!1},{pubkey:t.hostFeeAccount??n,isWritable:!1,isSigner:!1},{pubkey:t.tokenProgram??N,isWritable:!1,isSigner:!1}];if(t.anchorRemainingAccounts!=null)for(const l of t.anchorRemainingAccounts)i.push(l);return new C({programId:n,keys:i,data:c})}const Kt=new a.BeetArgsStruct([["instructionDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["poolTokenAmount",a.u64],["minimumTokenAAmount",a.u64],["minimumTokenBAmount",a.u64]],"WithdrawAllTokenTypesInstructionArgs"),Ot=[189,254,156,174,210,9,164,216];function qt(t,e,n=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){const[c]=Kt.serialize({instructionDiscriminator:Ot,...e}),i=[{pubkey:t.tokenSwap,isWritable:!1,isSigner:!1},{pubkey:t.authority,isWritable:!1,isSigner:!1},{pubkey:t.userTransferAuthority,isWritable:!1,isSigner:!0},{pubkey:t.poolMint,isWritable:!0,isSigner:!1},{pubkey:t.source,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenA,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenB,isWritable:!0,isSigner:!1},{pubkey:t.destTokenA,isWritable:!0,isSigner:!1},{pubkey:t.destTokenB,isWritable:!0,isSigner:!1},{pubkey:t.poolFee,isWritable:!0,isSigner:!1},{pubkey:t.tokenProgram??N,isWritable:!1,isSigner:!1}];if(t.anchorRemainingAccounts!=null)for(const l of t.anchorRemainingAccounts)i.push(l);return new C({programId:n,keys:i,data:c})}const _t=new a.BeetArgsStruct([["instructionDiscriminator",a.uniformFixedSizeArray(a.u8,8)],["destinationTokenAmount",a.u64],["maximumPoolTokenAmount",a.u64]],"WithdrawSingleTokenTypeInstructionArgs"),Lt=[111,171,21,77,237,181,241,56];function Ut(t,e,n=new m("ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq")){const[c]=_t.serialize({instructionDiscriminator:Lt,...e}),i=[{pubkey:t.tokenSwap,isWritable:!1,isSigner:!1},{pubkey:t.authority,isWritable:!1,isSigner:!1},{pubkey:t.userTransferAuthority,isWritable:!1,isSigner:!0},{pubkey:t.poolMint,isWritable:!0,isSigner:!1},{pubkey:t.source,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenA,isWritable:!0,isSigner:!1},{pubkey:t.swapTokenB,isWritable:!0,isSigner:!1},{pubkey:t.destination,isWritable:!0,isSigner:!1},{pubkey:t.poolFee,isWritable:!0,isSigner:!1},{pubkey:t.tokenProgram??N,isWritable:!1,isSigner:!1}];if(t.anchorRemainingAccounts!=null)for(const l of t.anchorRemainingAccounts)i.push(l);return new C({programId:n,keys:i,data:c})}var Ue=(t=>(t[t.ConstantProduct=0]="ConstantProduct",t[t.ConstantPrice=1]="ConstantPrice",t[t.Offset=2]="Offset",t))(Ue||{});a.fixedScalarEnum(Ue);var Ve=(t=>(t[t.Floor=0]="Floor",t[t.Ceiling=1]="Ceiling",t))(Ve||{});a.fixedScalarEnum(Ve);var Qe=(t=>(t[t.AtoB=0]="AtoB",t[t.BtoA=1]="BtoA",t))(Qe||{});a.fixedScalarEnum(Qe);const Vt="ASWfaoztykN8Lz1P2uwuvwWR61SvFrvn6acM1sJpxKtq",Qt=new m(Vt);class Jt{constructor(e){r(this,"programId",Qt),this.provider=e}get connection(){return this.provider.connection}swapAuthority(e){return m.findProgramAddressSync([e.toBuffer()],this.programId)[0]}async createTokenSwap(e,n){const c=new D,i=e.tokenSwap??$e.generate(),l=Array.from({length:32}),h=Array.from(e.curveParameters??[]);for(let A=0;A<h.length;A++)l[A]=h[A];const g={curveType:e.curveType,curveParameters:l},u=T.byteSize({bumpSeed:0,curve:g,fees:{tradeFeeNumerator:0,tradeFeeDenominator:0,ownerTradeFeeNumerator:0,ownerTradeFeeDenominator:0,ownerWithdrawFeeNumerator:0,ownerWithdrawFeeDenominator:0,hostFeeNumerator:0,hostFeeDenominator:0},isInitialized:!1,policy:m.default,poolFeeAccount:m.default,poolMint:m.default,tokenA:m.default,tokenAMint:m.default,tokenB:m.default,tokenBMint:m.default,tokenProgramId:m.default}),o=await this.connection.getMinimumBalanceForRentExemption(u);c.add(Ge.createAccount({fromPubkey:this.provider.publicKey,newAccountPubkey:i.publicKey,programId:this.programId,lamports:o,space:u})),c.add(zt({authority:this.swapAuthority(i.publicKey),tokenSwap:i.publicKey,destination:e.destination,poolMint:e.poolMint,poolFee:e.poolFee,tokenA:e.tokenA,tokenB:e.tokenB},{feesInput:{tradeFeeNumerator:new f(e.fees.tradeFeeNumerator.toString()),tradeFeeDenominator:new f(e.fees.tradeFeeDenominator.toString()),ownerTradeFeeNumerator:new f(e.fees.ownerTradeFeeNumerator.toString()),ownerTradeFeeDenominator:new f(e.fees.ownerTradeFeeDenominator.toString()),ownerWithdrawFeeNumerator:new f(e.fees.ownerWithdrawFeeNumerator.toString()),ownerWithdrawFeeDenominator:new f(e.fees.ownerWithdrawFeeDenominator.toString()),hostFeeNumerator:new f(e.fees.hostFeeNumerator.toString()),hostFeeDenominator:new f(e.fees.hostFeeDenominator.toString())},curveInput:g,policy:e.policy??null}));const F=await this.provider.sendAndConfirm(c,[i],n);return{tokenSwap:i.publicKey,signature:F}}async swap(e,n){const c=new D;try{await ht(this.connection,e.userDestination)}catch(i){(i instanceof St||i instanceof gt)&&e.receiver&&e.destinationTokenMint&&c.add(At(this.provider.publicKey,e.userDestination,e.receiver,e.destinationTokenMint))}return c.add(Rt({authority:this.swapAuthority(e.tokenSwap),userTransferAuthority:this.provider.publicKey,userSource:e.userSource,userDestination:e.userDestination,tokenSwap:e.tokenSwap,poolFee:e.poolFee,poolMint:e.poolMint,poolSource:e.poolSource,poolDestination:e.poolDestination,proofRequest:e.proofRequest,hostFeeAccount:e.hostFeeAccount},{amountIn:new f(e.amountIn.toString()),minimumAmountOut:new f(e.minimumAmountOut.toString())})),this.provider.sendAndConfirm(c,[],n)}async depositAllTokenTypes(e,n){const c=It({authority:this.swapAuthority(e.tokenSwap),userTransferAuthority:this.provider.publicKey,tokenSwap:e.tokenSwap,poolMint:e.poolMint,destination:e.destination,userTokenA:e.userTokenA,userTokenB:e.userTokenB,swapTokenA:e.swapTokenA,swapTokenB:e.swapTokenB},{poolTokenAmount:new f(e.poolTokenAmount.toString()),maximumTokenAAmount:new f(e.maximumTokenA.toString()),maximumTokenBAmount:new f(e.maximumTokenB.toString())}),i=new D().add(c);return this.provider.sendAndConfirm(i,[],n)}async withdrawAllTokenTypes(e,n){const c=qt({authority:this.swapAuthority(e.tokenSwap),userTransferAuthority:this.provider.publicKey,tokenSwap:e.tokenSwap,poolMint:e.poolMint,poolFee:e.poolFee,source:e.source,destTokenA:e.destTokenA,destTokenB:e.destTokenB,swapTokenA:e.swapTokenA,swapTokenB:e.swapTokenB},{poolTokenAmount:new f(e.poolTokenAmount.toString()),minimumTokenAAmount:new f(e.minimumTokenA.toString()),minimumTokenBAmount:new f(e.minimumTokenB.toString())}),i=new D().add(c);return this.provider.sendAndConfirm(i,[],n)}async depositSingleTokenTypeExactAmountIn(e,n){const c=xt({authority:this.swapAuthority(e.tokenSwap),userTransferAuthority:this.provider.publicKey,tokenSwap:e.tokenSwap,poolMint:e.poolMint,source:e.source,destination:e.destination,swapTokenA:e.swapTokenA,swapTokenB:e.swapTokenB},{sourceTokenAmount:new f(e.sourceTokenAmount.toString()),minimumPoolTokenAmount:new f(e.minimumPoolTokenAmount.toString())}),i=new D().add(c);return this.provider.sendAndConfirm(i,[],n)}async withdrawSingleTokenTypeExactAmountOut(e,n){const c=Ut({authority:this.swapAuthority(e.tokenSwap),userTransferAuthority:this.provider.publicKey,tokenSwap:e.tokenSwap,poolMint:e.poolMint,poolFee:e.poolFee,source:e.source,destination:e.destination,swapTokenA:e.swapTokenA,swapTokenB:e.swapTokenB},{destinationTokenAmount:new f(e.destinationTokenAmount.toString()),maximumPoolTokenAmount:new f(e.maximumPoolTokenAmount.toString())}),i=new D().add(c);return this.provider.sendAndConfirm(i,[],n)}async load(e,n){return T.fromAccountAddress(this.provider.connection,new m(e),n)}async loadAll(e={}){const n=T.gpaBuilder().addFilter("accountDiscriminator",Be);return e.noData&&(n.config.dataSlice={offset:0,length:0}),e.tokenProgramId&&n.addFilter("tokenProgramId",new m(e.tokenProgramId)),e.poolMint&&n.addFilter("poolMint",new m(e.poolMint)),e.tokenAMint&&n.addFilter("tokenAMint",new m(e.tokenAMint)),e.tokenBMint&&n.addFilter("tokenBMint",new m(e.tokenBMint)),(await n.run(this.provider.connection)).map(({pubkey:c,account:i})=>({pubkey:c,data:e.noData?null:T.fromAccountInfo(i)[0]}))}}const jt=Xe("swap",()=>{const t=Ye(),e=qe(),n=Ze(),{publicKey:c}=He(),{notify:i}=et(),l=x(()=>new Jt(new Ne(t.connection,n.value??{publicKey:m.default},Ne.defaultOptions()))),h=q([]),g=q([]),u=q(),o=tt({loading:!1,slippageDialog:!1,status:void 0,poolBalance:{},poolTokenSupply:0,from:ot,to:nt,swapping:!1,active:!1,slippage:.01,rate:0,minimumReceived:0,impact:0,fees:{host:0,trade:0,ownerTrade:0,ownerWithdraw:0},direction:0});M(n,async s=>{F().then(),s||B()},{immediate:!0});async function F(){o.loading=!0;try{console.log("swapClient ================: ",l.value),h.value=await l.value.loadAll(),console.log("swaps ================: ",h.value)}catch(s){console.log(s),h.value=[]}finally{o.loading=!1}}const A=q(!1),E=rt(async()=>{if(console.log("loadPoolTokenAccounts ========= "),!!u.value){A.value=!0;try{const s=await at(t.connection,l.value.swapAuthority(u.value.pubkey));for(const S of s)o.poolBalance[`${S.mint}`]=S.amount;const k=await Tt(t.connection,u.value.data.poolMint);o.poolTokenSupply=Number(k.supply),console.log("[Pool Balance]",o.poolBalance),console.log("[Pool Balance] poolTokenSupply",o.poolTokenSupply)}catch(s){console.log("[Pool Balance] error",s)}finally{A.value=!1}}},500);setInterval(E,6e4);function P(s){u.value=s,console.log("setTokenSwap ========================== ",u.value)}M([h,()=>o.from.mint,()=>o.to.mint],async()=>{if(console.log("tokenSwapsAll ================: ",h.value),console.log("from.mint ================: ",o.from.mint),console.log("to.mint ================: ",o.to.mint),h.value&&o.from.mint&&o.to.mint&&o.from.mint!==o.to.mint)if(g.value=h.value.filter(s=>{const k=s.data?.tokenAMint.toBase58(),S=s.data?.tokenBMint.toBase58();return k===o.from.mint&&S===o.to.mint||k===o.to.mint&&S===o.from.mint}),g.value.length){if(g.value.length>1){const s=g.value.find(k=>e.state.certificates?.find(S=>S.data?.policy.toBase58()===k.data.policy?.toBase58()));s&&(u.value=s)}u.value=g.value[0]}else u.value=void 0;else g.value=[],u.value=void 0,e.setContractPolicy(""),o.poolBalance={}},{immediate:!0}),M([u],async()=>{console.log("Token SWAP: ",u.value),e.setContractPolicy(u.value?.data.policy?.toBase58()??""),u.value&&E()},{immediate:!0});function B(){o.loading=!1,o.slippageDialog=!1,o.status=void 0,o.poolBalance={},o.poolTokenSupply=0}M([()=>o.from.amount,()=>o.poolBalance],async()=>{const s=Number(o.from.amount??0),k=Ce(Number(o.poolBalance[o.from.mint]??0),o.from.decimals),S=Ce(Number(o.poolBalance[o.to.mint]??0),o.to.decimals);if(s===0||Number.isNaN(s)){o.to.amount=0,o.rate=S/k,o.impact=0,o.minimumReceived=0;return}const W=S-k*S/(k+s);o.rate=s?W/s:S/k,o.to.amount=W?Number(it(W*(1-o.fees.ownerTrade-o.fees.trade),o.to.decimals)):0,o.impact=s?1-W/s/(S/k):0,o.minimumReceived=_(o.to.amount-o.to.amount*o.slippage,o.to.decimals)},{immediate:!0});async function Ae(){if(!e.certificateValid)return st();if(!u.value||!c.value){console.log("TokenSwap is not initialized...");return}n.value.publicKey||i({type:"info",message:"Please connect your wallet first"});const k=Number(_(o.from.amount??0,o.from.decimals)),S=Number(_(e.tokenBalance(o.from.mint)??0,o.from.decimals)),W=Number(_(o.to.amount??0,o.to.decimals));if(k>S){i({type:"negative",message:"Insufficient balance."});return}try{o.swapping=!0;const Te=o.direction===0?u.value.data.tokenAMint:u.value.data.tokenBMint,Ie=o.direction===0?u.value.data.tokenBMint:u.value.data.tokenAMint,We=o.direction===0?u.value.data.tokenA:u.value.data.tokenB,Me=o.direction===0?u.value.data.tokenB:u.value.data.tokenA,xe=await Oe(Te,n.value.publicKey),Pe=await Oe(Ie,n.value.publicKey),De=k;console.log("toAmount = ",W),console.log("slippage = ",o.slippage),console.log("slippage 2 = ",W*o.slippage);const ze=l.value.swapAuthority(u.value.pubkey);console.log("proofRequest = ",e.certificate?.pubkey.toBase58()),console.log("swapAuthority = ",ze),console.log("tokenSwap = ",u.value.pubkey.toBase58()),console.log("userSource = ",xe.toBase58()),console.log("userDestination = ",Pe.toBase58()),console.log("poolSource = ",We.toBase58()),console.log("poolDestination = ",Me.toBase58()),console.log("poolMint = ",u.value.data.poolMint.toBase58()),console.log("poolFee = ",u.value.data.poolFeeAccount.toBase58()),console.log("amountIn = ",De),console.log("minimumAmountOut = ",o.minimumReceived),await l.value.swap({proofRequest:e.certificate?.pubkey,authority:ze,tokenSwap:u.value.pubkey,userSource:xe,userDestination:Pe,poolSource:We,poolDestination:Me,poolMint:u.value.data.poolMint,poolFee:u.value.data.poolFeeAccount,amountIn:De,minimumAmountOut:o.minimumReceived,receiver:c.value,destinationTokenMint:Ie},{commitment:"confirmed"}),Fe()}catch(Te){console.log(Te)}finally{o.swapping=!1}}function R(){const{from:s,to:k}=o;o.rate=0,o.to={...s,amount:void 0},o.from={...k,amount:void 0},o.direction=o.direction===0?1:0}function K(){o.slippageDialog=!0}function Je(){o.slippageDialog=!1}function je(s){o.from.amount=s}function Fe(){E(),o.from.amount=void 0,o.to.amount=void 0}M(()=>n.value?.publicKey,s=>{s||Fe()}),M(()=>o.to,s=>{s.amount&&(s.amount=void 0)});function Ee(s){return{host:L(s.fees.hostFeeNumerator,s.fees.hostFeeDenominator),trade:L(s.fees.tradeFeeNumerator,s.fees.tradeFeeDenominator),ownerTrade:L(s.fees.ownerTradeFeeNumerator,s.fees.ownerTradeFeeDenominator),ownerWithdraw:L(s.fees.ownerWithdrawFeeNumerator,s.fees.ownerWithdrawFeeDenominator)}}return M(u,s=>{if(!s)return;const k=Ee(s.data);o.fees.host=k.host,o.fees.trade=k.trade,o.fees.ownerTrade=k.ownerTrade,o.fees.ownerWithdraw=k.ownerWithdraw,console.log("fees ==== ",o.fees)}),{state:o,tokenSwapsAll:h,tokenSwaps:g,tokenSwap:u,swapClient:l,loadingPoolTokens:A,loadPoolTokenAccounts:E,setTokenSwap:P,setMax:je,closeSlippage:Je,openSlippage:K,changeDirection:R,swapSubmit:Ae,getPoolFee:Ee}}),$t={class:"pool-card__subtitle row justify-center items-center"},Gt={class:"pool-card__icons row justify-center q-mt-xs"},Xt=["src","alt"],Yt=["src","alt"],Zt={class:"q-mt-md row justify-center"},Ht={key:0,class:"row q-mt-md"},eo={class:"col"},to={class:"row items-center"},oo={class:"pool-card__pubkey monoscaped"},no={class:"row items-center"},ro={class:"pool-card__pubkey monoscaped"},ao={class:"row items-center"},io={class:"pool-card__pubkey monoscaped"},so={class:"row items-center q-mt-xs"},co={class:"pool-card__pubkey"},po=ct({__name:"PoolsListItem",props:{pubkey:Object,data:Object,useEmit:Boolean},emits:["selectPool"],setup(t){const e=t,n=ut(),c=x(()=>n.tokens),i=x(()=>c.value.find(B=>B.mint===e.data?.tokenAMint.toBase58())),l=x(()=>c.value.find(B=>B.mint===e.data?.tokenBMint.toBase58())),h=qe(),g=x(()=>h.servicePolicy.find(B=>B.pubkey.toBase58()===e.data?.policy?.toBase58())),u=jt(),o=lt();async function F(){i.value&&l.value&&e.pubkey&&e.data&&(u.state.from=i.value,u.state.to=l.value,await o.push("/swap"),u.setTokenSwap({pubkey:e.pubkey,data:e.data}),console.log("[swap] swapAction: ",e.pubkey.toBase58()))}const A=x(()=>e.data?u.getPoolFee(e.data):{}),E=x(()=>A.value.ownerTrade+A.value.trade),P=q(!1);return(B,I)=>{const Ae=bt,R=yt;return t.pubkey&&t.data&&w(i)&&w(l)?(U(),pt(Ke,{key:0,class:"pool-card",onClick:I[2]||(I[2]=K=>t.useEmit?B.$emit("selectPool"):void 0)},{default:O(()=>[b(dt,{class:"pool-card__body"},{default:O(()=>[y("div",$t,[y("span",null,z(w(i)?.symbol)+" / "+z(w(l)?.symbol),1),y("span",{class:"policy-info q-ml-md",onClick:I[0]||(I[0]=K=>P.value=!0)}," i ")]),y("div",Gt,[w(i)?.image?(U(),be("img",{key:0,src:w(i)?.image,alt:w(i)?.symbol},null,8,Xt)):V("",!0),w(l)?.image?(U(),be("img",{key:1,src:w(l)?.image,alt:w(l)?.symbol},null,8,Yt)):V("",!0)]),y("div",Zt,[b(Ae,{"required-policy":t.data.policy?.toBase58(),"required-policy-data":w(g)?.data},null,8,["required-policy","required-policy-data"])]),t.useEmit?V("",!0):(U(),be("div",Ht,[y("div",eo,[b(mt,{spread:""},{default:O(()=>[b(Re,{disable:"",label:"ADD LIQUIDITY",color:"warning","text-color":"#282828",target:"_blank",onClick:F}),b(Re,{label:"SWAP",color:"info","text-color":"white",target:"_blank",onClick:F})]),_:1})])]))]),_:1}),b(kt,{modelValue:w(P),"onUpdate:modelValue":I[1]||(I[1]=K=>ft(P)?P.value=K:null),"transition-duration":"100","transition-show":"fade","transition-hide":"fade"},{default:O(()=>[b(Ke,{class:"q-pa-md"},{default:O(()=>[y("div",to,[Q(" Pool address:  "),y("span",null,[y("span",oo,z(w(ve)(t.pubkey.toBase58())),1),b(R,{text:t.pubkey.toBase58()},null,8,["text"])])]),y("div",no,[Q(" Token A mint:  "),y("span",null,[y("span",ro,z(w(ve)(t.data.tokenAMint.toBase58())),1),b(R,{text:t.data.tokenAMint.toBase58()},null,8,["text"])])]),y("div",ao,[Q(" Token B mint:  "),y("span",null,[y("span",io,z(w(ve)(t.data.tokenBMint.toBase58())),1),b(R,{text:t.data.tokenBMint.toBase58()},null,8,["text"])])]),y("div",so,[Q(" Pool fee:  "),y("span",co,z(w(wt).format(w(E))),1)])]),_:1})]),_:1},8,["modelValue"])]),_:1})):V("",!0)}}});export{po as _,Ue as t,jt as u};