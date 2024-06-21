import{k as fe,l as pe,F as H,i as te,p as ne,r as g,b as V,m as N,n as E,q as x,s as $,u as ve,d as D,e as A,f as I,w as me,v as X,x as O,y as P,g as T,z as be,t as F,T as he,A as we,B as ge,C as re}from"./index-e31e3277.js";function R(e,t,...r){if(e in t){let n=t[e];return typeof n=="function"?n(...r):n}let a=new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map(n=>`"${n}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(a,R),a}var U=(e=>(e[e.None=0]="None",e[e.RenderStrategy=1]="RenderStrategy",e[e.Static=2]="Static",e))(U||{}),ye=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(ye||{});function L({visible:e=!0,features:t=0,ourProps:r,theirProps:a,...n}){var l;let o=oe(a,r),i=Object.assign(n,{props:o});if(e||t&2&&o.static)return j(i);if(t&1){let f=(l=o.unmount)==null||l?0:1;return R(f,{0(){return null},1(){return j({...n,props:{...o,hidden:!0,style:{display:"none"}}})}})}return j(i)}function j({props:e,attrs:t,slots:r,slot:a,name:n}){var l,o;let{as:i,...f}=Ie(e,["unmount","static"]),c=(l=r.default)==null?void 0:l.call(r,a),u={};if(a){let m=!1,p=[];for(let[v,d]of Object.entries(a))typeof d=="boolean"&&(m=!0),d===!0&&p.push(v);m&&(u["data-headlessui-state"]=p.join(" "))}if(i==="template"){if(c=ae(c??[]),Object.keys(f).length>0||Object.keys(t).length>0){let[m,...p]=c??[];if(!xe(m)||p.length>0)throw new Error(['Passing props on "template"!',"",`The current component <${n} /> is rendering a "template".`,"However we need to passthrough the following props:",Object.keys(f).concat(Object.keys(t)).map(s=>s.trim()).filter((s,h,S)=>S.indexOf(s)===h).sort((s,h)=>s.localeCompare(h)).map(s=>`  - ${s}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',"Render a single element as the child so that we can forward the props onto that element."].map(s=>`  - ${s}`).join(`
`)].join(`
`));let v=oe((o=m.props)!=null?o:{},f),d=fe(m,v);for(let s in v)s.startsWith("on")&&(d.props||(d.props={}),d.props[s]=v[s]);return d}return Array.isArray(c)&&c.length===1?c[0]:c}return pe(i,Object.assign({},f,u),{default:()=>c})}function ae(e){return e.flatMap(t=>t.type===H?ae(t.children):[t])}function oe(...e){if(e.length===0)return{};if(e.length===1)return e[0];let t={},r={};for(let a of e)for(let n in a)n.startsWith("on")&&typeof a[n]=="function"?(r[n]!=null||(r[n]=[]),r[n].push(a[n])):t[n]=a[n];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(r).map(a=>[a,void 0])));for(let a in r)Object.assign(t,{[a](n,...l){let o=r[a];for(let i of o){if(n instanceof Event&&n.defaultPrevented)return;i(n,...l)}}});return t}function Ie(e,t=[]){let r=Object.assign({},e);for(let a of t)a in r&&delete r[a];return r}function xe(e){return e==null?!1:typeof e.type=="string"||typeof e.type=="object"||typeof e.type=="function"}let Se=0;function Ee(){return++Se}function W(){return Ee()}var w=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(w||{});function De(e){throw new Error("Unexpected object: "+e)}var y=(e=>(e[e.First=0]="First",e[e.Previous=1]="Previous",e[e.Next=2]="Next",e[e.Last=3]="Last",e[e.Specific=4]="Specific",e[e.Nothing=5]="Nothing",e))(y||{});function Oe(e,t){let r=t.resolveItems();if(r.length<=0)return null;let a=t.resolveActiveIndex(),n=a??-1,l=(()=>{switch(e.focus){case 0:return r.findIndex(o=>!t.resolveDisabled(o));case 1:{let o=r.slice().reverse().findIndex((i,f,c)=>n!==-1&&c.length-f-1>=n?!1:!t.resolveDisabled(i));return o===-1?o:r.length-1-o}case 2:return r.findIndex((o,i)=>i<=n?!1:!t.resolveDisabled(o));case 3:{let o=r.slice().reverse().findIndex(i=>!t.resolveDisabled(i));return o===-1?o:r.length-1-o}case 4:return r.findIndex(o=>t.resolveId(o)===e.id);case 5:return null;default:De(e)}})();return l===-1?a:l}function b(e){var t;return e==null||e.value==null?null:(t=e.value.$el)!=null?t:e.value}let le=Symbol("Context");var M=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(M||{});function Pe(){return te(le,null)}function Te(e){ne(le,e)}function Y(e,t){if(e)return e;let r=t??"button";if(typeof r=="string"&&r.toLowerCase()==="button")return"button"}function Me(e,t){let r=g(Y(e.value.type,e.value.as));return V(()=>{r.value=Y(e.value.type,e.value.as)}),N(()=>{var a;r.value||b(t)&&b(t)instanceof HTMLButtonElement&&!((a=b(t))!=null&&a.hasAttribute("type"))&&(r.value="button")}),r}var Ne=Object.defineProperty,ke=(e,t,r)=>t in e?Ne(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Q=(e,t,r)=>(ke(e,typeof t!="symbol"?t+"":t,r),r);class Ae{constructor(){Q(this,"current",this.detect()),Q(this,"currentId",0)}set(t){this.current!==t&&(this.currentId=0,this.current=t)}reset(){this.set(this.detect())}nextId(){return++this.currentId}get isServer(){return this.current==="server"}get isClient(){return this.current==="client"}detect(){return typeof window>"u"||typeof document>"u"?"server":"client"}}let K=new Ae;function q(e){if(K.isServer)return null;if(e instanceof Node)return e.ownerDocument;if(e!=null&&e.hasOwnProperty("value")){let t=b(e);if(t)return t.ownerDocument}return document}function Fe({container:e,accept:t,walk:r,enabled:a}){N(()=>{let n=e.value;if(!n||a!==void 0&&!a.value)return;let l=q(e);if(!l)return;let o=Object.assign(f=>t(f),{acceptNode:t}),i=l.createTreeWalker(n,NodeFilter.SHOW_ELEMENT,o,!1);for(;i.nextNode();)r(i.currentNode)})}let _=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var B=(e=>(e[e.First=1]="First",e[e.Previous=2]="Previous",e[e.Next=4]="Next",e[e.Last=8]="Last",e[e.WrapAround=16]="WrapAround",e[e.NoScroll=32]="NoScroll",e))(B||{}),$e=(e=>(e[e.Error=0]="Error",e[e.Overflow=1]="Overflow",e[e.Success=2]="Success",e[e.Underflow=3]="Underflow",e))($e||{}),Re=(e=>(e[e.Previous=-1]="Previous",e[e.Next=1]="Next",e))(Re||{});function ue(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(_)).sort((t,r)=>Math.sign((t.tabIndex||Number.MAX_SAFE_INTEGER)-(r.tabIndex||Number.MAX_SAFE_INTEGER)))}var z=(e=>(e[e.Strict=0]="Strict",e[e.Loose=1]="Loose",e))(z||{});function G(e,t=0){var r;return e===((r=q(e))==null?void 0:r.body)?!1:R(t,{0(){return e.matches(_)},1(){let a=e;for(;a!==null;){if(a.matches(_))return!0;a=a.parentElement}return!1}})}function ie(e){let t=q(e);E(()=>{t&&!G(t.activeElement,0)&&Ce(e)})}var Le=(e=>(e[e.Keyboard=0]="Keyboard",e[e.Mouse=1]="Mouse",e))(Le||{});typeof window<"u"&&typeof document<"u"&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="")},!0),document.addEventListener("click",e=>{e.detail===1?delete document.documentElement.dataset.headlessuiFocusVisible:e.detail===0&&(document.documentElement.dataset.headlessuiFocusVisible="")},!0));function Ce(e){e==null||e.focus({preventScroll:!0})}let je=["textarea","input"].join(",");function Ue(e){var t,r;return(r=(t=e==null?void 0:e.matches)==null?void 0:t.call(e,je))!=null?r:!1}function se(e,t=r=>r){return e.slice().sort((r,a)=>{let n=t(r),l=t(a);if(n===null||l===null)return 0;let o=n.compareDocumentPosition(l);return o&Node.DOCUMENT_POSITION_FOLLOWING?-1:o&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function _e(e,t){return Be(ue(),t,{relativeTo:e})}function Be(e,t,{sorted:r=!0,relativeTo:a=null,skipElements:n=[]}={}){var l;let o=(l=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e==null?void 0:e.ownerDocument)!=null?l:document,i=Array.isArray(e)?r?se(e):e:ue(e);n.length>0&&i.length>1&&(i=i.filter(d=>!n.includes(d))),a=a??o.activeElement;let f=(()=>{if(t&5)return 1;if(t&10)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),c=(()=>{if(t&1)return 0;if(t&2)return Math.max(0,i.indexOf(a))-1;if(t&4)return Math.max(0,i.indexOf(a))+1;if(t&8)return i.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),u=t&32?{preventScroll:!0}:{},m=0,p=i.length,v;do{if(m>=p||m+p<=0)return 0;let d=c+m;if(t&16)d=(d+p)%p;else{if(d<0)return 3;if(d>=p)return 1}v=i[d],v==null||v.focus(u),m+=f}while(v!==o.activeElement);return t&6&&Ue(v)&&v.select(),2}function k(e,t,r){K.isServer||N(a=>{document.addEventListener(e,t,r),a(()=>document.removeEventListener(e,t,r))})}function He(e,t,r){K.isServer||N(a=>{window.addEventListener(e,t,r),a(()=>window.removeEventListener(e,t,r))})}function Ve(e,t,r=x(()=>!0)){function a(l,o){if(!r.value||l.defaultPrevented)return;let i=o(l);if(i===null||!i.getRootNode().contains(i))return;let f=function c(u){return typeof u=="function"?c(u()):Array.isArray(u)||u instanceof Set?u:[u]}(e);for(let c of f){if(c===null)continue;let u=c instanceof HTMLElement?c:b(c);if(u!=null&&u.contains(i)||l.composed&&l.composedPath().includes(u))return}return!G(i,z.Loose)&&i.tabIndex!==-1&&l.preventDefault(),t(l,i)}let n=g(null);k("pointerdown",l=>{var o,i;r.value&&(n.value=((i=(o=l.composedPath)==null?void 0:o.call(l))==null?void 0:i[0])||l.target)},!0),k("mousedown",l=>{var o,i;r.value&&(n.value=((i=(o=l.composedPath)==null?void 0:o.call(l))==null?void 0:i[0])||l.target)},!0),k("click",l=>{n.value&&(a(l,()=>n.value),n.value=null)},!0),k("touchend",l=>a(l,()=>l.target instanceof HTMLElement?l.target:null),!0),He("blur",l=>a(l,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}function J(e){return[e.screenX,e.screenY]}function We(){let e=g([-1,-1]);return{wasMoved(t){let r=J(t);return e.value[0]===r[0]&&e.value[1]===r[1]?!1:(e.value=r,!0)},update(t){e.value=J(t)}}}let Z=/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;function ee(e){var t,r;let a=(t=e.innerText)!=null?t:"",n=e.cloneNode(!0);if(!(n instanceof HTMLElement))return a;let l=!1;for(let i of n.querySelectorAll('[hidden],[aria-hidden],[role="img"]'))i.remove(),l=!0;let o=l?(r=n.innerText)!=null?r:"":a;return Z.test(o)&&(o=o.replace(Z,"")),o}function Ke(e){let t=e.getAttribute("aria-label");if(typeof t=="string")return t.trim();let r=e.getAttribute("aria-labelledby");if(r){let a=r.split(" ").map(n=>{let l=document.getElementById(n);if(l){let o=l.getAttribute("aria-label");return typeof o=="string"?o.trim():ee(l).trim()}return null}).filter(Boolean);if(a.length>0)return a.join(", ")}return ee(e).trim()}function qe(e){let t=g(""),r=g("");return()=>{let a=b(e);if(!a)return"";let n=a.innerText;if(t.value===n)return r.value;let l=Ke(a).trim().toLowerCase();return t.value=n,r.value=l,l}}var ze=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(ze||{}),Ge=(e=>(e[e.Pointer=0]="Pointer",e[e.Other=1]="Other",e))(Ge||{});function Xe(e){requestAnimationFrame(()=>requestAnimationFrame(e))}let ce=Symbol("MenuContext");function C(e){let t=te(ce,null);if(t===null){let r=new Error(`<${e} /> is missing a parent <Menu /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,C),r}return t}let Ye=$({name:"Menu",props:{as:{type:[Object,String],default:"template"}},setup(e,{slots:t,attrs:r}){let a=g(1),n=g(null),l=g(null),o=g([]),i=g(""),f=g(null),c=g(1);function u(p=v=>v){let v=f.value!==null?o.value[f.value]:null,d=se(p(o.value.slice()),h=>b(h.dataRef.domRef)),s=v?d.indexOf(v):null;return s===-1&&(s=null),{items:d,activeItemIndex:s}}let m={menuState:a,buttonRef:n,itemsRef:l,items:o,searchQuery:i,activeItemIndex:f,activationTrigger:c,closeMenu:()=>{a.value=1,f.value=null},openMenu:()=>a.value=0,goToItem(p,v,d){let s=u(),h=Oe(p===y.Specific?{focus:y.Specific,id:v}:{focus:p},{resolveItems:()=>s.items,resolveActiveIndex:()=>s.activeItemIndex,resolveId:S=>S.id,resolveDisabled:S=>S.dataRef.disabled});i.value="",f.value=h,c.value=d??1,o.value=s.items},search(p){let v=i.value!==""?0:1;i.value+=p.toLowerCase();let d=(f.value!==null?o.value.slice(f.value+v).concat(o.value.slice(0,f.value+v)):o.value).find(h=>h.dataRef.textValue.startsWith(i.value)&&!h.dataRef.disabled),s=d?o.value.indexOf(d):-1;s===-1||s===f.value||(f.value=s,c.value=1)},clearSearch(){i.value=""},registerItem(p,v){let d=u(s=>[...s,{id:p,dataRef:v}]);o.value=d.items,f.value=d.activeItemIndex,c.value=1},unregisterItem(p){let v=u(d=>{let s=d.findIndex(h=>h.id===p);return s!==-1&&d.splice(s,1),d});o.value=v.items,f.value=v.activeItemIndex,c.value=1}};return Ve([n,l],(p,v)=>{var d;m.closeMenu(),G(v,z.Loose)||(p.preventDefault(),(d=b(n))==null||d.focus())},x(()=>a.value===0)),ne(ce,m),Te(x(()=>R(a.value,{0:M.Open,1:M.Closed}))),()=>{let p={open:a.value===0,close:m.closeMenu};return L({ourProps:{},theirProps:e,slot:p,slots:t,attrs:r,name:"Menu"})}}}),Qe=$({name:"MenuButton",props:{disabled:{type:Boolean,default:!1},as:{type:[Object,String],default:"button"},id:{type:String,default:()=>`headlessui-menu-button-${W()}`}},setup(e,{attrs:t,slots:r,expose:a}){let n=C("MenuButton");a({el:n.buttonRef,$el:n.buttonRef});function l(c){switch(c.key){case w.Space:case w.Enter:case w.ArrowDown:c.preventDefault(),c.stopPropagation(),n.openMenu(),E(()=>{var u;(u=b(n.itemsRef))==null||u.focus({preventScroll:!0}),n.goToItem(y.First)});break;case w.ArrowUp:c.preventDefault(),c.stopPropagation(),n.openMenu(),E(()=>{var u;(u=b(n.itemsRef))==null||u.focus({preventScroll:!0}),n.goToItem(y.Last)});break}}function o(c){switch(c.key){case w.Space:c.preventDefault();break}}function i(c){e.disabled||(n.menuState.value===0?(n.closeMenu(),E(()=>{var u;return(u=b(n.buttonRef))==null?void 0:u.focus({preventScroll:!0})})):(c.preventDefault(),n.openMenu(),Xe(()=>{var u;return(u=b(n.itemsRef))==null?void 0:u.focus({preventScroll:!0})})))}let f=Me(x(()=>({as:e.as,type:t.type})),n.buttonRef);return()=>{var c;let u={open:n.menuState.value===0},{id:m,...p}=e,v={ref:n.buttonRef,id:m,type:f.value,"aria-haspopup":"menu","aria-controls":(c=b(n.itemsRef))==null?void 0:c.id,"aria-expanded":n.menuState.value===0,onKeydown:l,onKeyup:o,onClick:i};return L({ourProps:v,theirProps:p,slot:u,attrs:t,slots:r,name:"MenuButton"})}}}),Je=$({name:"MenuItems",props:{as:{type:[Object,String],default:"div"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},id:{type:String,default:()=>`headlessui-menu-items-${W()}`}},setup(e,{attrs:t,slots:r,expose:a}){let n=C("MenuItems"),l=g(null);a({el:n.itemsRef,$el:n.itemsRef}),Fe({container:x(()=>b(n.itemsRef)),enabled:x(()=>n.menuState.value===0),accept(u){return u.getAttribute("role")==="menuitem"?NodeFilter.FILTER_REJECT:u.hasAttribute("role")?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT},walk(u){u.setAttribute("role","none")}});function o(u){var m;switch(l.value&&clearTimeout(l.value),u.key){case w.Space:if(n.searchQuery.value!=="")return u.preventDefault(),u.stopPropagation(),n.search(u.key);case w.Enter:if(u.preventDefault(),u.stopPropagation(),n.activeItemIndex.value!==null){let p=n.items.value[n.activeItemIndex.value];(m=b(p.dataRef.domRef))==null||m.click()}n.closeMenu(),ie(b(n.buttonRef));break;case w.ArrowDown:return u.preventDefault(),u.stopPropagation(),n.goToItem(y.Next);case w.ArrowUp:return u.preventDefault(),u.stopPropagation(),n.goToItem(y.Previous);case w.Home:case w.PageUp:return u.preventDefault(),u.stopPropagation(),n.goToItem(y.First);case w.End:case w.PageDown:return u.preventDefault(),u.stopPropagation(),n.goToItem(y.Last);case w.Escape:u.preventDefault(),u.stopPropagation(),n.closeMenu(),E(()=>{var p;return(p=b(n.buttonRef))==null?void 0:p.focus({preventScroll:!0})});break;case w.Tab:u.preventDefault(),u.stopPropagation(),n.closeMenu(),E(()=>_e(b(n.buttonRef),u.shiftKey?B.Previous:B.Next));break;default:u.key.length===1&&(n.search(u.key),l.value=setTimeout(()=>n.clearSearch(),350));break}}function i(u){switch(u.key){case w.Space:u.preventDefault();break}}let f=Pe(),c=x(()=>f!==null?(f.value&M.Open)===M.Open:n.menuState.value===0);return()=>{var u,m;let p={open:n.menuState.value===0},{id:v,...d}=e,s={"aria-activedescendant":n.activeItemIndex.value===null||(u=n.items.value[n.activeItemIndex.value])==null?void 0:u.id,"aria-labelledby":(m=b(n.buttonRef))==null?void 0:m.id,id:v,onKeydown:o,onKeyup:i,role:"menu",tabIndex:0,ref:n.itemsRef};return L({ourProps:s,theirProps:d,slot:p,attrs:t,slots:r,features:U.RenderStrategy|U.Static,visible:c.value,name:"MenuItems"})}}}),Ze=$({name:"MenuItem",inheritAttrs:!1,props:{as:{type:[Object,String],default:"template"},disabled:{type:Boolean,default:!1},id:{type:String,default:()=>`headlessui-menu-item-${W()}`}},setup(e,{slots:t,attrs:r,expose:a}){let n=C("MenuItem"),l=g(null);a({el:l,$el:l});let o=x(()=>n.activeItemIndex.value!==null?n.items.value[n.activeItemIndex.value].id===e.id:!1),i=qe(l),f=x(()=>({disabled:e.disabled,get textValue(){return i()},domRef:l}));V(()=>n.registerItem(e.id,f)),ve(()=>n.unregisterItem(e.id)),N(()=>{n.menuState.value===0&&o.value&&n.activationTrigger.value!==0&&E(()=>{var s,h;return(h=(s=b(l))==null?void 0:s.scrollIntoView)==null?void 0:h.call(s,{block:"nearest"})})});function c(s){if(e.disabled)return s.preventDefault();n.closeMenu(),ie(b(n.buttonRef))}function u(){if(e.disabled)return n.goToItem(y.Nothing);n.goToItem(y.Specific,e.id)}let m=We();function p(s){m.update(s)}function v(s){m.wasMoved(s)&&(e.disabled||o.value||n.goToItem(y.Specific,e.id,0))}function d(s){m.wasMoved(s)&&(e.disabled||o.value&&n.goToItem(y.Nothing))}return()=>{let{disabled:s}=e,h={active:o.value,disabled:s,close:n.closeMenu},{id:S,...de}=e;return L({ourProps:{id:S,ref:l,role:"menuitem",tabIndex:s===!0?void 0:-1,"aria-disabled":s===!0?!0:void 0,disabled:void 0,onClick:c,onFocus:u,onPointerenter:p,onMouseenter:p,onPointermove:v,onMousemove:v,onPointerleave:d,onMouseleave:d},theirProps:{...r,...de},slot:h,attrs:r,slots:t,name:"MenuItem"})}}});function et(e,t){return D(),A("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[I("path",{"fill-rule":"evenodd",d:"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z","clip-rule":"evenodd"})])}const tt=["onClick"],nt={class:"absolute w-full px-5 left-0 right-0 bottom-5"},rt=["onClick"],ot={__name:"TheDropdown",props:{unitType:{type:String},calcUnits:{type:Object},activeUnit:{type:String}},emits:["setActiveUnit"],setup(e){const t=g(null),r=g(!1);me(()=>t.value,n=>{if(n){const l=n.parentElement.getAttribute("data-headlessui-state");r.value=l==="open",a()}else r.value=!1});const a=()=>{if(!r.value)return;const n=t.value.parentElement,l=window.innerHeight*.01;document.documentElement.style.setProperty("--vh",`${l}px`),window.innerWidth<768?n.style.minHeight="calc(var(--vh, 1vh) * 100)":n.style.minHeight="510px"};return V(()=>{window.addEventListener("resize",a)}),(n,l)=>(D(),X(P(Ye),{as:"div",class:"text-left"},{default:O(({close:o})=>[I("div",null,[T(P(Qe),{class:"menu-button"},{default:O(()=>[be(F(e.unitType||e.activeUnit)+" ",1),T(P(et),{class:"-mr-1 h-6 w-6 text-navajo-white","aria-hidden":"true"})]),_:1})]),(D(),X(he,{to:"body"},[T(ge,{"enter-active-class":"transition ease-out duration-100","enter-from-class":"transform opacity-0 scale-95","enter-to-class":"transform opacity-100 scale-100","leave-active-class":"transition ease-in duration-75","leave-from-class":"transform opacity-100 scale-100","leave-to-class":"transform opacity-0 scale-95"},{default:O(()=>[T(P(Je),{class:"menu-items-wrapper"},{default:O(()=>[I("div",{class:"pb-10",ref_key:"menuItemsSubWrapper",ref:t},[(D(!0),A(H,null,we(e.calcUnits,i=>(D(),A("div",{key:i,class:"py-1"},[T(P(Ze),null,{default:O(({active:f})=>[I("a",{onClick:c=>n.$emit("setActiveUnit",i.shortName?i.shortName:i),href:"#",class:re([f?"bg-mellow-apricot":"","block px-2 py-2 rounded-md"])},F(i.longName?i.longName:i),11,tt)]),_:2},1024)]))),128))],512),I("div",nt,[I("button",{class:"w-full p-2 bg-neon-carrot text-seal-brown rounded-md",onClick:o}," Close ",8,rt)])]),_:2},1024)]),_:2},1024)]))]),_:1}))}},lt={__name:"UnitValue",props:["dropdownOwner","converterData"],emits:["setActiveDropdown"],setup(e){const t=e,r=()=>{let o="";return t.converterData.activeDropdown==="top"&&t.dropdownOwner==="top"&&(o+="active"),t.converterData.activeDropdown==="bottom"&&t.dropdownOwner==="bottom"&&(o+="active"),t.dropdownOwner==="top"&&t.converterData.topUnitValue&&t.converterData.topUnitValue.length>16&&window.innerWidth<480&&(o+=" text-2xl"),t.dropdownOwner==="bottom"&&t.converterData.bottomUnitValue&&t.converterData.bottomUnitValue.length>16&&window.innerWidth<480&&(o+=" text-2xl"),o},a=()=>t.dropdownOwner==="top"?t.converterData.topUnitValue||t.converterData.defaultResult:t.converterData.bottomUnitValue||t.converterData.defaultResult,n=()=>t.dropdownOwner==="top"?t.converterData.topUnitName:t.converterData.bottomUnitName,l=()=>{if(t.dropdownOwner==="top")return"top";if(t.dropdownOwner==="bottom")return"bottom"};return(o,i)=>(D(),A(H,null,[I("div",{onClick:i[0]||(i[0]=f=>o.$emit("setActiveDropdown",l())),class:"results-wrapper"},[I("h2",{class:re(["result",r()])},F(a()),3)]),I("div",{onClick:i[1]||(i[1]=f=>o.$emit("setActiveDropdown",l())),class:"unit-name-wrapper"},[I("span",null,F(n()),1)])],64))}};export{ot as _,lt as a};