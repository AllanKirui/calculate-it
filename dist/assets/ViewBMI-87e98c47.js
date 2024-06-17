import{_ as I,a as B}from"./UnitValue-fd4836e8.js";import{i as a,r as p,a as E,w as v,o as W,b as X,c as J,d as _,e as x,f as n,t as k,g as h,h as Q,j as Y,n as Z,_ as tt}from"./index-db5bb53c.js";const et={class:"component-wrapper"},nt={class:"display-container"},ot={class:"bg-text"},at={key:1},st={class:"px-8 py-4"},it={class:"flex justify-center items-center gap-3 pb-2 border-b-4 border-sandy-brown"},ct={class:"text-6xl"},lt={class:"flex flex-col items-center"},rt=n("span",{class:"text-3xl"},"BMI",-1),ut={class:"text-sm"},mt=Y('<div><h3 class="hidden md:block mt-3 text-xl text-center">Information</h3><div class="mt-5 flex text-center text-sm"><span class="w-5/6">Underweight</span><span class="w-full">Normal</span><span class="w-5/6">Overweight</span></div><div class="mt-3 flex"><span class="h-2 w-5/6 bg-mellow-apricot"></span><span class="h-2 w-full bg-mango-tango"></span><span class="h-2 w-5/6 bg-liver"></span></div><div class="mt-2 flex"><span class="w-5/6">16.0</span><span class="w-full">18.5</span><span class="w-5/6">25.0</span><span>40.0</span></div></div>',1),dt=n("p",{class:"mt-2 text-center text-xs"},"Powered by Calculate It!",-1),pt={key:2,class:"flex flex-col justify-end"},vt=n("p",null,"Oops! Something went wrong.",-1),ht=n("p",null,"Please check your units and retry.",-1),bt=n("p",{class:"mt-2 text-center text-xs"},"Powered by Calculate It!",-1),Ut={__name:"ViewBMI",setup(ft){const M=a("appendNumber");a("removeCommas");const D=a("clearAll"),F=a("clearChars"),R=a("listenForKeyboardInputs"),S=a("removeListenerForKeyboardInputs"),N=a("showRippleEffectOnButtons"),r=a("storeConverterDataLocally"),L=a("getStoredConverterData"),C=a("adjustCalculatorHeight"),u=p(null),i=p(!1),c=p(!1),b=p(null),V=p(null),o=E({topUnit:"",bottomUnit:""}),K=["Kilograms","Pounds"],q=["Centimeters","Meters","Feet","Inches"],f={weight:{oneKilo:{poundEquiv:2.20462262}},height:{oneCentimeter:{inchEquiv:.393700787},oneMeter:{inchEquiv:39.3700787},oneFoot:{inchEquiv:12}}},t=E({name:"bmiData",topActiveUnit:"Kilograms",bottomActiveUnit:"Centimeters",topUnitName:"Kilograms",bottomUnitName:"Centimeters",topUnitValue:"",bottomUnitValue:"",activeDropdown:"top",defaultResult:0});v(()=>t.topActiveUnit,e=>{switch(e){case"Pounds":t.topUnitName="Pounds";break;default:t.topUnitName="Kilograms";break}r(t,o)}),v(()=>t.bottomActiveUnit,e=>{switch(e){case"Meters":t.bottomUnitName="Meters";break;case"Feet":t.bottomUnitName="Feet";break;case"Inches":t.bottomUnitName="Inches";break;default:t.bottomUnitName="Centimeters";break}r(t,o)}),v(()=>t.topUnitValue,e=>{e||w(0),r(t,o)}),v(()=>t.bottomUnitValue,e=>{e||w(0),r(t,o)}),v(()=>t.activeDropdown,e=>{o.topUnit="",o.bottomUnit="",r(t,o)}),W(()=>{localStorage&&L(t,o)}),X(()=>{R(t,o,u),N(u),t.topUnitValue===""&&t.bottomUnitValue===""&&w(0),window.addEventListener("resize",C),C()}),J(()=>{S(t,o,u),window.removeEventListener("resize",C)});const w=e=>{T(o,t.activeDropdown)||M(e,t,o)},T=(e,U)=>{let m;return U==="top"?m=e.topUnit:m=e.bottomUnit,m.length+1>3},y=e=>{t.activeDropdown=e},O=e=>{t.topActiveUnit=e},j=e=>{t.bottomActiveUnit=e},H=()=>{!t.topUnitValue&&!t.bottomUnitValue||D(t,o)},P=()=>{!t.topUnitValue&&!t.bottomUnitValue||F(t,o)},G=()=>{if(t.topUnitValue===""||t.bottomUnitValue===""){i.value=!1,c.value=!0;return}const e=18.5,U=25,A=50,m=0;let d,s,l;const $=t.topActiveUnit,z=t.bottomActiveUnit;switch($){case"Kilograms":d=t.topUnitValue*f.weight.oneKilo.poundEquiv;break;default:d=t.topUnitValue;break}switch(z){case"Centimeters":s=t.bottomUnitValue*f.height.oneCentimeter.inchEquiv;break;case"Meters":s=t.bottomUnitValue*f.height.oneMeter.inchEquiv;break;case"Feet":s=t.bottomUnitValue*f.height.oneFoot.inchEquiv;break;default:s=t.bottomUnitValue;break}if(d=d.toLocaleString("en",{maximumFractionDigits:7}),s=s.toLocaleString("en",{maximumFractionDigits:7}),l=d*(703/(s*s)),isNaN(l)&&(l=0),l<m||l>A){i.value=!1,c.value=!0;return}b.value=l.toLocaleString("en",{maximumFractionDigits:1}),i.value=!0,c.value=!1,V.value=+b.value<e?"Underweight":+b.value>U?"Overweight":"Normal"},g=()=>{i.value=!1,c.value=!1,Z(()=>N(u))};return(e,U)=>(_(),x("div",et,[n("div",nt,[n("div",ot,[n("span",null,k(e.$route.name),1)]),n("div",{onClick:g,class:"dropdown-container"},[h(I,{"calc-units":K,"unit-type":"Weight","active-unit":t.topActiveUnit,onSetActiveUnit:O},null,8,["active-unit"]),h(B,{"dropdown-owner":"top","converter-data":t,onSetActiveDropdown:y},null,8,["converter-data"])]),n("div",{onClick:g,class:"dropdown-container"},[h(I,{"calc-units":q,"unit-type":"Height","active-unit":t.bottomActiveUnit,onSetActiveUnit:j},null,8,["active-unit"]),h(B,{"dropdown-owner":"bottom","converter-data":t,onSetActiveDropdown:y},null,8,["converter-data"])])]),!i.value&&!c.value?(_(),x("div",{key:0,class:"buttons-container",ref_key:"buttonsContainerRef",ref:u},[h(tt,{mode:"bmi",onAppendNumber:w,onClear:H,onBackspace:P,onCalculateBMI:G})],512)):i.value&&!c.value?(_(),x("div",at,[n("div",st,[n("div",it,[n("h2",ct,k(b.value),1),n("div",lt,[rt,n("span",ut,k(V.value),1)])]),mt,n("button",{onClick:g,class:"w-full mt-4 p-2 bg-neon-carrot text-seal-brown rounded-md"}," Close "),dt])])):!i.value&&c.value?(_(),x("div",pt,[n("div",{class:"px-8 py-4 text-center"},[vt,ht,n("button",{onClick:g,class:"w-full mt-4 p-2 bg-neon-carrot text-seal-brown rounded-md"}," Close "),bt])])):Q("",!0)]))}};export{Ut as default};
