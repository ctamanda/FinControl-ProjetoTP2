import{$ as NC,Br as tv,D as FT,Dr as ov,En as ce,Ft as Sd,G as Jr,Gr as v,Kn as gv,Kt as US,Mn as dh,Nn as dv,Pr as rr,Sr as ni,Tr as oM,Un as ge,Yn as ha,Zn as hn,c as BS,fr as le,ft as Oe,j as GS,kr as pn,mr as li,pr as lh,qn as h,si as yt,t as $S,u as Bd,vr as mn,wr as nv,yt as Qg}from"./chunk-CNMUGzne.js";var V=[`determinateSpinner`];function j(t,x){if(t&1&&(lh(),ha(0,`svg`,11),nv(1,`circle`,12),Sd()),t&2){let e=BS();rr(`viewBox`,e._viewBox()),ni(),gv(`stroke-dasharray`,e._strokeCircumference(),`px`)(`stroke-dashoffset`,e._strokeCircumference()/2,`px`)(`stroke-width`,e._circleStrokeWidth(),`%`),rr(`r`,e._circleRadius())}}var L=new v(`mat-progress-spinner-default-options`,{providedIn:`root`,factory:()=>({diameter:z})});var z=100;var Q=10;var ee=(()=>{class t{_elementRef=h(le);_noopAnimations;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor=`primary`;_determinateCircle;constructor(){let e=h(L),i=oM(),r=this._elementRef.nativeElement;this._noopAnimations=i===`di-disabled`&&!!e&&!e._forceAnimations,this.mode=r.nodeName.toLowerCase()===`mat-spinner`?`indeterminate`:`determinate`,!this._noopAnimations&&i===`reduced-motion`&&r.classList.add(`mat-progress-spinner-reduced-motion`),e&&(e.color&&(this.color=this._defaultColor=e.color),e.diameter&&(this.diameter=e.diameter),e.strokeWidth&&(this.strokeWidth=e.strokeWidth))}mode;get value(){return this.mode===`determinate`?this._value:0}set value(e){this._value=Math.max(0,Math.min(100,e||0))}_value=0;get diameter(){return this._diameter}set diameter(e){this._diameter=e||0}_diameter=z;get strokeWidth(){return this._strokeWidth??this.diameter/10}set strokeWidth(e){this._strokeWidth=e||0}_strokeWidth;_circleRadius(){return(this.diameter-Q)/2}_viewBox(){let e=this._circleRadius()*2+this.strokeWidth;return`0 0 ${e} ${e}`}_strokeCircumference(){return 2*Math.PI*this._circleRadius()}_strokeDashOffset(){return this.mode===`determinate`?this._strokeCircumference()*(100-this._value)/100:null}_circleStrokeWidth(){return this.strokeWidth/this.diameter*100}static ɵfac=function(i){return new(i||t)};static ɵcmp=Oe({type:t,selectors:[[`mat-progress-spinner`],[`mat-spinner`]],viewQuery:function(i,r){if(i&1&&dv(V,5),i&2){let o;US(o=$S())&&(r._determinateCircle=o.first)}},hostAttrs:[`role`,`progressbar`,`tabindex`,`-1`,1,`mat-mdc-progress-spinner`,`mdc-circular-progress`],hostVars:18,hostBindings:function(i,r){i&2&&(rr(`aria-valuemin`,0)(`aria-valuemax`,100)(`aria-valuenow`,r.mode===`determinate`?r.value:null)(`mode`,r.mode),li(`mat-`+r.color),gv(`width`,r.diameter,`px`)(`height`,r.diameter,`px`)(`--%NS%mat-progress-spinner-size`,r.diameter+`px`)(`--%NS%mat-progress-spinner-active-indicator-width`,r.diameter+`px`),yt(`_mat-animation-noopable`,r._noopAnimations)(`mdc-circular-progress--indeterminate`,r.mode===`indeterminate`))},inputs:{color:`color`,mode:`mode`,value:[2,`value`,`value`,Bd],diameter:[2,`diameter`,`diameter`,Bd],strokeWidth:[2,`strokeWidth`,`strokeWidth`,Bd]},exportAs:[`matProgressSpinner`],decls:14,vars:11,consts:[[`circle`,``],[`determinateSpinner`,``],[`aria-hidden`,`true`,1,`mdc-circular-progress__determinate-container`],[`xmlns`,`http://www.w3.org/2000/svg`,`focusable`,`false`,1,`mdc-circular-progress__determinate-circle-graphic`],[`cx`,`50%`,`cy`,`50%`,1,`mdc-circular-progress__determinate-circle`],[`aria-hidden`,`true`,1,`mdc-circular-progress__indeterminate-container`],[1,`mdc-circular-progress__spinner-layer`],[1,`mdc-circular-progress__circle-clipper`,`mdc-circular-progress__circle-left`],[3,`ngTemplateOutlet`],[1,`mdc-circular-progress__gap-patch`],[1,`mdc-circular-progress__circle-clipper`,`mdc-circular-progress__circle-right`],[`xmlns`,`http://www.w3.org/2000/svg`,`focusable`,`false`,1,`mdc-circular-progress__indeterminate-circle-graphic`],[`cx`,`50%`,`cy`,`50%`]],template:function(i,r){if(i&1&&(Qg(0,j,2,8,`ng-template`,null,0,NC),ha(2,`div`,2,1),lh(),ha(4,`svg`,3),nv(5,`circle`,4),Sd()(),dh(),ha(6,`div`,5)(7,`div`,6)(8,`div`,7),ov(9,8),Sd(),ha(10,`div`,9),ov(11,8),Sd(),ha(12,`div`,10),ov(13,8),Sd()()()),i&2){let o=GS(1);ni(4),rr(`viewBox`,r._viewBox()),ni(),gv(`stroke-dasharray`,r._strokeCircumference(),`px`)(`stroke-dashoffset`,r._strokeDashOffset(),`px`)(`stroke-width`,r._circleStrokeWidth(),`%`),rr(`r`,r._circleRadius()),ni(4),tv(`ngTemplateOutlet`,o),ni(2),tv(`ngTemplateOutlet`,o),ni(2),tv(`ngTemplateOutlet`,o)}},dependencies:[FT],styles:[`.mat-mdc-progress-spinner {
  --%NS%mat-progress-spinner-animation-multiplier: 1;
  display: block;
  overflow: hidden;
  line-height: 0;
  position: relative;
  direction: ltr;
  transition: opacity 250ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mat-mdc-progress-spinner circle {
  stroke-width: var(--%NS%mat-progress-spinner-active-indicator-width, 4px);
}
.mat-mdc-progress-spinner._mat-animation-noopable, .mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__determinate-circle {
  transition: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-circle-graphic,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__spinner-layer,
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container {
  animation: none !important;
}
.mat-mdc-progress-spinner._mat-animation-noopable .mdc-circular-progress__indeterminate-container circle {
  stroke-dasharray: 0 !important;
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic,
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle {
    stroke: currentColor;
    stroke: CanvasText;
  }
}

.mat-progress-spinner-reduced-motion {
  --%NS%mat-progress-spinner-animation-multiplier: 1.25;
}

.mdc-circular-progress__determinate-container,
.mdc-circular-progress__indeterminate-circle-graphic,
.mdc-circular-progress__indeterminate-container,
.mdc-circular-progress__spinner-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mdc-circular-progress__determinate-container {
  transform: rotate(-90deg);
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__determinate-container {
  opacity: 0;
}

.mdc-circular-progress__indeterminate-container {
  font-size: 0;
  letter-spacing: 0;
  white-space: nowrap;
  opacity: 0;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__indeterminate-container {
  opacity: 1;
  animation: mdc-circular-progress-container-rotate calc(1568.2352941176ms * var(--%NS%mat-progress-spinner-animation-multiplier)) linear infinite;
}

.mdc-circular-progress__determinate-circle-graphic,
.mdc-circular-progress__indeterminate-circle-graphic {
  fill: transparent;
}

.mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
.mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
  stroke: var(--%NS%mat-progress-spinner-active-indicator-color, var(--%NS%mat-sys-primary));
}
@media (forced-colors: active) {
  .mat-mdc-progress-spinner .mdc-circular-progress__determinate-circle,
  .mat-mdc-progress-spinner .mdc-circular-progress__indeterminate-circle-graphic {
    stroke: CanvasText;
  }
}

.mdc-circular-progress__determinate-circle {
  transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
}

.mdc-circular-progress__gap-patch {
  position: absolute;
  top: 0;
  left: 47.5%;
  box-sizing: border-box;
  width: 5%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress__gap-patch .mdc-circular-progress__indeterminate-circle-graphic {
  left: -900%;
  width: 2000%;
  transform: rotate(180deg);
}
.mdc-circular-progress__circle-clipper .mdc-circular-progress__indeterminate-circle-graphic {
  width: 200%;
}
.mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  left: -100%;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-left .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-left-spin calc(1333ms * var(--%NS%mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}
.mdc-circular-progress--indeterminate .mdc-circular-progress__circle-right .mdc-circular-progress__indeterminate-circle-graphic {
  animation: mdc-circular-progress-right-spin calc(1333ms * var(--%NS%mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

.mdc-circular-progress__circle-clipper {
  display: inline-flex;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

.mdc-circular-progress--indeterminate .mdc-circular-progress__spinner-layer {
  animation: mdc-circular-progress-spinner-layer-rotate calc(5332ms * var(--%NS%mat-progress-spinner-animation-multiplier)) cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}

@keyframes mdc-circular-progress-container-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes mdc-circular-progress-spinner-layer-rotate {
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg);
  }
  75% {
    transform: rotate(810deg);
  }
  87.5% {
    transform: rotate(945deg);
  }
  100% {
    transform: rotate(1080deg);
  }
}
@keyframes mdc-circular-progress-left-spin {
  from {
    transform: rotate(265deg);
  }
  50% {
    transform: rotate(130deg);
  }
  to {
    transform: rotate(265deg);
  }
}
@keyframes mdc-circular-progress-right-spin {
  from {
    transform: rotate(-265deg);
  }
  50% {
    transform: rotate(-130deg);
  }
  to {
    transform: rotate(-265deg);
  }
}
`],encapsulation:2})}return t})();var re=(()=>{class t{static ɵfac=function(i){return new(i||t)};static ɵmod=ge({type:t});static ɵinj=ce({imports:[Jr]})}return t})();var F=class t{static ɵfac=function(e){return new(e||t)};static ɵcmp=Oe({type:t,selectors:[[`app-fundo-auth`]],decls:31,vars:0,consts:[[`viewBox`,`0 0 1440 900`,`preserveAspectRatio`,`xMidYMid slice`,`aria-hidden`,`true`],[`id`,`brilho`,`cx`,`50%`,`cy`,`50%`,`r`,`50%`],[`offset`,`0%`,`stop-color`,`#6d3cc9`,`stop-opacity`,`.55`],[`offset`,`100%`,`stop-color`,`#6d3cc9`,`stop-opacity`,`0`],[`id`,`linha`,`x1`,`0`,`x2`,`1`],[`offset`,`0%`,`stop-color`,`#facc15`,`stop-opacity`,`0`],[`offset`,`60%`,`stop-color`,`#facc15`,`stop-opacity`,`.55`],[`offset`,`100%`,`stop-color`,`#facc15`,`stop-opacity`,`.9`],[`cx`,`180`,`cy`,`160`,`r`,`320`,`fill`,`url(#brilho)`],[`cx`,`1300`,`cy`,`780`,`r`,`380`,`fill`,`url(#brilho)`],[`d`,`M-20 760 C 160 720, 240 640, 380 660 S 600 560, 720 590 S 940 440, 1080 470 S 1300 300, 1460 260`,`fill`,`none`,`stroke`,`url(#linha)`,`stroke-width`,`3`,`stroke-linecap`,`round`],[`fill`,`#facc15`],[`cx`,`380`,`cy`,`660`,`r`,`6`,`opacity`,`.5`],[`cx`,`720`,`cy`,`590`,`r`,`6`,`opacity`,`.6`],[`cx`,`1080`,`cy`,`470`,`r`,`6`,`opacity`,`.75`],[`cx`,`1380`,`cy`,`285`,`r`,`7`],[`fill`,`#ffffff`,`opacity`,`.05`],[`x`,`90`,`y`,`560`,`width`,`34`,`height`,`340`,`rx`,`10`],[`x`,`140`,`y`,`480`,`width`,`34`,`height`,`420`,`rx`,`10`],[`x`,`190`,`y`,`620`,`width`,`34`,`height`,`280`,`rx`,`10`],[`x`,`1210`,`y`,`120`,`width`,`34`,`height`,`250`,`rx`,`10`],[`x`,`1260`,`y`,`60`,`width`,`34`,`height`,`310`,`rx`,`10`],[`x`,`1310`,`y`,`170`,`width`,`34`,`height`,`200`,`rx`,`10`],[`cx`,`1150`,`cy`,`640`,`r`,`26`,`fill`,`#facc15`,`opacity`,`.18`],[`cx`,`1150`,`cy`,`640`,`r`,`17`,`fill`,`none`,`stroke`,`#facc15`,`stroke-width`,`2`,`opacity`,`.35`],[`cx`,`300`,`cy`,`300`,`r`,`18`,`fill`,`#facc15`,`opacity`,`.15`],[`cx`,`300`,`cy`,`300`,`r`,`11`,`fill`,`none`,`stroke`,`#facc15`,`stroke-width`,`2`,`opacity`,`.3`],[`cx`,`980`,`cy`,`160`,`r`,`12`,`fill`,`#ffffff`,`opacity`,`.1`],[`cx`,`520`,`cy`,`820`,`r`,`14`,`fill`,`#ffffff`,`opacity`,`.08`]],template:function(e,i){e&1&&(lh(),pn(0,`svg`,0)(1,`defs`)(2,`radialGradient`,1),mn(3,`stop`,2)(4,`stop`,3),hn(),pn(5,`linearGradient`,4),mn(6,`stop`,5)(7,`stop`,6)(8,`stop`,7),hn()(),mn(9,`circle`,8)(10,`circle`,9)(11,`path`,10),pn(12,`g`,11),mn(13,`circle`,12)(14,`circle`,13)(15,`circle`,14)(16,`circle`,15),hn(),pn(17,`g`,16),mn(18,`rect`,17)(19,`rect`,18)(20,`rect`,19)(21,`rect`,20)(22,`rect`,21)(23,`rect`,22),hn(),pn(24,`g`),mn(25,`circle`,23)(26,`circle`,24)(27,`circle`,25)(28,`circle`,26)(29,`circle`,27)(30,`circle`,28),hn()())},styles:[`[_nghost-%COMP%]{position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(160deg,#2e0f60,#3b1478 45%,#4c1d95)}svg[_ngcontent-%COMP%]{width:100%;height:100%}`]})};export{ee as n,re as r,F as t};