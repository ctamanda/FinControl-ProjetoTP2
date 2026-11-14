import{$ as La,A as Gs,An as eh,B as JG,Br as sv,Cr as or,Dn as dv,En as de,Et as Pe,Fn as fi,Fr as ro,Gn as h,Hr as tG,Ir as rr,Jr as ui,K as KS,Mt as RS,O as Fv,Pn as fh,Qn as iv,Qr as v,Qt as Vd,S as Es,Sr as oi,U as Jp,Ut as Tv,Vn as ge,Wr as tt$1,Zr as uv,Zt as VC,_r as no,a as AS,b as Dv,bn as ba,br as ny,bt as Ot$1,di as xd,dr as mf,ei as vC,et as Lb,ft as NC,gi as zS,gn as _f,gr as ne,gt as Nv,hr as nW,ir as kC,jr as qS,kt as RC,lr as li,m as Cd,mr as mv,n as $t$1,ni as va,nt as Le,on as XG,pi as xv,qr as ue,r as A,rn as WT,tr as jS,un as ZS,w as FC,xn as bt$1,y as Dt$1,zt as TC}from"./chunk-fkch88o2.js";import"./chunk-CEyKRt4x.js";import"./chunk-7jPyCknY.js";import{i as ce,r as Nt$1}from"./chunk-B7utWsYu.js";import{t as n}from"./chunk-cOJ8JrQp.js";import{F as x,L as Yt,R as mt$1,a as o,i as e,n as i,r as l,t as Te,y as O}from"./main-DWNHLFPV.js";import{t as g}from"./chunk-DRTGwRin.js";import{t as Qt}from"./chunk-BluzVOY5.js";import{n as Z,t as L$1}from"./chunk-BI6EqrC1.js";import{o as ee}from"./chunk-CVhv5u5M.js";import{t as F}from"./chunk-PPjYwpei.js";import{n as h$1}from"./chunk-B9iL49Ty.js";import{t as n$1}from"./chunk-CPbc16GP.js";import{i as de$1,s as re,t as A$1}from"./chunk-sPQauMXW.js";var et=[`*`];var Ge=(()=>{class n{labelPosition=`after`;static ɵfac=function(i){return new(i||n)};static ɵcmp=Le({type:n,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(i,l){i&2&&bt$1(`mdc-form-field--align-end`,l.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:et,decls:1,vars:0,template:function(i,l){i&1&&(or(),tt$1(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})}return n})();var tt=[`switch`];var nt=[`*`];function at(n,t){n&1&&(va(0,`span`,11),fh(),va(1,`svg`,13),sv(2,`path`,14),Cd(),va(3,`svg`,15),sv(4,`path`,16),Cd()())}var it=new v(`mat-slide-toggle-default-options`,{providedIn:`root`,factory:()=>({disableToggleValue:!1,hideIcon:!1,disabledInteractive:!1})});var j=class{source;checked;constructor(t,e){this.source=t,this.checked=e}};var J=(()=>{class n{_elementRef=h(de);_focusMonitor=h(mf);_changeDetectorRef=h(ny);defaults=h(it);_onChange=e=>{};_onTouched=()=>{};_validatorOnChange=()=>{};_uniqueId;_checked=!1;_createChangeEvent(e){return new j(this,e)}_labelId;get buttonId(){return`${this.id||this._uniqueId}-button`}_switchElement;focus(){this._switchElement.nativeElement.focus()}_noopAnimations=no();_focused=!1;name=null;id;labelPosition=`after`;ariaLabel=null;ariaLabelledby=null;ariaDescribedby;required=!1;color;disabled=!1;fullWidth=!1;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked=e,this._changeDetectorRef.markForCheck()}hideIcon;disabledInteractive;change=new Pe;toggleChange=new Pe;get inputId(){return`${this.id||this._uniqueId}-input`}constructor(){h($t$1).load(Lb);let e=h(new La(`tabindex`),{optional:!0}),i=this.defaults;this.tabIndex=e==null?0:parseInt(e)||0,this.color=i.color||`accent`,this.id=this._uniqueId=h(_f).getId(`mat-mdc-slide-toggle-`),this.hideIcon=i.hideIcon??!1,this.disabledInteractive=i.disabledInteractive??!1,this._labelId=this._uniqueId+`-label`}ngAfterContentInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{e===`keyboard`||e===`program`?(this._focused=!0,this._changeDetectorRef.markForCheck()):e||Promise.resolve().then(()=>{this._focused=!1,this._onTouched(),this._changeDetectorRef.markForCheck()})})}ngOnChanges(e){e.required&&this._validatorOnChange()}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef)}writeValue(e){this.checked=!!e}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorOnChange=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck()}toggle(){this.checked=!this.checked,this._onChange(this.checked)}_emitChangeEvent(){this._onChange(this.checked),this.change.emit(this._createChangeEvent(this.checked))}_handleClick(){this.disabled||(this.toggleChange.emit(),this.defaults.disableToggleValue||(this.checked=!this.checked,this._onChange(this.checked),this.change.emit(new j(this,this.checked))))}_getAriaLabelledBy(){return this.ariaLabelledby?this.ariaLabelledby:this.ariaLabel?null:this._labelId}static ɵfac=function(i){return new(i||n)};static ɵcmp=Le({type:n,selectors:[[`mat-slide-toggle`]],viewQuery:function(i,l){if(i&1&&mv(tt,5),i&2){let p;qS(p=ZS())&&(l._switchElement=p.first)}},hostAttrs:[1,`mat-mdc-slide-toggle`],hostVars:15,hostBindings:function(i,l){i&2&&(uv(`id`,l.id),rr(`tabindex`,null)(`aria-label`,null)(`name`,null)(`aria-labelledby`,null),fi(l.color?`mat-`+l.color:``),bt$1(`mat-mdc-slide-toggle-focused`,l._focused)(`mat-mdc-slide-toggle-checked`,l.checked)(`mat-slide-toggle-full-width`,l.fullWidth)(`_mat-animation-noopable`,l._noopAnimations))},inputs:{name:`name`,id:`id`,labelPosition:`labelPosition`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],required:[2,`required`,`required`,Dt$1],color:`color`,disabled:[2,`disabled`,`disabled`,Dt$1],fullWidth:[2,`fullWidth`,`fullWidth`,Dt$1],disableRipple:[2,`disableRipple`,`disableRipple`,Dt$1],tabIndex:[2,`tabIndex`,`tabIndex`,e=>e==null?0:Vd(e)],checked:[2,`checked`,`checked`,Dt$1],hideIcon:[2,`hideIcon`,`hideIcon`,Dt$1],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,Dt$1]},outputs:{change:`change`,toggleChange:`toggleChange`},exportAs:[`matSlideToggle`],features:[Fv([{provide:O,useExisting:Es(()=>n),multi:!0},{provide:x,useExisting:n,multi:!0}]),ba],ngContentSelectors:nt,decls:14,vars:27,consts:[[`switch`,``],[`mat-internal-form-field`,``,3,`labelPosition`],[`role`,`switch`,`type`,`button`,1,`mdc-switch`,3,`click`,`tabIndex`,`disabled`],[1,`mat-mdc-slide-toggle-touch-target`],[1,`mdc-switch__track`],[1,`mdc-switch__handle-track`],[1,`mdc-switch__handle`],[1,`mdc-switch__shadow`],[1,`mdc-elevation-overlay`],[1,`mdc-switch__ripple`],[`mat-ripple`,``,1,`mat-mdc-slide-toggle-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mdc-switch__icons`],[1,`mdc-label`,3,`click`,`for`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--on`],[`d`,`M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z`],[`viewBox`,`0 0 24 24`,`aria-hidden`,`true`,1,`mdc-switch__icon`,`mdc-switch__icon--off`],[`d`,`M20 13H4v-2h16v2z`]],template:function(i,l){if(i&1&&(or(),va(0,`div`,1)(1,`button`,2,0),dv(`click`,function(){return l._handleClick()}),sv(3,`div`,3)(4,`span`,4),va(5,`span`,5)(6,`span`,6)(7,`span`,7),sv(8,`span`,8),Cd(),va(9,`span`,9),sv(10,`span`,10),Cd(),ui(11,at,5,0,`span`,11),Cd()()(),va(12,`label`,12),dv(`click`,function(v){return v.stopPropagation()}),tt$1(13),Cd()()),i&2){let p=KS(2);iv(`labelPosition`,l.labelPosition),oi(),bt$1(`mdc-switch--selected`,l.checked)(`mdc-switch--unselected`,!l.checked)(`mdc-switch--checked`,l.checked)(`mdc-switch--disabled`,l.disabled)(`mat-mdc-slide-toggle-disabled-interactive`,l.disabledInteractive),iv(`tabIndex`,l.disabled&&!l.disabledInteractive?-1:l.tabIndex)(`disabled`,l.disabled&&!l.disabledInteractive),rr(`id`,l.buttonId)(`name`,l.name)(`aria-label`,l.ariaLabel)(`aria-labelledby`,l._getAriaLabelledBy())(`aria-describedby`,l.ariaDescribedby)(`aria-required`,l.required||null)(`aria-checked`,l.checked)(`aria-disabled`,l.disabled&&l.disabledInteractive?`true`:null),oi(9),iv(`matRippleTrigger`,p)(`matRippleDisabled`,l.disableRipple||l.disabled)(`matRippleCentered`,!0),oi(),li(l.hideIcon?-1:11),oi(),iv(`for`,l.buttonId),rr(`id`,l._labelId)}},dependencies:[tG,Ge],styles:[`.mdc-switch {
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 0;
  position: relative;
  width: var(--%NS%mat-slide-toggle-track-width, 52px);
}
.mdc-switch.mdc-switch--disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-switch.mat-mdc-slide-toggle-disabled-interactive {
  pointer-events: auto;
}

.mdc-switch__track {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: var(--%NS%mat-slide-toggle-track-height, 32px);
  border-radius: var(--%NS%mat-slide-toggle-track-shape, var(--%NS%mat-sys-corner-full));
}
.mdc-switch--disabled.mdc-switch .mdc-switch__track {
  opacity: var(--%NS%mat-slide-toggle-disabled-track-opacity, 0.12);
}
.mdc-switch__track::before, .mdc-switch__track::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  height: 100%;
  left: 0;
  position: absolute;
  width: 100%;
  border-width: var(--%NS%mat-slide-toggle-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-track-outline-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--selected .mdc-switch__track::before, .mdc-switch--selected .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-selected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-selected-track-outline-color, transparent);
}
.mdc-switch--disabled .mdc-switch__track::before, .mdc-switch--disabled .mdc-switch__track::after {
  border-width: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-width, 2px);
  border-color: var(--%NS%mat-slide-toggle-disabled-unselected-track-outline-color, var(--%NS%mat-sys-on-surface));
}
@media (forced-colors: active) {
  .mdc-switch__track {
    border-color: currentColor;
  }
}
.mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: translateX(0);
  background: var(--%NS%mat-slide-toggle-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__track::before {
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before {
  transform: translateX(-100%);
}
.mdc-switch--selected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::before {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-hover-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-focus-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch:enabled:active .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-track-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::before, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::before, .mdc-switch.mdc-switch--disabled .mdc-switch__track::before {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-track-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch__track::after {
  transform: translateX(-100%);
  background: var(--%NS%mat-slide-toggle-selected-track-color, var(--%NS%mat-sys-primary));
}
[dir=rtl] .mdc-switch__track::after {
  transform: translateX(100%);
}
.mdc-switch--selected .mdc-switch__track::after {
  transform: translateX(0);
}
.mdc-switch--selected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-visible-track-opacity, 1);
  transition: var(--%NS%mat-slide-toggle-visible-track-transition, opacity 75ms);
}
.mdc-switch--unselected .mdc-switch__track::after {
  opacity: var(--%NS%mat-slide-toggle-hidden-track-opacity, 0);
  transition: var(--%NS%mat-slide-toggle-hidden-track-transition, opacity 75ms);
}
.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-track-color, var(--%NS%mat-sys-primary));
}
.mdc-switch:enabled:active .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-track-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__track::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__track::after, .mdc-switch.mdc-switch--disabled .mdc-switch__track::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-track-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch__handle-track {
  height: 100%;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  left: 0;
  right: auto;
  transform: translateX(0);
  width: calc(100% - var(--%NS%mat-slide-toggle-handle-width));
}
[dir=rtl] .mdc-switch__handle-track {
  left: auto;
  right: 0;
}
.mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(100%);
}
[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track {
  transform: translateX(-100%);
}

.mdc-switch__handle {
  display: flex;
  pointer-events: auto;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: auto;
  transition: width 75ms cubic-bezier(0.4, 0, 0.2, 1), height 75ms cubic-bezier(0.4, 0, 0.2, 1), margin 75ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--%NS%mat-slide-toggle-handle-width);
  height: var(--%NS%mat-slide-toggle-handle-height);
  border-radius: var(--%NS%mat-slide-toggle-handle-shape, var(--%NS%mat-sys-corner-full));
}
[dir=rtl] .mdc-switch__handle {
  left: auto;
  right: 0;
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-handle-size, 16px);
  margin: var(--%NS%mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px);
}
.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-selected-handle-size, 24px);
  margin: var(--%NS%mat-slide-toggle-selected-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons) {
  margin: var(--%NS%mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px);
}
.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons) {
  width: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
  height: var(--%NS%mat-slide-toggle-with-icon-handle-size, 24px);
}
.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  width: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
  height: var(--%NS%mat-slide-toggle-pressed-handle-size, 28px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%selected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px);
}
.mat-mdc-slide-toggle .mdc-switch--%NS%unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle {
  margin: var(--%NS%mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-handle-opacity, 1);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-handle-opacity, 0.38);
}
.mdc-switch__handle::before, .mdc-switch__handle::after {
  border: 1px solid transparent;
  border-radius: inherit;
  box-sizing: border-box;
  content: "";
  width: 100%;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1), border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}
@media (forced-colors: active) {
  .mdc-switch__handle::before, .mdc-switch__handle::after {
    border-color: currentColor;
  }
}
.mdc-switch--%NS%selected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-handle-color, var(--%NS%mat-sys-on-primary));
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-handle-color, var(--%NS%mat-sys-primary-container));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-handle-color, var(--%NS%mat-sys-primary-container));
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:hover:not(:focus):not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:focus:not(:active) .mdc-switch__handle::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--%NS%selected:active .mdc-switch__handle::after, .mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-selected-handle-color, var(--%NS%mat-sys-surface));
}
.mdc-switch--%NS%unselected:enabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-handle-color, var(--%NS%mat-sys-outline));
}
.mdc-switch--%NS%unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:focus:not(:active) .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-handle-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after {
  background: var(--%NS%mat-slide-toggle-disabled-unselected-handle-color, var(--%NS%mat-sys-on-surface));
}
.mdc-switch__handle::before {
  background: var(--%NS%mat-slide-toggle-handle-surface-color);
}

.mdc-switch__shadow {
  border-radius: inherit;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.mdc-switch:enabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-handle-elevation-shadow);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:hover:not(:focus):not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:focus:not(:active) .mdc-switch__shadow, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:active .mdc-switch__shadow, .mdc-switch.mdc-switch--disabled .mdc-switch__shadow {
  box-shadow: var(--%NS%mat-slide-toggle-disabled-handle-elevation-shadow);
}

.mdc-switch__ripple {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  width: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
  height: var(--%NS%mat-slide-toggle-state-layer-size, 40px);
}
.mdc-switch__ripple::after {
  content: "";
  opacity: 0;
}
.mdc-switch--disabled .mdc-switch__ripple::after {
  display: none;
}
.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after {
  display: block;
}
.mdc-switch:hover .mdc-switch__ripple::after {
  transition: 75ms opacity cubic-bezier(0, 0, 0.2, 1);
}
.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:focus .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:active .mdc-switch__ripple::after, .mat-mdc-slide-toggle-disabled-interactive.mdc-switch--%NS%disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after, .mdc-switch--%NS%unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%unselected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
  opacity: var(--%NS%mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}
.mdc-switch--%NS%selected:enabled:hover:not(:focus) .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:focus .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
.mdc-switch--%NS%selected:enabled:active .mdc-switch__ripple::after {
  background: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
  opacity: var(--%NS%mat-slide-toggle-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  transition: opacity 75ms linear;
}

.mdc-switch__icons {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 1;
  transform: translateZ(0);
}
.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-unselected-icon-opacity, 0.38);
}
.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons {
  opacity: var(--%NS%mat-slide-toggle-disabled-selected-icon-opacity, 0.38);
}

.mdc-switch__icon {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1);
}
.mdc-switch--unselected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-unselected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-unselected-icon-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-switch--selected .mdc-switch__icon {
  width: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  height: var(--%NS%mat-slide-toggle-selected-icon-size, 16px);
  fill: var(--%NS%mat-slide-toggle-selected-icon-color, var(--%NS%mat-sys-on-primary-container));
}
.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon {
  fill: var(--%NS%mat-slide-toggle-disabled-selected-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-switch--selected .mdc-switch__icon--on,
.mdc-switch--unselected .mdc-switch__icon--off {
  opacity: 1;
  transition: opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1);
}

.mat-mdc-slide-toggle {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
}
.mat-mdc-slide-toggle .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,
.mat-mdc-slide-toggle .mdc-switch__ripple::after {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),
.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty) {
  transform: translateZ(0);
}
.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before {
  content: "";
}
.mat-mdc-slide-toggle .mat-internal-form-field {
  color: var(--%NS%mat-slide-toggle-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-slide-toggle-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-slide-toggle-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-slide-toggle-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-slide-toggle-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-slide-toggle-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-slide-toggle .mat-ripple-element {
  opacity: 0.12;
}
.mat-mdc-slide-toggle .mat-focus-indicator::before {
  border-radius: 50%;
}
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,
.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after {
  transition: none;
}
.mat-mdc-slide-toggle .mdc-switch:enabled + .mdc-label {
  cursor: pointer;
}
.mat-mdc-slide-toggle .mdc-switch--disabled + label {
  color: var(--%NS%mat-slide-toggle-disabled-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-slide-toggle label:empty {
  display: none;
}

.mat-slide-toggle-full-width {
  width: 100%;
}
.mat-slide-toggle-full-width .mat-internal-form-field {
  width: 100%;
  justify-content: space-between;
}
.mat-slide-toggle-full-width .mat-internal-form-field label {
  margin: 0;
  flex-grow: 1;
  text-align: end;
}
.mat-slide-toggle-full-width .mdc-form-field--align-end label {
  text-align: start;
}

.mat-mdc-slide-toggle-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-slide-toggle-touch-target-size, 48px);
  width: 100%;
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-slide-toggle-touch-target-display, block);
}
[dir=rtl] .mat-mdc-slide-toggle-touch-target {
  left: auto;
  right: 50%;
  transform: translate(50%, -50%);
}
`],encapsulation:2})}return n})();var Xe=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=ge({type:n});static ɵinj=ue({imports:[J,ro]})}return n})();var rt=n=>({filtro:n});var Ye=n=>[`/admin/usuarios`,n];var ct=n=>({usuario:n});var lt=()=>({filtro:`SEM_ACESSO_30_DIAS`});var st=()=>({filtro:`SEM_LANCAMENTO`});var dt=n=>({acao:n});var Qe=(n,t)=>t.mes;var L=(n,t)=>t.id;var mt=(n,t)=>t.modulo;var pt=(n,t)=>t.acao;function gt(n,t){n&1&&sv(0,`mat-progress-bar`,3)}function ut(n,t){if(n&1&&(va(0,`p`,7),vC(1),Cd()),n&2){let e=zS();oi(),Tv(e.erro())}}function ht(n,t){if(n&1&&(va(0,`div`,11),sv(1,`app-indicador`,40),RC(2,`number`),sv(3,`app-indicador`,41),RC(4,`number`),sv(5,`app-indicador`,42),RC(6,`number`),sv(7,`app-indicador`,43),Cd()),n&2){let e=t;oi(),iv(`destaque`,!0)(`valor`,kC(2,11,e.ativos.valor)??``)(`variacao`,e.ativos.variacao),oi(2),iv(`valor`,kC(4,13,e.novos.valor)??``)(`rotulo`,`Novos cadastros em `+e.mes)(`variacao`,e.novos.variacao),oi(2),iv(`valor`,kC(6,15,e.lancamentos.valor)??``)(`rotulo`,`Lançamentos em `+e.mes)(`variacao`,e.lancamentos.variacao),oi(2),iv(`valor`,e.volume.valor)(`variacao`,e.volume.variacao)}}function _t(n,t){if(n&1&&(va(0,`div`,19)(1,`span`,44),vC(2),Cd(),sv(3,`span`,45),Cd()),n&2){let e=t.$implicit;oi(2),Tv(e.contasPessoais),oi(),Dv(`--%NS%cor`,e.atual?`#3b1478`:`#b9a8e6`)(`height`,e.altura,`%`),iv(`title`,e.contasPessoais+` contas pessoais`)}}function ft(n,t){if(n&1&&(va(0,`span`),vC(1),Cd()),n&2){let e=t.$implicit;bt$1(`atual`,e.atual),oi(),Tv(e.rotulo)}}function bt(n,t){if(n&1){let e=jS();va(0,`button`,46),dv(`click`,function(){let l=Jp(e).$implicit;return eh(zS().aba.set(l.id))}),vC(1),Cd()}if(n&2){let e=t.$implicit,i=zS();bt$1(`ativa`,i.aba()===e.id),rr(`aria-selected`,i.aba()===e.id),oi(),xd(` `,e.rotulo,` `)}}function vt(n,t){if(n&1&&(va(0,`a`,63)(1,`mat-icon`),vC(2,`receipt_long`),Cd()()),n&2){let e=zS().$implicit;iv(`queryParams`,NC(1,ct,e.id))}}function xt(n,t){if(n&1){let e=jS();va(0,`button`,65),dv(`click`,function(){Jp(e);let l=zS().$implicit;return eh(zS(2).excluir(l))}),va(1,`mat-icon`),vC(2,`delete_outline`),Cd()()}}function St(n,t){if(n&1){let e=jS();va(0,`tr`)(1,`td`)(2,`div`,53)(3,`span`,54),vC(4),Cd(),va(5,`div`,55),vC(6),va(7,`span`,56),vC(8),Cd()()()(),va(9,`td`,57),sv(10,`span`,58),vC(11),Cd(),va(12,`td`,59),vC(13),Cd(),va(14,`td`,59),vC(15),Cd(),va(16,`td`)(17,`div`,60)(18,`mat-slide-toggle`,61,1),dv(`change`,function(){let l=Jp(e).$implicit,p=KS(19);return eh(zS(2).alterarAtivo(l,p))}),Cd(),va(20,`span`),vC(21),Cd()()(),va(22,`td`,49)(23,`a`,62)(24,`mat-icon`),vC(25,`edit`),Cd()(),ui(26,vt,3,3,`a`,63),ui(27,xt,3,0,`button`,64),Cd()()}if(n&2){let e=t.$implicit,i=zS(2);oi(4),Tv(i.iniciais(e.nome)),oi(2),Tv(e.nome),oi(2),Tv(e.email),oi(2),Dv(`background`,i.corPerfil(e.role)),oi(),Tv(i.rotulosRole[e.role]),oi(2),Tv(e.ultimoAcesso?i.quando(e.ultimoAcesso):`Ainda não entrou`),oi(2),Tv(i.quando(e.dataCadastro)),oi(3),iv(`checked`,e.ativo)(`disabled`,e.id===i.eu()?.id),rr(`aria-label`,(e.ativo?`Desativar `:`Reativar `)+e.nome),oi(3),Tv(e.ativo?`Ativo`:`Inativo`),oi(2),iv(`routerLink`,NC(15,Ye,e.id)),oi(3),li(e.role===`PESSOAL`?26:-1),oi(),li(e.id!==i.eu()?.id?27:-1)}}function wt(n,t){if(n&1){let e=jS();va(0,`li`)(1,`span`,66),vC(2),Cd(),va(3,`a`,67)(4,`strong`),vC(5),Cd(),va(6,`span`),sv(7,`span`,58),vC(8),Cd()(),va(9,`mat-slide-toggle`,61,2),dv(`change`,function(){let l=Jp(e).$implicit,p=KS(10);return eh(zS(2).alterarAtivo(l,p))}),Cd()()}if(n&2){let e=t.$implicit,i=zS(2);oi(2),Tv(i.iniciais(e.nome)),oi(),iv(`routerLink`,NC(9,Ye,e.id)),oi(2),Tv(e.nome),oi(2),Dv(`background`,i.corPerfil(e.role)),oi(),xd(` `,e.ultimoAcesso?`Acesso: `+i.quando(e.ultimoAcesso):`Ainda não entrou`),oi(),iv(`checked`,e.ativo)(`disabled`,e.id===i.eu()?.id),rr(`aria-label`,(e.ativo?`Desativar `:`Reativar `)+e.nome)}}function yt(n,t){if(n&1&&(va(0,`div`,47)(1,`table`,48)(2,`thead`)(3,`tr`)(4,`th`),vC(5,`Usuário`),Cd(),va(6,`th`),vC(7,`Perfil`),Cd(),va(8,`th`),vC(9,`Último acesso`),Cd(),va(10,`th`),vC(11,`Cadastro`),Cd(),va(12,`th`),vC(13,`Status`),Cd(),va(14,`th`,49),vC(15,`Ações`),Cd()()(),va(16,`tbody`),AS(17,St,28,17,`tr`,null,L),Cd()()(),va(19,`ul`,50),AS(20,wt,11,11,`li`,null,L),Cd(),va(22,`p`,51)(23,`a`,52),vC(24),RC(25,`number`),Cd()()),n&2){let e=zS();oi(17),RS(e.usuarios()),oi(3),RS(e.usuarios()),oi(3),iv(`queryParams`,NC(4,rt,e.aba())),oi(),xd(`Ver todos os `,kC(25,2,e.totalUsuarios()),` usuários`)}}function Ct(n,t){n&1&&(va(0,`p`,26),vC(1,`Nenhum usuário neste filtro.`),Cd())}function Pt(n,t){n&1&&(va(0,`span`,76),vC(1,`em breve`),Cd())}function Ot(n,t){if(n&1&&sv(0,`span`,81),n&2){let e=zS().$implicit;Dv(`width`,e.pctDados,`%`)}}function Mt(n,t){if(n&1&&(va(0,`li`)(1,`span`,74)(2,`mat-icon`),vC(3),Cd()(),va(4,`span`,75),vC(5),ui(6,Pt,2,0,`span`,76),Cd(),va(7,`span`,77),sv(8,`span`,78),ui(9,Ot,1,2,`span`,79),Cd(),va(10,`span`,80),vC(11),RC(12,`number`),Cd()()),n&2){let e=t.$implicit,i=zS();bt$1(`em-breve`,!e.info.disponivel),oi(3),Tv(e.info.icone),oi(2),xd(` `,e.info.rotulo,` `),oi(),li(e.info.disponivel?-1:6),oi(),iv(`matTooltip`,e.ligados+` de `+i.totais.contasPessoaisAtivas+` contas ligaram`+(e.comDados!==null?` · `+e.comDados+` já têm dados`:``)),oi(),Dv(`width`,e.pctLigados,`%`),oi(),li(e.pctDados!==null?9:-1),oi(2),xd(``,FC(12,10,e.pctLigados,`1.0-0`),`%`)}}function Nt(n,t){if(n&1&&(va(0,`section`,27)(1,`div`,13)(2,`h2`),vC(3,`Uso dos módulos`),Cd(),va(4,`span`,68),vC(5),RC(6,`number`),Cd()(),va(7,`div`,69)(8,`span`),sv(9,`span`,15),vC(10,`Ligado na conta`),Cd(),va(11,`span`),sv(12,`span`,70),vC(13,`Já tem dados`),Cd()(),va(14,`ul`,71),AS(15,Mt,13,13,`li`,72,mt),Cd(),va(17,`p`,73),vC(18,` "Já tem dados" conta quem lançou receitas/despesas, cadastrou conta além da Carteira ou criou categoria própria. Dashboard e os módulos "em breve" não guardam dados para contar. `),Cd()()),n&2){let e=zS();oi(5),xd(``,kC(6,1,t.totais.contasPessoaisAtivas),` contas pessoais ativas`),oi(10),RS(e.modulos())}}function Et(n,t){if(n&1&&(vC(0),RC(1,`number`)),n&2){let e=zS();Nv(` `,kC(1,2,e.engajamento.semAcessoRegistrado),` `,e.engajamento.semAcessoRegistrado===1?`conta ainda não tem`:`contas ainda não têm`,` login registrado (o sistema passou a gravar o último acesso há pouco) e ficam fora de "pararam de usar". `)}}function kt(n,t){if(n&1&&(va(0,`section`,31)(1,`div`,13)(2,`h2`),vC(3,`Base de usuários`),Cd(),va(4,`a`,82),vC(5,`Ver usuários`),Cd()(),va(6,`div`,83)(7,`a`,84)(8,`mat-icon`),vC(9,`groups`),Cd(),va(10,`strong`),vC(11),RC(12,`number`),Cd(),va(13,`span`),vC(14),RC(15,`number`),RC(16,`number`),RC(17,`number`),Cd()(),va(18,`a`,85)(19,`mat-icon`),vC(20,`bedtime`),Cd(),va(21,`strong`),vC(22),RC(23,`number`),Cd(),va(24,`span`),vC(25,`Pararam de usar (30+ dias sem entrar)`),Cd()(),va(26,`a`,85)(27,`mat-icon`),vC(28,`hourglass_empty`),Cd(),va(29,`strong`),vC(30),RC(31,`number`),Cd(),va(32,`span`),vC(33,`Cadastraram e nunca lançaram`),Cd()()(),va(34,`p`,73),vC(35,` Contas pessoais ativas, situação de hoje. `),ui(36,Et,2,4),Cd()()),n&2){let e=t;oi(11),Tv(kC(12,10,e.totais.usuarios)),oi(3),xv(` usuários no total · `,kC(15,12,e.totais.ativos),` ativos · `,kC(16,14,e.totais.inativos),` inativos · `,kC(17,16,e.totais.administradores),` `,e.totais.administradores===1?`administrador`:`administradores`,` `),oi(4),iv(`queryParams`,TC(22,lt)),oi(4),Tv(kC(23,18,e.engajamento.semAcesso30Dias)),oi(4),iv(`queryParams`,TC(23,st)),oi(4),Tv(kC(31,20,e.engajamento.nuncaLancaram)),oi(6),li(e.engajamento.semAcessoRegistrado>0?36:-1)}}function At(n,t){if(n&1&&(va(0,`a`,87)(1,`mat-icon`),vC(2),Cd(),va(3,`strong`),vC(4),RC(5,`number`),Cd(),va(6,`span`),vC(7),Cd()()),n&2){let e=t.$implicit;bt$1(`alerta`,e.alerta&&e.valor>0),iv(`queryParams`,NC(8,dt,e.acao)),oi(2),Tv(e.icone),oi(2),Tv(kC(5,6,e.valor)),oi(3),Tv(e.rotulo)}}function It(n,t){if(n&1&&(va(0,`section`,32)(1,`div`,13)(2,`h2`),vC(3,`Segurança`),Cd(),va(4,`a`,38),vC(5,`Ver auditoria`),Cd()(),va(6,`div`,83),AS(7,At,8,10,`a`,86,pt),Cd()()),n&2){let e=zS();oi(7),RS(e.seguranca())}}function Dt(n,t){n&1&&(va(0,`span`,76),vC(1,`inativa`),Cd())}function Tt(n,t){if(n&1&&(va(0,`li`),sv(1,`app-icone-categoria`,88),va(2,`div`,89)(3,`div`,90)(4,`span`,91),vC(5),ui(6,Dt,2,0,`span`,76),Cd(),va(7,`strong`),vC(8),RC(9,`number`),Cd()(),va(10,`span`,92),sv(11,`span`,93),Cd(),va(12,`span`,94),vC(13),Cd()()()),n&2){let e=t.$implicit;oi(),iv(`categoria`,e)(`tamanho`,34),oi(4),Tv(e.nome),oi(),li(e.ativo?-1:6),oi(2),Tv(kC(9,11,e.lancamentos)),oi(3),Dv(`width`,e.pct,`%`)(`background`,e.cor||`#3b1478`),oi(2),Nv(``,e.usuarios,` `,e.usuarios===1?`usuário`:`usuários`)}}function zt(n,t){if(n&1&&(va(0,`ul`,36),AS(1,Tt,14,13,`li`,null,L),Cd()),n&2){let e=zS();oi(),RS(e.categorias())}}function Rt(n,t){n&1&&(va(0,`p`,26),vC(1,`Nenhuma categoria padrão cadastrada.`),Cd())}function Lt(n,t){if(n&1&&(va(0,`li`),sv(1,`span`,58),va(2,`div`)(3,`p`)(4,`strong`),vC(5),Cd(),vC(6),Cd(),va(7,`span`),vC(8),Cd()()()),n&2){let e=t.$implicit,i=zS(2);oi(),Dv(`background`,i.corAuditoria(e.acao)),oi(4),Tv(e.autorEmail),oi(),xd(` `,i.frase(e)),oi(2),Tv(i.quando(e.dataHora))}}function Ft(n,t){if(n&1&&(va(0,`ul`,39),AS(1,Lt,9,5,`li`,null,L),Cd()),n&2){let e=zS();oi(),RS(e.auditoria())}}function Vt(n,t){n&1&&(va(0,`p`,26),vC(1,`Nenhuma ação registrada ainda.`),Cd())}var Bt=[`Jan`,`Fev`,`Mar`,`Abr`,`Mai`,`Jun`,`Jul`,`Ago`,`Set`,`Out`,`Nov`,`Dez`];var We=23;var Ut=[{id:`TODOS`,rotulo:`Todos`},{id:`ATIVOS`,rotulo:`Ativos`},{id:`INATIVOS`,rotulo:`Inativos`},{id:`ADMINS`,rotulo:`Administradores`}];var qt={USUARIO_CRIADO:`criou`,USUARIO_ALTERADO:`alterou`,PERFIL_ALTERADO:`alterou o perfil de`,USUARIO_ATIVADO:`reativou`,USUARIO_DESATIVADO:`desativou`,USUARIO_EXCLUIDO:`excluiu`,CATEGORIA_PADRAO_CRIADA:`criou a categoria padrão`,CATEGORIA_PADRAO_ALTERADA:`alterou a categoria padrão`,CATEGORIA_PADRAO_ATIVADA:`ativou a categoria padrão`,CATEGORIA_PADRAO_DESATIVADA:`desativou a categoria padrão`,CONSULTA_TRANSACOES:`consultou`,DADOS_PESSOAIS_ALTERADOS:`alterou os dados pessoais de`,SENHA_ALTERADA:`trocou a senha de`,EMAIL_ALTERADO:`trocou o e-mail de acesso de`,SESSOES_ENCERRADAS:`encerrou as sessões de`,CONTA_BLOQUEADA:`errou a senha várias vezes; bloqueado temporariamente:`,CONTA_DESBLOQUEADA:`desbloqueou`,SENHA_PROVISORIA_GERADA:`gerou uma senha provisória para`};var Je={DADOS_PESSOAIS_ALTERADOS:`alterou os próprios dados pessoais`,SENHA_ALTERADA:`trocou a própria senha`,EMAIL_ALTERADO:`trocou o e-mail de acesso`,SESSOES_ENCERRADAS:`saiu de todos os dispositivos`,CONTA_BLOQUEADA:`errou a senha 5 vezes e teve a conta bloqueada por 15 minutos`};var Ze=class n$2{adminService=h(g);dialog=h(ee);snack=h(Qt);router=h(ce);mes=h(l);eu=h(n).perfil;iniciais=Te;abas=Ut;rotulosRole=e;painel=Ot$1(null);auditoria=Ot$1([]);usuarios=Ot$1([]);totalUsuarios=Ot$1(0);aba=Ot$1(`TODOS`);carregando=Ot$1(!0);erro=Ot$1(``);consulta;constructor(){this.mes.mesesAnteriores.set(We),(this.mes.chave()<i(new Date,-We)||this.mes.chave()>i(new Date))&&this.mes.irParaAtual(),Gs(()=>this.carregarPainel(this.mes.chave())),Gs(()=>this.carregarUsuarios(this.aba())),this.recarregarAuditoria()}ngOnDestroy(){this.mes.mesesAnteriores.set(null)}indicadores=VC(()=>{let t=this.painel();if(!t)return null;let e=this.mes.nome().toLowerCase();return{ativos:{valor:t.usuariosAtivos.atual,variacao:re(t.usuariosAtivos.atual,t.usuariosAtivos.anterior)},novos:{valor:t.novosCadastros.atual,variacao:re(t.novosCadastros.atual,t.novosCadastros.anterior)},lancamentos:{valor:t.lancamentos.atual,variacao:re(t.lancamentos.atual,t.lancamentos.anterior)},volume:{valor:$t(Number(t.volume.atual)),variacao:re(Number(t.volume.atual),Number(t.volume.anterior))},mes:e}});cadastros=VC(()=>{let t=this.painel()?.cadastrosPorMes??[],e=de$1(Math.max(0,...t.map(i=>i.contasPessoais)));return{maior:e,meses:t.map(i=>ne(A({},i),{rotulo:Bt[Number(i.mes.slice(5,7))-1],altura:i.contasPessoais/e*100,atual:i.mes===this.mes.chave()}))}});modulos=VC(()=>{let t=this.painel();if(!t)return[];let e=Math.max(1,t.totais.contasPessoaisAtivas);return t.modulos.map(i=>ne(A({},i),{info:o[i.modulo],pctLigados:i.ligados/e*100,pctDados:i.comDados===null?null:i.comDados/e*100}))});categorias=VC(()=>{let t=(this.painel()?.categoriasPadrao??[]).filter(i=>i.ativo||i.lancamentos>0).slice(0,6),e=Math.max(1,...t.map(i=>i.lancamentos));return t.map(i=>ne(A({},i),{pct:i.lancamentos/e*100}))});seguranca=VC(()=>{let t=this.painel()?.seguranca;return t?[{valor:t.contasBloqueadasHoje,rotulo:`Contas bloqueadas hoje`,icone:`lock_clock`,acao:`CONTA_BLOQUEADA`,alerta:!0},{valor:t.senhasTrocadasSemana,rotulo:`Senhas trocadas (7 dias)`,icone:`password`,acao:`SENHA_ALTERADA`,alerta:!1},{valor:t.sessoesEncerradasSemana,rotulo:`Sessões encerradas (7 dias)`,icone:`devices_off`,acao:`SESSOES_ENCERRADAS`,alerta:!1},{valor:t.emailsTrocadosSemana,rotulo:`E-mails trocados (7 dias)`,icone:`alternate_email`,acao:`EMAIL_ALTERADO`,alerta:!1}]:[]});carregarPainel(t){this.consulta?.unsubscribe(),this.carregando.set(!0),this.consulta=this.adminService.painel(t).subscribe({next:e=>{this.painel.set(e),this.erro.set(``),this.carregando.set(!1)},error:e=>{this.erro.set(nW(e,`Erro ao carregar os indicadores.`)),this.carregando.set(!1)}})}carregarUsuarios(t){let e=t===`ADMINS`?{role:`SUPER_ADMIN`}:t===`ATIVOS`?{ativo:!0}:t===`INATIVOS`?{ativo:!1}:{};this.adminService.listarUsuarios(e,0,5).subscribe({next:i=>{this.usuarios.set(i.items),this.totalUsuarios.set(i.totalItems)},error:()=>this.usuarios.set([])})}recarregarAuditoria(){this.adminService.listarAuditoria({},0,5).subscribe({next:t=>this.auditoria.set(t.items),error:()=>{}})}buscar(t){let e=t.trim();e&&this.router.navigate([`/admin/usuarios`],{queryParams:{busca:e}})}alterarAtivo(t,e){let i=!t.ativo;F(this.dialog,{titulo:i?`Reativar usuário`:`Desativar usuário`,mensagem:i?`${t.nome} volta a entrar no FinControl.`:`${t.nome} perde o acesso na hora, inclusive nas sess\xF5es j\xE1 abertas. O cadastro e o hist\xF3rico continuam guardados.`,confirmar:i?`Reativar`:`Desativar`}).subscribe(l=>{if(!l){e.checked=t.ativo;return}this.adminService.alterarAtivoUsuario(t.id,i).subscribe({next:()=>{this.avisar(i?`Usuário reativado.`:`Usuário desativado.`),this.carregarUsuarios(this.aba()),this.carregarPainel(this.mes.chave()),this.recarregarAuditoria()},error:p=>{e.checked=t.ativo,this.avisar(nW(p,`Não foi possível alterar o usuário.`))}})})}excluir(t){F(this.dialog,{titulo:`Excluir usuário`,mensagem:`Excluir ${t.nome}? S\xF3 \xE9 poss\xEDvel para quem n\xE3o tem hist\xF3rico (lan\xE7amentos ou a\xE7\xF5es na auditoria); nesse caso, desative.`}).subscribe(e=>{e&&this.adminService.excluirUsuario(t.id).subscribe({next:()=>{this.avisar(`Usuário excluído.`),this.carregarUsuarios(this.aba()),this.carregarPainel(this.mes.chave()),this.recarregarAuditoria()},error:i=>this.avisar(nW(i,`Não foi possível excluir.`))})})}frase(t){if(Je[t.acao]&&t.alvo?.includes(`(${t.autorEmail})`))return Je[t.acao];let e=t.alvo?t.alvo.charAt(0).toLowerCase()+t.alvo.slice(1):``;return`${qt[t.acao]??t.acao.toLowerCase().replaceAll(`_`,` `)} ${e}`.trim()}corAuditoria(t){return/DESATIV|EXCLU|BLOQUEADA/.test(t)?`#d0343f`:t.startsWith(`CONSULTA`)?`#2563c9`:t.startsWith(`CATEGORIA`)?`#3b1478`:`#f5c518`}quando(t){if(!t)return`—`;let e=t.slice(0,10),i$1=t.slice(11,16),l=new Date;return l.setDate(l.getDate()-1),e===n$1()?i$1?`Hoje, ${i$1}`:`Hoje`:e===`${i(l)}-${String(l.getDate()).padStart(2,`0`)}`?i$1?`Ontem, ${i$1}`:`Ontem`:`${e.slice(8,10)}/${e.slice(5,7)}/${e.slice(0,4)}`}corPerfil(t){return t===`SUPER_ADMIN`?`#f5c518`:`#3b1478`}avisar(t){this.snack.open(t,`Ok`,{duration:4e3,verticalPosition:`top`})}static ɵfac=function(e){return new(e||n$2)};static ɵcmp=Le({type:n$2,selectors:[[`app-admin-painel`]],decls:75,vars:17,consts:[[`termo`,``],[`t`,``],[`tc`,``],[`mode`,`indeterminate`,1,`carregando`],[1,`conteudo-celular`],[1,`cabeca-celular`,`so-celular`],[1,`sobre`],[1,`cartao`,`vazio`,`erro`],[1,`painel`],[1,`col-principal`],[1,`titulo-secao`,`so-computador`],[1,`indicadores`,`c-indicadores`],[1,`cartao`,`c-cadastros`],[1,`cartao-cabeca`],[1,`legenda`],[1,`bolinha`,2,`background`,`#3b1478`],[`role`,`img`,`aria-label`,`Novos cadastros de contas pessoais nos últimos 6 meses`,1,`grafico`],[1,`eixo-y`],[1,`area`],[1,`mes-col`],[1,`rotulos-x`],[3,`atual`],[1,`cartao`,`c-usuarios`],[`role`,`tablist`,1,`abas`,`claras`,`so-computador`],[`type`,`button`,`role`,`tab`,3,`ativa`],[`routerLink`,`/admin/usuarios`,1,`link`,`so-celular`],[1,`vazio`],[1,`cartao`,`c-modulos`],[1,`col-lateral`],[1,`cartao`,`busca-admin`,`c-busca`,3,`submit`],[`type`,`search`,`placeholder`,`Buscar usuário por nome ou e-mail`,`aria-label`,`Buscar usuário por nome ou e-mail`],[1,`cartao`,`c-base`],[1,`cartao`,`c-seguranca`],[1,`cartao`,`c-categorias`],[`routerLink`,`/admin/categorias`,1,`link`],[1,`discreto`,`sub-cartao`],[1,`categorias-uso`],[1,`cartao`,`c-auditoria`],[`routerLink`,`/admin/auditoria`,1,`link`],[1,`auditoria`],[`icone`,`person_outline`,`cor`,`amarelo`,`rotulo`,`Usuários ativos no mês`,`detalhe`,`com lançamento no mês`,3,`destaque`,`valor`,`variacao`],[`icone`,`person_add`,`cor`,`roxo`,`detalhe`,`sem cadastros no mês anterior`,3,`valor`,`rotulo`,`variacao`],[`icone`,`swap_vert`,`cor`,`azul`,`detalhe`,`sem lançamentos no mês anterior`,3,`valor`,`rotulo`,`variacao`],[`icone`,`trending_up`,`cor`,`verde`,`rotulo`,`Volume registrado`,`detalhe`,`receitas + despesas do mês`,3,`valor`,`variacao`],[1,`valor-col`],[1,`col`,`larga`,3,`title`],[`type`,`button`,`role`,`tab`,3,`click`],[1,`tabela-rolagem`,`so-computador`],[1,`tabela`],[1,`num`],[1,`agenda`,`so-celular`],[1,`rodape-cartao`,`so-computador`],[`routerLink`,`/admin/usuarios`,1,`link-roxo`,3,`queryParams`],[1,`pessoa`],[1,`sigla`,`cinza`],[1,`quem`],[1,`sub`],[1,`perfil`],[1,`bolinha`],[1,`cinza`],[1,`toggle`],[3,`change`,`checked`,`disabled`],[`matTooltip`,`Editar`,`aria-label`,`Editar`,1,`acao-icone`,3,`routerLink`],[`routerLink`,`/admin/transacoes`,`matTooltip`,`Ver lançamentos (fica na auditoria)`,`aria-label`,`Ver lançamentos`,1,`acao-icone`,3,`queryParams`],[`type`,`button`,`matTooltip`,`Excluir`,`aria-label`,`Excluir`,1,`acao-icone`],[`type`,`button`,`matTooltip`,`Excluir`,`aria-label`,`Excluir`,1,`acao-icone`,3,`click`],[1,`sigla`,`grande`],[1,`info`,`link-linha`,3,`routerLink`],[1,`discreto`],[1,`legenda`,`legenda-modulos`],[1,`bolinha`,2,`background`,`#f5c518`],[1,`modulos`],[3,`em-breve`],[1,`nota`],[1,`mod-icone`],[1,`mod-nome`],[1,`selo`],[1,`mod-trilha`,3,`matTooltip`],[1,`mod-barra`,`ligado`],[1,`mod-barra`,`dados`,3,`width`],[1,`mod-pct`],[1,`mod-barra`,`dados`],[`routerLink`,`/admin/usuarios`,1,`link`],[1,`seguranca`],[`routerLink`,`/admin/usuarios`,1,`seg-item`,`largo`],[`routerLink`,`/admin/usuarios`,1,`seg-item`,3,`queryParams`],[`routerLink`,`/admin/auditoria`,1,`seg-item`,3,`alerta`,`queryParams`],[`routerLink`,`/admin/auditoria`,1,`seg-item`,3,`queryParams`],[3,`categoria`,`tamanho`],[1,`cat-info`],[1,`cat-linha`],[1,`cat-nome`],[1,`cat-trilha`],[1,`cat-barra`],[1,`cat-sub`]],template:function(e,i){if(e&1){let l=jS();ui(0,gt,1,0,`mat-progress-bar`,3),va(1,`div`,4)(2,`div`,5)(3,`p`,6),vC(4),Cd(),va(5,`h1`),vC(6,`Visão geral do sistema`),Cd()(),ui(7,ut,2,1,`p`,7),va(8,`div`,8)(9,`div`,9)(10,`h2`,10),vC(11,`Visão geral do sistema`),Cd(),ui(12,ht,8,17,`div`,11),va(13,`section`,12)(14,`div`,13)(15,`h2`),vC(16,`Novos cadastros`),Cd(),va(17,`div`,14)(18,`span`),sv(19,`span`,15),vC(20,`Contas pessoais por mês`),Cd()()(),va(21,`div`,16)(22,`div`,17)(23,`span`),vC(24),RC(25,`number`),Cd(),va(26,`span`),vC(27),RC(28,`number`),Cd(),va(29,`span`),vC(30,`0`),Cd()(),va(31,`div`,18),AS(32,_t,4,6,`div`,19,Qe),Cd(),va(34,`div`,20),AS(35,ft,2,3,`span`,21,Qe),Cd()()(),va(37,`section`,22)(38,`div`,13)(39,`h2`),vC(40,`Usuários`),Cd(),va(41,`div`,23),AS(42,bt,2,4,`button`,24,L),Cd(),va(44,`a`,25),vC(45,`Ver todos`),Cd()(),ui(46,yt,26,6)(47,Ct,2,0,`p`,26),Cd(),ui(48,Nt,19,3,`section`,27),Cd(),va(49,`div`,28)(50,`form`,29),dv(`submit`,function(v){Jp(l);let Ke=KS(54);return v.preventDefault(),eh(i.buscar(Ke.value))}),va(51,`mat-icon`),vC(52,`search`),Cd(),sv(53,`input`,30,0),Cd(),ui(55,kt,37,24,`section`,31),ui(56,It,9,0,`section`,32),va(57,`section`,33)(58,`div`,13)(59,`h2`),vC(60,`Categorias padrão mais usadas`),Cd(),va(61,`a`,34),vC(62,`Gerenciar`),Cd()(),va(63,`p`,35),vC(64),Cd(),ui(65,zt,3,0,`ul`,36)(66,Rt,2,0,`p`,26),Cd(),va(67,`section`,37)(68,`div`,13)(69,`h2`),vC(70,`Auditoria recente`),Cd(),va(71,`a`,38),vC(72,`Ver log`),Cd()(),ui(73,Ft,3,0,`ul`,39)(74,Vt,2,0,`p`,26),Cd()()()()}if(e&2){let l,p,v;li(i.carregando()?0:-1),oi(4),xd(`Administração · `,i.mes.rotulo()),oi(3),li(i.erro()?7:-1),oi(5),li((l=i.indicadores())?12:-1,l),oi(12),Tv(kC(25,13,i.cadastros().maior)),oi(3),Tv(kC(28,15,i.cadastros().maior/2)),oi(5),RS(i.cadastros().meses),oi(3),RS(i.cadastros().meses),oi(7),RS(i.abas),oi(4),li(i.usuarios().length?46:47),oi(2),li((p=i.painel())?48:-1,p),oi(7),li((v=i.painel())?55:-1,v),oi(),li(i.seguranca().length?56:-1),oi(8),xd(`Lançamentos em `,i.mes.nome().toLowerCase(),`, somando as cópias de todas as contas.`),oi(),li(i.categorias().length?65:66),oi(8),li(i.auditoria().length?73:74)}},dependencies:[Nt$1,JG,XG,Z,L$1,Xe,J,Yt,mt$1,A$1,h$1,WT],styles:[`[_nghost-%COMP%]{display:block}.painel[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,440px);gap:24px;align-items:start}.col-principal[_ngcontent-%COMP%], .col-lateral[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:24px;min-width:0}.linha-topo[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(260px,.75fr) minmax(0,1fr);gap:24px}.indicadores[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}.titulo-secao[_ngcontent-%COMP%]{margin:4px 0 -8px;font-size:18px;font-weight:500;color:var(--%NS%fc-roxo)}.cartao[_ngcontent-%COMP%]{background:var(--%NS%fc-surface);border-radius:20px;box-shadow:var(--%NS%fc-shadow);padding:24px 28px;min-width:0}.cartao-cabeca[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px 12px;margin-bottom:16px}.cartao-cabeca[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0;font-size:18px;font-weight:500;color:var(--%NS%fc-roxo)}.cartao-cabeca[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%], .link-roxo[_ngcontent-%COMP%]{color:var(--%NS%fc-roxo);font-size:14px;text-decoration:underline;text-underline-offset:3px;white-space:nowrap;background:none;border:none;font-family:inherit;cursor:pointer;padding:0}.cartao-cabeca[_ngcontent-%COMP%]   .discreto[_ngcontent-%COMP%]{font-size:14px;color:var(--%NS%fc-muted)}.rodape-cartao[_ngcontent-%COMP%]{margin:16px 0 0;text-align:center;font-size:13px;color:var(--%NS%fc-muted)}.carregando[_ngcontent-%COMP%]{margin:-20px 0 16px}.vazio.erro[_ngcontent-%COMP%]{color:var(--%NS%fc-danger)}.vazio[_ngcontent-%COMP%]{padding:20px 0 8px;text-align:center;color:var(--%NS%fc-muted);font-size:14px}.barras[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}.barras[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:grid;grid-template-columns:minmax(90px,160px) minmax(0,1fr) 52px;align-items:center;gap:16px;font-size:15px}.barras[_ngcontent-%COMP%]   .nome[_ngcontent-%COMP%]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.barras[_ngcontent-%COMP%]   .trilha[_ngcontent-%COMP%]{display:block;height:14px}.barras[_ngcontent-%COMP%]   .barra[_ngcontent-%COMP%]{display:block;height:100%;min-width:6px;border-radius:4px;background:var(--%NS%cor)}.barras[_ngcontent-%COMP%]   .pct[_ngcontent-%COMP%]{text-align:right;font-size:13px;color:var(--%NS%fc-muted);font-variant-numeric:tabular-nums}.agenda[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0}.agenda[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--%NS%fc-border)}.agenda[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:first-child{padding-top:4px}.dia[_ngcontent-%COMP%]{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;background:#efeafb;color:var(--%NS%fc-roxo);font-weight:500}.dia.urgente[_ngcontent-%COMP%]{background:var(--%NS%fc-danger-soft);color:#d0343f}.info[_ngcontent-%COMP%]{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.info[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-weight:400;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:13px;color:var(--%NS%fc-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.valor-despesa[_ngcontent-%COMP%], .valor-receita[_ngcontent-%COMP%]{font-size:16px;white-space:nowrap;font-variant-numeric:tabular-nums}.valor-despesa[_ngcontent-%COMP%]{color:#d0343f}.valor-receita[_ngcontent-%COMP%]{color:#15803d}.legenda[_ngcontent-%COMP%]{display:flex;gap:18px;font-size:14px;color:var(--%NS%fc-muted)}.legenda[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:6px}.bolinha[_ngcontent-%COMP%]{width:10px;height:10px;border-radius:50%;display:inline-block;flex-shrink:0}.grafico[_ngcontent-%COMP%]{display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-rows:200px auto;column-gap:12px}.eixo-y[_ngcontent-%COMP%]{display:flex;flex-direction:column;justify-content:space-between;font-size:12px;color:var(--%NS%fc-muted);text-align:right;margin:-6px 0}.area[_ngcontent-%COMP%]{position:relative;display:flex;align-items:flex-end;justify-content:space-around;border-bottom:1px solid var(--%NS%fc-border);background:linear-gradient(var(--%NS%fc-border) 1px,transparent 1px) 0 0 / 100% 50%}.mes-col[_ngcontent-%COMP%]{display:flex;align-items:flex-end;gap:4px;height:100%}.mes-col[_ngcontent-%COMP%]   .col[_ngcontent-%COMP%]{width:16px;min-height:2px;border-radius:4px 4px 0 0;background:var(--%NS%cor)}.rotulos-x[_ngcontent-%COMP%]{grid-column:2;display:flex;justify-content:space-around;padding-top:8px;font-size:13px;color:var(--%NS%fc-muted)}.rotulos-x[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{width:36px;text-align:center}.rosca[_ngcontent-%COMP%]{width:180px;height:180px;margin:8px auto 24px;border-radius:50%;display:grid;place-items:center}.rosca-centro[_ngcontent-%COMP%]{width:126px;height:126px;border-radius:50%;background:var(--%NS%fc-surface);display:flex;flex-direction:column;align-items:center;justify-content:center}.rosca-centro[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:22px;font-weight:500;color:var(--%NS%fc-roxo)}.rosca-centro[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:13px;color:var(--%NS%fc-muted)}.legenda-lista[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0}.legenda-lista[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--%NS%fc-border);font-size:15px}.legenda-lista[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:last-child{border-bottom:none}.legenda-lista[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{margin-left:auto;font-weight:400;font-variant-numeric:tabular-nums}.tabela-rolagem[_ngcontent-%COMP%]{overflow-x:auto;margin:0 -4px}.tabela[_ngcontent-%COMP%]{width:100%;border-collapse:collapse;font-size:15px}.tabela[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{padding:10px 16px;text-align:left;font-weight:400;font-size:14px;color:var(--%NS%fc-muted);border-bottom:1px solid var(--%NS%fc-border);white-space:nowrap}.tabela[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:16px;border-bottom:1px solid var(--%NS%fc-border);vertical-align:middle}.tabela[_ngcontent-%COMP%]   .num[_ngcontent-%COMP%]{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.tabela[_ngcontent-%COMP%]   .sub[_ngcontent-%COMP%]{display:block;font-size:13px;color:var(--%NS%fc-muted)}.tabela[_ngcontent-%COMP%]   tfoot[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{border-bottom:none;font-weight:500}.sigla[_ngcontent-%COMP%]{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;flex-shrink:0;background:#efeafb;color:var(--%NS%fc-roxo);font-size:13px;font-weight:500}.pessoa[_ngcontent-%COMP%]{display:flex;align-items:center;gap:14px;min-width:0}.abas[_ngcontent-%COMP%]{display:flex;gap:4px}.abas[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{height:36px;padding:0 16px;border:none;border-radius:18px;background:none;color:var(--%NS%fc-muted);font:inherit;font-size:14px;cursor:pointer}.abas[_ngcontent-%COMP%]   button.ativa[_ngcontent-%COMP%]{background:var(--%NS%fc-roxo);color:#fff}.abas.claras[_ngcontent-%COMP%]   button.ativa[_ngcontent-%COMP%]{background:#efeafb;color:var(--%NS%fc-roxo)}.status[_ngcontent-%COMP%]{font-size:14px;white-space:nowrap}.status.ok[_ngcontent-%COMP%]{color:#15803d}.status.aviso[_ngcontent-%COMP%]{color:#a16207}.status.off[_ngcontent-%COMP%]{color:var(--%NS%fc-muted)}.etiqueta[_ngcontent-%COMP%]{display:inline-block;margin:2px 4px 2px 0;padding:3px 10px;border-radius:12px;background:#efeafb;color:var(--%NS%fc-roxo);font-size:13px;white-space:nowrap}.em-breve-corpo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:16px;padding:18px;border:1.5px dashed #d9d3e8;border-radius:14px;color:var(--%NS%fc-muted);font-size:14px;line-height:1.5}.em-breve-corpo[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex-shrink:0;font-size:30px;width:30px;height:30px;color:#b9a8e6}.selo[_ngcontent-%COMP%]{padding:2px 10px;border-radius:10px;background:#fff6d6;color:#8a6100;font-size:12px;white-space:nowrap}.acao-icone[_ngcontent-%COMP%]{width:36px;height:36px;border:none;border-radius:50%;background:none;color:var(--%NS%fc-muted);display:inline-grid;place-items:center;cursor:pointer;text-decoration:none}.acao-icone[_ngcontent-%COMP%]:hover{background:#f1eef8;color:var(--%NS%fc-roxo)}.acao-icone[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:20px;width:20px;height:20px}.cabeca-celular[_ngcontent-%COMP%]{margin:-20px -16px -56px;padding:8px 16px 76px;background:var(--%NS%fc-roxo);color:#fff}.cabeca-celular[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{margin:0;font-size:26px;font-weight:500}.cabeca-celular[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:4px 0 0;font-size:14px;color:#ffffffbf}.chip-contexto[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 16px 0 6px;border-radius:22px;background:#ffffff1f;font-size:16px}.chip-contexto[_ngcontent-%COMP%]   .bola[_ngcontent-%COMP%]{width:34px;height:34px;border-radius:50%;background:var(--%NS%fc-amarelo);color:var(--%NS%fc-roxo-escuro);display:grid;place-items:center}.chip-contexto[_ngcontent-%COMP%]   .bola[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:18px;width:18px;height:18px}@media(max-width:1280px){.painel[_ngcontent-%COMP%]{grid-template-columns:minmax(0,1fr)}.indicadores[_ngcontent-%COMP%]{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:760px){.painel[_ngcontent-%COMP%], .col-principal[_ngcontent-%COMP%], .col-lateral[_ngcontent-%COMP%], .linha-topo[_ngcontent-%COMP%]{display:contents}.conteudo-celular[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:16px}.cartao[_ngcontent-%COMP%]{padding:20px;border-radius:18px}.cartao-cabeca[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:17px}.indicadores[_ngcontent-%COMP%]{gap:12px}.barras[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{grid-template-columns:100px minmax(0,1fr) 46px;gap:10px}.tabela[_ngcontent-%COMP%]{font-size:14px}.tabela[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .tabela[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:12px 8px}}`,`.cabeca-celular[_ngcontent-%COMP%]   .sobre[_ngcontent-%COMP%]{margin:0 0 2px}.cinza[_ngcontent-%COMP%]{color:var(--%NS%fc-muted)}.sigla.cinza[_ngcontent-%COMP%]{background:#f1f0f5;color:var(--%NS%fc-text)}.sigla.grande[_ngcontent-%COMP%]{width:46px;height:46px}.quem[_ngcontent-%COMP%]{min-width:0}.perfil[_ngcontent-%COMP%]{white-space:nowrap;font-size:14px}.perfil[_ngcontent-%COMP%]   .bolinha[_ngcontent-%COMP%]{margin-right:8px}.toggle[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px;white-space:nowrap}.link-linha[_ngcontent-%COMP%]{color:inherit;text-decoration:none}a.link-linha[_ngcontent-%COMP%]:hover{color:var(--%NS%fc-roxo)}.agenda[_ngcontent-%COMP%]   .info[_ngcontent-%COMP%]   .bolinha[_ngcontent-%COMP%]{width:8px;height:8px}.busca-admin[_ngcontent-%COMP%]{display:flex;align-items:center;gap:14px;padding:0 24px;height:64px}.busca-admin[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%fc-roxo)}.busca-admin[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{flex:1;min-width:0;border:none;outline:none;background:none;font:inherit;font-size:16px}.auditoria[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0}.auditoria[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--%NS%fc-border)}.auditoria[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:first-child{padding-top:0}.auditoria[_ngcontent-%COMP%]   .bolinha[_ngcontent-%COMP%]{width:8px;height:8px;margin-top:7px}.auditoria[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:15px;line-height:1.45;word-break:break-word}.auditoria[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-weight:500}.auditoria[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:13px;color:var(--%NS%fc-muted)}.mes-col[_ngcontent-%COMP%]{flex-direction:column;align-items:center;justify-content:flex-end;gap:4px}.mes-col[_ngcontent-%COMP%]   .col.larga[_ngcontent-%COMP%]{width:28px}.valor-col[_ngcontent-%COMP%]{font-size:12px;color:var(--%NS%fc-muted);font-variant-numeric:tabular-nums}.rotulos-x[_ngcontent-%COMP%]   span.atual[_ngcontent-%COMP%]{color:var(--%NS%fc-roxo);font-weight:600}.discreto[_ngcontent-%COMP%]{font-size:13px;color:var(--%NS%fc-muted)}.sub-cartao[_ngcontent-%COMP%]{margin:-8px 0 16px}.nota[_ngcontent-%COMP%]{margin:16px 0 0;font-size:12px;line-height:1.5;color:var(--%NS%fc-muted)}.legenda-modulos[_ngcontent-%COMP%]{margin:-6px 0 14px}.modulos[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:12px 28px}.modulos[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:grid;grid-template-columns:30px minmax(0,1fr) 42px;grid-template-rows:auto auto;column-gap:10px;row-gap:4px;align-items:center}.mod-icone[_ngcontent-%COMP%]{grid-column:1;grid-row:1 / 3;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#efeafb;color:var(--%NS%fc-roxo)}.mod-icone[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:17px;width:17px;height:17px}.mod-nome[_ngcontent-%COMP%]{grid-column:2;grid-row:1;font-size:14px;display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mod-pct[_ngcontent-%COMP%]{grid-column:3;grid-row:1 / 3;text-align:right;font-size:14px;font-weight:600;font-variant-numeric:tabular-nums}.mod-trilha[_ngcontent-%COMP%]{grid-column:2;grid-row:2;position:relative;height:8px;border-radius:4px;background:#f1eef8;overflow:hidden}.mod-barra[_ngcontent-%COMP%]{position:absolute;inset:0 auto 0 0;border-radius:4px}.mod-barra.ligado[_ngcontent-%COMP%]{background:var(--%NS%fc-roxo)}.mod-barra.dados[_ngcontent-%COMP%]{top:2px;bottom:2px;background:var(--%NS%fc-amarelo)}.modulos[_ngcontent-%COMP%]   li.em-breve[_ngcontent-%COMP%]   .mod-icone[_ngcontent-%COMP%]{background:#f4f4f6;color:var(--%NS%fc-muted)}.modulos[_ngcontent-%COMP%]   li.em-breve[_ngcontent-%COMP%]   .mod-barra.ligado[_ngcontent-%COMP%]{background:#b9a8e6}.seguranca[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:10px}.seg-item[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:2px;padding:14px;border-radius:14px;background:#f7f5fc;color:var(--%NS%fc-text);text-decoration:none;transition:background .15s}.seg-item[_ngcontent-%COMP%]:hover{background:#efeafb}.seg-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:var(--%NS%fc-roxo);font-size:20px;width:20px;height:20px;margin-bottom:4px}.seg-item[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-size:24px;font-weight:600;line-height:1.1}.seg-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:12px;color:var(--%NS%fc-muted);line-height:1.3}.seg-item.largo[_ngcontent-%COMP%]{grid-column:1 / -1}.seg-item.alerta[_ngcontent-%COMP%]{background:#fdecee}.seg-item.alerta[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%], .seg-item.alerta[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:#d0343f}.categorias-uso[_ngcontent-%COMP%]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}.categorias-uso[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px}.cat-info[_ngcontent-%COMP%]{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.cat-linha[_ngcontent-%COMP%]{display:flex;justify-content:space-between;gap:8px;font-size:14px}.cat-nome[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px}.cat-trilha[_ngcontent-%COMP%]{height:6px;border-radius:3px;background:#f1eef8;overflow:hidden}.cat-barra[_ngcontent-%COMP%]{display:block;height:100%;border-radius:3px}.cat-sub[_ngcontent-%COMP%]{font-size:12px;color:var(--%NS%fc-muted)}@media(max-width:1100px){.modulos[_ngcontent-%COMP%]{grid-template-columns:1fr}}@media(max-width:760px){.cabeca-celular[_ngcontent-%COMP%]{order:0}.c-indicadores[_ngcontent-%COMP%]{order:1}.c-busca[_ngcontent-%COMP%]{order:2}.c-base[_ngcontent-%COMP%]{order:3}.c-seguranca[_ngcontent-%COMP%]{order:4}.c-usuarios[_ngcontent-%COMP%]{order:5}.c-cadastros[_ngcontent-%COMP%]{order:6}.c-categorias[_ngcontent-%COMP%]{order:7}.c-modulos[_ngcontent-%COMP%]{order:8}.c-auditoria[_ngcontent-%COMP%]{order:9}.vazio.erro[_ngcontent-%COMP%]{order:1}.busca-admin[_ngcontent-%COMP%]{height:60px;padding:0 20px}.mes-col[_ngcontent-%COMP%]   .col.larga[_ngcontent-%COMP%]{width:20px}}`]})};function $t(n){return n>=1e6?`R$ ${(n/1e6).toLocaleString(`pt-BR`,{maximumFractionDigits:2})} mi`:n>=1e4?`R$ ${(n/1e3).toLocaleString(`pt-BR`,{maximumFractionDigits:1})} mil`:n.toLocaleString(`pt-BR`,{style:`currency`,currency:`BRL`})}export{Ze as AdminPainel};