import{A as GG,Br as tv,Cn as bs,Dn as ci,Dt as Rb,En as ce$1,Er as or,Ft as Sd,G as Jr,Gr as v,Ht as Td,In as fC,Jn as hM,Kr as vC,Kt as US,Mt as SG,Nn as dv,O as Fb,Pn as et,Pr as rr,Q as Md,Qt as WG,Sr as ni,U as Je,Un as ge$1,V as Iv,Xn as hf,Yn as ha,Zr as wC,a as Aa,an as Xp,c as BS,cn as YG,dr as ke$1,fr as le$1,ft as Oe$1,g as Cd,gn as ai,gr as lv,gt as PT,ii as xv,ir as jT,j as GS,mr as li,n as $t,on as Xr,p as CG,pn as _C,pt as Ot,qn as h,qr as vM,r as A,si as yt,sn as Xv,t as $S,ti as wv,un as Z3,ut as OS,vn as av,wn as bt,wr as nv,wt as RC,x as Df,xr as ne,xt as Qp,y as Db,yt as Qg,zt as TC}from"./chunk-CNMUGzne.js";import"./chunk-CfNAlzkh.js";import{B as i,I as Yt,L as mt,R as m,b as O$1,c as Nt}from"./main-EBT65UBW.js";import{t as h$1}from"./chunk-CKS_A7ex.js";import{t as Qt}from"./chunk-DnYfL0n2.js";import{n as Z,t as L$1}from"./chunk-CfxLhuU2.js";import{a as Qt$1,c as Xt$1,d as qt,i as Kt$1,l as Yt$1,n as Gt,o as Vt,r as Jt$1,s as Wt,t as $t$1,u as Zt$1}from"./chunk-BWi_yB-A.js";import{n as re$1,t as ci$1}from"./chunk-C-_5Qlp1.js";import{t as i$1}from"./chunk-Cy0jnUCz.js";var re=[`button`];var le=[`*`];function se(e,o){if(e&1&&(ha(0,`div`,2),nv(1,`mat-pseudo-checkbox`,6),Sd()),e&2){let t=BS();ni(),tv(`disabled`,t.disabled)}}var Kt=new v(`MAT_BUTTON_TOGGLE_DEFAULT_OPTIONS`,{providedIn:`root`,factory:()=>({hideSingleSelectionIndicator:!1,hideMultipleSelectionIndicator:!1,disabledInteractive:!1})});var Zt=new v(`MatButtonToggleGroup`);var ce={provide:O$1,useExisting:bs(()=>j),multi:!0};var L=class{source;value;constructor(o,t){this.source=o,this.value=t}};var j=(()=>{class e{_changeDetector=h(Xv);_dir=h(vM,{optional:!0});_multiple=!1;_disabled=!1;_disabledInteractive=!1;_selectionModel;_rawValue;_controlValueAccessorChangeFn=()=>{};_onTouched=()=>{};_buttonToggles;appearance;get name(){return this._name}set name(t){this._name=t,this._markButtonsForCheck()}_name=h(Df).getId(`mat-button-toggle-group-`);vertical=!1;get value(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t.map(n=>n.value):t[0]?t[0].value:void 0}set value(t){this._setSelectionByValue(t),this.valueChange.emit(this.value)}valueChange=new ke$1;get selected(){let t=this._selectionModel?this._selectionModel.selected:[];return this.multiple?t:t[0]||null}get multiple(){return this._multiple}set multiple(t){this._multiple=t,this._markButtonsForCheck()}get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._markButtonsForCheck()}get disabledInteractive(){return this._disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t,this._markButtonsForCheck()}get dir(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}change=new ke$1;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(t){this._hideSingleSelectionIndicator=t,this._markButtonsForCheck()}_hideSingleSelectionIndicator;get hideMultipleSelectionIndicator(){return this._hideMultipleSelectionIndicator}set hideMultipleSelectionIndicator(t){this._hideMultipleSelectionIndicator=t,this._markButtonsForCheck()}_hideMultipleSelectionIndicator;constructor(){let t=h(Kt,{optional:!0});this.appearance=t&&t.appearance?t.appearance:`standard`,this._hideSingleSelectionIndicator=t?.hideSingleSelectionIndicator??!1,this._hideMultipleSelectionIndicator=t?.hideMultipleSelectionIndicator??!1}ngOnInit(){this._selectionModel=new m(this.multiple,void 0,!1)}ngAfterContentInit(){this._selectionModel.select(...this._buttonToggles.filter(t=>t.checked)),this.multiple||this._initializeTabIndex()}writeValue(t){this.value=t,this._changeDetector.markForCheck()}registerOnChange(t){this._controlValueAccessorChangeFn=t}registerOnTouched(t){this._onTouched=t}setDisabledState(t){this.disabled=t}_keydown(t){if(this.multiple||this.disabled||Db(t))return;let a=t.target.id,c=this._buttonToggles.toArray().findIndex(C=>C.buttonId===a),u=null;switch(t.keyCode){case 32:case 13:u=this._buttonToggles.get(c)||null;break;case 38:u=this._getNextButton(c,-1);break;case 37:u=this._getNextButton(c,this.dir===`ltr`?-1:1);break;case 40:u=this._getNextButton(c,1);break;case 39:u=this._getNextButton(c,this.dir===`ltr`?1:-1);break;default:return}u&&(t.preventDefault(),u._onButtonClick(),u.focus())}_emitChangeEvent(t){let n=new L(t,this.value);this._rawValue=n.value,this._controlValueAccessorChangeFn(n.value),this.change.emit(n)}_syncButtonToggle(t,n,a=!1,c=!1){!this.multiple&&this.selected&&!t.checked&&(this.selected.checked=!1),this._selectionModel?n?this._selectionModel.select(t):this._selectionModel.deselect(t):c=!0,c?Promise.resolve().then(()=>this._updateModelValue(t,a)):this._updateModelValue(t,a)}_isSelected(t){return this._selectionModel&&this._selectionModel.isSelected(t)}_isPrechecked(t){return typeof this._rawValue>`u`?!1:this.multiple&&Array.isArray(this._rawValue)?this._rawValue.some(n=>t.value!=null&&n===t.value):t.value===this._rawValue}_initializeTabIndex(){if(this._buttonToggles.forEach(t=>{t.tabIndex=-1}),this.selected)this.selected.tabIndex=0;else for(let t=0;t<this._buttonToggles.length;t++){let n=this._buttonToggles.get(t);if(!n.disabled){n.tabIndex=0;break}}}_getNextButton(t,n){let a=this._buttonToggles;for(let c=1;c<=a.length;c++){let u=(t+n*c+a.length)%a.length,C=a.get(u);if(C&&!C.disabled)return C}return null}_setSelectionByValue(t){if(this._rawValue=t,!this._buttonToggles)return;let n=this._buttonToggles.toArray();if(this.multiple&&t?(this._clearSelection(),t.forEach(a=>this._selectValue(a,n))):(this._clearSelection(),this._selectValue(t,n)),!this.multiple&&n.every(a=>a.tabIndex===-1)){for(let a of n)if(!a.disabled){a.tabIndex=0;break}}}_clearSelection(){this._selectionModel.clear(),this._buttonToggles.forEach(t=>{t.checked=!1,this.multiple||(t.tabIndex=-1)})}_selectValue(t,n){for(let a of n)if(a.value===t){a.checked=!0,this._selectionModel.select(a),this.multiple||(a.tabIndex=0);break}}_updateModelValue(t,n){n&&this._emitChangeEvent(t),this.valueChange.emit(this.value)}_markButtonsForCheck(){this._buttonToggles?.forEach(t=>t._markForCheck())}static ɵfac=function(n){return new(n||e)};static ɵdir=Je({type:e,selectors:[[`mat-button-toggle-group`]],contentQueries:function(n,a,c){if(n&1&&lv(c,O,5),n&2){let u;US(u=$S())&&(a._buttonToggles=u)}},hostAttrs:[1,`mat-button-toggle-group`],hostVars:6,hostBindings:function(n,a){n&1&&av(`keydown`,function(u){return a._keydown(u)}),n&2&&(rr(`role`,a.multiple?`group`:`radiogroup`)(`aria-disabled`,a.disabled),yt(`mat-button-toggle-vertical`,a.vertical)(`mat-button-toggle-group-appearance-standard`,a.appearance===`standard`))},inputs:{appearance:`appearance`,name:`name`,vertical:[2,`vertical`,`vertical`,bt],value:`value`,multiple:[2,`multiple`,`multiple`,bt],disabled:[2,`disabled`,`disabled`,bt],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,bt],hideSingleSelectionIndicator:[2,`hideSingleSelectionIndicator`,`hideSingleSelectionIndicator`,bt],hideMultipleSelectionIndicator:[2,`hideMultipleSelectionIndicator`,`hideMultipleSelectionIndicator`,bt]},outputs:{valueChange:`valueChange`,change:`change`},exportAs:[`matButtonToggleGroup`],features:[xv([ce,{provide:Zt,useExisting:e}])]})}return e})();var O=(()=>{class e{_changeDetectorRef=h(Xv);_elementRef=h(le$1);_focusMonitor=h(hf);_idGenerator=h(Df);_animationDisabled=Xr();_checked=!1;ariaLabel;ariaLabelledby=null;_buttonElement;buttonToggleGroup;get buttonId(){return`${this.id}-button`}id;name;value;get tabIndex(){return this._tabIndex()}set tabIndex(t){this._tabIndex.set(t)}_tabIndex;disableRipple=!1;get appearance(){return this.buttonToggleGroup?this.buttonToggleGroup.appearance:this._appearance}set appearance(t){this._appearance=t}_appearance;get checked(){return this.buttonToggleGroup?this.buttonToggleGroup._isSelected(this):this._checked}set checked(t){t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&this.buttonToggleGroup._syncButtonToggle(this,this._checked),this._changeDetectorRef.markForCheck())}get disabled(){return this._disabled||this.buttonToggleGroup&&this.buttonToggleGroup.disabled}set disabled(t){this._disabled=t}_disabled=!1;get disabledInteractive(){return this._disabledInteractive||this.buttonToggleGroup!==null&&this.buttonToggleGroup.disabledInteractive}set disabledInteractive(t){this._disabledInteractive=t}_disabledInteractive;change=new ke$1;constructor(){h($t).load(Rb);let t=h(Zt,{optional:!0}),n=h(new Aa(`tabindex`),{optional:!0})||``,a=h(Kt,{optional:!0});this._tabIndex=Ot(parseInt(n)||0),this.buttonToggleGroup=t,this._appearance=a&&a.appearance?a.appearance:`standard`,this._disabledInteractive=a?.disabledInteractive??!1}ngOnInit(){let t=this.buttonToggleGroup;this.id=this.id||this._idGenerator.getId(`mat-button-toggle-`),t&&(t._isPrechecked(this)?this.checked=!0:t._isSelected(this)!==this._checked&&t._syncButtonToggle(this,this._checked))}ngAfterViewInit(){this._animationDisabled||this._elementRef.nativeElement.classList.add(`mat-button-toggle-animations-enabled`),this._focusMonitor.monitor(this._elementRef,!0)}ngOnDestroy(){let t=this.buttonToggleGroup;this._focusMonitor.stopMonitoring(this._elementRef),t&&t._isSelected(this)&&t._syncButtonToggle(this,!1,!1,!0)}focus(t){this._buttonElement.nativeElement.focus(t)}_onButtonClick(){if(this.disabled)return;let t=this.isSingleSelector()?!0:!this._checked;if(t!==this._checked&&(this._checked=t,this.buttonToggleGroup&&(this.buttonToggleGroup._syncButtonToggle(this,this._checked,!0),this.buttonToggleGroup._onTouched())),this.isSingleSelector()){let n=this.buttonToggleGroup._buttonToggles.find(a=>a.tabIndex===0);n&&(n.tabIndex=-1),this.tabIndex=0}this.change.emit(new L(this,this.value))}_markForCheck(){this._changeDetectorRef.markForCheck()}_getButtonName(){return this.isSingleSelector()?this.buttonToggleGroup.name:this.name||null}isSingleSelector(){return this.buttonToggleGroup&&!this.buttonToggleGroup.multiple}static ɵfac=function(n){return new(n||e)};static ɵcmp=Oe$1({type:e,selectors:[[`mat-button-toggle`]],viewQuery:function(n,a){if(n&1&&dv(re,5),n&2){let c;US(c=$S())&&(a._buttonElement=c.first)}},hostAttrs:[`role`,`presentation`,1,`mat-button-toggle`],hostVars:14,hostBindings:function(n,a){n&1&&av(`focus`,function(){return a.focus()}),n&2&&(rr(`aria-label`,null)(`aria-labelledby`,null)(`id`,a.id)(`name`,null),yt(`mat-button-toggle-standalone`,!a.buttonToggleGroup)(`mat-button-toggle-checked`,a.checked)(`mat-button-toggle-disabled`,a.disabled)(`mat-button-toggle-disabled-interactive`,a.disabledInteractive)(`mat-button-toggle-appearance-standard`,a.appearance===`standard`))},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],id:`id`,name:`name`,value:`value`,tabIndex:`tabIndex`,disableRipple:[2,`disableRipple`,`disableRipple`,bt],appearance:`appearance`,checked:[2,`checked`,`checked`,bt],disabled:[2,`disabled`,`disabled`,bt],disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,bt]},outputs:{change:`change`},exportAs:[`matButtonToggle`],ngContentSelectors:le,decls:7,vars:13,consts:[[`button`,``],[`type`,`button`,1,`mat-button-toggle-button`,`mat-focus-indicator`,3,`click`,`id`,`disabled`],[1,`mat-button-toggle-checkbox-wrapper`],[1,`mat-button-toggle-label-content`],[1,`mat-button-toggle-focus-overlay`],[`matRipple`,``,1,`mat-button-toggle-ripple`,3,`matRippleTrigger`,`matRippleDisabled`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,3,`disabled`]],template:function(n,a){if(n&1&&(or(),ha(0,`button`,1,0),av(`click`,function(){return a._onButtonClick()}),ai(2,se,2,1,`div`,2),ha(3,`span`,3),et(4),Sd()(),nv(5,`span`,4)(6,`span`,5)),n&2){let c=GS(1);tv(`id`,a.buttonId)(`disabled`,a.disabled&&!a.disabledInteractive||null),rr(`role`,a.isSingleSelector()?`radio`:`button`)(`tabindex`,a.disabled&&!a.disabledInteractive?-1:a.tabIndex)(`aria-pressed`,a.isSingleSelector()?null:a.checked)(`aria-checked`,a.isSingleSelector()?a.checked:null)(`name`,a._getButtonName())(`aria-label`,a.ariaLabel)(`aria-labelledby`,a.ariaLabelledby)(`aria-disabled`,a.disabled&&a.disabledInteractive?`true`:null),ni(2),ci(a.buttonToggleGroup&&(!a.buttonToggleGroup.multiple&&!a.buttonToggleGroup.hideSingleSelectionIndicator||a.buttonToggleGroup.multiple&&!a.buttonToggleGroup.hideMultipleSelectionIndicator)?2:-1),ni(4),tv(`matRippleTrigger`,c)(`matRippleDisabled`,a.disableRipple||a.disabled)}},dependencies:[Z3,i],styles:[`.mat-button-toggle-standalone,
.mat-button-toggle-group {
  position: relative;
  display: inline-flex;
  flex-direction: row;
  white-space: nowrap;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  border-radius: var(--%NS%mat-button-toggle-legacy-shape);
  transform: translateZ(0);
}
.mat-button-toggle-standalone:not([class*=mat-elevation-z]),
.mat-button-toggle-group:not([class*=mat-elevation-z]) {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone,
  .mat-button-toggle-group {
    outline: solid 1px;
  }
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
.mat-button-toggle-group-appearance-standard {
  border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard .mat-pseudo-checkbox,
.mat-button-toggle-group-appearance-standard .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-button-toggle-standalone.mat-button-toggle-appearance-standard:not([class*=mat-elevation-z]),
.mat-button-toggle-group-appearance-standard:not([class*=mat-elevation-z]) {
  box-shadow: none;
}
@media (forced-colors: active) {
  .mat-button-toggle-standalone.mat-button-toggle-appearance-standard,
  .mat-button-toggle-group-appearance-standard {
    outline: 0;
  }
}

.mat-button-toggle-vertical {
  flex-direction: column;
}
.mat-button-toggle-vertical .mat-button-toggle-label-content {
  display: block;
}

.mat-button-toggle {
  white-space: nowrap;
  position: relative;
  color: var(--%NS%mat-button-toggle-legacy-text-color);
  font-family: var(--%NS%mat-button-toggle-legacy-label-text-font);
  font-size: var(--%NS%mat-button-toggle-legacy-label-text-size);
  line-height: var(--%NS%mat-button-toggle-legacy-label-text-line-height);
  font-weight: var(--%NS%mat-button-toggle-legacy-label-text-weight);
  letter-spacing: var(--%NS%mat-button-toggle-legacy-label-text-tracking);
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
}
.mat-button-toggle.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-legacy-focus-state-layer-opacity);
}
.mat-button-toggle .mat-icon svg {
  vertical-align: top;
}

.mat-button-toggle-checkbox-wrapper {
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  width: 0;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate3d(0, -50%, 0);
}
[dir=rtl] .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 16px;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: 12px;
}
[dir=rtl] .mat-button-toggle-appearance-standard .mat-button-toggle-checkbox-wrapper {
  left: auto;
  right: 12px;
}
.mat-button-toggle-checked .mat-button-toggle-checkbox-wrapper {
  width: 18px;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-checkbox-wrapper {
  transition: width 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-checkbox-wrapper {
  transition: none;
}

.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-legacy-selected-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-selected-state-background-color);
}

.mat-button-toggle-disabled {
  pointer-events: none;
  color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-state-background-color);
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-legacy-disabled-state-text-color);
}
.mat-button-toggle-disabled.mat-button-toggle-checked {
  background-color: var(--%NS%mat-button-toggle-legacy-disabled-selected-state-background-color);
}

.mat-button-toggle-disabled-interactive {
  pointer-events: auto;
}

.mat-button-toggle-appearance-standard {
  color: var(--%NS%mat-button-toggle-text-color, var(--%NS%mat-sys-on-surface));
  background-color: var(--%NS%mat-button-toggle-background-color, transparent);
  font-family: var(--%NS%mat-button-toggle-label-text-font, var(--%NS%mat-sys-label-large-font));
  font-size: var(--%NS%mat-button-toggle-label-text-size, var(--%NS%mat-sys-label-large-size));
  line-height: var(--%NS%mat-button-toggle-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-weight: var(--%NS%mat-button-toggle-label-text-weight, var(--%NS%mat-sys-label-large-weight));
  letter-spacing: var(--%NS%mat-button-toggle-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
}
.mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
[dir=rtl] .mat-button-toggle-group-appearance-standard .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle-appearance-standard + .mat-button-toggle-appearance-standard {
  border-left: none;
  border-right: none;
  border-top: solid 1px var(--%NS%mat-button-toggle-divider-color, var(--%NS%mat-sys-outline));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-selected-state-text-color, var(--%NS%mat-sys-on-secondary-container));
  background-color: var(--%NS%mat-button-toggle-selected-state-background-color, var(--%NS%mat-sys-secondary-container));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled {
  color: var(--%NS%mat-button-toggle-disabled-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-state-background-color, transparent);
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-button-toggle-appearance-standard.mat-button-toggle-disabled.mat-button-toggle-checked {
  color: var(--%NS%mat-button-toggle-disabled-selected-state-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  background-color: var(--%NS%mat-button-toggle-disabled-selected-state-background-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
  background-color: var(--%NS%mat-button-toggle-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-button-toggle-appearance-standard.cdk-keyboard-focused .mat-button-toggle-focus-overlay {
  opacity: var(--%NS%mat-button-toggle-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
}
@media (hover: none) {
  .mat-button-toggle-appearance-standard:hover .mat-button-toggle-focus-overlay {
    display: none;
  }
}

.mat-button-toggle-label-content {
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  padding: 0 16px;
  line-height: var(--%NS%mat-button-toggle-legacy-height);
  position: relative;
}
.mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
  padding: 0 12px;
  line-height: var(--%NS%mat-button-toggle-height, 40px);
}

.mat-button-toggle-label-content > * {
  vertical-align: middle;
}

.mat-button-toggle-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background-color: var(--%NS%mat-button-toggle-legacy-state-layer-color);
}

@media (forced-colors: active) {
  .mat-button-toggle-checked .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
    opacity: 0.5;
    height: 0;
  }
  .mat-button-toggle-checked:hover .mat-button-toggle-focus-overlay {
    opacity: 0.6;
  }
  .mat-button-toggle-checked.mat-button-toggle-appearance-standard .mat-button-toggle-focus-overlay {
    border-bottom: solid 500px;
  }
}
.mat-button-toggle .mat-button-toggle-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}

.mat-button-toggle-button {
  border: 0;
  background: none;
  color: inherit;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: none;
  width: 100%;
  cursor: pointer;
}
.mat-button-toggle-animations-enabled .mat-button-toggle-button {
  transition: padding 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-button-toggle-vertical .mat-button-toggle-button {
  transition: none;
}
.mat-button-toggle-disabled .mat-button-toggle-button {
  cursor: default;
}
.mat-button-toggle-button::-moz-focus-inner {
  border: 0;
}
.mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 30px;
}
[dir=rtl] .mat-button-toggle-checked .mat-button-toggle-button:has(.mat-button-toggle-checkbox-wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

.mat-button-toggle-standalone.mat-button-toggle-appearance-standard {
  --%NS%mat-focus-indicator-border-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard:not(.mat-button-toggle-vertical) .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}

.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:last-of-type .mat-button-toggle-button::before {
  border-bottom-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-bottom-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
.mat-button-toggle-group-appearance-standard.mat-button-toggle-vertical .mat-button-toggle:first-of-type .mat-button-toggle-button::before {
  border-top-right-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
  border-top-left-radius: var(--%NS%mat-button-toggle-shape, var(--%NS%mat-sys-corner-extra-large));
}
`],encapsulation:2})}return e})();var Jt=(()=>{class e{static ɵfac=function(n){return new(n||e)};static ɵmod=ge$1({type:e});static ɵinj=ce$1({imports:[Fb,O,Jr]})}return e})();var ue=e=>[`/admin/parametros`,e];function me(e,o){e&1&&nv(0,`mat-progress-bar`,11)}function ge(e,o){if(e&1){let t=OS();ha(0,`div`,12)(1,`mat-icon`),fC(2,`cloud_off`),Sd(),ha(3,`p`),fC(4),Sd(),ha(5,`button`,13),av(`click`,function(){Qp(t);return Xp(BS().carregar())}),fC(6,`Tentar novamente`),Sd()()}if(e&2){let t=BS();ni(4),Iv(t.erro())}}function pe(e,o){e&1&&(ha(0,`th`,31),fC(1,`Chave`),Sd())}function be(e,o){if(e&1&&(nv(0,`br`),ha(1,`span`,34),fC(2),Sd()),e&2){let t=BS().$implicit;ni(2),Iv(t.descricao)}}function he(e,o){if(e&1&&(ha(0,`td`,32)(1,`span`,33),fC(2),Sd(),ai(3,be,3,1),Sd()),e&2){let t=o.$implicit;ni(),yt(`inativo`,t.ativo===!1),ni(),Iv(t.chave),ni(),ci(t.descricao?3:-1)}}function _e(e,o){e&1&&(ha(0,`th`,31),fC(1,`Vale para`),Sd())}function fe(e,o){if(e&1&&(ha(0,`td`,32),fC(1),Sd()),e&2){let t=o.$implicit,n=BS(2);ni(),Iv(t.tipoEmpresa?n.rotulosTipo[t.tipoEmpresa]:`MEI e ME`)}}function ve(e,o){e&1&&(ha(0,`th`,35),fC(1,`Valor`),Sd())}function ye(e,o){if(e&1&&(ha(0,`td`,36),fC(1),wC(2,`number`),Sd()),e&2){let t=o.$implicit;ni(),Iv(TC(2,1,t.valor,`1.2-2`))}}function Se(e,o){e&1&&(ha(0,`th`,31),fC(1,`Vigência`),Sd())}function xe(e,o){if(e&1&&(ha(0,`td`,32),fC(1),wC(2,`date`),wC(3,`date`),Sd()),e&2){let t=o.$implicit;ni(),wv(` `,TC(2,2,t.vigenciaInicio,`dd/MM/yyyy`),` a `,TC(3,5,t.vigenciaFim,`dd/MM/yyyy`),` `)}}function ke(e,o){e&1&&(ha(0,`th`,31),fC(1,`Situação`),Sd())}function Te(e,o){e&1&&(ha(0,`span`,37),fC(1,`Desativado`),Sd())}function Ce(e,o){if(e&1&&(ha(0,`span`),fC(1),Sd()),e&2){let t=BS().$implicit;li(vC(`chip `,t.rotulo.cor)),ni(),Iv(t.rotulo.texto)}}function Me(e,o){if(e&1&&(ha(0,`td`,32),ai(1,Te,2,0,`span`,37)(2,Ce,2,4,`span`,38),Sd()),e&2){let t=o.$implicit;ni(),ci(t.ativo===!1?1:2)}}function Ee(e,o){e&1&&(ha(0,`th`,31),fC(1,`Última alteração`),Sd())}function Ie(e,o){if(e&1&&(nv(0,`br`),ha(1,`span`,34),fC(2),Sd()),e&2){let t=BS().$implicit;ni(2),Iv(t.alteradoPor)}}function Ne(e,o){if(e&1&&(ha(0,`td`,32),fC(1),wC(2,`date`),ai(3,Ie,3,1),Sd()),e&2){let t=o.$implicit;ni(),Md(` `,TC(2,2,t.ultimaAlteracao,`dd/MM/yyyy HH:mm`),` `),ni(2),ci(t.alteradoPor?3:-1)}}function we(e,o){e&1&&nv(0,`th`,39)}function De(e,o){if(e&1){let t=OS();ha(0,`td`,40)(1,`a`,41)(2,`mat-icon`),fC(3,`edit`),Sd()(),ha(4,`button`,42),av(`click`,function(){let a=Qp(t).$implicit;return Xp(BS(2).alterarAtivo(a))}),ha(5,`mat-icon`),fC(6),Sd()(),ha(7,`button`,43),av(`click`,function(){let a=Qp(t).$implicit;return Xp(BS(2).excluir(a))}),ha(8,`mat-icon`),fC(9,`delete_outline`),Sd()()()}if(e&2){let t=o.$implicit;ni(),tv(`routerLink`,_C(3,ue,t.id)),ni(3),tv(`matTooltip`,t.ativo===!1?`Ativar`:`Desativar`),ni(2),Iv(t.ativo===!1?`toggle_off`:`toggle_on`)}}function Pe(e,o){e&1&&nv(0,`tr`,44)}function Re(e,o){e&1&&nv(0,`tr`,45)}function Be(e,o){e&1&&fC(0,` Nenhum parâmetro corresponde aos filtros. `)}function Le(e,o){e&1&&fC(0,` Nenhum parâmetro cadastrado ainda. `)}function Oe(e,o){if(e&1&&(ha(0,`div`,12)(1,`mat-icon`),fC(2,`tune`),Sd(),ha(3,`p`),ai(4,Be,1,0)(5,Le,1,0),Sd()()),e&2){let t=BS(2);ni(4),ci(t.parametros().length?4:5)}}function Ge(e,o){if(e&1&&(ha(0,`div`,14)(1,`table`,15),Cd(2,16),Qg(3,pe,2,0,`th`,17)(4,he,4,4,`td`,18),Td(),Cd(5,19),Qg(6,_e,2,0,`th`,17)(7,fe,2,1,`td`,18),Td(),Cd(8,20),Qg(9,ve,2,0,`th`,21)(10,ye,3,4,`td`,22),Td(),Cd(11,23),Qg(12,Se,2,0,`th`,17)(13,xe,4,8,`td`,18),Td(),Cd(14,24),Qg(15,ke,2,0,`th`,17)(16,Me,3,1,`td`,18),Td(),Cd(17,25),Qg(18,Ee,2,0,`th`,17)(19,Ne,4,5,`td`,18),Td(),Cd(20,26),Qg(21,we,1,0,`th`,27)(22,De,10,5,`td`,28),Td(),Qg(23,Pe,1,0,`tr`,29)(24,Re,1,0,`tr`,30),Sd()(),ai(25,Oe,6,1,`div`,12)),e&2){let t=BS();ni(),tv(`dataSource`,t.filtrados()),ni(22),tv(`matHeaderRowDef`,t.colunas),ni(),tv(`matRowDefColumns`,t.colunas),ni(),ci(!t.carregando()&&t.filtrados().length===0?25:-1)}}var Xt=class e{adminService=h(h$1);dialog=h(re$1);snack=h(Qt);colunas=[`chave`,`aplica`,`valor`,`vigencia`,`situacao`,`alteracao`,`acoes`];rotulosTipo={MEI:`MEI`,MICROEMPRESA:`Microempresa`};parametros=Ot([]);carregando=Ot(!0);erro=Ot(``);busca=Ot(``);situacao=Ot(`TODOS`);rotulosSituacao={VIGENTE:{texto:`Vigente`,cor:`green`},FUTURO:{texto:`Futuro`,cor:`blue`},ENCERRADO:{texto:`Encerrado`,cor:``}};contagem=RC(()=>{let o={TODOS:0,VIGENTE:0,FUTURO:0,ENCERRADO:0};for(let t of this.parametros())o.TODOS++,o[i$1(t)]++;return o});filtrados=RC(()=>{let o=this.busca().trim().toLowerCase(),t=this.situacao();return this.parametros().map(n=>{let a=i$1(n);return ne(A({},n),{situacao:a,rotulo:this.rotulosSituacao[a]})}).filter(n=>t===`TODOS`||n.situacao===t).filter(n=>!o||n.chave.toLowerCase().includes(o))});ngOnInit(){this.carregar()}carregar(){this.carregando.set(!0),this.erro.set(``),this.adminService.listarParametros().subscribe({next:o=>{this.parametros.set(o),this.carregando.set(!1)},error:o=>{this.erro.set(YG(o,`Erro ao carregar os parâmetros.`)),this.carregando.set(!1)}})}filtrar(o){this.busca.set(o.target.value)}excluir(o){ci$1(this.dialog,{titulo:`Excluir parâmetro`,mensagem:`Deseja excluir o par\xE2metro ${o.chave} (vig\xEAncia a partir de ${Ve(o.vigenciaInicio)})?`}).subscribe(t=>{!t||o.id==null||this.adminService.excluirParametro(o.id).subscribe({next:()=>{this.parametros.update(n=>n.filter(a=>a.id!==o.id)),this.avisar(`Parâmetro excluído.`)},error:n=>this.avisar(YG(n,`Erro ao excluir o parâmetro.`))})})}alterarAtivo(o){o.id!=null&&this.adminService.alterarAtivoParametro(o.id,o.ativo===!1).subscribe({next:t=>{this.parametros.update(n=>n.map(a=>a.id===t.id?t:a)),this.avisar(t.ativo?`Parâmetro ativado.`:`Parâmetro desativado.`)},error:t=>this.avisar(YG(t,`Não foi possível alterar o parâmetro.`))})}avisar(o){this.snack.open(o,`Ok`,{duration:3e3,verticalPosition:`top`})}static ɵfac=function(t){return new(t||e)};static ɵcmp=Oe$1({type:e,selectors:[[`app-parametro-list`]],decls:28,vars:7,consts:[[1,`page-header`],[`mat-flat-button`,``,`routerLink`,`/admin/parametros/novo`,1,`btn-primario`],[1,`fc-card`],[1,`toolbar-filtros`],[1,`busca`],[`placeholder`,`Buscar por chave (ex.: LIMITE_MEI)`,`aria-label`,`Buscar por chave`,3,`input`],[`aria-label`,`Filtrar por situação`,`hideSingleSelectionIndicator`,``,3,`change`,`value`],[`value`,`TODOS`],[`value`,`VIGENTE`],[`value`,`FUTURO`],[`value`,`ENCERRADO`],[`mode`,`indeterminate`],[1,`estado-vazio`],[`mat-stroked-button`,``,3,`click`],[1,`table-wrap`],[`mat-table`,``,3,`dataSource`],[`matColumnDef`,`chave`],[`mat-header-cell`,``,4,`matHeaderCellDef`],[`mat-cell`,``,4,`matCellDef`],[`matColumnDef`,`aplica`],[`matColumnDef`,`valor`],[`mat-header-cell`,``,`class`,`col-num`,4,`matHeaderCellDef`],[`mat-cell`,``,`class`,`col-num`,4,`matCellDef`],[`matColumnDef`,`vigencia`],[`matColumnDef`,`situacao`],[`matColumnDef`,`alteracao`],[`matColumnDef`,`acoes`],[`mat-header-cell`,``,`class`,`col-acoes`,4,`matHeaderCellDef`],[`mat-cell`,``,`class`,`col-acoes`,4,`matCellDef`],[`mat-header-row`,``,4,`matHeaderRowDef`],[`mat-row`,``,4,`matRowDef`,`matRowDefColumns`],[`mat-header-cell`,``],[`mat-cell`,``],[1,`chave`],[1,`meta`],[`mat-header-cell`,``,1,`col-num`],[`mat-cell`,``,1,`col-num`],[1,`chip`,`red`],[3,`class`],[`mat-header-cell`,``,1,`col-acoes`],[`mat-cell`,``,1,`col-acoes`],[`mat-icon-button`,``,`matTooltip`,`Editar`,3,`routerLink`],[`mat-icon-button`,``,3,`click`,`matTooltip`],[`mat-icon-button`,``,`matTooltip`,`Excluir`,3,`click`],[`mat-header-row`,``],[`mat-row`,``]],template:function(t,n){t&1&&(ha(0,`div`,0)(1,`div`)(2,`h1`),fC(3,`Parâmetros fiscais`),Sd(),ha(4,`p`),fC(5,`Valores fiscais de MEI e Microempresa (tetos, DAS, alíquotas) com vigência. Ficam no banco, nunca fixos no código.`),Sd()(),ha(6,`a`,1)(7,`mat-icon`),fC(8,`add`),Sd(),fC(9,` Novo parâmetro `),Sd()(),ha(10,`section`,2)(11,`div`,3)(12,`label`,4)(13,`mat-icon`),fC(14,`search`),Sd(),ha(15,`input`,5),av(`input`,function(c){return n.filtrar(c)}),Sd()(),ha(16,`mat-button-toggle-group`,6),av(`change`,function(c){return n.situacao.set(c.value)}),ha(17,`mat-button-toggle`,7),fC(18),Sd(),ha(19,`mat-button-toggle`,8),fC(20),Sd(),ha(21,`mat-button-toggle`,9),fC(22),Sd(),ha(23,`mat-button-toggle`,10),fC(24),Sd()()(),ai(25,me,1,0,`mat-progress-bar`,11),ai(26,ge,7,1,`div`,12)(27,Ge,26,4),Sd()),t&2&&(ni(16),tv(`value`,n.situacao()),ni(2),Md(`Todos (`,n.contagem().TODOS,`)`),ni(2),Md(`Vigentes (`,n.contagem().VIGENTE,`)`),ni(2),Md(`Futuros (`,n.contagem().FUTURO,`)`),ni(2),Md(`Encerrados (`,n.contagem().ENCERRADO,`)`),ni(),ci(n.carregando()?25:-1),ni(),ci(n.erro()?26:27))},dependencies:[Nt,Jt$1,Vt,Wt,Xt$1,$t$1,Qt$1,Gt,qt,Kt$1,Yt$1,Zt$1,CG,SG,hM,Jt,j,O,WG,GG,Yt,mt,Z,L$1,PT,jT],styles:[`.chave[_ngcontent-%COMP%]{font-family:Roboto Mono,monospace;font-size:13px;font-weight:500}.toolbar-filtros[_ngcontent-%COMP%]{margin-bottom:16px}.chave.inativo[_ngcontent-%COMP%]{color:var(--%NS%fc-muted);text-decoration:line-through}.meta[_ngcontent-%COMP%]{font-size:12px;color:var(--%NS%fc-muted)}`]})};function Ve(e){let[o,t,n]=e.split(`-`);return`${n}/${t}/${o}`}export{Xt as ParametroList};