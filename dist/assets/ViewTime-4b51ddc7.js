import{_ as f,a as N}from"./UnitValue-fd4836e8.js";import{i as s,r as V,a as D,w as l,o as F,b as L,c as I,d as x,e as K,f as v,t as O,g as m,_ as $}from"./index-db5bb53c.js";const j={class:"component-wrapper"},z={class:"display-container"},G={class:"bg-text"},J={class:"dropdown-container"},P={class:"dropdown-container"},ee={__name:"ViewTime",setup(Q){const T=s("appendNumber");s("removeCommas");const _=s("clearAll"),M=s("clearChars"),C=s("listenForKeyboardInputs"),A=s("removeListenerForKeyboardInputs"),S=s("showRippleEffectOnButtons"),u=s("storeConverterDataLocally"),B=s("getStoredConverterData"),b=s("convertTopUnitToBottomEquiv"),q=s("convertBottomUnitToTopEquiv"),d=s("convertResultToExponential"),g=s("setNumberOfFractionDigits"),k=s("adjustCalculatorHeight"),E=V(null),i=D({topUnit:"",bottomUnit:""}),U=V({year:{shortName:"y",longName:"Year y"},week:{shortName:"wk",longName:"Week wk"},day:{shortName:"d",longName:"Day d"},hour:{shortName:"h",longName:"Hour h"},minute:{shortName:"min",longName:"Minute min"},second:{shortName:"s",longName:"Second s"},millisecond:{shortName:"ms",longName:"Millisecond ms"}}),e=D({name:"timeData",topActiveUnit:"y",bottomActiveUnit:"wk",topUnitName:"Year",bottomUnitName:"Week",hasConvertedToTopEquiv:!1,hasConvertedToBottomEquiv:!1,topUnitValue:"",bottomUnitValue:"",activeDropdown:"top",defaultResult:0}),n={oneYear:{yearEquiv:1,weekEquiv:52.1428571,dayEquiv:365,hourEquiv:8760,minuteEquiv:525600,secondEquiv:31536e3,millisecondEquiv:31536e6},oneWeek:{weekEquiv:1,yearEquiv:.0191780822,dayEquiv:7,hourEquiv:168,minuteEquiv:10080,secondEquiv:604800,millisecondEquiv:6048e5},oneDay:{dayEquiv:1,yearEquiv:.00273972603,weekEquiv:.142857143,hourEquiv:24,minuteEquiv:1440,secondEquiv:86400,millisecondEquiv:864e5},oneHour:{hourEquiv:1,yearEquiv:.000114155251,weekEquiv:.00595238095,dayEquiv:.0416666667,minuteEquiv:60,secondEquiv:3600,millisecondEquiv:36e5},oneMinute:{minuteEquiv:1,yearEquiv:190258752e-13,weekEquiv:.000992063492,dayEquiv:.000694444444,hourEquiv:.0166666667,secondEquiv:60,millisecondEquiv:6e4},oneSecond:{secondEquiv:1,yearEquiv:31709792e-14,weekEquiv:165343915e-13,dayEquiv:.000115740741,hourEquiv:.000277777778,minuteEquiv:.166666667,millisecondEquiv:1e3},oneMillisecond:{millisecondEquiv:1,yearEquiv:31709792e-17,weekEquiv:165343915e-16,dayEquiv:115740741e-15,hourEquiv:277777778e-14,minuteEquiv:.000166666667,secondEquiv:.001}};l(()=>e.topActiveUnit,a=>{switch(a){case"wk":e.topUnitName="Week";break;case"d":e.topUnitName="Day";break;case"h":e.topUnitName="Hour";break;case"min":e.topUnitName="Minute";break;case"s":e.topUnitName="Second";break;case"ms":e.topUnitName="Millisecond";break;default:e.topUnitName="Year";break}!e.topUnitValue&&!e.bottomUnitValue||(e.activeDropdown==="top"?(e.bottomUnitValue=b(e,e.topUnitValue,c),e.hasConvertedToTopEquiv=!0):(e.topUnitValue=q(e,e.bottomUnitValue,c),e.hasConvertedToBottomEquiv=!0),d(e),u(e,i))}),l(()=>e.bottomActiveUnit,a=>{switch(a){case"y":e.bottomUnitName="Year";break;case"d":e.bottomUnitName="Day";break;case"h":e.bottomUnitName="Hour";break;case"min":e.bottomUnitName="Minute";break;case"s":e.bottomUnitName="Second";break;case"ms":e.bottomUnitName="Millisecond";break;default:e.bottomUnitName="Week";break}!e.topUnitValue&&!e.bottomUnitValue||(e.activeDropdown==="bottom"?(e.topUnitValue=q(e,e.bottomUnitValue,c),e.hasConvertedToBottomEquiv=!0):(e.bottomUnitValue=b(e,e.topUnitValue,c),e.hasConvertedToTopEquiv=!0),d(e),u(e,i))}),l(()=>e.topUnitValue,a=>{e.hasConvertedToBottomEquiv||(e.bottomUnitValue=b(e,a,c),d(e),u(e,i))}),l(()=>e.bottomUnitValue,a=>{e.hasConvertedToTopEquiv||(e.topUnitValue=q(e,a,c),d(e),u(e,i))}),l(()=>e.activeDropdown,a=>{e.hasConvertedToTopEquiv=!1,e.hasConvertedToBottomEquiv=!1,i.topUnit="",i.bottomUnit="",u(e,i)}),F(()=>{localStorage&&B(e,i)}),L(()=>{C(e,i,E),S(E),e.topUnitValue===""&&e.bottomUnitValue===""&&h(1),window.addEventListener("resize",k),k()}),I(()=>{A(e,i,E),window.removeEventListener("resize",k)});const h=a=>{T(a,e,i)},c=(a,w)=>{let o,p,r,t;switch(o=w,a==="top"?(p=e.bottomActiveUnit,r=e.topActiveUnit):(p=e.topActiveUnit,r=e.bottomActiveUnit),p){case"wk":switch(r){case"y":t=n.oneYear.weekEquiv*o;break;case"d":t=n.oneDay.weekEquiv*o;break;case"h":t=n.oneHour.weekEquiv*o;break;case"min":t=n.oneMinute.weekEquiv*o;break;case"s":t=n.oneSecond.weekEquiv*o;break;case"ms":t=n.oneMillisecond.weekEquiv*o;break;default:t=n.oneWeek.weekEquiv*o;break}break;case"y":switch(r){case"y":t=n.oneYear.yearEquiv*o;break;case"d":t=n.oneDay.yearEquiv*o;break;case"h":t=n.oneHour.yearEquiv*o;break;case"min":t=n.oneMinute.yearEquiv*o;break;case"s":t=n.oneSecond.yearEquiv*o;break;case"ms":t=n.oneMillisecond.yearEquiv*o;break;default:t=n.oneWeek.yearEquiv*o;break}break;case"d":switch(r){case"y":t=n.oneYear.dayEquiv*o;break;case"d":t=n.oneDay.dayEquiv*o;break;case"h":t=n.oneHour.dayEquiv*o;break;case"min":t=n.oneMinute.dayEquiv*o;break;case"s":t=n.oneSecond.dayEquiv*o;break;case"ms":t=n.oneMillisecond.dayEquiv*o;break;default:t=n.oneWeek.dayEquiv*o;break}break;case"h":switch(r){case"y":t=n.oneYear.hourEquiv*o;break;case"d":t=n.oneDay.hourEquiv*o;break;case"h":t=n.oneHour.hourEquiv*o;break;case"min":t=n.oneMinute.hourEquiv*o;break;case"s":t=n.oneSecond.hourEquiv*o;break;case"ms":t=n.oneMillisecond.hourEquiv*o;break;default:t=n.oneWeek.hourEquiv*o;break}break;case"min":switch(r){case"y":t=n.oneYear.minuteEquiv*o;break;case"d":t=n.oneDay.minuteEquiv*o;break;case"h":t=n.oneHour.minuteEquiv*o;break;case"min":t=n.oneMinute.minuteEquiv*o;break;case"s":t=n.oneSecond.minuteEquiv*o;break;case"ms":t=n.oneMillisecond.minuteEquiv*o;break;default:t=n.oneWeek.minuteEquiv*o;break}break;case"s":switch(r){case"y":t=n.oneYear.secondEquiv*o;break;case"d":t=n.oneDay.secondEquiv*o;break;case"h":t=n.oneHour.secondEquiv*o;break;case"min":t=n.oneMinute.secondEquiv*o;break;case"s":t=n.oneSecond.secondEquiv*o;break;case"ms":t=n.oneMillisecond.secondEquiv*o;break;default:t=n.oneWeek.secondEquiv*o;break}break;case"ms":switch(r){case"y":t=n.oneYear.millisecondEquiv*o;break;case"d":t=n.oneDay.millisecondEquiv*o;break;case"h":t=n.oneHour.millisecondEquiv*o;break;case"min":t=n.oneMinute.millisecondEquiv*o;break;case"s":t=n.oneSecond.millisecondEquiv*o;break;case"ms":t=n.oneMillisecond.millisecondEquiv*o;break;default:t=n.oneWeek.millisecondEquiv*o;break}break}return g(t)},y=a=>{e.activeDropdown=a},H=a=>{e.topActiveUnit=a,u(e,i)},W=a=>{e.bottomActiveUnit=a,u(e,i)},Y=()=>{!e.topUnitValue&&!e.bottomUnitValue||_(e,i)},R=()=>{!e.topUnitValue&&!e.bottomUnitValue||M(e,i)};return(a,w)=>(x(),K("div",j,[v("div",z,[v("div",G,[v("span",null,O(a.$route.name),1)]),v("div",J,[m(f,{"calc-units":U.value,"active-unit":e.topActiveUnit,onSetActiveUnit:H},null,8,["calc-units","active-unit"]),m(N,{"dropdown-owner":"top","converter-data":e,onSetActiveDropdown:y},null,8,["converter-data"])]),v("div",P,[m(f,{"calc-units":U.value,"active-unit":e.bottomActiveUnit,onSetActiveUnit:W},null,8,["calc-units","active-unit"]),m(N,{"dropdown-owner":"bottom","converter-data":e,onSetActiveDropdown:y},null,8,["converter-data"])])]),v("div",{class:"buttons-container",ref_key:"buttonsContainerRef",ref:E},[m($,{onAppendNumber:h,onClear:Y,onBackspace:R})],512)]))}};export{ee as default};