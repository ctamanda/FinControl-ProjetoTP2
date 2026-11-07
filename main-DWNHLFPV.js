import{$ as La,$r as v3,A as Gs,An as eh,B as JG,Bn as gb,Br as sv,Bt as TD,Cr as or,D as Fe$1,Dn as dv,Dr as ph,En as de$1,Er as pS,Et as Pe$2,Fn as fi$1,Fr as ro,G as K$2,Gn as h,Gr as tv,Gt as U$2,Hr as tG,Ht as Ti$1,Ir as rr,J as Kr,Jn as ho,Jr as ui$1,Jt as UN,K as KS,Kt as U3,L as IE,Ln as fv,Lr as sM,Lt as SM,M as HH,Mn as ev,Mt as RS,Nt as Ra,O as Fv,Or as pn$1,Ot as R,Pn as fh,Q as LN,Qn as iv,Qr as v$1,Qt as Vd,R as Ie$1,Rn as g,Rr as sc,S as Es,Sr as oi,T as FD,Tn as dc,Tr as ov,U as Jp,Ur as tW,Ut as Tv,Vn as ge$1,W as Jv,Wn as gv,Wr as tt$2,Wt as Tw,Xn as i$,Xr as uo,Y as LC,Yn as hv,Yr as un$2,Yt as Ur,Zn as ir,Zr as uv,Zt as VC,_ as De$1,_n as _m,_r as no,_t as O$1,a as AS,ai as vv,an as X$1,ar as kD,bn as ba,br as ny,bt as Ot$1,cn as YS,cr as lc,d as Bt$3,di as xd,dr as mf,ei as vC,er as jH,et as Lb,fn as Zr,fr as mn$1,ft as NC,g as Cn,gi as zS,gn as _f,gr as ne$1,h as Ci$1,hn as _M,in as We$1,jn as et$3,jr as qS,kn as ed,l as Bb,li as xS,ln as Yr,lr as li$1,m as Cd,mi as yo,mr as mv,n as $t$2,ni as va,nr as k,nt as Le$2,oi as wb,on as XG,or as kc,p as CD,pn as Zt$2,q as Kn,qn as hn$1,qr as ue$2,r as A$1,rt as M,s as BH,sn as Xn,sr as lN,st as Mc,t as $T,tn as W$1,tr as jS,tt as Lc,u as Bc,un as ZS,v as Df,vn as aM,vr as nr,wr as ot$2,wt as PN,x as Ef,xn as bt$1,xt as P,y as Dt$1,yn as at$3,yt as OG,zr as st$2,zt as TC}from"./chunk-fkch88o2.js";import{C as ve$3,E as yt$1,T as ye$2,_ as j$1,c as Ot$2,d as W$2,h as bt$2,i as H$1,l as Pt$2,n as Dt$2,o as I$2,r as Et$1,u as T$2,y as kt$1}from"./chunk-CEyKRt4x.js";import{i as t,n as i$2,r,t as E}from"./chunk-7jPyCknY.js";import{a as ur,i as ce,o as wo,r as Nt$1,s as z$1,t as Eo}from"./chunk-B7utWsYu.js";import{t as n$1}from"./chunk-cOJ8JrQp.js";var nt$2=[`tooltip`];var at$2=20;var rt$2=new v$1(`mat-tooltip-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=h(X$1);return()=>Ot$2(n,{scrollThrottle:at$2})}});var lt$1=new v$1(`mat-tooltip-default-options`,{providedIn:`root`,factory:()=>({showDelay:0,hideDelay:0,touchendHideDelay:1500})});var et$2=`tooltip-panel`;var ht$1={passive:!0};var dt$1=8;var ct$1=8;var pt$1=24;var _t$1=200;var mt$1=(()=>{class n{_elementRef=h(de$1);_ngZone=h(P);_platform=h(Ie$1);_ariaDescriber=h(v3);_focusMonitor=h(mf);_dir=h(SM);_injector=h(X$1);_viewContainerRef=h(Zr);_mediaMatcher=h(dc);_document=h(O$1);_renderer=h(Xn);_animationsDisabled=no();_defaultOptions=h(lt$1,{optional:!0});_overlayRef=null;_tooltipInstance=null;_overlayPanelClass;_portal;_position=`below`;_positionAtOrigin=!1;_disabled=!1;_tooltipClass;_viewInitialized=!1;_pointerExitEventsInitialized=!1;_tooltipComponent=it$2;_viewportMargin=8;_currentPosition;_cssClassPrefix=`mat-mdc`;_ariaDescriptionPending=!1;_dirSubscribed=!1;get position(){return this._position}set position(t){t!==this._position&&(this._position=t,this._overlayRef&&(this._updatePosition(this._overlayRef),this._tooltipInstance?.show(0),this._overlayRef.updatePosition()))}get positionAtOrigin(){return this._positionAtOrigin}set positionAtOrigin(t){this._positionAtOrigin=U3(t),this._detach(),this._overlayRef=null}get disabled(){return this._disabled}set disabled(t){let e=U3(t);this._disabled!==e&&(this._disabled=e,e?this.hide(0):this._setupPointerEnterEventsIfNeeded(),this._syncAriaDescription(this.message))}get showDelay(){return this._showDelay}set showDelay(t){this._showDelay=UN(t)}_showDelay;get hideDelay(){return this._hideDelay}set hideDelay(t){this._hideDelay=UN(t),this._tooltipInstance&&(this._tooltipInstance._mouseLeaveHideDelay=this._hideDelay)}_hideDelay;touchGestures=`auto`;get message(){return this._message}set message(t){let e=this._message;this._message=t!=null?String(t).trim():``,!this._message&&this._isTooltipVisible()?this.hide(0):(this._setupPointerEnterEventsIfNeeded(),this._updateTooltipMessage()),this._syncAriaDescription(e)}_message=``;get tooltipClass(){return this._tooltipClass}set tooltipClass(t){this._tooltipClass=t,this._tooltipInstance&&this._setTooltipClass(this._tooltipClass)}_eventCleanups=[];_touchstartTimeout=null;_destroyed=new U$2;_isDestroyed=!1;constructor(){let t=this._defaultOptions;t&&(this._showDelay=t.showDelay,this._hideDelay=t.hideDelay,t.position&&(this.position=t.position),t.positionAtOrigin&&(this.positionAtOrigin=t.positionAtOrigin),t.touchGestures&&(this.touchGestures=t.touchGestures),t.tooltipClass&&(this.tooltipClass=t.tooltipClass)),this._viewportMargin=dt$1}ngAfterViewInit(){this._viewInitialized=!0,this._setupPointerEnterEventsIfNeeded(),this._focusMonitor.monitor(this._elementRef).pipe(yo(this._destroyed)).subscribe(t=>{t?t===`keyboard`&&this._ngZone.run(()=>this.show()):this._ngZone.run(()=>this.hide(0))})}ngOnDestroy(){let t=this._elementRef.nativeElement;this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null),this._eventCleanups.forEach(e=>e()),this._eventCleanups.length=0,this._destroyed.next(),this._destroyed.complete(),this._isDestroyed=!0,this._ariaDescriber.removeDescription(t,this.message,`tooltip`),this._focusMonitor.stopMonitoring(t)}show(t=this.showDelay,e){if(this.disabled||!this.message||this._isTooltipVisible()){this._tooltipInstance?._cancelPendingAnimations();return}let i=this._createOverlay(e);this._detach(),this._portal=this._portal||new bt$2(this._tooltipComponent,this._viewContainerRef);let o=this._tooltipInstance=i.attach(this._portal).instance;o._triggerElement=this._elementRef.nativeElement,o._mouseLeaveHideDelay=this._hideDelay,o.afterHidden().pipe(yo(this._destroyed)).subscribe(()=>this._detach()),this._setTooltipClass(this._tooltipClass),this._updateTooltipMessage(),o.show(t)}hide(t=this.hideDelay){let e=this._tooltipInstance;e&&(e.isVisible()?e.hide(t):(e._cancelPendingAnimations(),this._detach()))}toggle(t){this._isTooltipVisible()?this.hide():this.show(void 0,t)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}_createOverlay(t){if(this._overlayRef){let s=this._overlayRef.getConfig().positionStrategy;if((!this.positionAtOrigin||!t)&&s._origin instanceof de$1)return this._overlayRef;this._detach()}let e=this._injector.get(W$2).getAncestorScrollContainers(this._elementRef),i=`${this._cssClassPrefix}-${et$2}`,o=Et$1(this._injector,this.positionAtOrigin?t||this._elementRef:this._elementRef).withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`).withFlexibleDimensions(!1).withViewportMargin(this._viewportMargin).withScrollableContainers(e).withPopoverLocation(`global`);return o.positionChanges.pipe(yo(this._destroyed)).subscribe(s=>{this._updateCurrentPositionClass(s.connectionPair),this._tooltipInstance&&s.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=Dt$2(this._injector,{direction:this._dir,positionStrategy:o,panelClass:this._overlayPanelClass?[...this._overlayPanelClass,i]:i,scrollStrategy:this._injector.get(rt$2)(),disableAnimations:this._animationsDisabled,eventPredicate:this._overlayEventPredicate}),this._updatePosition(this._overlayRef),this._overlayRef.detachments().pipe(yo(this._destroyed)).subscribe(()=>this._detach()),this._overlayRef.outsidePointerEvents().pipe(yo(this._destroyed)).subscribe(()=>this._tooltipInstance?._handleBodyInteraction()),this._overlayRef.keydownEvents().pipe(yo(this._destroyed)).subscribe(s=>{s.preventDefault(),s.stopPropagation(),this._ngZone.run(()=>this.hide(0))}),this._defaultOptions?.disableTooltipInteractivity&&this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`),this._dirSubscribed||(this._dirSubscribed=!0,this._dir.change.pipe(yo(this._destroyed)).subscribe(()=>{this._overlayRef&&this._updatePosition(this._overlayRef)})),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_updatePosition(t){let e=t.getConfig().positionStrategy,i=this._getOrigin(),o=this._getOverlayPosition();e.withPositions([this._addOffset(A$1(A$1({},i.main),o.main)),this._addOffset(A$1(A$1({},i.fallback),o.fallback))])}_addOffset(t){let e=ct$1,i=!this._dir||this._dir.value==`ltr`;return t.originY===`top`?t.offsetY=-e:t.originY===`bottom`?t.offsetY=e:t.originX===`start`?t.offsetX=i?-e:e:t.originX===`end`&&(t.offsetX=i?e:-e),t}_getOrigin(){let t=!this._dir||this._dir.value==`ltr`,e=this.position,i;e==`above`||e==`below`?i={originX:`center`,originY:e==`above`?`top`:`bottom`}:e==`before`||e==`left`&&t||e==`right`&&!t?i={originX:`start`,originY:`center`}:(e==`after`||e==`right`&&t||e==`left`&&!t)&&(i={originX:`end`,originY:`center`});let{x:o,y:s}=this._invertPosition(i.originX,i.originY);return{main:i,fallback:{originX:o,originY:s}}}_getOverlayPosition(){let t=!this._dir||this._dir.value==`ltr`,e=this.position,i;e==`above`?i={overlayX:`center`,overlayY:`bottom`}:e==`below`?i={overlayX:`center`,overlayY:`top`}:e==`before`||e==`left`&&t||e==`right`&&!t?i={overlayX:`end`,overlayY:`center`}:(e==`after`||e==`right`&&t||e==`left`&&!t)&&(i={overlayX:`start`,overlayY:`center`});let{x:o,y:s}=this._invertPosition(i.overlayX,i.overlayY);return{main:i,fallback:{overlayX:o,overlayY:s}}}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),ed(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()},{injector:this._injector}))}_setTooltipClass(t){this._tooltipInstance&&(this._tooltipInstance.tooltipClass=t instanceof Set?Array.from(t):t,this._tooltipInstance._markForCheck())}_invertPosition(t,e){return this.position===`above`||this.position===`below`?e===`top`?e=`bottom`:e===`bottom`&&(e=`top`):t===`end`?t=`start`:t===`start`&&(t=`end`),{x:t,y:e}}_updateCurrentPositionClass(t){let{overlayY:e,originX:i,originY:o}=t,s;if(e===`center`?this._dir&&this._dir.value===`rtl`?s=i===`end`?`left`:`right`:s=i===`start`?`left`:`right`:s=e===`bottom`&&o===`top`?`above`:`below`,s!==this._currentPosition){let d=this._overlayRef;if(d){let b=`${this._cssClassPrefix}-${et$2}-`;d.removePanelClass(b+this._currentPosition),d.addPanelClass(b+s)}this._currentPosition=s}}_setupPointerEnterEventsIfNeeded(){this._disabled||!this.message||!this._viewInitialized||this._eventCleanups.length||(this._isTouchPlatform()?this.touchGestures!==`off`&&(this._disableNativeGesturesIfNecessary(),this._addListener(`touchstart`,t=>{let e=t.targetTouches?.[0],i=e?{x:e.clientX,y:e.clientY}:void 0;this._setupPointerExitEventsIfNeeded(),this._touchstartTimeout&&clearTimeout(this._touchstartTimeout);let o=500;this._touchstartTimeout=setTimeout(()=>{this._touchstartTimeout=null,this.show(void 0,i)},this._defaultOptions?.touchLongPressShowDelay??o)})):this._addListener(`mouseenter`,t=>{this._setupPointerExitEventsIfNeeded();let e;t.x!==void 0&&t.y!==void 0&&(e=t),this.show(void 0,e)}))}_setupPointerExitEventsIfNeeded(){if(!this._pointerExitEventsInitialized){if(this._pointerExitEventsInitialized=!0,!this._isTouchPlatform())this._addListener(`mouseleave`,t=>{let e=t.relatedTarget;(!e||!this._overlayRef?.overlayElement.contains(e))&&this.hide()}),this._addListener(`wheel`,t=>{if(this._isTooltipVisible()){let e=this._document.elementFromPoint(t.clientX,t.clientY),i=this._elementRef.nativeElement;e!==i&&!i.contains(e)&&this.hide()}});else if(this.touchGestures!==`off`){this._disableNativeGesturesIfNecessary();let t=()=>{this._touchstartTimeout&&clearTimeout(this._touchstartTimeout),this.hide(this._defaultOptions?.touchendHideDelay)};this._addListener(`touchend`,t),this._addListener(`touchcancel`,t)}}}_addListener(t,e){this._eventCleanups.push(this._renderer.listen(this._elementRef.nativeElement,t,e,ht$1))}_isTouchPlatform(){let t=this._defaultOptions?.detectHoverCapability;return typeof t==`function`?!t():this._platform.IOS||this._platform.ANDROID?!0:this._platform.isBrowser?!!t&&this._mediaMatcher.matchMedia(`(any-hover: none)`).matches:!1}_disableNativeGesturesIfNecessary(){let t=this.touchGestures;if(t!==`off`){let e=this._elementRef.nativeElement,i=e.style;(t===`on`||e.nodeName!==`INPUT`&&e.nodeName!==`TEXTAREA`)&&(i.userSelect=i.msUserSelect=i.webkitUserSelect=i.MozUserSelect=`none`),(t===`on`||!e.draggable)&&(i.webkitUserDrag=`none`),i.touchAction=`none`,i.webkitTapHighlightColor=`transparent`}}_syncAriaDescription(t){this._ariaDescriptionPending||(this._ariaDescriptionPending=!0,this._ariaDescriber.removeDescription(this._elementRef.nativeElement,t,`tooltip`),this._isDestroyed||ed({write:()=>{this._ariaDescriptionPending=!1,this.message&&!this.disabled&&this._ariaDescriber.describe(this._elementRef.nativeElement,this.message,`tooltip`)}},{injector:this._injector}))}_overlayEventPredicate=t=>t.type===`keydown`?this._isTooltipVisible()&&t.keyCode===27&&!wb(t):!0;static ɵfac=function(e){return new(e||n)};static ɵdir=et$3({type:n,selectors:[[``,`matTooltip`,``]],hostAttrs:[1,`mat-mdc-tooltip-trigger`],hostVars:2,hostBindings:function(e,i){e&2&&bt$1(`mat-mdc-tooltip-disabled`,i.disabled)},inputs:{position:[0,`matTooltipPosition`,`position`],positionAtOrigin:[0,`matTooltipPositionAtOrigin`,`positionAtOrigin`],disabled:[0,`matTooltipDisabled`,`disabled`],showDelay:[0,`matTooltipShowDelay`,`showDelay`],hideDelay:[0,`matTooltipHideDelay`,`hideDelay`],touchGestures:[0,`matTooltipTouchGestures`,`touchGestures`],message:[0,`matTooltip`,`message`],tooltipClass:[0,`matTooltipClass`,`tooltipClass`]},exportAs:[`matTooltip`]})}return n})();var it$2=(()=>{class n{_changeDetectorRef=h(ny);_elementRef=h(de$1);_isMultiline=!1;message;tooltipClass;_showTimeoutId;_hideTimeoutId;_triggerElement;_mouseLeaveHideDelay;_animationsDisabled=no();_tooltip;_closeOnInteraction=!1;_isVisible=!1;_onHide=new U$2;_showAnimation=`mat-mdc-tooltip-show`;_hideAnimation=`mat-mdc-tooltip-hide`;show(t){this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=setTimeout(()=>{this._toggleVisibility(!0),this._showTimeoutId=void 0},t)}hide(t){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId=setTimeout(()=>{this._toggleVisibility(!1),this._hideTimeoutId=void 0},t)}afterHidden(){return this._onHide}isVisible(){return this._isVisible}ngOnDestroy(){this._cancelPendingAnimations(),this._onHide.complete(),this._triggerElement=null}_handleBodyInteraction(){this._closeOnInteraction&&this.hide(0)}_markForCheck(){this._changeDetectorRef.markForCheck()}_handleMouseLeave({relatedTarget:t}){(!t||!this._triggerElement.contains(t))&&(this.isVisible()?this.hide(this._mouseLeaveHideDelay):this._finalizeAnimation(!1))}_onShow(){this._isMultiline=this._isTooltipMultiline(),this._markForCheck()}_isTooltipMultiline(){let t=this._elementRef.nativeElement.getBoundingClientRect();return t.height>pt$1&&t.width>=_t$1}_handleAnimationEnd({animationName:t}){(t===this._showAnimation||t===this._hideAnimation)&&this._finalizeAnimation(t===this._showAnimation)}_cancelPendingAnimations(){this._showTimeoutId!=null&&clearTimeout(this._showTimeoutId),this._hideTimeoutId!=null&&clearTimeout(this._hideTimeoutId),this._showTimeoutId=this._hideTimeoutId=void 0}_finalizeAnimation(t){t?this._closeOnInteraction=!0:this.isVisible()||this._onHide.next()}_toggleVisibility(t){let e=this._tooltip.nativeElement,i=this._showAnimation,o=this._hideAnimation;if(e.classList.remove(t?o:i),e.classList.add(t?i:o),this._isVisible!==t&&(this._isVisible=t,this._changeDetectorRef.markForCheck()),t&&!this._animationsDisabled&&typeof getComputedStyle==`function`){let s=getComputedStyle(e);(s.getPropertyValue(`animation-duration`)===`0s`||s.getPropertyValue(`animation-name`)===`none`)&&(this._animationsDisabled=!0)}t&&this._onShow(),this._animationsDisabled&&(e.classList.add(`_mat-animation-noopable`),this._finalizeAnimation(t))}static ɵfac=function(e){return new(e||n)};static ɵcmp=Le$2({type:n,selectors:[[`mat-tooltip-component`]],viewQuery:function(e,i){if(e&1&&mv(nt$2,7),e&2){let o;qS(o=ZS())&&(i._tooltip=o.first)}},hostAttrs:[`aria-hidden`,`true`],hostBindings:function(e,i){e&1&&dv(`mouseleave`,function(s){return i._handleMouseLeave(s)})},decls:4,vars:5,consts:[[`tooltip`,``],[1,`mdc-tooltip`,`mat-mdc-tooltip`,3,`animationend`],[1,`mat-mdc-tooltip-surface`,`mdc-tooltip__surface`]],template:function(e,i){e&1&&(pn$1(0,`div`,1,0),fv(`animationend`,function(s){return i._handleAnimationEnd(s)}),pn$1(2,`div`,2),vC(3),hn$1()()),e&2&&(fi$1(i.tooltipClass),bt$1(`mdc-tooltip--multiline`,i._isMultiline),oi(3),Tv(i.message))},styles:[`.mat-mdc-tooltip {
  position: relative;
  transform: scale(0);
  display: inline-flex;
}
.mat-mdc-tooltip::before {
  content: "";
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  position: absolute;
}
.mat-mdc-tooltip-panel-below .mat-mdc-tooltip::before {
  top: -8px;
}
.mat-mdc-tooltip-panel-above .mat-mdc-tooltip::before {
  bottom: -8px;
}
.mat-mdc-tooltip-panel-right .mat-mdc-tooltip::before {
  left: -8px;
}
.mat-mdc-tooltip-panel-left .mat-mdc-tooltip::before {
  right: -8px;
}
.mat-mdc-tooltip._mat-animation-noopable {
  animation: none;
  transform: scale(1);
}

.mat-mdc-tooltip-surface {
  word-break: normal;
  overflow-wrap: anywhere;
  padding: 4px 8px;
  min-width: 40px;
  max-width: 200px;
  min-height: 24px;
  max-height: 40vh;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  will-change: transform, opacity;
  background-color: var(--%NS%mat-tooltip-container-color, var(--%NS%mat-sys-inverse-surface));
  color: var(--%NS%mat-tooltip-supporting-text-color, var(--%NS%mat-sys-inverse-on-surface));
  border-radius: var(--%NS%mat-tooltip-container-shape, var(--%NS%mat-sys-corner-extra-small));
  font-family: var(--%NS%mat-tooltip-supporting-text-font, var(--%NS%mat-sys-body-small-font));
  font-size: var(--%NS%mat-tooltip-supporting-text-size, var(--%NS%mat-sys-body-small-size));
  font-weight: var(--%NS%mat-tooltip-supporting-text-weight, var(--%NS%mat-sys-body-small-weight));
  line-height: var(--%NS%mat-tooltip-supporting-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  letter-spacing: var(--%NS%mat-tooltip-supporting-text-tracking, var(--%NS%mat-sys-body-small-tracking));
}
.mat-mdc-tooltip-surface::before {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  content: "";
  pointer-events: none;
}
.mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: left;
}
[dir=rtl] .mdc-tooltip--multiline .mat-mdc-tooltip-surface {
  text-align: right;
}

.mat-mdc-tooltip-panel {
  line-height: normal;
}
.mat-mdc-tooltip-panel.mat-mdc-tooltip-panel-non-interactive {
  pointer-events: none;
}

@keyframes mat-mdc-tooltip-show {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes mat-mdc-tooltip-hide {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
.mat-mdc-tooltip-show {
  animation: mat-mdc-tooltip-show 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}

.mat-mdc-tooltip-hide {
  animation: mat-mdc-tooltip-hide 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}
`],encapsulation:2})}return n})();var Yt$2=(()=>{class n{static ɵfac=function(e){return new(e||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[aM,ye$2,ro,yt$1]})}return n})();var ze$1=(()=>{class n{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty(`disabled`,e)}static ɵfac=function(i){return new(i||n)(Fe$1(Xn),Fe$1(de$1))};static ɵdir=et$3({type:n})}return n})();var re$2=(()=>{class n extends ze$1{static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,features:[Yr]})}return n})();var O=new v$1(``);var Dt={provide:O,useExisting:Es(()=>Ze),multi:!0};function bt(){let n=Bt$3()?Bt$3().getUserAgent():``;return/android (\d+)/.test(n.toLowerCase())}var At$1=new v$1(``);var Ze=(()=>{class n extends ze$1{_compositionMode;_composing=!1;constructor(e,i,r){super(e,i),this._compositionMode=r,this._compositionMode??=!bt()}writeValue(e){let i=e??``;this.setProperty(`value`,i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static ɵfac=function(i){return new(i||n)(Fe$1(Xn),Fe$1(de$1),Fe$1(At$1,8))};static ɵdir=et$3({type:n,selectors:[[`input`,`formControlName`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`formControlName`,``,3,`ngNoCva`,``],[`input`,`formControl`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`formControl`,``,3,`ngNoCva`,``],[`input`,`ngModel`,``,3,`type`,`checkbox`,3,`ngNoCva`,``],[`textarea`,`ngModel`,``,3,`ngNoCva`,``],[``,`ngDefaultControl`,``]],hostBindings:function(i,r){i&1&&dv(`input`,function(s){return r._handleInput(s.target.value)})(`blur`,function(){return r.onTouched()})(`compositionstart`,function(){return r._compositionStart()})(`compositionend`,function(s){return r._compositionEnd(s.target.value)})},standalone:!1,features:[Fv([Dt]),Yr]})}return n})();function Ve$1(n){return n==null||De(n)===0}function De(n){return n==null?null:Array.isArray(n)||typeof n==`string`?n.length:n instanceof Set?n.size:null}var x=new v$1(``);var oe=new v$1(``);var Mt=/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;var pe$1=class{static min(t){return Xe(t)}static max(t){return Et(t)}static required(t){return Ye(t)}static requiredTrue(t){return Ft(t)}static email(t){return wt(t)}static minLength(t){return Nt(t)}static maxLength(t){return It$1(t)}static pattern(t){return St(t)}static nullValidator(t){return Y()}static compose(t){return nt$1(t)}static composeAsync(t){return it$1(t)}};function Xe(n){return t=>{if(t.value==null||n==null)return null;let e=parseFloat(t.value);return!isNaN(e)&&e<n?{min:{min:n,actual:t.value}}:null}}function Et(n){return t=>{if(t.value==null||n==null)return null;let e=parseFloat(t.value);return!isNaN(e)&&e>n?{max:{max:n,actual:t.value}}:null}}function Ye(n){return Ve$1(n.value)?{required:!0}:null}function Ft(n){return n.value===!0?null:{required:!0}}function wt(n){return Ve$1(n.value)||Mt.test(n.value)?null:{email:!0}}function Nt(n){return t=>{let e=t.value?.length??De(t.value);return e===null||e===0?null:e<n?{minlength:{requiredLength:n,actualLength:e}}:null}}function It$1(n){return t=>{let e=t.value?.length??De(t.value);return e!==null&&e>n?{maxlength:{requiredLength:n,actualLength:e}}:null}}function St(n){if(!n)return Y;let t,e;return typeof n==`string`?(e=``,n.charAt(0)!==`^`&&(e+=`^`),e+=n,n.charAt(n.length-1)!==`$`&&(e+=`$`),t=new RegExp(e)):(e=n.toString(),t=n),i=>{if(Ve$1(i.value))return null;let r=i.value;return t.test(r)?null:{pattern:{requiredPattern:e,actualValue:r}}}}function Y(n){return null}function Ke(n){return n!=null}function Je(n){return Ra(n)?st$2(n):n}function Qe(n){let t={};return n.forEach(e=>{t=e!=null?A$1(A$1({},t),e):t}),Object.keys(t).length===0?null:t}function et$1(n,t){return t.map(e=>e(n))}function Ot(n){return!n.validate}function tt$1(n){return n.map(t=>Ot(t)?t:e=>t.validate(e))}function nt$1(n){if(!n)return null;let t=n.filter(Ke);return t.length==0?null:function(e){return Qe(et$1(e,t))}}function be$1(n){return n!=null?nt$1(tt$1(n)):null}function it$1(n){if(!n)return null;let t=n.filter(Ke);return t.length==0?null:function(e){return Lc(et$1(e,t).map(Je)).pipe(K$2(Qe))}}function Ae$2(n){return n!=null?it$1(tt$1(n)):null}function Te$1(n,t){return n===null?[t]:Array.isArray(n)?[...n,t]:[n,t]}function rt$1(n){return n._rawValidators}function ot$1(n){return n._rawAsyncValidators}function me$1(n){return n?Array.isArray(n)?n:[n]:[]}function K$1(n,t){return Array.isArray(n)?n.includes(t):n===t}function Ge(n,t){let e=me$1(t);return me$1(n).forEach(r=>{K$1(e,r)||e.push(r)}),e}function Be$1(n,t){return me$1(t).filter(e=>!K$1(n,e))}var J$1=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(t){this._rawValidators=t||[],this._composedValidatorFn=be$1(this._rawValidators)}_setAsyncValidators(t){this._rawAsyncValidators=t||[],this._composedAsyncValidatorFn=Ae$2(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(t){this._onDestroyCallbacks.push(t)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(t=>t()),this._onDestroyCallbacks=[]}reset(t=void 0){this.control?.reset(t)}hasError(t,e){return this.control?this.control.hasError(t,e):!1}getError(t,e){return this.control?this.control.getError(t,e):null}};var m=class extends J$1{name;get formDirective(){return null}get path(){return null}};var T$1=`VALID`;var X=`INVALID`;var w$1=`PENDING`;var G$1=`DISABLED`;var C=class{};var Q=class extends C{value;source;constructor(t,e){super(),this.value=t,this.source=e}};var U$1=class extends C{pristine;source;constructor(t,e){super(),this.pristine=t,this.source=e}};var H=class extends C{touched;source;constructor(t,e){super(),this.touched=t,this.source=e}};var N$1=class extends C{status;source;constructor(t,e){super(),this.status=t,this.source=e}};var ee=class extends C{source;constructor(t){super(),this.source=t}};var F$1=class extends C{source;constructor(t){super(),this.source=t}};function Me$1(n){return(se$1(n)?n.validators:n)||null}function xt(n){return Array.isArray(n)?be$1(n):n||null}function Ee$1(n,t){return(se$1(t)?t.asyncValidators:n)||null}function Rt(n){return Array.isArray(n)?Ae$2(n):n||null}function se$1(n){return n!=null&&!Array.isArray(n)&&typeof n==`object`}function st$1(n,t,e){let i=n.controls;if(!(t?Object.keys(i):i).length)throw new g(1e3,``);if(!lt(i,e))throw new g(1001,``)}function at$1(n,t,e){n._forEachChild((i,r)=>{if(e[r]===void 0)throw new g(-1002,``)})}var I$1=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_hasRequired=Ot$1(!1);_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(t,e){this._assignValidators(t),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(t){this._rawValidators=this._composedValidatorFn=t,this._updateHasRequiredValidator()}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(t){this._rawAsyncValidators=this._composedAsyncValidatorFn=t}get parent(){return this._parent}get status(){return Kr(this.statusReactive)}set status(t){Kr(()=>this.statusReactive.set(t))}_status=VC(()=>this.statusReactive());statusReactive=Ot$1(void 0);get valid(){return this.status===T$1}get invalid(){return this.status===X}get pending(){return this.status===w$1}get disabled(){return this.status===G$1}get enabled(){return this.status!==G$1}errors;get pristine(){return Kr(this.pristineReactive)}set pristine(t){Kr(()=>this.pristineReactive.set(t))}_pristine=VC(()=>this.pristineReactive());pristineReactive=Ot$1(!0);get dirty(){return!this.pristine}get touched(){return Kr(this.touchedReactive)}set touched(t){Kr(()=>this.touchedReactive.set(t))}_touched=VC(()=>this.touchedReactive());touchedReactive=Ot$1(!1);get untouched(){return!this.touched}_events=new U$2;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:`change`}setValidators(t){this._assignValidators(t)}setAsyncValidators(t){this._assignAsyncValidators(t)}addValidators(t){this.setValidators(Ge(t,this._rawValidators))}addAsyncValidators(t){this.setAsyncValidators(Ge(t,this._rawAsyncValidators))}removeValidators(t){this.setValidators(Be$1(t,this._rawValidators))}removeAsyncValidators(t){this.setAsyncValidators(Be$1(t,this._rawAsyncValidators))}hasValidator(t){return K$1(this._rawValidators,t)}hasAsyncValidator(t){return K$1(this._rawAsyncValidators,t)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(t={}){let e=this.touched===!1;this.touched=!0;let i=t.sourceControl??this;t.onlySelf||this._parent?.markAsTouched(ne$1(A$1({},t),{sourceControl:i})),e&&t.emitEvent!==!1&&this._events.next(new H(!0,i))}markAllAsDirty(t={}){this.markAsDirty({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(t))}markAllAsTouched(t={}){this.markAsTouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(t))}markAsUntouched(t={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=t.sourceControl??this;this._forEachChild(r=>{r.markAsUntouched({onlySelf:!0,emitEvent:t.emitEvent,sourceControl:i})}),t.onlySelf||this._parent?._updateTouched(t,i),e&&t.emitEvent!==!1&&this._events.next(new H(!1,i))}markAsDirty(t={}){let e=this.pristine===!0;this.pristine=!1;let i=t.sourceControl??this;t.onlySelf||this._parent?.markAsDirty(ne$1(A$1({},t),{sourceControl:i})),e&&t.emitEvent!==!1&&this._events.next(new U$1(!1,i))}markAsPristine(t={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=t.sourceControl??this;this._forEachChild(r=>{r.markAsPristine({onlySelf:!0,emitEvent:t.emitEvent})}),t.onlySelf||this._parent?._updatePristine(t,i),e&&t.emitEvent!==!1&&this._events.next(new U$1(!0,i))}markAsPending(t={}){this.status=w$1;let e=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new N$1(this.status,e)),this.statusChanges.emit(this.status)),t.onlySelf||this._parent?.markAsPending(ne$1(A$1({},t),{sourceControl:e}))}disable(t={}){let e=this._parentMarkedDirty(t.onlySelf);this.status=G$1,this.errors=null,this._forEachChild(r=>{r.disable(ne$1(A$1({},t),{onlySelf:!0}))}),this._updateValue();let i=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Q(this.value,i)),this._events.next(new N$1(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(ne$1(A$1({},t),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(r=>r(!0))}enable(t={}){let e=this._parentMarkedDirty(t.onlySelf);this.status=T$1,this._forEachChild(i=>{i.enable(ne$1(A$1({},t),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent}),this._updateAncestors(ne$1(A$1({},t),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(t,e){t.onlySelf||(this._parent?.updateValueAndValidity(t),t.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(t){this._parent=t}getRawValue(){return this.value}updateValueAndValidity(t={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===T$1||this.status===w$1)&&this._runAsyncValidator(i,t.emitEvent)}let e=t.sourceControl??this;t.emitEvent!==!1&&(this._events.next(new Q(this.value,e)),this._events.next(new N$1(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),t.onlySelf||this._parent?.updateValueAndValidity(ne$1(A$1({},t),{sourceControl:e}))}_updateTreeValidity(t={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(t)),this.updateValueAndValidity({onlySelf:!0,emitEvent:t.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?G$1:T$1}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(t,e){if(this.asyncValidator){this.status=w$1,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:t!==!1};let i=Je(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(r=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(r,{emitEvent:e,shouldHaveEmitted:t})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let t=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,t}return!1}setErrors(t,e={}){this.errors=t,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(t){let e=t;return e==null||(Array.isArray(e)||(e=e.split(`.`)),e.length===0)?null:e.reduce((i,r)=>i&&i._find(r),this)}getError(t,e){let i=e?this.get(e):this;return i?.errors?i.errors[t]:null}hasError(t,e){return!!this.getError(t,e)}get root(){let t=this;for(;t._parent;)t=t._parent;return t}_updateControlsErrors(t,e,i){this.status=this._calculateStatus(),t&&this.statusChanges.emit(this.status),(t||i)&&this._events.next(new N$1(this.status,e)),this._parent&&this._parent._updateControlsErrors(t,e,i)}_initObservables(){this.valueChanges=new Pe$2,this.statusChanges=new Pe$2}_calculateStatus(){return this._allControlsDisabled()?G$1:this.errors?X:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(w$1)?w$1:this._anyControlsHaveStatus(X)?X:T$1}_anyControlsHaveStatus(t){return this._anyControls(e=>e.status===t)}_anyControlsDirty(){return this._anyControls(t=>t.dirty)}_anyControlsTouched(){return this._anyControls(t=>t.touched)}_updatePristine(t,e){let i=!this._anyControlsDirty(),r=this.pristine!==i;this.pristine=i,t.onlySelf||this._parent?._updatePristine(t,e),r&&this._events.next(new U$1(this.pristine,e))}_updateTouched(t={},e){this.touched=this._anyControlsTouched(),this._events.next(new H(this.touched,e)),t.onlySelf||this._parent?._updateTouched(t,e)}_onDisabledChange=[];_registerOnCollectionChange(t){this._onCollectionChange=t}_setUpdateStrategy(t){se$1(t)&&t.updateOn!=null&&(this._updateOn=t.updateOn)}_parentMarkedDirty(t){return!t&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(t){return null}_assignValidators(t){this._rawValidators=Array.isArray(t)?t.slice():t,this._composedValidatorFn=xt(this._rawValidators),this._updateHasRequiredValidator()}_assignAsyncValidators(t){this._rawAsyncValidators=Array.isArray(t)?t.slice():t,this._composedAsyncValidatorFn=Rt(this._rawAsyncValidators)}_updateHasRequiredValidator(){Kr(()=>this._hasRequired.set(this.hasValidator(pe$1.required)))}};function lt(n,t){return Object.hasOwn(n,t)}function Pt$1(n){return n.tagName===`INPUT`||n.tagName===`SELECT`||n.tagName===`TEXTAREA`}function kt(n,t,e,i){switch(e){case`name`:n.setAttribute(t,e,i);break;case`disabled`:case`readonly`:case`required`:i?n.setAttribute(t,e,``):n.removeAttribute(t,e);break;case`max`:case`min`:case`minLength`:case`maxLength`:i!==void 0?n.setAttribute(t,e,i.toString()):n.removeAttribute(t,e);break}}var ve$2=class{kind;context;control;message;constructor({kind:t,context:e,control:i}){this.kind=t,this.context=e,this.control=i}};function jt$1(n){return typeof n==`number`?n:parseFloat(n)}var ut=(()=>{class n{_validator=Y;_onChange;_enabled;ngOnChanges(e){if(this.inputName in e){let i=this.normalizeInput(e[this.inputName].currentValue);this._enabled=this.enabled(i),this._validator=this._enabled?this.createValidator(i):Y,this._onChange?.()}}validate(e){return this._validator(e)}registerOnValidatorChange(e){this._onChange=e}enabled(e){return e!=null}static ɵfac=function(i){return new(i||n)};static ɵdir=et$3({type:n,features:[ba]})}return n})();var Tt={provide:x,useExisting:Es(()=>Gt$1),multi:!0};var Gt$1=(()=>{class n extends ut{min;inputName=`min`;normalizeInput=e=>jt$1(e);createValidator=e=>Xe(e);static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,selectors:[[`input`,`type`,`number`,`min`,``,`formControlName`,``],[`input`,`type`,`number`,`min`,``,`formControl`,``],[`input`,`type`,`number`,`min`,``,`ngModel`,``]],hostVars:1,hostBindings:function(i,r){i&2&&rr(`min`,r._enabled?r.min:null)},inputs:{min:`min`},standalone:!1,features:[Fv([Tt]),Yr]})}return n})();var Bt$2={provide:x,useExisting:Es(()=>dt),multi:!0};var dt=(()=>{class n extends ut{required;inputName=`required`;normalizeInput=Dt$1;createValidator=e=>Ye;enabled(e){return e}static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,selectors:[[``,`required`,``,`formControlName`,``,3,`type`,`checkbox`],[``,`required`,``,`formControl`,``,3,`type`,`checkbox`],[``,`required`,``,`ngModel`,``,3,`type`,`checkbox`]],hostVars:1,hostBindings:function(i,r){i&2&&rr(`required`,r._enabled?``:null)},inputs:{required:`required`},standalone:!1,features:[Fv([Bt$2]),Yr]})}return n})();var Ut$1=new v$1(``);var W=new v$1(``,{factory:()=>ae});var ae=`always`;function ct(n,t){return[...t.path,n]}function _e$1(n,t,e=ae){Fe(n,t),t.valueAccessor.writeValue(n.value),(n.disabled||e===`always`)&&t.valueAccessor.setDisabledState?.(n.disabled),Lt$2(n,t),$t$1(n,t),Wt$1(n,t),Ht$1(n,t)}function Ue(n,t,e=!0){let i=()=>{};t?.valueAccessor?.registerOnChange(i),t?.valueAccessor?.registerOnTouched(i),ne(n,t),n&&(t._invokeOnDestroyCallbacks(),n._registerOnCollectionChange(()=>{}))}function te(n,t){n.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(t)})}function Ht$1(n,t){if(t.valueAccessor.setDisabledState){let e=i=>{t.valueAccessor.setDisabledState(i)};n.registerOnDisabledChange(e),t._registerOnDestroy(()=>{n._unregisterOnDisabledChange(e)})}}function Fe(n,t){let e=rt$1(n);t.validator!==null?n.setValidators(Te$1(e,t.validator)):typeof e==`function`&&n.setValidators([e]);let i=ot$1(n);t.asyncValidator!==null?n.setAsyncValidators(Te$1(i,t.asyncValidator)):typeof i==`function`&&n.setAsyncValidators([i]);let r=()=>n.updateValueAndValidity();te(t._rawValidators,r),te(t._rawAsyncValidators,r)}function ne(n,t){let e=!1;if(n!==null){if(t.validator!==null){let r=rt$1(n);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==t.validator);o.length!==r.length&&(e=!0,n.setValidators(o))}}if(t.asyncValidator!==null){let r=ot$1(n);if(Array.isArray(r)&&r.length>0){let o=r.filter(s=>s!==t.asyncValidator);o.length!==r.length&&(e=!0,n.setAsyncValidators(o))}}}let i=()=>{};return te(t._rawValidators,i),te(t._rawAsyncValidators,i),e}function Lt$2(n,t){t.valueAccessor.registerOnChange(e=>{n._pendingValue=e,n._pendingChange=!0,n._pendingDirty=!0,n.updateOn===`change`&&ht(n,t)})}function Wt$1(n,t){t.valueAccessor.registerOnTouched(()=>{n._pendingTouched=!0,n.updateOn===`blur`&&n._pendingChange&&ht(n,t),n.updateOn!==`submit`&&n.markAsTouched()})}function ht(n,t){n._pendingDirty&&n.markAsDirty(),n.setValue(n._pendingValue,{emitModelToViewChange:!1}),t.viewToModelUpdate(n._pendingValue),n._pendingChange=!1}function $t$1(n,t){let e=(i,r)=>{t.valueAccessor.writeValue(i),r&&t.viewToModelUpdate(i)};n.registerOnChange(e),t._registerOnDestroy(()=>{n._unregisterOnChange(e)})}function ft(n,t){Fe(n,t)}function qt$1(n,t){return ne(n,t)}function gt(n,t){if(!Object.hasOwn(n,`model`))return!1;let e=n.model;return e.isFirstChange()?!0:!Object.is(t,e.currentValue)}function zt$1(n){return Object.getPrototypeOf(n.constructor)===re$2}function pt(n,t){n._syncPendingControls(),t.forEach(e=>{let i=e.control;i.updateOn===`submit`&&i._pendingChange&&(e.viewToModelUpdate(i._pendingValue),i._pendingChange=!1)})}function Zt$1(n,t){if(!t)return null;let e,i,r;return t.forEach(o=>{o.constructor===Ze?e=o:zt$1(o)?i=o:r=o}),r||i||e||null}function Xt$1(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}var mt={provide:Ut$1,useFactory:()=>{let n=h(V,{self:!0});return{setParseErrors:t=>{n.setParseErrorSource(t)},set onReset(t){n.onReset=t}}}};var V=class extends J$1{_parent=null;name=null;valueAccessor=null;isCustomControlBased=!1;userOnReset;resetSubscription;set onReset(t){this.userOnReset=t,this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.control&&(this.resetSubscription=this.control.events.subscribe(e=>{e instanceof F$1&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription?.add(this.resetSubscription))}isNativeFormElement=!1;rawValueAccessors;_selectedValueAccessor=null;get selectedValueAccessor(){return this._selectedValueAccessor??=Zt$1(this,this.rawValueAccessors)}parseErrorsValidator=null;renderer;injector;requiredValidatorViaDi;subscription;customControlBindings=null;constructor(t,e,i){super(),this.injector=t,this.renderer=e,this.rawValueAccessors=i,this.injector?.get(De$1)?.onDestroy(()=>{this.removeParseErrorsValidator(this.control),this.subscription?.unsubscribe()})}setupCustomControl(){this.subscription?.unsubscribe();let t=this.injector?.get(ny);if(!this.control||!t)return;let e=t.markForCheck.bind(t);this.subscription=new W$1,this.subscription.add(this.control.valueChanges.subscribe(e)),this.subscription.add(this.control.statusChanges.subscribe(e)),this.resetSubscription?.unsubscribe(),this.resetSubscription=void 0,this.userOnReset&&(this.resetSubscription=this.control.events.subscribe(i=>{i instanceof F$1&&this.control&&this.userOnReset?.(this.control.value)}),this.subscription.add(this.resetSubscription)),this.parseErrorsValidator&&this.control.addValidators(this.parseErrorsValidator)}ngControlCreate(t){!t.nativeElement.hasAttribute?.(`ngNoCva`)&&(this.rawValueAccessors&&this.rawValueAccessors.length>0||this.valueAccessor!==null)||!t.customControl||(this.isCustomControlBased=!0,t.listenToCustomControlModel(r=>{this.control?.setValue(r,{emitModelToViewChange:!1}),this.control?.markAsDirty(),this.viewToModelUpdate(r)}),t.listenToCustomControlOutput(`touch`,()=>{this.control?.markAsTouched()}),this.customControlBindings={},this.isNativeFormElement=Pt$1(t.nativeElement),this.requiredValidatorViaDi=this._rawValidators.find(r=>r instanceof dt))}ngControlUpdate(t,e){if(!this.isCustomControlBased)return;let i=this.control,r=this.customControlBindings;Object.is(r.value,i.value)||(r.value=i.value,t.setCustomControlModelInput(i.value)),this.bindControlProperty(t,r,`touched`,i.touched),this.bindControlProperty(t,r,`dirty`,i.dirty),this.bindControlProperty(t,r,`valid`,i.valid),this.bindControlProperty(t,r,`invalid`,i.invalid),this.bindControlProperty(t,r,`pending`,i.pending),this.bindControlProperty(t,r,`disabled`,i.disabled),this.shouldBindRequired&&this.bindControlProperty(t,r,`required`,this.isRequired);let o=i.errors;if(r.errors!==o){r.errors=o;let s=this._convertErrors(o);t.setInputOnDirectives(`errors`,s)}}get isRequired(){return(this.requiredValidatorViaDi?._enabled||this.control?._hasRequired())??!1}get shouldBindRequired(){return!0}bindControlProperty(t,e,i,r){if(e[i]===r)return;e[i]=r;let o=t.setInputOnDirectives(i,r);this.isNativeFormElement&&!o&&(i===`disabled`||i===`required`)&&this.renderer&&kt(this.renderer,t.nativeElement,i,r)}_convertErrors(t){if(t===null)return[];let e=this.control;return Object.entries(t).map(([i,r])=>new ve$2({context:r,kind:i,control:e}))}setParseErrorSource(t){if(t===void 0)return;let e=null,i=VC(()=>{let r=t();return r.length===0?null:r.reduce((o,s)=>(o[s.kind]=s,o),{})});this.parseErrorsValidator=(()=>e).bind(this),Gs(()=>{e=i(),this.control?.updateValueAndValidity({emitEvent:!1})},{injector:this.injector})}removeParseErrorsValidator(t){this.parseErrorsValidator&&(t?.removeValidators(this.parseErrorsValidator),t?.updateValueAndValidity({emitEvent:!1}))}};var ie=class{_cd;constructor(t){this._cd=t}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Sn=(()=>{class n extends ie{constructor(e){super(e)}static ɵfac=function(i){return new(i||n)(Fe$1(V,2))};static ɵdir=et$3({type:n,selectors:[[``,`formControlName`,``],[``,`ngModel`,``],[``,`formControl`,``]],hostVars:14,hostBindings:function(i,r){i&2&&bt$1(`ng-untouched`,r.isUntouched)(`ng-touched`,r.isTouched)(`ng-pristine`,r.isPristine)(`ng-dirty`,r.isDirty)(`ng-valid`,r.isValid)(`ng-invalid`,r.isInvalid)(`ng-pending`,r.isPending)},standalone:!1,features:[Yr]})}return n})();var On=(()=>{class n extends ie{constructor(e){super(e)}static ɵfac=function(i){return new(i||n)(Fe$1(m,10))};static ɵdir=et$3({type:n,selectors:[[``,`formGroupName`,``],[``,`formArrayName`,``],[``,`ngModelGroup`,``],[``,`formGroup`,``],[``,`formArray`,``],[`form`,3,`ngNoForm`,``],[``,`ngForm`,``]],hostVars:16,hostBindings:function(i,r){i&2&&bt$1(`ng-untouched`,r.isUntouched)(`ng-touched`,r.isTouched)(`ng-pristine`,r.isPristine)(`ng-dirty`,r.isDirty)(`ng-valid`,r.isValid)(`ng-invalid`,r.isInvalid)(`ng-pending`,r.isPending)(`ng-submitted`,r.isSubmitted)},standalone:!1,features:[Yr]})}return n})();var S=class extends I$1{constructor(t,e,i){super(Me$1(e),Ee$1(i,e)),this.controls=t,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;registerControl(t,e){return this._find(t)||(this.controls[t]=e,e.setParent(this),e._registerOnCollectionChange(this._onCollectionChange),e)}addControl(t,e,i={}){this.registerControl(t,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}removeControl(t,e={}){let i=this._find(t);i&&i._registerOnCollectionChange(()=>{}),delete this.controls[t],this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}setControl(t,e,i={}){let r=this._find(t);r&&r._registerOnCollectionChange(()=>{}),delete this.controls[t],e&&this.registerControl(t,e),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}contains(t){return this._find(t)?.enabled===!0}setValue(t,e={}){Kr(()=>{at$1(this,!0,t),Object.keys(t).forEach(i=>{st$1(this,!0,i),this.controls[i].setValue(t[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(t,e={}){t!=null&&(Object.keys(t).forEach(i=>{let r=this._find(i);r&&r.patchValue(t[i],{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(t={},e={}){this._forEachChild((i,r)=>{i.reset(t?t[r]:null,ne$1(A$1({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new F$1(this))}getRawValue(){return this._reduceChildren({},(t,e,i)=>(t[i]=e.getRawValue(),t))}_syncPendingControls(){let t=this._reduceChildren(!1,(e,i)=>i._syncPendingControls()?!0:e);return t&&this.updateValueAndValidity({onlySelf:!0}),t}_forEachChild(t){Object.keys(this.controls).forEach(e=>{let i=this.controls[e];i&&t(i,e)})}_setUpControls(){this._forEachChild(t=>{t.setParent(this),t._registerOnCollectionChange(this._onCollectionChange)})}_updateValue(){this.value=this._reduceValue()}_anyControls(t){for(let[e,i]of Object.entries(this.controls))if(this.contains(e)&&t(i))return!0;return!1}_reduceValue(){return this._reduceChildren({},(e,i,r)=>((i.enabled||this.disabled)&&(e[r]=i.value),e))}_reduceChildren(t,e){let i=t;return this._forEachChild((r,o)=>{i=e(i,r,o)}),i}_allControlsDisabled(){for(let t of Object.keys(this.controls))if(this.controls[t].enabled)return!1;return Object.keys(this.controls).length>0||this.disabled}_find(t){return lt(this.controls,t)?this.controls[t]:null}};var ye$1=class extends S{};var Yt$1={provide:m,useExisting:Es(()=>Kt$1)};var B$1=Promise.resolve();var Kt$1=(()=>{class n extends m{callSetDisabledState;get submitted(){return Kr(this.submittedReactive)}_submitted=VC(()=>this.submittedReactive());submittedReactive=Ot$1(!1);_directives=new Set;form;ngSubmit=new Pe$2;options;constructor(e,i,r){super(),this.callSetDisabledState=r,this.form=new S({},be$1(e),Ae$2(i))}ngAfterViewInit(){this._setUpdateStrategy()}get formDirective(){return this}get control(){return this.form}get path(){return[]}get controls(){return this.form.controls}addControl(e){B$1.then(()=>{e.control=this._findContainer(e.path).registerControl(e.name,e.control),e._setupWithForm(this.callSetDisabledState),e.control.updateValueAndValidity({emitEvent:!1}),this._directives.add(e)})}getControl(e){return this.form.get(e.path)}removeControl(e){B$1.then(()=>{this._findContainer(e.path)?.removeControl(e.name),this._directives.delete(e)})}addFormGroup(e){B$1.then(()=>{let i=this._findContainer(e.path),r=new S({});ft(r,e),i.registerControl(e.name,r),r.updateValueAndValidity({emitEvent:!1})})}removeFormGroup(e){B$1.then(()=>{this._findContainer(e.path)?.removeControl?.(e.name)})}getFormGroup(e){return this.form.get(e.path)}updateModel(e,i){B$1.then(()=>{this.form.get(e.path).setValue(i)})}setValue(e){this.control.setValue(e)}onSubmit(e){return this.submittedReactive.set(!0),pt(this.form,this._directives),this.ngSubmit.emit(e),this.form._events.next(new ee(this.control)),e?.target?.method===`dialog`}onReset(){this.resetForm()}resetForm(e=void 0){this.form.reset(e),this.submittedReactive.set(!1)}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.form._updateOn=this.options.updateOn)}_findContainer(e){return e.pop(),e.length?this.form.get(e):this.form}static ɵfac=function(i){return new(i||n)(Fe$1(x,10),Fe$1(oe,10),Fe$1(W,8))};static ɵdir=et$3({type:n,selectors:[[`form`,3,`ngNoForm`,``,3,`formGroup`,``,3,`formArray`,``],[`ng-form`],[``,`ngForm`,``]],hostBindings:function(i,r){i&1&&dv(`submit`,function(s){return r.onSubmit(s)})(`reset`,function(){return r.onReset()})},inputs:{options:[0,`ngFormOptions`,`options`]},outputs:{ngSubmit:`ngSubmit`},exportAs:[`ngForm`],standalone:!1,features:[Fv([Yt$1]),Yr]})}return n})();function He$1(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}function Le$1(n){return typeof n==`object`&&n!==null&&Object.keys(n).length===2&&`value`in n&&`disabled`in n}var L=class extends I$1{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(t=null,e,i){super(Me$1(e),Ee$1(i,e)),this._applyFormState(t),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),se$1(e)&&(e.nonNullable||e.initialValueIsDefault)&&(Le$1(t)?this.defaultValue=t.value:this.defaultValue=t)}setValue(t,e={}){Kr(()=>{this.value=this._pendingValue=t,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)})}patchValue(t,e={}){this.setValue(t,e)}reset(t=this.defaultValue,e={}){this._applyFormState(t),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new F$1(this))}_updateValue(){}_anyControls(t){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(t){this._onChange.push(t)}_unregisterOnChange(t){He$1(this._onChange,t)}registerOnDisabledChange(t){this._onDisabledChange.push(t)}_unregisterOnDisabledChange(t){He$1(this._onDisabledChange,t)}_forEachChild(t){}_syncPendingControls(){return this.updateOn===`submit`&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(t){Le$1(t)?(this.value=this._pendingValue=t.value,t.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=t}};var Jt$1=n=>n instanceof L;var Qt$1=(()=>{class n extends m{callSetDisabledState;get submitted(){return Kr(this._submittedReactive)}set submitted(e){this._submittedReactive.set(e)}_submitted=VC(()=>this._submittedReactive());_submittedReactive=Ot$1(!1);_oldForm;_onCollectionChange=()=>this._updateDomValue();directives=[];constructor(e,i,r){super(),this.callSetDisabledState=r,this._setValidators(e),this._setAsyncValidators(i)}ngOnChanges(e){this.onChanges(e)}ngOnDestroy(){this.onDestroy()}onChanges(e){this._checkFormPresent(),Object.hasOwn(e,`form`)&&(this._updateValidators(),this._updateDomValue(),this._updateRegistrations(),this._oldForm=this.form)}onDestroy(){this.form&&(ne(this.form,this),this.form._onCollectionChange===this._onCollectionChange&&this.form._registerOnCollectionChange(()=>{}))}get formDirective(){return this}get path(){return[]}addControl(e){let i=this.form.get(e.path);return e._setupWithForm(i,this.callSetDisabledState),i.updateValueAndValidity({emitEvent:!1}),this.directives.push(e),i}getControl(e){return this.form.get(e.path)}removeControl(e){Ue(e.control||null,e,!1),Xt$1(this.directives,e)}addFormGroup(e){this._setUpFormContainer(e)}removeFormGroup(e){this._cleanUpFormContainer(e)}getFormGroup(e){return this.form.get(e.path)}getFormArray(e){return this.form.get(e.path)}addFormArray(e){this._setUpFormContainer(e)}removeFormArray(e){this._cleanUpFormContainer(e)}updateModel(e,i){this.form.get(e.path).setValue(i)}onReset(){this.resetForm()}resetForm(e=void 0,i={}){this.form.reset(e,i),this._submittedReactive.set(!1)}onSubmit(e){return this.submitted=!0,pt(this.form,this.directives),this.ngSubmit.emit(e),this.form._events.next(new ee(this.control)),e?.target?.method===`dialog`}_updateDomValue(){this.directives.forEach(e=>{let i=e.control,r=this.form.get(e.path);i!==r&&(Ue(i||null,e),Jt$1(r)&&e._setupWithForm(r,this.callSetDisabledState))}),this.form._updateTreeValidity({emitEvent:!1})}_setUpFormContainer(e){let i=this.form.get(e.path);ft(i,e),i.updateValueAndValidity({emitEvent:!1})}_cleanUpFormContainer(e){let i=this.form?.get(e.path);i&&qt$1(i,e)&&i.updateValueAndValidity({emitEvent:!1})}_updateRegistrations(){this.form._registerOnCollectionChange(this._onCollectionChange),this._oldForm?._registerOnCollectionChange(()=>{})}_updateValidators(){Fe(this.form,this),this._oldForm&&ne(this._oldForm,this)}_checkFormPresent(){this.form}static ɵfac=function(i){return new(i||n)(Fe$1(x,10),Fe$1(oe,10),Fe$1(W,8))};static ɵdir=et$3({type:n,features:[Yr,ba]})}return n})();var en$1={provide:m,useExisting:Es(()=>tn$1)};var tn$1=(()=>{class n extends Qt$1{form=null;ngSubmit=new Pe$2;get control(){return this.form}static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,selectors:[[``,`formGroup`,``]],hostBindings:function(i,r){i&1&&dv(`submit`,function(s){return r.onSubmit(s)})(`reset`,function(){return r.onReset()})},inputs:{form:[0,`formGroup`,`form`]},outputs:{ngSubmit:`ngSubmit`},exportAs:[`ngForm`],standalone:!1,features:[Fv([en$1]),Yr]})}return n})();var nn$1={provide:V,useExisting:Es(()=>rn$1)};var We=Promise.resolve();var rn$1=(()=>{class n extends V{_changeDetectorRef;callSetDisabledState;control=new L;static ngAcceptInputType_isDisabled;_registered=!1;_ngModelInjector;viewModel;name=``;isDisabled;model;options;update=new Pe$2;constructor(e,i,r,o,s,f,v,R){super(v,R,o),this._changeDetectorRef=s,this.callSetDisabledState=f,this._parent=e,this._setValidators(i),this._setAsyncValidators(r)}ngOnChanges(e){if(this._registered,this._checkForErrors(),!this._registered||`name`in e){if(this._registered&&(this._checkName(),this.formDirective)){let i=e.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}`isDisabled`in e&&this._updateDisabled(e),gt(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}ɵngControlCreate(e){super.ngControlCreate(e)}ɵngControlUpdate(e){super.ngControlUpdate(e,!1)}get shouldBindRequired(){return!1}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,_e$1(this.control,this,this.callSetDisabledState)),this.control.updateValueAndValidity({emitEvent:!1})}_setupWithForm(e){this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,_e$1(this.control,this,e))}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){We.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let i=e.isDisabled.currentValue,r=i!==0&&Dt$1(i);We.then(()=>{r&&!this.control.disabled?this.control.disable():!r&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?ct(e,this._parent):[e]}static ɵfac=function(i){return new(i||n)(Fe$1(m,9),Fe$1(x,10),Fe$1(oe,10),Fe$1(O,10),Fe$1(ny,8),Fe$1(W,8),Fe$1(X$1,8),Fe$1(Xn,8))};static ɵdir=et$3({type:n,selectors:[[``,`ngModel`,``,3,`formControlName`,``,3,`formControl`,``]],inputs:{name:`name`,isDisabled:[0,`disabled`,`isDisabled`],model:[0,`ngModel`,`model`],options:[0,`ngModelOptions`,`options`]},outputs:{update:`ngModelChange`},exportAs:[`ngModel`],standalone:!1,features:[Fv([nn$1,mt]),Yr,ba,pS(null)]})}return n})();var Rn=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵdir=et$3({type:n,selectors:[[`form`,3,`ngNoForm`,``,3,`ngNativeValidate`,``]],hostAttrs:[`novalidate`,``],standalone:!1})}return n})();var on$1={provide:O,useExisting:Es(()=>sn$1),multi:!0};var sn$1=(()=>{class n extends re$2{writeValue(e){let i=e??``;this.setProperty(`value`,i)}registerOnChange(e){this.onChange=i=>{e(i==``?null:parseFloat(i))}}static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,selectors:[[`input`,`type`,`number`,`formControlName`,``,3,`ngNoCva`,``],[`input`,`type`,`number`,`formControl`,``,3,`ngNoCva`,``],[`input`,`type`,`number`,`ngModel`,``,3,`ngNoCva`,``]],hostBindings:function(i,r){i&1&&dv(`input`,function(s){return r.onChange(s.target.value)})(`blur`,function(){return r.onTouched()})},standalone:!1,features:[Fv([on$1]),Yr]})}return n})();var Ce$1=class extends I$1{constructor(t,e,i){super(Me$1(e),Ee$1(i,e)),this.controls=t,this._initObservables(),this._setUpdateStrategy(e),this._setUpControls(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator})}controls;at(t){return this.controls[this._adjustIndex(t)]}push(t,e={}){Array.isArray(t)?t.forEach(i=>{this.controls.push(i),this._registerControl(i)}):(this.controls.push(t),this._registerControl(t)),this.updateValueAndValidity({emitEvent:e.emitEvent}),this._onCollectionChange()}insert(t,e,i={}){this.controls.splice(t,0,e),this._registerControl(e),this.updateValueAndValidity({emitEvent:i.emitEvent})}removeAt(t,e={}){let i=this._adjustIndex(t);i<0&&(i=0),this.controls[i]&&this.controls[i]._registerOnCollectionChange(()=>{}),this.controls.splice(i,1),this.updateValueAndValidity({emitEvent:e.emitEvent})}setControl(t,e,i={}){let r=this._adjustIndex(t);r<0&&(r=0),this.controls[r]&&this.controls[r]._registerOnCollectionChange(()=>{}),this.controls.splice(r,1),e&&(this.controls.splice(r,0,e),this._registerControl(e)),this.updateValueAndValidity({emitEvent:i.emitEvent}),this._onCollectionChange()}get length(){return this.controls.length}setValue(t,e={}){Kr(()=>{at$1(this,!1,t),t.forEach((i,r)=>{st$1(this,!1,r),this.at(r).setValue(i,{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e)})}patchValue(t,e={}){t!=null&&(t.forEach((i,r)=>{this.at(r)&&this.at(r).patchValue(i,{onlySelf:!0,emitEvent:e.emitEvent})}),this.updateValueAndValidity(e))}reset(t=[],e={}){this._forEachChild((i,r)=>{i.reset(t[r],ne$1(A$1({},e),{onlySelf:!0}))}),this._updatePristine(e,this),this._updateTouched(e,this),this.updateValueAndValidity(e),e?.emitEvent!==!1&&this._events.next(new F$1(this))}getRawValue(){return this.controls.map(t=>t.getRawValue())}clear(t={}){this.controls.length<1||(this._forEachChild(e=>e._registerOnCollectionChange(()=>{})),this.controls.splice(0),this.updateValueAndValidity({emitEvent:t.emitEvent}))}_adjustIndex(t){return t<0?t+this.length:t}_syncPendingControls(){let t=this.controls.reduce((e,i)=>i._syncPendingControls()?!0:e,!1);return t&&this.updateValueAndValidity({onlySelf:!0}),t}_forEachChild(t){this.controls.forEach((e,i)=>{t(e,i)})}_updateValue(){this.value=this.controls.filter(t=>t.enabled||this.disabled).map(t=>t.value)}_anyControls(t){return this.controls.some(e=>e.enabled&&t(e))}_setUpControls(){this._forEachChild(t=>this._registerControl(t))}_allControlsDisabled(){for(let t of this.controls)if(t.enabled)return!1;return this.controls.length>0||this.disabled}_registerControl(t){t.setParent(this),t._registerOnCollectionChange(this._onCollectionChange)}_find(t){return this.at(t)??null}};var vt=new v$1(``);var an$1={provide:V,useExisting:Es(()=>ln$1)};var ln$1=(()=>{class n extends V{_ngModelWarningConfig;_added=!1;viewModel;control;name=null;set isDisabled(e){}model;update=new Pe$2;static _ngModelWarningSentOnce=!1;_ngModelWarningSent=!1;constructor(e,i,r,o,s,f,v){super(v,f,o),this._ngModelWarningConfig=s,this._parent=e,this._setValidators(i),this._setAsyncValidators(r)}_setupWithForm(e,i){this.control=e,this.isCustomControlBased?this.setupCustomControl():(this.valueAccessor??=this.selectedValueAccessor,_e$1(e,this,i))}ngOnChanges(e){this._added||this._setUpControl(),gt(e,this.viewModel)&&(this.viewModel=this.model,this.formDirective.updateModel(this,this.model))}ngOnDestroy(){this.formDirective?.removeControl(this)}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}get path(){return ct(this.name==null?this.name:this.name.toString(),this._parent)}get formDirective(){return this._parent?this._parent.formDirective:null}_setUpControl(){this.control=this.formDirective.addControl(this),this._added=!0}ɵngControlCreate(e){super.ngControlCreate(e)}ɵngControlUpdate(e){this.isCustomControlBased&&(this._added||this._setUpControl(),super.ngControlUpdate(e,!0))}static ɵfac=function(i){return new(i||n)(Fe$1(m,13),Fe$1(x,10),Fe$1(oe,10),Fe$1(O,10),Fe$1(vt,8),Fe$1(Xn,8),Fe$1(X$1,8))};static ɵdir=et$3({type:n,selectors:[[``,`formControlName`,``]],inputs:{name:[0,`formControlName`,`name`],isDisabled:[0,`disabled`,`isDisabled`],model:[0,`ngModel`,`model`]},outputs:{update:`ngModelChange`},standalone:!1,features:[Fv([an$1,mt]),Yr,ba,pS(null)]})}return n})();var un$1={provide:O,useExisting:Es(()=>yt),multi:!0};function _t(n,t){return n==null?`${t}`:(t&&typeof t==`object`&&(t=`Object`),`${n}: ${t}`.slice(0,50))}function dn$1(n){return n.split(`:`)[0]}var yt=(()=>{class n extends re$2{value;_optionMap=new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;appRefInjector=h(nr).injector;destroyRef=h(De$1);cdr=h(ny);_queuedWrite=!1;_writeValueAfterRender(){this._queuedWrite||this.appRefInjector.destroyed||(this._queuedWrite=!0,ed({write:()=>{this.destroyRef.destroyed||(this._queuedWrite=!1,this.writeValue(this.value))}},{injector:this.appRefInjector}))}writeValue(e){this.cdr.markForCheck(),this.value=e;let r=_t(this._getOptionId(e),e);this.setProperty(`value`,r)}registerOnChange(e){this.onChange=i=>{this.value=this._getOptionValue(i),e(this.value)}}_registerOption(){return(this._idCounter++).toString()}_getOptionId(e){for(let i of this._optionMap.keys())if(this._compareWith(this._optionMap.get(i),e))return i;return null}_getOptionValue(e){let i=dn$1(e);return this._optionMap.has(i)?this._optionMap.get(i):e}static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,selectors:[[`select`,`formControlName`,``,3,`multiple`,``,3,`ngNoCva`,``],[`select`,`formControl`,``,3,`multiple`,``,3,`ngNoCva`,``],[`select`,`ngModel`,``,3,`multiple`,``,3,`ngNoCva`,``]],hostBindings:function(i,r){i&1&&dv(`change`,function(s){return r.onChange(s.target.value)})(`blur`,function(){return r.onTouched()})},inputs:{compareWith:`compareWith`},standalone:!1,features:[Fv([un$1]),Yr]})}return n})();var Pn=(()=>{class n{_element;_renderer;_select;id;constructor(e,i,r){this._element=e,this._renderer=i,this._select=r,this._select&&(this.id=this._select._registerOption())}set ngValue(e){this._select!=null&&(this._select._optionMap.set(this.id,e),this._setElementValue(_t(this.id,e)),this._select._writeValueAfterRender())}set value(e){this._setElementValue(e),this._select?._writeValueAfterRender()}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,`value`,e)}ngOnDestroy(){this._select?._optionMap.delete(this.id),this._select?._writeValueAfterRender()}static ɵfac=function(i){return new(i||n)(Fe$1(de$1),Fe$1(Xn),Fe$1(yt,9))};static ɵdir=et$3({type:n,selectors:[[`option`]],inputs:{ngValue:`ngValue`,value:`value`},standalone:!1})}return n})();var cn$1={provide:O,useExisting:Es(()=>Ct),multi:!0};function $e$1(n,t){return n==null?`${t}`:(typeof t==`string`&&(t=`'${t}'`),t&&typeof t==`object`&&(t=`Object`),`${n}: ${t}`.slice(0,50))}function hn(n){return n.split(`:`)[0]}var Ct=(()=>{class n extends re$2{value;_optionMap=new Map;_idCounter=0;set compareWith(e){this._compareWith=e}_compareWith=Object.is;writeValue(e){this.value=e;let i;if(Array.isArray(e)){let r=e.map(o=>this._getOptionId(o));i=(o,s)=>{o._setSelected(r.indexOf(s)>-1)}}else i=r=>{r._setSelected(!1)};this._optionMap.forEach(i)}registerOnChange(e){this.onChange=i=>{let r=[],o=i.selectedOptions;if(o!==void 0){let s=o;for(let f=0;f<s.length;f++){let v=s[f],R=this._getOptionValue(v.value);r.push(R)}}else{let s=i.options;for(let f=0;f<s.length;f++){let v=s[f];if(v.selected){let R=this._getOptionValue(v.value);r.push(R)}}}this.value=r,e(r)}}_registerOption(e){let i=(this._idCounter++).toString();return this._optionMap.set(i,e),i}_getOptionId(e){for(let i of this._optionMap.keys())if(this._compareWith(this._optionMap.get(i)._value,e))return i;return null}_getOptionValue(e){let i=hn(e);return this._optionMap.has(i)?this._optionMap.get(i)._value:e}static ɵfac=(()=>{let e;return function(r){return(e||(e=_m(n)))(r||n)}})();static ɵdir=et$3({type:n,selectors:[[`select`,`multiple`,``,`formControlName`,``,3,`ngNoCva`,``],[`select`,`multiple`,``,`formControl`,``,3,`ngNoCva`,``],[`select`,`multiple`,``,`ngModel`,``,3,`ngNoCva`,``]],hostBindings:function(i,r){i&1&&dv(`change`,function(s){return r.onChange(s.target)})(`blur`,function(){return r.onTouched()})},inputs:{compareWith:`compareWith`},standalone:!1,features:[Fv([cn$1]),Yr]})}return n})();var kn=(()=>{class n{_element;_renderer;_select;id;_value;constructor(e,i,r){this._element=e,this._renderer=i,this._select=r,this._select&&(this.id=this._select._registerOption(this))}set ngValue(e){this._select!=null&&(this._value=e,this._setElementValue($e$1(this.id,e)),this._select.writeValue(this._select.value))}set value(e){this._select?(this._value=e,this._setElementValue($e$1(this.id,e)),this._select.writeValue(this._select.value)):this._setElementValue(e)}_setElementValue(e){this._renderer.setProperty(this._element.nativeElement,`value`,e)}_setSelected(e){this._renderer.setProperty(this._element.nativeElement,`selected`,e)}ngOnDestroy(){this._select&&(this._select._optionMap.delete(this.id),this._select.writeValue(this._select.value))}static ɵfac=function(i){return new(i||n)(Fe$1(de$1),Fe$1(Xn),Fe$1(Ct,9))};static ɵdir=et$3({type:n,selectors:[[`option`]],inputs:{ngValue:`ngValue`,value:`value`},standalone:!1})}return n})();var Vt$1=(()=>{class n{static ɵfac=function(i){return new(i||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({})}return n})();function qe$1(n){return!!n&&(n.asyncValidators!==void 0||n.validators!==void 0||n.updateOn!==void 0)}var jn=(()=>{class n{useNonNullable=!1;get nonNullable(){let e=new n;return e.useNonNullable=!0,e}group(e,i=null){let r=this._reduceControls(e),o={};return qe$1(i)?o=i:i!==null&&(o.validators=i.validator,o.asyncValidators=i.asyncValidator),new S(r,o)}record(e,i=null){return new ye$1(this._reduceControls(e),i)}control(e,i,r){let o={};return this.useNonNullable?(qe$1(i)?o=i:(o.validators=i,o.asyncValidators=r),new L(e,ne$1(A$1({},o),{nonNullable:!0}))):new L(e,i,r)}array(e,i,r){return new Ce$1(e.map(s=>this._createControl(s)),i,r)}_reduceControls(e){let i={};return Object.keys(e).forEach(r=>{i[r]=this._createControl(e[r])}),i}_createControl(e){if(e instanceof L)return e;if(e instanceof I$1)return e;if(Array.isArray(e)){let i=e[0],r=e.length>1?e[1]:null,o=e.length>2?e[2]:null;return this.control(i,r,o)}else return this.control(e)}static ɵfac=function(i){return new(i||n)};static ɵprov=k({token:n,factory:n.ɵfac})}return n})();var Tn=(()=>{class n{static withConfig(e){return{ngModule:n,providers:[{provide:W,useValue:e.callSetDisabledState??ae}]}}static ɵfac=function(i){return new(i||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[Vt$1]})}return n})();var Gn=(()=>{class n{static withConfig(e){return{ngModule:n,providers:[{provide:vt,useValue:e.warnOnNgModelWithFormControl??`always`},{provide:W,useValue:e.callSetDisabledState??ae}]}}static ɵfac=function(i){return new(i||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[Vt$1]})}return n})();var Ie=class{_box;_destroyed=new U$2;_resizeSubject=new U$2;_resizeObserver;_elementObservables=new Map;constructor(a){this._box=a,typeof ResizeObserver<`u`&&(this._resizeObserver=new ResizeObserver(e=>this._resizeSubject.next(e)))}observe(a){return this._elementObservables.has(a)||this._elementObservables.set(a,new M(e=>{let t=this._resizeSubject.subscribe(e);return this._resizeObserver?.observe(a,{box:this._box}),()=>{this._resizeObserver?.unobserve(a),t.unsubscribe(),this._elementObservables.delete(a)}}).pipe(at$3(e=>e.some(t=>t.target===a)),FD({bufferSize:1,refCount:!0}),yo(this._destroyed))),this._elementObservables.get(a)}destroy(){this._destroyed.next(),this._destroyed.complete(),this._resizeSubject.complete(),this._elementObservables.clear()}};var It=(()=>{class n{_cleanupErrorListener;_observers=new Map;_ngZone=h(P);constructor(){}ngOnDestroy(){for(let[,e]of this._observers)e.destroy();this._observers.clear(),this._cleanupErrorListener?.()}observe(e,t){let i=t?.box||`content-box`;return this._observers.has(i)||this._observers.set(i,new Ie(i)),this._observers.get(i).observe(e)}static ɵfac=function(t){return new(t||n)};static ɵprov=k({token:n,factory:n.ɵfac})}return n})();var li=[`notch`];var si=[`*`];var At=[`iconPrefixContainer`];var Pt=[`textPrefixContainer`];var zt=[`iconSuffixContainer`];var Lt$1=[`textSuffixContainer`];var di=[`textField`];var ci=[`*`,[[`mat-label`]],[[``,`matPrefix`,``],[``,`matIconPrefix`,``]],[[``,`matTextPrefix`,``]],[[``,`matTextSuffix`,``]],[[``,`matSuffix`,``],[``,`matIconSuffix`,``]],[[`mat-error`],[``,`matError`,``]],[[`mat-hint`,3,`align`,`end`]],[[`mat-hint`,`align`,`end`]]];var mi=[`*`,`mat-label`,`[matPrefix], [matIconPrefix]`,`[matTextPrefix]`,`[matTextSuffix]`,`[matSuffix], [matIconSuffix]`,`mat-error, [matError]`,`mat-hint:not([align='end'])`,`mat-hint[align='end']`];function fi(n,a){n&1&&sv(0,`span`,21)}function ui(n,a){if(n&1&&(va(0,`label`,20),tt$2(1,1),ui$1(2,fi,1,0,`span`,21),Cd()),n&2){let e=zS(2);iv(`floating`,e._shouldLabelFloat())(`monitorResize`,e._hasOutline())(`id`,e._labelId),rr(`for`,e._control.disableAutomaticLabeling?null:e._control.id),oi(2),li$1(!e.hideRequiredMarker&&e._control.required?2:-1)}}function pi(n,a){if(n&1&&ui$1(0,ui,3,5,`label`,20),n&2)li$1(zS()._hasFloatingLabel()?0:-1)}function hi(n,a){n&1&&sv(0,`div`,7)}function gi(n,a){}function _i(n,a){if(n&1&&ev(0,gi,0,0,`ng-template`,13),n&2){zS(2);iv(`ngTemplateOutlet`,KS(1))}}function bi(n,a){if(n&1&&(va(0,`div`,9),ui$1(1,_i,1,1,null,13),Cd()),n&2){let e=zS();iv(`matFormFieldNotchedOutlineOpen`,e._shouldLabelFloat()),oi(),li$1(e._forceDisplayInfixLabel()?-1:1)}}function vi(n,a){n&1&&(va(0,`div`,10,2),tt$2(2,2),Cd())}function xi(n,a){n&1&&(va(0,`div`,11,3),tt$2(2,3),Cd())}function yi(n,a){}function Si(n,a){if(n&1&&ev(0,yi,0,0,`ng-template`,13),n&2){zS();iv(`ngTemplateOutlet`,KS(1))}}function Ni(n,a){n&1&&(va(0,`div`,14,4),tt$2(2,4),Cd())}function Ci(n,a){n&1&&(va(0,`div`,15,5),tt$2(2,5),Cd())}function wi(n,a){n&1&&sv(0,`div`,16)}function Mi(n,a){n&1&&(va(0,`div`,18),tt$2(1,6),Cd())}function ki(n,a){if(n&1&&(va(0,`mat-hint`,22),vC(1),Cd()),n&2){let e=zS(2);iv(`id`,e._hintLabelId),oi(),Tv(e.hintLabel)}}function Fi(n,a){if(n&1&&(va(0,`div`,19),ui$1(1,ki,2,2,`mat-hint`,22),tt$2(2,7),sv(3,`div`,23),tt$2(4,8),Cd()),n&2){let e=zS();oi(),li$1(e.hintLabel?1:-1)}}var Ae$1=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵdir=et$3({type:n,selectors:[[`mat-label`]]})}return n})();var Ei=new v$1(`MatError`);var Pe$1=(()=>{class n{align=`start`;id=h(_f).getId(`mat-mdc-hint-`);static ɵfac=function(t){return new(t||n)};static ɵdir=et$3({type:n,selectors:[[`mat-hint`]],hostAttrs:[1,`mat-mdc-form-field-hint`,`mat-mdc-form-field-bottom-align`],hostVars:4,hostBindings:function(t,i){t&2&&(uv(`id`,i.id),rr(`align`,null),bt$1(`mat-mdc-form-field-hint-end`,i.align===`end`))},inputs:{align:`align`,id:`id`}})}return n})();var Oi=new v$1(`MatPrefix`);var Di=new v$1(`MatSuffix`);var Gt=new v$1(`FloatingLabelParent`);var Vt=(()=>{class n{_elementRef=h(de$1);get floating(){return this._floating}set floating(e){this._floating=e,this.monitorResize&&this._handleResize()}_floating=!1;get monitorResize(){return this._monitorResize}set monitorResize(e){this._monitorResize=e,this._monitorResize?this._subscribeToResize():this._resizeSubscription.unsubscribe()}_monitorResize=!1;_resizeObserver=h(It);_ngZone=h(P);_parent=h(Gt);_resizeSubscription=new W$1;ngOnDestroy(){this._resizeSubscription.unsubscribe()}getWidth(){return Ti(this._elementRef.nativeElement)}get element(){return this._elementRef.nativeElement}_handleResize(){setTimeout(()=>this._parent._handleLabelResized())}_subscribeToResize(){this._resizeSubscription.unsubscribe(),this._ngZone.runOutsideAngular(()=>{this._resizeSubscription=this._resizeObserver.observe(this._elementRef.nativeElement,{box:`border-box`}).subscribe(()=>this._handleResize())})}static ɵfac=function(t){return new(t||n)};static ɵdir=et$3({type:n,selectors:[[`label`,`matFormFieldFloatingLabel`,``]],hostAttrs:[1,`mdc-floating-label`,`mat-mdc-floating-label`],hostVars:2,hostBindings:function(t,i){t&2&&bt$1(`mdc-floating-label--float-above`,i.floating)},inputs:{floating:`floating`,monitorResize:`monitorResize`}})}return n})();function Ti(n){let a=n;if(a.offsetParent!==null)return a.scrollWidth;let e=a.cloneNode(!0);e.style.setProperty(`position`,`absolute`),e.style.setProperty(`transform`,`translate(-9999px, -9999px)`),document.documentElement.appendChild(e);let t=e.scrollWidth;return e.remove(),t}var Bt$1=`mdc-line-ripple--active`;var ve$1=`mdc-line-ripple--deactivating`;var jt=(()=>{class n{_elementRef=h(de$1);_cleanupTransitionEnd;constructor(){let e=h(P),t=h(Xn);e.runOutsideAngular(()=>{this._cleanupTransitionEnd=t.listen(this._elementRef.nativeElement,`transitionend`,this._handleTransitionEnd)})}activate(){let e=this._elementRef.nativeElement.classList;e.remove(ve$1),e.add(Bt$1)}deactivate(){this._elementRef.nativeElement.classList.add(ve$1)}_handleTransitionEnd=e=>{let t=this._elementRef.nativeElement.classList,i=t.contains(ve$1);e.propertyName===`opacity`&&i&&t.remove(Bt$1,ve$1)};ngOnDestroy(){this._cleanupTransitionEnd()}static ɵfac=function(t){return new(t||n)};static ɵdir=et$3({type:n,selectors:[[`div`,`matFormFieldLineRipple`,``]],hostAttrs:[1,`mdc-line-ripple`]})}return n})();var qt=(()=>{class n{_elementRef=h(de$1);_ngZone=h(P);open=!1;_notch;ngAfterViewInit(){let e=this._elementRef.nativeElement,t=e.querySelector(`.mdc-floating-label`);t?(e.classList.add(`mdc-notched-outline--upgraded`),typeof requestAnimationFrame==`function`&&(t.style.transitionDuration=`0s`,this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>t.style.transitionDuration=``)}))):e.classList.add(`mdc-notched-outline--no-label`)}_setNotchWidth(e){let t=this._notch.nativeElement;!this.open||!e?t.style.width=``:t.style.width=`calc(${e}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)`}_setMaxWidth(e){this._notch.nativeElement.style.setProperty(`--mat-form-field-notch-max-width`,`calc(100% - ${e}px)`)}static ɵfac=function(t){return new(t||n)};static ɵcmp=Le$2({type:n,selectors:[[`div`,`matFormFieldNotchedOutline`,``]],viewQuery:function(t,i){if(t&1&&mv(li,5),t&2){let r;qS(r=ZS())&&(i._notch=r.first)}},hostAttrs:[1,`mdc-notched-outline`],hostVars:2,hostBindings:function(t,i){t&2&&bt$1(`mdc-notched-outline--notched`,i.open)},inputs:{open:[0,`matFormFieldNotchedOutlineOpen`,`open`]},ngContentSelectors:si,decls:5,vars:0,consts:[[`notch`,``],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__leading`],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__notch`],[1,`mat-mdc-notch-piece`,`mdc-notched-outline__trailing`]],template:function(t,i){t&1&&(or(),mn$1(0,`div`,1),pn$1(1,`div`,2,0),tt$2(3),hn$1(),mn$1(4,`div`,3))},encapsulation:2})}return n})();var ze=(()=>{class n{value=null;stateChanges;id;placeholder;ngControl=null;focused=!1;empty=!1;shouldLabelFloat=!1;required=!1;disabled=!1;errorState=!1;controlType;autofilled;userAriaDescribedBy;disableAutomaticLabeling;describedByIds;static ɵfac=function(t){return new(t||n)};static ɵdir=et$3({type:n})}return n})();var Le=new v$1(`MatFormField`);var Ri=new v$1(`MAT_FORM_FIELD_DEFAULT_OPTIONS`);var Ht=`fill`;var Ii=`auto`;var Wt=`fixed`;var Ai=`translateY(-50%)`;var xe$1=(()=>{class n{_elementRef=h(de$1);_changeDetectorRef=h(ny);_platform=h(Ie$1);_idGenerator=h(_f);_ngZone=h(P);_defaults=h(Ri,{optional:!0});_currentDirection;_textField;_iconPrefixContainer;_textPrefixContainer;_iconSuffixContainer;_textSuffixContainer;_floatingLabel;_notchedOutline;_lineRipple;_iconPrefixContainerSignal=jH(`iconPrefixContainer`);_textPrefixContainerSignal=jH(`textPrefixContainer`);_iconSuffixContainerSignal=jH(`iconSuffixContainer`);_textSuffixContainerSignal=jH(`textSuffixContainer`);_prefixSuffixContainers=VC(()=>[this._iconPrefixContainerSignal(),this._textPrefixContainerSignal(),this._iconSuffixContainerSignal(),this._textSuffixContainerSignal()].map(e=>e?.nativeElement).filter(e=>e!==void 0));_formFieldControl;_prefixChildren;_suffixChildren;_errorChildren;_hintChildren;_labelChild=BH(Ae$1);get hideRequiredMarker(){return this._hideRequiredMarker}set hideRequiredMarker(e){this._hideRequiredMarker=U3(e)}_hideRequiredMarker=!1;color=`primary`;get floatLabel(){return this._floatLabel||this._defaults?.floatLabel||Ii}set floatLabel(e){e!==this._floatLabel&&(this._floatLabel=e,this._changeDetectorRef.markForCheck())}_floatLabel;get appearance(){return this._appearanceSignal()}set appearance(e){let t=e||this._defaults?.appearance||Ht;this._appearanceSignal.set(t)}_appearanceSignal=Ot$1(Ht);get subscriptSizing(){return this._subscriptSizing||this._defaults?.subscriptSizing||Wt}set subscriptSizing(e){this._subscriptSizing=e||this._defaults?.subscriptSizing||Wt}_subscriptSizing=null;get hintLabel(){return this._hintLabel}set hintLabel(e){this._hintLabel=e,this._processHints()}_hintLabel=``;_hasIconPrefix=!1;_hasTextPrefix=!1;_hasIconSuffix=!1;_hasTextSuffix=!1;_labelId=this._idGenerator.getId(`mat-mdc-form-field-label-`);_hintLabelId=this._idGenerator.getId(`mat-mdc-hint-`);_describedByIds;get _control(){return this._explicitFormFieldControl||this._formFieldControl}set _control(e){this._explicitFormFieldControl=e}_destroyed=new U$2;_isFocused=null;_explicitFormFieldControl;_previousControl=null;_previousControlValidatorFn=null;_stateChanges;_valueChanges;_describedByChanges;_outlineLabelOffsetResizeObserver=null;_animationsDisabled=no();constructor(){let e=this._defaults,t=h(SM);e&&(e.appearance&&(this.appearance=e.appearance),this._hideRequiredMarker=!!e?.hideRequiredMarker,e.color&&(this.color=e.color)),Gs(()=>this._currentDirection=t.valueSignal()),this._syncOutlineLabelOffset()}ngAfterViewInit(){this._updateFocusState(),this._animationsDisabled||this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{this._elementRef.nativeElement.classList.add(`mat-form-field-animations-enabled`)},300)}),this._changeDetectorRef.detectChanges()}ngAfterContentInit(){this._assertFormFieldControl(),this._initializeSubscript(),this._initializePrefixAndSuffix()}ngAfterContentChecked(){this._assertFormFieldControl(),this._control!==this._previousControl&&(this._initializeControl(this._previousControl),this._control.ngControl&&this._control.ngControl.control&&(this._previousControlValidatorFn=this._control.ngControl.control.validator),this._previousControl=this._control,this._changeDetectorRef.markForCheck()),this._control.ngControl&&this._control.ngControl.control&&this._control.ngControl.control.validator!==this._previousControlValidatorFn&&this._changeDetectorRef.markForCheck()}ngOnDestroy(){this._outlineLabelOffsetResizeObserver?.disconnect(),this._stateChanges?.unsubscribe(),this._valueChanges?.unsubscribe(),this._describedByChanges?.unsubscribe(),this._destroyed.next(),this._destroyed.complete()}getLabelId=VC(()=>this._hasFloatingLabel()?this._labelId:null);getConnectedOverlayOrigin(){return this._textField||this._elementRef}_animateAndLockLabel(){this._hasFloatingLabel()&&(this.floatLabel=`always`)}_initializeControl(e){let t=this._control,i=`mat-mdc-form-field-type-`;e&&this._elementRef.nativeElement.classList.remove(i+e.controlType),t.controlType&&this._elementRef.nativeElement.classList.add(i+t.controlType),this._stateChanges?.unsubscribe(),this._stateChanges=t.stateChanges.subscribe(()=>{this._updateFocusState(),this._changeDetectorRef.markForCheck()}),this._describedByChanges?.unsubscribe(),this._describedByChanges=t.stateChanges.pipe(Bc([void 0,void 0]),K$2(()=>[t.errorState,t.userAriaDescribedBy]),kD(),at$3(([[r,o],[g,b]])=>r!==g||o!==b)).subscribe(()=>this._syncDescribedByIds()),this._valueChanges?.unsubscribe(),t.ngControl&&t.ngControl.valueChanges&&(this._valueChanges=t.ngControl.valueChanges.pipe(yo(this._destroyed)).subscribe(()=>this._changeDetectorRef.markForCheck()))}_checkPrefixAndSuffixTypes(){this._hasIconPrefix=!!this._prefixChildren.find(e=>!e._isText),this._hasTextPrefix=!!this._prefixChildren.find(e=>e._isText),this._hasIconSuffix=!!this._suffixChildren.find(e=>!e._isText),this._hasTextSuffix=!!this._suffixChildren.find(e=>e._isText)}_initializePrefixAndSuffix(){this._checkPrefixAndSuffixTypes(),TD(this._prefixChildren.changes,this._suffixChildren.changes).subscribe(()=>{this._checkPrefixAndSuffixTypes(),this._changeDetectorRef.markForCheck()})}_initializeSubscript(){this._hintChildren.changes.subscribe(()=>{this._processHints(),this._changeDetectorRef.markForCheck()}),this._errorChildren.changes.subscribe(()=>{this._syncDescribedByIds(),this._changeDetectorRef.markForCheck()}),this._validateHints(),this._syncDescribedByIds()}_assertFormFieldControl(){this._control}_updateFocusState(){let e=this._control.focused;e&&!this._isFocused?(this._isFocused=!0,this._lineRipple?.activate()):!e&&(this._isFocused||this._isFocused===null)&&(this._isFocused=!1,this._lineRipple?.deactivate()),this._elementRef.nativeElement.classList.toggle(`mat-focused`,e),this._textField?.nativeElement.classList.toggle(`mdc-text-field--focused`,e)}_syncOutlineLabelOffset(){HH({earlyRead:()=>{if(this._appearanceSignal()!==`outline`)return this._outlineLabelOffsetResizeObserver?.disconnect(),null;if(globalThis.ResizeObserver){this._outlineLabelOffsetResizeObserver||=new globalThis.ResizeObserver(()=>{this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset())});for(let e of this._prefixSuffixContainers())this._outlineLabelOffsetResizeObserver.observe(e,{box:`border-box`})}return this._getOutlinedLabelOffset()},write:e=>this._writeOutlinedLabelStyles(e())})}_shouldAlwaysFloat(){return this.floatLabel===`always`}_hasOutline(){return this.appearance===`outline`}_forceDisplayInfixLabel(){return!this._platform.isBrowser&&this._prefixChildren.length&&!this._shouldLabelFloat()}_hasFloatingLabel=VC(()=>!!this._labelChild());_shouldLabelFloat(){return this._hasFloatingLabel()?this._control.shouldLabelFloat||this._shouldAlwaysFloat():!1}_shouldForward(e){let t=this._control?this._control.ngControl:null;return t&&t[e]}_getSubscriptMessageType(){return this._errorChildren&&this._errorChildren.length>0&&this._control.errorState?`error`:`hint`}_handleLabelResized(){this._refreshOutlineNotchWidth()}_refreshOutlineNotchWidth(){!this._hasOutline()||!this._floatingLabel||!this._shouldLabelFloat()?this._notchedOutline?._setNotchWidth(0):this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth())}_processHints(){this._validateHints(),this._syncDescribedByIds()}_validateHints(){this._hintChildren}_syncDescribedByIds(){if(this._control){let e=[];if(this._control.userAriaDescribedBy&&typeof this._control.userAriaDescribedBy==`string`&&e.push(...this._control.userAriaDescribedBy.split(` `)),this._getSubscriptMessageType()===`hint`){let r=this._hintChildren?this._hintChildren.find(g=>g.align===`start`):null,o=this._hintChildren?this._hintChildren.find(g=>g.align===`end`):null;r?e.push(r.id):this._hintLabel&&e.push(this._hintLabelId),o&&e.push(o.id)}else this._errorChildren&&e.push(...this._errorChildren.map(r=>r.id));let t=this._control.describedByIds,i;if(t){let r=this._describedByIds||e;i=e.concat(t.filter(o=>o&&!r.includes(o)))}else i=e;this._control.setDescribedByIds(i),this._describedByIds=e}}_getOutlinedLabelOffset(){if(!this._hasOutline()||!this._floatingLabel)return null;if(!this._iconPrefixContainer&&!this._textPrefixContainer)return[``,null];if(!this._isAttachedToDom())return null;let e=this._iconPrefixContainer?.nativeElement,t=this._textPrefixContainer?.nativeElement,i=this._iconSuffixContainer?.nativeElement,r=this._textSuffixContainer?.nativeElement,o=e?.getBoundingClientRect().width??0,g=t?.getBoundingClientRect().width??0,b=i?.getBoundingClientRect().width??0,Y=r?.getBoundingClientRect().width??0;return[`var(--mat-mdc-form-field-label-transform, ${Ai} translateX(${`calc(${this._currentDirection===`rtl`?`-1`:`1`} * (${`${o+g}px`} + var(--mat-mdc-form-field-label-offset-x, 0px)))`}))`,o+g+b+Y]}_writeOutlinedLabelStyles(e){if(e!==null){let[t,i]=e;this._floatingLabel&&(this._floatingLabel.element.style.transform=t),i!==null&&this._notchedOutline?._setMaxWidth(i)}}_isAttachedToDom(){let e=this._elementRef.nativeElement;if(e.getRootNode){let t=e.getRootNode();return t&&t!==e}return document.documentElement.contains(e)}static ɵfac=function(t){return new(t||n)};static ɵcmp=Le$2({type:n,selectors:[[`mat-form-field`]],contentQueries:function(t,i,r){if(t&1&&(gv(r,i._labelChild,Ae$1,5),hv(r,ze,5)(r,Oi,5)(r,Di,5)(r,Ei,5)(r,Pe$1,5)),t&2){YS();let o;qS(o=ZS())&&(i._formFieldControl=o.first),qS(o=ZS())&&(i._prefixChildren=o),qS(o=ZS())&&(i._suffixChildren=o),qS(o=ZS())&&(i._errorChildren=o),qS(o=ZS())&&(i._hintChildren=o)}},viewQuery:function(t,i){if(t&1&&(vv(i._iconPrefixContainerSignal,At,5)(i._textPrefixContainerSignal,Pt,5)(i._iconSuffixContainerSignal,zt,5)(i._textSuffixContainerSignal,Lt$1,5),mv(di,5)(At,5)(Pt,5)(zt,5)(Lt$1,5)(Vt,5)(qt,5)(jt,5)),t&2){YS(4);let r;qS(r=ZS())&&(i._textField=r.first),qS(r=ZS())&&(i._iconPrefixContainer=r.first),qS(r=ZS())&&(i._textPrefixContainer=r.first),qS(r=ZS())&&(i._iconSuffixContainer=r.first),qS(r=ZS())&&(i._textSuffixContainer=r.first),qS(r=ZS())&&(i._floatingLabel=r.first),qS(r=ZS())&&(i._notchedOutline=r.first),qS(r=ZS())&&(i._lineRipple=r.first)}},hostAttrs:[1,`mat-mdc-form-field`],hostVars:38,hostBindings:function(t,i){t&2&&bt$1(`mat-mdc-form-field-label-always-float`,i._shouldAlwaysFloat())(`mat-mdc-form-field-has-icon-prefix`,i._hasIconPrefix)(`mat-mdc-form-field-has-icon-suffix`,i._hasIconSuffix)(`mat-form-field-invalid`,i._control.errorState)(`mat-form-field-disabled`,i._control.disabled)(`mat-form-field-autofilled`,i._control.autofilled)(`mat-form-field-appearance-fill`,i.appearance==`fill`)(`mat-form-field-appearance-outline`,i.appearance==`outline`)(`mat-form-field-hide-placeholder`,i._hasFloatingLabel()&&!i._shouldLabelFloat())(`mat-primary`,i.color!==`accent`&&i.color!==`warn`)(`mat-accent`,i.color===`accent`)(`mat-warn`,i.color===`warn`)(`ng-untouched`,i._shouldForward(`untouched`))(`ng-touched`,i._shouldForward(`touched`))(`ng-pristine`,i._shouldForward(`pristine`))(`ng-dirty`,i._shouldForward(`dirty`))(`ng-valid`,i._shouldForward(`valid`))(`ng-invalid`,i._shouldForward(`invalid`))(`ng-pending`,i._shouldForward(`pending`))},inputs:{hideRequiredMarker:`hideRequiredMarker`,color:`color`,floatLabel:`floatLabel`,appearance:`appearance`,subscriptSizing:`subscriptSizing`,hintLabel:`hintLabel`},exportAs:[`matFormField`],features:[Fv([{provide:Le,useExisting:n},{provide:Gt,useExisting:n}])],ngContentSelectors:mi,decls:18,vars:21,consts:[[`labelTemplate`,``],[`textField`,``],[`iconPrefixContainer`,``],[`textPrefixContainer`,``],[`textSuffixContainer`,``],[`iconSuffixContainer`,``],[1,`mat-mdc-text-field-wrapper`,`mdc-text-field`,3,`click`],[1,`mat-mdc-form-field-focus-overlay`],[1,`mat-mdc-form-field-flex`],[`matFormFieldNotchedOutline`,``,3,`matFormFieldNotchedOutlineOpen`],[1,`mat-mdc-form-field-icon-prefix`],[1,`mat-mdc-form-field-text-prefix`],[1,`mat-mdc-form-field-infix`],[3,`ngTemplateOutlet`],[1,`mat-mdc-form-field-text-suffix`],[1,`mat-mdc-form-field-icon-suffix`],[`matFormFieldLineRipple`,``],[`aria-atomic`,`true`,`aria-live`,`polite`,1,`mat-mdc-form-field-subscript-wrapper`,`mat-mdc-form-field-bottom-align`],[1,`mat-mdc-form-field-error-wrapper`],[1,`mat-mdc-form-field-hint-wrapper`],[`matFormFieldFloatingLabel`,``,3,`floating`,`monitorResize`,`id`],[`aria-hidden`,`true`,1,`mat-mdc-form-field-required-marker`,`mdc-floating-label--required`],[3,`id`],[1,`mat-mdc-form-field-hint-spacer`]],template:function(t,i){if(t&1&&(or(ci),ev(0,pi,1,1,`ng-template`,null,0,LC),va(2,`div`,6,1),dv(`click`,function(o){return i._control.onContainerClick(o)}),ui$1(4,hi,1,0,`div`,7),va(5,`div`,8),ui$1(6,bi,2,2,`div`,9),ui$1(7,vi,3,0,`div`,10),ui$1(8,xi,3,0,`div`,11),va(9,`div`,12),ui$1(10,Si,1,1,null,13),tt$2(11),Cd(),ui$1(12,Ni,3,0,`div`,14),ui$1(13,Ci,3,0,`div`,15),Cd(),ui$1(14,wi,1,0,`div`,16),Cd(),va(15,`div`,17),ui$1(16,Mi,2,0,`div`,18)(17,Fi,5,1,`div`,19),Cd()),t&2){let r;oi(2),bt$1(`mdc-text-field--filled`,!i._hasOutline())(`mdc-text-field--outlined`,i._hasOutline())(`mdc-text-field--no-label`,!i._hasFloatingLabel())(`mdc-text-field--disabled`,i._control.disabled)(`mdc-text-field--invalid`,i._control.errorState),oi(2),li$1(!i._hasOutline()&&!i._control.disabled?4:-1),oi(2),li$1(i._hasOutline()?6:-1),oi(),li$1(i._hasIconPrefix?7:-1),oi(),li$1(i._hasTextPrefix?8:-1),oi(2),li$1(!i._hasOutline()||i._forceDisplayInfixLabel()?10:-1),oi(2),li$1(i._hasTextSuffix?12:-1),oi(),li$1(i._hasIconSuffix?13:-1),oi(),li$1(i._hasOutline()?-1:14),oi(),bt$1(`mat-mdc-form-field-subscript-dynamic-size`,i.subscriptSizing===`dynamic`);let o=i._getSubscriptMessageType();oi(),li$1((r=o)===`error`?16:r===`hint`?17:-1)}},dependencies:[Vt,qt,$T,jt,Pe$1],styles:[`.mdc-text-field {
  display: inline-flex;
  align-items: baseline;
  padding: 0 16px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  will-change: opacity, transform, color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.mdc-text-field__input {
  width: 100%;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: none;
  padding: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  height: 28px;
}
.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {
  display: none;
}
.mdc-text-field__input::-ms-clear {
  display: none;
}
.mdc-text-field__input:focus {
  outline: none;
}
.mdc-text-field__input:invalid {
  box-shadow: none;
}
.mdc-text-field__input::placeholder {
  opacity: 0;
}
.mdc-text-field__input::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field__input::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field__input:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  opacity: 1;
}
.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  opacity: 1;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {
  opacity: 0;
}
.mdc-text-field--%NS%disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {
  opacity: 0;
}
.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {
  height: 100%;
}
.mdc-text-field--outlined .mdc-text-field__input {
  display: flex;
  border: none !important;
  background-color: transparent;
}
.mdc-text-field--disabled .mdc-text-field__input {
  pointer-events: auto;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-filled-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-filled-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-input-text-color, var(--%NS%mat-sys-on-surface));
  caret-color: var(--%NS%mat-form-field-outlined-caret-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-outlined-input-text-placeholder-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-filled-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--outlined.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {
  caret-color: var(--%NS%mat-form-field-outlined-error-caret-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {
  color: var(--%NS%mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-text-field__input {
    background-color: Window;
  }
}

.mdc-text-field--filled {
  height: 56px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-top-right-radius: var(--%NS%mat-form-field-filled-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) {
  background-color: var(--%NS%mat-form-field-filled-container-color, var(--%NS%mat-sys-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled {
  background-color: var(--%NS%mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 4%, transparent));
}

.mdc-text-field--outlined {
  height: 56px;
  overflow: visible;
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
}
[dir=rtl] .mdc-text-field--outlined {
  padding-right: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)) + 4px);
  padding-left: max(16px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}

.mdc-floating-label {
  position: absolute;
  left: 0;
  transform-origin: left top;
  line-height: 1.15rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: text;
  overflow: hidden;
  will-change: transform;
}
[dir=rtl] .mdc-floating-label {
  right: 0;
  left: auto;
  transform-origin: right top;
  text-align: right;
}
.mdc-text-field .mdc-floating-label {
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.mdc-notched-outline .mdc-floating-label {
  display: inline-block;
  position: relative;
  max-width: 100%;
}
.mdc-text-field--outlined .mdc-floating-label {
  left: 4px;
  right: auto;
}
[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {
  left: auto;
  right: 4px;
}
.mdc-text-field--filled .mdc-floating-label {
  left: 16px;
  right: auto;
}
[dir=rtl] .mdc-text-field--filled .mdc-floating-label {
  left: auto;
  right: 16px;
}
.mdc-text-field--disabled .mdc-floating-label {
  cursor: default;
}
@media (forced-colors: active) {
  .mdc-text-field--disabled .mdc-floating-label {
    z-index: 1;
  }
}
.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {
  display: none;
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-hover-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-filled-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--filled .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-filled-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-filled-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-filled-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-filled-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-label-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-focus-label-text-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-focus-label-text-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {
  color: var(--%NS%mat-form-field-outlined-error-hover-label-text-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--outlined .mdc-floating-label {
  font-family: var(--%NS%mat-form-field-outlined-label-text-font, var(--%NS%mat-sys-body-large-font));
  font-size: var(--%NS%mat-form-field-outlined-label-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-form-field-outlined-label-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-form-field-outlined-label-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

.mdc-floating-label--float-above {
  cursor: auto;
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--filled .mdc-floating-label--float-above {
  transform: translateY(-106%) scale(0.75);
}
.mdc-text-field--outlined .mdc-floating-label--float-above {
  transform: translateY(-37.25px) scale(1);
  font-size: 0.75rem;
}
.mdc-notched-outline .mdc-floating-label--float-above {
  text-overflow: clip;
}
.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: 133.3333333333%;
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  transform: translateY(-34.75px) scale(0.75);
}
.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: 1rem;
}

.mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 1px;
  margin-right: 0;
  content: "*";
}
[dir=rtl] .mdc-floating-label--%NS%required:not(.mdc-floating-label--hide-required-marker)::after {
  margin-left: 0;
  margin-right: 1px;
}

.mdc-notched-outline {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  text-align: left;
  pointer-events: none;
}
[dir=rtl] .mdc-notched-outline {
  text-align: right;
}
.mdc-text-field--outlined .mdc-notched-outline {
  z-index: 1;
}

.mat-mdc-notch-piece {
  box-sizing: border-box;
  height: 100%;
  pointer-events: none;
  border: none;
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.mdc-text-field--focused .mat-mdc-notch-piece {
  border-width: 2px;
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-outline-color, var(--%NS%mat-sys-outline));
  border-width: var(--%NS%mat-form-field-outlined-outline-width, 1px);
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-hover-outline-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-focus-outline-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 12%, transparent));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-hover-outline-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {
  border-color: var(--%NS%mat-form-field-outlined-error-focus-outline-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {
  border-width: var(--%NS%mat-form-field-outlined-focus-outline-width, 2px);
}

.mdc-notched-outline__leading {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {
  width: max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small)));
}
[dir=rtl] .mdc-notched-outline__leading {
  border-left: none;
  border-right: 1px solid;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__trailing {
  flex-grow: 1;
  border-left: none;
  border-right: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-right-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}
[dir=rtl] .mdc-notched-outline__trailing {
  border-left: 1px solid;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
  border-bottom-left-radius: var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small));
}

.mdc-notched-outline__notch {
  flex: 0 0 auto;
  width: auto;
}
.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {
  max-width: min(var(--%NS%mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  max-width: min(100%, calc(100% - max(12px, var(--%NS%mat-form-field-outlined-container-shape, var(--%NS%mat-sys-corner-extra-small))) * 2));
}
.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 1px;
}
.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-top: 2px;
}
.mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 0;
  padding-right: 8px;
  border-top: none;
}
[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {
  padding-left: 8px;
  padding-right: 0;
}
.mdc-notched-outline--no-label .mdc-notched-outline__notch {
  display: none;
}

.mdc-line-ripple::before, .mdc-line-ripple::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom-style: solid;
  content: "";
}
.mdc-line-ripple::before {
  z-index: 1;
  border-bottom-width: var(--%NS%mat-form-field-filled-active-indicator-height, 1px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-active-indicator-color, var(--%NS%mat-sys-on-surface-variant));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-hover-active-indicator-color, var(--%NS%mat-sys-on-surface));
}
.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-active-indicator-color, var(--%NS%mat-sys-error));
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled).mdc-text-field--%NS%invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-hover-active-indicator-color, var(--%NS%mat-sys-on-error-container));
}
.mdc-line-ripple::after {
  transform: scaleX(0);
  opacity: 0;
  z-index: 2;
}
.mdc-text-field--filled .mdc-line-ripple::after {
  border-bottom-width: var(--%NS%mat-form-field-filled-focus-active-indicator-height, 2px);
}
.mdc-text-field--%NS%filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-focus-active-indicator-color, var(--%NS%mat-sys-primary));
}
.mdc-text-field--filled.mdc-text-field--%NS%invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
  border-bottom-color: var(--%NS%mat-form-field-filled-error-focus-active-indicator-color, var(--%NS%mat-sys-error));
}

.mdc-line-ripple--%NS%active::after {
  transform: scaleX(1);
  opacity: 1;
}

.mdc-line-ripple--%NS%deactivating::after {
  opacity: 0;
}

.mdc-text-field--disabled {
  pointer-events: none;
}

.mat-mdc-form-field-textarea-control {
  vertical-align: middle;
  resize: vertical;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  overflow: auto;
}

.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font: inherit;
  letter-spacing: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  border: none;
}

.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  line-height: normal;
  pointer-events: all;
  will-change: auto;
}

.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {
  cursor: inherit;
}

.mdc-text-field--%NS%no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,
.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {
  height: auto;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {
  height: 23px;
}

.mat-mdc-text-field-wrapper {
  height: auto;
  flex: auto;
  will-change: auto;
}

.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-left: 0;
  --%NS%mat-mdc-form-field-label-offset-x: -16px;
}

.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

[dir=rtl] .mat-mdc-text-field-wrapper {
  padding-left: 16px;
  padding-right: 16px;
}
[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {
  padding-left: 0;
}
[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {
  padding-right: 0;
}

.mat-form-field-disabled .mdc-text-field__input::placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {
  color: var(--%NS%mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
  opacity: 1;
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {
  left: auto;
  right: auto;
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {
  display: inline-block;
}

.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {
  padding-top: 0;
}

.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: 1px solid transparent;
}

[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {
  border-left: none;
  border-right: 1px solid transparent;
}

.mat-mdc-form-field-infix {
  min-height: var(--%NS%mat-form-field-container-height, 56px);
  padding-top: var(--%NS%mat-form-field-filled-with-label-container-padding-top, 24px);
  padding-bottom: var(--%NS%mat-form-field-filled-with-label-container-padding-bottom, 8px);
}
.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {
  padding-top: var(--%NS%mat-form-field-container-vertical-padding, 16px);
  padding-bottom: var(--%NS%mat-form-field-container-vertical-padding, 16px);
}

.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {
  top: calc(var(--%NS%mat-form-field-container-height, 56px) / 2);
}

.mdc-text-field--filled .mat-mdc-floating-label {
  display: var(--%NS%mat-form-field-filled-label-display, block);
}

.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  --%NS%mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--%NS%mat-form-field-container-height, 56px) / 2) * -1))
    scale(var(--%NS%mat-mdc-form-field-floating-label-scale, 0.75));
  transform: var(--%NS%mat-mdc-form-field-label-transform);
}

@keyframes _mat-form-field-subscript-animation {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mat-mdc-form-field-subscript-wrapper {
  box-sizing: border-box;
  width: 100%;
  position: relative;
}

.mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-error-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 16px;
  opacity: 1;
  transform: translateY(0);
  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {
  position: static;
}

.mat-mdc-form-field-bottom-align::before {
  content: "";
  display: inline-block;
  height: 16px;
}

.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {
  content: unset;
}

.mat-mdc-form-field-hint-end {
  order: 1;
}

.mat-mdc-form-field-hint-wrapper {
  display: flex;
}

.mat-mdc-form-field-hint-spacer {
  flex: 1 0 1em;
}

.mat-mdc-form-field-error {
  display: block;
  color: var(--%NS%mat-form-field-error-text-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-subscript-wrapper,
.mat-mdc-form-field-bottom-align::before {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-subscript-text-font, var(--%NS%mat-sys-body-small-font));
  line-height: var(--%NS%mat-form-field-subscript-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  font-size: var(--%NS%mat-form-field-subscript-text-size, var(--%NS%mat-sys-body-small-size));
  letter-spacing: var(--%NS%mat-form-field-subscript-text-tracking, var(--%NS%mat-sys-body-small-tracking));
  font-weight: var(--%NS%mat-form-field-subscript-text-weight, var(--%NS%mat-sys-body-small-weight));
}

.mat-mdc-form-field-focus-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-form-field-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
}
.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {
  opacity: var(--%NS%mat-form-field-focus-state-layer-opacity, 0);
}

select.mat-mdc-form-field-input-control {
  -moz-appearance: none;
  -webkit-appearance: none;
  background-color: transparent;
  display: inline-flex;
  box-sizing: border-box;
}
select.mat-mdc-form-field-input-control:not(:disabled) {
  cursor: pointer;
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {
  color: var(--%NS%mat-form-field-select-option-text-color, var(--%NS%mat-sys-neutral10));
}
select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {
  color: var(--%NS%mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--%NS%mat-sys-neutral10) 38%, transparent));
}

.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  content: "";
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid;
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -2.5px;
  pointer-events: none;
  color: var(--%NS%mat-form-field-enabled-select-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {
  right: auto;
  left: 0;
}
.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-focus-select-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 15px;
}
[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {
  padding-right: 0;
  padding-left: 15px;
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {
    outline: solid 1px;
  }
}
@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {
    outline-color: GrayText;
  }
}

@media (forced-colors: active) {
  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {
    outline: dashed 3px;
  }
}

@media (forced-colors: active) {
  .mat-mdc-form-field.mat-focused .mdc-notched-outline {
    border: dashed 3px;
  }
}

.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {
  line-height: 1;
}
.mat-mdc-form-field-input-control::-webkit-datetime-edit {
  line-height: 1;
  padding: 0;
  margin-bottom: -2px;
}

.mat-mdc-form-field {
  --%NS%mat-mdc-form-field-floating-label-scale: 0.75;
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: var(--%NS%mat-form-field-container-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-form-field-container-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-form-field-container-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-form-field-container-text-tracking, var(--%NS%mat-sys-body-large-tracking));
  font-weight: var(--%NS%mat-form-field-container-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {
  font-size: calc(var(--%NS%mat-form-field-outlined-label-text-populated-size) * var(--%NS%mat-mdc-form-field-floating-label-scale));
}
.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  font-size: var(--%NS%mat-form-field-outlined-label-text-populated-size);
}
[dir=rtl] .mat-mdc-form-field {
  text-align: right;
}

.mat-mdc-form-field-flex {
  display: inline-flex;
  align-items: baseline;
  box-sizing: border-box;
  width: 100%;
}

.mat-mdc-text-field-wrapper {
  width: 100%;
  z-index: 0;
}

.mat-mdc-form-field-icon-prefix,
.mat-mdc-form-field-icon-suffix {
  align-self: center;
  line-height: 0;
  pointer-events: auto;
  position: relative;
  z-index: 1;
}
.mat-mdc-form-field-icon-prefix > .mat-icon,
.mat-mdc-form-field-icon-suffix > .mat-icon {
  padding: 0 12px;
  box-sizing: content-box;
}

.mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-leading-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {
  color: var(--%NS%mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-trailing-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-trailing-icon-color, var(--%NS%mat-sys-error));
}
.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-hover-trailing-icon-color, var(--%NS%mat-sys-on-error-container));
}
.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {
  color: var(--%NS%mat-form-field-error-focus-trailing-icon-color, var(--%NS%mat-sys-error));
}

.mat-mdc-form-field-icon-prefix,
[dir=rtl] .mat-mdc-form-field-icon-suffix {
  padding: 0 4px 0 0;
}

.mat-mdc-form-field-icon-suffix,
[dir=rtl] .mat-mdc-form-field-icon-prefix {
  padding: 0 0 0 4px;
}

.mat-mdc-form-field-subscript-wrapper .mat-icon,
.mat-mdc-form-field label .mat-icon {
  width: 1em;
  height: 1em;
  font-size: inherit;
}

.mat-mdc-form-field-infix {
  flex: auto;
  min-width: 0;
  width: 180px;
  position: relative;
  box-sizing: border-box;
}
.mat-mdc-form-field-infix:has(textarea[cols]) {
  width: auto;
}

.mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: -1px;
  -webkit-clip-path: inset(-9em -999em -9em 1px);
  clip-path: inset(-9em -999em -9em 1px);
}
[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {
  margin-left: 0;
  margin-right: -1px;
  -webkit-clip-path: inset(-9em 1px -9em -999em);
  clip-path: inset(-9em 1px -9em -999em);
}

.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {
  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {
  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {
  transition-delay: 40ms;
  transition-duration: 110ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--%NS%filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {
  transition-duration: 75ms;
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
}
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,
.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {
  animation-duration: 300ms;
}

.mdc-notched-outline .mdc-floating-label {
  max-width: calc(100% + 1px);
}

.mdc-notched-outline--upgraded .mdc-floating-label--float-above {
  max-width: calc(133.3333333333% + 1px);
}
`],encapsulation:2})}return n})();var ue$1=class{_multiple;_emitChanges;compareWith;_selection=new Set;_deselectedToEmit=[];_selectedToEmit=[];_selected=null;get selected(){return this._selected||(this._selected=Array.from(this._selection.values())),this._selected}changed=new U$2;bulk={select:a=>this._select(a),deselect:a=>this._deselect(a),setSelection:a=>this._setSelection(a)};constructor(a=!1,e,t=!0,i){this._multiple=a,this._emitChanges=t,this.compareWith=i,e&&e.length&&(a?e.forEach(r=>this._markSelected(r)):this._markSelected(e[0]),this._selectedToEmit.length=0)}select(...a){return this._select(a)}deselect(...a){return this._deselect(a)}setSelection(...a){return this._setSelection(a)}toggle(a){return this.isSelected(a)?this.deselect(a):this.select(a)}clear(a=!0){this._unmarkAll();let e=this._hasQueuedChanges();return a&&this._emitChangeEvent(),e}isSelected(a){return this._selection.has(this._getConcreteValue(a))}isEmpty(){return this._selection.size===0}hasValue(){return!this.isEmpty()}sort(a){this._multiple&&this.selected&&this._selected.sort(a)}isMultipleSelection(){return this._multiple}_select(a){this._verifyValueAssignment(a),a.forEach(t=>this._markSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_deselect(a){this._verifyValueAssignment(a),a.forEach(t=>this._unmarkSelected(t));let e=this._hasQueuedChanges();return this._emitChangeEvent(),e}_setSelection(a){this._verifyValueAssignment(a);let e=this.selected,t=new Set(a.map(r=>this._getConcreteValue(r)));a.forEach(r=>this._markSelected(r)),e.filter(r=>!t.has(this._getConcreteValue(r,t))).forEach(r=>this._unmarkSelected(r));let i=this._hasQueuedChanges();return this._emitChangeEvent(),i}_emitChangeEvent(){this._selected=null,(this._selectedToEmit.length||this._deselectedToEmit.length)&&(this.changed.next({source:this,added:this._selectedToEmit,removed:this._deselectedToEmit}),this._deselectedToEmit=[],this._selectedToEmit=[])}_markSelected(a){a=this._getConcreteValue(a),this.isSelected(a)||(this._multiple||this._unmarkAll(),this.isSelected(a)||this._selection.add(a),this._emitChanges&&this._selectedToEmit.push(a))}_unmarkSelected(a){a=this._getConcreteValue(a),this.isSelected(a)&&(this._selection.delete(a),this._emitChanges&&this._deselectedToEmit.push(a))}_unmarkAll(){this.isEmpty()||this._selection.forEach(a=>this._unmarkSelected(a))}_verifyValueAssignment(a){a.length>1&&this._multiple}_hasQueuedChanges(){return!!(this._deselectedToEmit.length||this._selectedToEmit.length)}_getConcreteValue(a,e){if(this.compareWith){e=e??this._selection;for(let t of e)if(this.compareWith(a,t))return t;return a}else return a}};var Ut=class{applyChanges(a,e,t,i,r){a.forEachOperation((o,g,b)=>{let Y,X;if(o.previousIndex==null){let oe=t(o,g,b);Y=e.createEmbeddedView(oe.templateRef,oe.context,oe.index),X=I$2.INSERTED}else b==null?(e.remove(g),X=I$2.REMOVED):(Y=e.get(g),e.move(Y,b),X=I$2.MOVED);r&&r({context:Y?.context,operation:X,record:o})})}detach(){}};var Qt=new v$1(``);var Kt=(()=>{class n{_animationsDisabled=no();state=`unchecked`;disabled=!1;appearance=`full`;static ɵfac=function(t){return new(t||n)};static ɵcmp=Le$2({type:n,selectors:[[`mat-pseudo-checkbox`]],hostAttrs:[1,`mat-pseudo-checkbox`],hostVars:12,hostBindings:function(t,i){t&2&&bt$1(`mat-pseudo-checkbox-indeterminate`,i.state===`indeterminate`)(`mat-pseudo-checkbox-checked`,i.state===`checked`)(`mat-pseudo-checkbox-disabled`,i.disabled)(`mat-pseudo-checkbox-minimal`,i.appearance===`minimal`)(`mat-pseudo-checkbox-full`,i.appearance===`full`)(`_mat-animation-noopable`,i._animationsDisabled)},inputs:{state:`state`,disabled:`disabled`,appearance:`appearance`},decls:0,vars:0,template:function(t,i){},styles:[`.mat-pseudo-checkbox {
  border-radius: 2px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  position: relative;
  flex-shrink: 0;
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 0.1), background-color 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox::after {
  position: absolute;
  opacity: 0;
  content: "";
  border-bottom: 2px solid currentColor;
  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 0.1);
}
.mat-pseudo-checkbox._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-pseudo-checkbox._mat-animation-noopable::after {
  transition: none;
}

.mat-pseudo-checkbox-disabled {
  cursor: default;
}

.mat-pseudo-checkbox-indeterminate::after {
  left: 1px;
  opacity: 1;
  border-radius: 2px;
}

.mat-pseudo-checkbox-checked::after {
  left: 1px;
  border-left: 2px solid currentColor;
  transform: rotate(-45deg);
  opacity: 1;
  box-sizing: content-box;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color, var(--%NS%mat-sys-primary));
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-minimal-disabled-selected-checkmark-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-pseudo-checkbox-full {
  border-color: var(--%NS%mat-pseudo-checkbox-full-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  border-width: 2px;
  border-style: solid;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-disabled {
  border-color: var(--%NS%mat-pseudo-checkbox-full-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate {
  background-color: var(--%NS%mat-pseudo-checkbox-full-selected-icon-color, var(--%NS%mat-sys-primary));
  border-color: transparent;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  color: var(--%NS%mat-pseudo-checkbox-full-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled {
  background-color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked.mat-pseudo-checkbox-disabled::after, .mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate.mat-pseudo-checkbox-disabled::after {
  color: var(--%NS%mat-pseudo-checkbox-full-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}

.mat-pseudo-checkbox {
  width: 18px;
  height: 18px;
}

.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-checked::after {
  width: 14px;
  height: 6px;
  transform-origin: center;
  top: -4.2426406871px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-minimal.mat-pseudo-checkbox-indeterminate::after {
  top: 8px;
  width: 16px;
}

.mat-pseudo-checkbox-full.mat-pseudo-checkbox-checked::after {
  width: 10px;
  height: 4px;
  transform-origin: center;
  top: -2.8284271247px;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.mat-pseudo-checkbox-full.mat-pseudo-checkbox-indeterminate::after {
  top: 6px;
  width: 12px;
}
`],encapsulation:2})}return n})();var Pi=[`text`];var zi=[[[`mat-icon`]],`*`];var Li=[`mat-icon`,`*`];function Vi(n,a){if(n&1&&sv(0,`mat-pseudo-checkbox`,1),n&2){let e=zS();iv(`disabled`,e.disabled)(`state`,e.selected?`checked`:`unchecked`)}}function Bi(n,a){if(n&1&&sv(0,`mat-pseudo-checkbox`,3),n&2)iv(`disabled`,zS().disabled)}function ji(n,a){if(n&1&&(va(0,`span`,4),vC(1),Cd()),n&2){let e=zS();oi(),xd(`(`,e.group.label,`)`)}}var Be=new v$1(`MAT_OPTION_PARENT_COMPONENT`);var je=new v$1(`MatOptgroup`);var Ve=class{source;isUserInput;constructor(a,e=!1){this.source=a,this.isUserInput=e}};var re$1=(()=>{class n{_element=h(de$1);_changeDetectorRef=h(ny);_parent=h(Be,{optional:!0});group=h(je,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue=``;get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=h(_f).getId(`mat-option-`);get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=Ot$1(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new Pe$2;_text;_stateChanges=new U$2;constructor(){let e=h($t$2);e.load(Lb),e.load(lc),this._signalDisableRipple=!!this._parent&&un$2(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||``).trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let i=this._getHostElement();typeof i.focus==`function`&&i.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!wb(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?`-1`:`0`}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new Ve(this,e))}static ɵfac=function(t){return new(t||n)};static ɵcmp=Le$2({type:n,selectors:[[`mat-option`]],viewQuery:function(t,i){if(t&1&&mv(Pi,7),t&2){let r;qS(r=ZS())&&(i._text=r.first)}},hostAttrs:[`role`,`option`,1,`mat-mdc-option`,`mdc-list-item`],hostVars:11,hostBindings:function(t,i){t&1&&dv(`click`,function(){return i._selectViaInteraction()})(`keydown`,function(o){return i._handleKeydown(o)}),t&2&&(uv(`id`,i.id),rr(`aria-selected`,i.selected)(`aria-disabled`,i.disabled.toString()),bt$1(`mdc-list-item--selected`,i.selected)(`mat-mdc-option-multiple`,i.multiple)(`mat-mdc-option-active`,i.active)(`mdc-list-item--disabled`,i.disabled))},inputs:{value:`value`,id:`id`,disabled:[2,`disabled`,`disabled`,Dt$1]},outputs:{onSelectionChange:`onSelectionChange`},exportAs:[`matOption`],ngContentSelectors:Li,decls:8,vars:5,consts:[[`text`,``],[`aria-hidden`,`true`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`,`state`],[1,`mdc-list-item__primary-text`],[`state`,`checked`,`aria-hidden`,`true`,`appearance`,`minimal`,1,`mat-mdc-option-pseudo-checkbox`,3,`disabled`],[1,`cdk-visually-hidden`],[`aria-hidden`,`true`,`mat-ripple`,``,1,`mat-mdc-option-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`]],template:function(t,i){t&1&&(or(zi),ui$1(0,Vi,1,2,`mat-pseudo-checkbox`,1),tt$2(1),va(2,`span`,2,0),tt$2(4,1),Cd(),ui$1(5,Bi,1,1,`mat-pseudo-checkbox`,3),ui$1(6,ji,2,1,`span`,4),sv(7,`div`,5)),t&2&&(li$1(i.multiple?0:-1),oi(5),li$1(!i.multiple&&i.selected&&!i.hideSingleSelectionIndicator?5:-1),oi(),li$1(i.group&&i.group._inert?6:-1),oi(),iv(`matRippleTrigger`,i._getHostElement())(`matRippleDisabled`,i.disabled||i.disableRipple))},dependencies:[Kt,tG],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--%NS%mat-option-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-option-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-option-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-option-label-text-size, var(--%NS%mat-sys-body-large-size));
  letter-spacing: var(--%NS%mat-option-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-option-label-text-weight, var(--%NS%mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--%NS%mat-option-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--%NS%mat-option-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--%NS%mat-option-selected-state-layer-color, var(--%NS%mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--%NS%selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --%NS%mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--%NS%mat-option-selected-state-label-text-color, var(--%NS%mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--%NS%selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --%NS%mat-list-list-item-selected-container-color: var(--%NS%mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})}return n})();function $t(n,a,e){if(e.length){let t=a.toArray(),i=e.toArray(),r=0;for(let o=0;o<n+1;o++)t[o].group&&t[o].group===i[r]&&r++;return r}return 0}function Yt(n,a,e,t){return n<e?n:n+a>e+t?Math.max(0,n-t+a):e}var Xt=(()=>{class n{isErrorState(e,t){return!!(e&&e.invalid&&(e.touched||t&&t.submitted))}isSignalErrorState(e){if(!e)return!1;let t=e().invalid(),i=e().touched();return t&&i}static ɵfac=function(t){return new(t||n)};static ɵprov=k({token:n,factory:n.ɵfac})}return n})();var Ne$1=class{_defaultMatcher;_parentFormGroup;_parentForm;_stateChanges;errorState=!1;matcher;ngControl;formField;constructor(a,e,t,i,r){this._defaultMatcher=a,this._parentFormGroup=t,this._parentForm=i,this._stateChanges=r,e?un$2(e.field)&&!e.updateValueAndValidity?(this.formField=e,this.ngControl=null):(this.formField=null,this.ngControl=e):this.ngControl=this.formField=null}updateErrorState(){let a=this.errorState,e=this._getCurrentErrorState(this.matcher||this._defaultMatcher);e!==a&&(this.errorState=e,this._stateChanges.next())}_getCurrentErrorState(a){if(this.formField&&a?.isSignalErrorState)return a.isSignalErrorState(this.formField.field())??!1;let e=this._parentFormGroup||this._parentForm,t=this.ngControl?this.ngControl.control:null;return a?.isErrorState(t,e)??!1}};var Zt=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[gb,xe$1,ro]})}return n})();var Jt=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[ro]})}return n})();var qe=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[Bb,Jt,re$1,ro]})}return n})();var Ui=[`trigger`];var Qi=[`panel`];var Ki=[[[`mat-select-trigger`]],`*`];var $i=[`mat-select-trigger`,`*`];function Yi(n,a){if(n&1&&(va(0,`span`,4),vC(1),Cd()),n&2){let e=zS();oi(),Tv(e.placeholder)}}function Xi(n,a){n&1&&tt$2(0)}function Zi(n,a){if(n&1&&(va(0,`span`,11),vC(1),Cd()),n&2){let e=zS(2);oi(),Tv(e.triggerValue)}}function Ji(n,a){if(n&1&&(va(0,`span`,5),ui$1(1,Xi,1,0)(2,Zi,2,1,`span`,11),Cd()),n&2){let e=zS();oi(),li$1(e.customTrigger?1:2)}}function en(n,a){if(n&1){let e=jS();va(0,`div`,12,1),dv(`keydown`,function(i){Jp(e);return eh(zS()._handleKeydown(i))}),tt$2(2,1),Cd()}if(n&2){let e=zS();fi$1(e.panelClass),bt$1(`mat-select-panel-animations-enabled`,!e._animationsDisabled)(`mat-primary`,e._parentFormField?.color===`primary`)(`mat-accent`,e._parentFormField?.color===`accent`)(`mat-warn`,e._parentFormField?.color===`warn`)(`mat-undefined`,!e._parentFormField?.color),rr(`id`,e.id+`-panel`)(`aria-multiselectable`,e.multiple)(`aria-label`,e.ariaLabel||null)(`aria-labelledby`,e._getPanelAriaLabelledby())}}var tn=new v$1(`mat-select-scroll-strategy`,{providedIn:`root`,factory:()=>{let n=h(X$1);return()=>Ot$2(n)}});var nn=new v$1(`MAT_SELECT_CONFIG`);var an=new v$1(`MatSelectTrigger`);var He=class{source;value;constructor(a,e){this.source=a,this.value=e}};var ii=(()=>{class n{_viewportRuler=h(T$2);_changeDetectorRef=h(ny);_elementRef=h(de$1);_dir=h(SM,{optional:!0});_idGenerator=h(_f);_renderer=h(Xn);_parentFormField=h(Le,{optional:!0});ngControl=h(V,{self:!0,optional:!0});_liveAnnouncer=h(sM);_defaultOptions=h(nn,{optional:!0});_animationsDisabled=no();_popoverLocation;_initialized=new U$2;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:`start`,originY:`bottom`,overlayX:`start`,overlayY:`top`},{originX:`end`,originY:`bottom`,overlayX:`end`,overlayY:`top`},{originX:`start`,originY:`top`,overlayX:`start`,overlayY:`bottom`,panelClass:`mat-mdc-select-panel-above`},{originX:`end`,originY:`top`,overlayX:`end`,overlayY:`bottom`,panelClass:`mat-mdc-select-panel-above`}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let i=this.panel.nativeElement,r=$t(e,this.options,this.optionGroups),o=t._getHostElement();e===0&&r===1?i.scrollTop=0:i.scrollTop=Yt(o.offsetTop,o.offsetHeight,i.scrollTop,i.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new He(this,e)}_scrollStrategyFactory=h(tn);_panelOpen=!1;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId(`mat-select-`);_triggerAriaLabelledBy=null;_previousControl;_destroy=new U$2;_errorStateTracker;stateChanges=new U$2;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId(`mat-select-value-`);_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||``;get focused(){return this._focused||this._panelOpen}_focused=!1;controlType=`mat-select`;trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=Ot$1(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(pe$1.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel=``;ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<`u`?this._defaultOptions.panelWidth:`auto`;canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=CD(()=>{let e=this.options;return e?e.changes.pipe(Bc(e),Mc(()=>TD(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe(Mc(()=>this.optionSelectionChanges))});openedChange=new Pe$2;_openedStream=this.openedChange.pipe(at$3(e=>e),K$2(()=>{}));_closedStream=this.openedChange.pipe(at$3(e=>!e),K$2(()=>{}));selectionChange=new Pe$2;valueChange=new Pe$2;constructor(){let e=h(Xt),t=h(Kt$1,{optional:!0}),i=h(tn$1,{optional:!0}),r=h(new La(`tabindex`),{optional:!0}),o=h(Pt$2,{optional:!0}),g=h(Qt,{optional:!0,self:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new Ne$1(e,g||this.ngControl,i,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=r==null?0:parseInt(r)||0,this._popoverLocation=o?.usePopover===!1?null:`inline`,this.id=this.id}ngOnInit(){this._selectionModel=new ue$1(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(yo(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(yo(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect())}),this.options.changes.pipe(Bc(null),yo(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let i=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?i.setAttribute(`aria-labelledby`,e):i.removeAttribute(`aria-labelledby`)}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._panelOpen=!0,this._overlayDir.positionChange.pipe(Cn(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?`rtl`:`ltr`),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(i),this._cleanupDetach=void 0};let e=this.panel.nativeElement,t=this._renderer.listen(e,`animationend`,r=>{r.animationName===`_mat-select-exit`&&(this._cleanupDetach?.(),this._detachOverlay())}),i=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add(`mat-select-panel-exit`)}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return``;if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(`, `)}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value===`rtl`:!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let t=e.keyCode,i=t===40||t===38||t===37||t===39,r=t===13||t===32,o=this._keyManager;if(!o.isTyping()&&r&&!wb(e)||(this.multiple||e.altKey)&&i)e.preventDefault(),this.open();else if(!this.multiple){let g=this.selected;o.onKeydown(e);let b=this.selected;b&&g!==b&&this._liveAnnouncer.announce(b.viewValue,1e4)}}_handleOpenKeydown(e){let t=this._keyManager,i=e.keyCode,r=i===40||i===38,o=t.isTyping();if(r&&e.altKey)e.preventDefault(),this.close();else if(!o&&(i===13||i===32)&&t.activeItem&&!wb(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!o&&this._multiple&&i===65&&e.ctrlKey){e.preventDefault();let g=this.options.some(b=>!b.disabled&&!b.selected);this.options.forEach(b=>{b.disabled||(g?b.select():b.deselect())})}else{let g=t.activeItemIndex;t.onKeydown(e),this._multiple&&r&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==g&&t.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!wb(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else{let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let t=this.options.find(i=>{if(this._selectionModel.isSelected(i))return!1;try{return(i.value!=null||this.canSelectNullableOptions)&&this._compareWith(i.value,e)}catch{return!1}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth===`auto`?(e instanceof kt$1?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?``:this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new Df(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?`rtl`:`ltr`).withHomeAndEnd().withPageUpDown().withAllowedModifierKeys([`shiftKey`]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=TD(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(yo(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),TD(...this.options.map(t=>t._stateChanges)).pipe(yo(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,t){let i=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(i!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),i!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,i)=>this.sortComparator?this.sortComparator(t,i,e):e.indexOf(t)-e.indexOf(i)),this.stateChanges.next()}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(i=>i.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+` `:``;return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||``;return this.ariaLabelledby&&(e+=` `+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute(`aria-describedby`)?.split(` `)||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute(`aria-describedby`,e.join(` `)):t.removeAttribute(`aria-describedby`)}onContainerClick(e){let t=ot$2(e);t&&(t.tagName===`MAT-OPTION`||t.classList.contains(`cdk-overlay-backdrop`)||t.closest(`.mat-mdc-select-panel`))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static ɵfac=function(t){return new(t||n)};static ɵcmp=Le$2({type:n,selectors:[[`mat-select`]],contentQueries:function(t,i,r){if(t&1&&hv(r,an,5)(r,re$1,5)(r,je,5),t&2){let o;qS(o=ZS())&&(i.customTrigger=o.first),qS(o=ZS())&&(i.options=o),qS(o=ZS())&&(i.optionGroups=o)}},viewQuery:function(t,i){if(t&1&&mv(Ui,5)(Qi,5)(ve$3,5),t&2){let r;qS(r=ZS())&&(i.trigger=r.first),qS(r=ZS())&&(i.panel=r.first),qS(r=ZS())&&(i._overlayDir=r.first)}},hostAttrs:[`role`,`combobox`,`aria-haspopup`,`listbox`,1,`mat-mdc-select`],hostVars:21,hostBindings:function(t,i){t&1&&dv(`keydown`,function(o){return i._handleKeydown(o)})(`focus`,function(){return i._onFocus()})(`blur`,function(){return i._onBlur()}),t&2&&(rr(`id`,i.id)(`tabindex`,i.disabled?-1:i.tabIndex)(`aria-controls`,i.panelOpen?i.id+`-panel`:null)(`aria-expanded`,i.panelOpen)(`aria-label`,i.ariaLabel||null)(`aria-required`,i.required.toString())(`aria-disabled`,i.disabled.toString())(`aria-invalid`,i.errorState)(`aria-activedescendant`,i._getAriaActiveDescendant()),bt$1(`mat-mdc-select-disabled`,i.disabled)(`mat-mdc-select-invalid`,i.errorState)(`mat-mdc-select-required`,i.required)(`mat-mdc-select-empty`,i.empty)(`mat-mdc-select-multiple`,i.multiple)(`mat-select-open`,i.panelOpen))},inputs:{userAriaDescribedBy:[0,`aria-describedby`,`userAriaDescribedBy`],panelClass:`panelClass`,disabled:[2,`disabled`,`disabled`,Dt$1],disableRipple:[2,`disableRipple`,`disableRipple`,Dt$1],tabIndex:[2,`tabIndex`,`tabIndex`,e=>e==null?0:Vd(e)],hideSingleSelectionIndicator:[2,`hideSingleSelectionIndicator`,`hideSingleSelectionIndicator`,Dt$1],placeholder:`placeholder`,required:[2,`required`,`required`,Dt$1],multiple:[2,`multiple`,`multiple`,Dt$1],disableOptionCentering:[2,`disableOptionCentering`,`disableOptionCentering`,Dt$1],compareWith:`compareWith`,value:`value`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],errorStateMatcher:`errorStateMatcher`,typeaheadDebounceInterval:[2,`typeaheadDebounceInterval`,`typeaheadDebounceInterval`,Vd],sortComparator:`sortComparator`,id:`id`,panelWidth:`panelWidth`,canSelectNullableOptions:[2,`canSelectNullableOptions`,`canSelectNullableOptions`,Dt$1]},outputs:{openedChange:`openedChange`,_openedStream:`opened`,_closedStream:`closed`,selectionChange:`selectionChange`,valueChange:`valueChange`},exportAs:[`matSelect`],features:[Fv([{provide:ze,useExisting:n},{provide:Be,useExisting:n}]),ba],ngContentSelectors:$i,decls:11,vars:10,consts:[[`fallbackOverlayOrigin`,`cdkOverlayOrigin`,`trigger`,``],[`panel`,``],[`cdk-overlay-origin`,``,1,`mat-mdc-select-trigger`,3,`click`],[1,`mat-mdc-select-value`],[1,`mat-mdc-select-placeholder`,`mat-mdc-select-min-line`],[1,`mat-mdc-select-value-text`],[1,`mat-mdc-select-arrow-wrapper`],[1,`mat-mdc-select-arrow`],[`viewBox`,`0 0 24 24`,`width`,`24px`,`height`,`24px`,`focusable`,`false`,`aria-hidden`,`true`],[`d`,`M7 10l5 5 5-5z`],[`cdk-connected-overlay`,``,`cdkConnectedOverlayHasBackdrop`,``,`cdkConnectedOverlayBackdropClass`,`cdk-overlay-transparent-backdrop`,3,`detach`,`backdropClick`,`overlayKeydown`,`cdkConnectedOverlayDisableClose`,`cdkConnectedOverlayPanelClass`,`cdkConnectedOverlayScrollStrategy`,`cdkConnectedOverlayOrigin`,`cdkConnectedOverlayPositions`,`cdkConnectedOverlayWidth`,`cdkConnectedOverlayFlexibleDimensions`,`cdkConnectedOverlayUsePopover`],[1,`mat-mdc-select-min-line`],[`role`,`listbox`,`tabindex`,`-1`,1,`mat-mdc-select-panel`,`mdc-menu-surface`,`mdc-menu-surface--open`,3,`keydown`]],template:function(t,i){if(t&1&&(or(Ki),va(0,`div`,2,0),dv(`click`,function(){return i.open()}),va(3,`div`,3),ui$1(4,Yi,2,1,`span`,4)(5,Ji,3,1,`span`,5),Cd(),va(6,`div`,6)(7,`div`,7),fh(),va(8,`svg`,8),sv(9,`path`,9),Cd()()()(),ev(10,en,3,16,`ng-template`,10),dv(`detach`,function(){return i.close()})(`backdropClick`,function(){return i.close()})(`overlayKeydown`,function(o){return i._handleOverlayKeydown(o)})),t&2){let r=KS(1);oi(3),rr(`id`,i._valueId),oi(),li$1(i.empty?4:5),oi(6),iv(`cdkConnectedOverlayDisableClose`,!0)(`cdkConnectedOverlayPanelClass`,i._overlayPanelClass)(`cdkConnectedOverlayScrollStrategy`,i._scrollStrategy)(`cdkConnectedOverlayOrigin`,i._preferredOverlayOrigin||r)(`cdkConnectedOverlayPositions`,i._positions)(`cdkConnectedOverlayWidth`,i._overlayWidth)(`cdkConnectedOverlayFlexibleDimensions`,!0)(`cdkConnectedOverlayUsePopover`,i._popoverLocation)}},dependencies:[kt$1,ve$3],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--%NS%mat-select-enabled-trigger-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-select-trigger-text-font, var(--%NS%mat-sys-body-large-font));
  line-height: var(--%NS%mat-select-trigger-text-line-height, var(--%NS%mat-sys-body-large-line-height));
  font-size: var(--%NS%mat-select-trigger-text-size, var(--%NS%mat-sys-body-large-size));
  font-weight: var(--%NS%mat-select-trigger-text-weight, var(--%NS%mat-sys-body-large-weight));
  letter-spacing: var(--%NS%mat-select-trigger-text-tracking, var(--%NS%mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--%NS%mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--%NS%mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--%NS%mat-select-invalid-arrow-color, var(--%NS%mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--%NS%mat-select-enabled-arrow-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-focused-arrow-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--%NS%mat-select-disabled-arrow-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--%NS%mat-select-panel-background-color, var(--%NS%mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--%NS%mat-select-placeholder-text-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--%NS%mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2})}return n})();var ni=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[ye$2,qe,ro,yt$1,Zt,qe]})}return n})();function rn(n,a){if(n&1&&(va(0,`mat-option`,17),vC(1),Cd()),n&2){let e=a.$implicit;iv(`value`,e),oi(),xd(` `,e,` `)}}function on(n,a){if(n&1){let e=jS();va(0,`mat-form-field`,14)(1,`mat-select`,16,0),dv(`selectionChange`,function(i){Jp(e);return eh(zS(2)._changePageSize(i.value))}),AS(3,rn,2,2,`mat-option`,17,xS),Cd(),va(5,`div`,18),dv(`click`,function(){Jp(e);return eh(KS(2).open())}),Cd()()}if(n&2){let e=zS(2);iv(`appearance`,e._formFieldAppearance)(`color`,e.color),oi(),iv(`value`,e.pageSize)(`disabled`,e.disabled),ov(`aria-labelledby`,e._pageSizeLabelId),iv(`panelClass`,e.selectConfig.panelClass||``)(`disableOptionCentering`,e.selectConfig.disableOptionCentering),oi(2),RS(e._displayedPageSizeOptions)}}function ln(n,a){if(n&1&&(va(0,`div`,15),vC(1),Cd()),n&2){let e=zS(2);oi(),Tv(e.pageSize)}}function sn(n,a){if(n&1&&(va(0,`div`,3)(1,`div`,13),vC(2),Cd(),ui$1(3,on,6,7,`mat-form-field`,14),ui$1(4,ln,2,1,`div`,15),Cd()),n&2){let e=zS();oi(),rr(`id`,e._pageSizeLabelId),oi(),xd(` `,e._intl.itemsPerPageLabel,` `),oi(),li$1(e._displayedPageSizeOptions.length>1?3:-1),oi(),li$1(e._displayedPageSizeOptions.length<=1?4:-1)}}function dn(n,a){if(n&1){let e=jS();va(0,`button`,19),dv(`click`,function(){Jp(e);let i=zS();return eh(i._buttonClicked(0,i._previousButtonsDisabled()))}),fh(),va(1,`svg`,8),sv(2,`path`,20),Cd()()}if(n&2){let e=zS();iv(`matTooltip`,e._intl.firstPageLabel)(`matTooltipDisabled`,e._previousButtonsDisabled())(`disabled`,e._previousButtonsDisabled())(`tabindex`,e._previousButtonsDisabled()?-1:null),rr(`aria-label`,e._intl.firstPageLabel)}}function cn(n,a){if(n&1){let e=jS();va(0,`button`,21),dv(`click`,function(){Jp(e);let i=zS();return eh(i._buttonClicked(i.getNumberOfPages()-1,i._nextButtonsDisabled()))}),fh(),va(1,`svg`,8),sv(2,`path`,22),Cd()()}if(n&2){let e=zS();iv(`matTooltip`,e._intl.lastPageLabel)(`matTooltipDisabled`,e._nextButtonsDisabled())(`disabled`,e._nextButtonsDisabled())(`tabindex`,e._nextButtonsDisabled()?-1:null),rr(`aria-label`,e._intl.lastPageLabel)}}var mn=(()=>{class n{changes=new U$2;itemsPerPageLabel=`Items per page:`;nextPageLabel=`Next page`;previousPageLabel=`Previous page`;firstPageLabel=`First page`;lastPageLabel=`Last page`;getRangeLabel=(e,t,i)=>{if(i==0||t==0)return`0 of ${i}`;i=Math.max(i,0);let r=e*t,o=r<i?Math.min(r+t,i):r+t;return`${r+1} \u2013 ${o} of ${i}`};static ɵfac=function(t){return new(t||n)};static ɵprov=k({token:n,factory:n.ɵfac})}return n})();var fn=50;var un=new v$1(`MAT_PAGINATOR_DEFAULT_OPTIONS`);var pn=(()=>{class n{_intl=h(mn);_changeDetectorRef=h(ny);_formFieldAppearance;_pageSizeLabelId=h(_f).getId(`mat-paginator-page-size-label-`);_intlChanges;_isInitialized=!1;_initializedStream=new uo(1);color;get pageIndex(){return this._pageIndex}set pageIndex(e){this._pageIndex=Math.max(e||0,0),this._changeDetectorRef.markForCheck()}_pageIndex=0;get length(){return this._length}set length(e){this._length=e||0,this._changeDetectorRef.markForCheck()}_length=0;get pageSize(){return this._pageSize}set pageSize(e){this._pageSize=Math.max(e||0,0),this._updateDisplayedPageSizeOptions()}_pageSize;get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(e){this._pageSizeOptions=(e||[]).map(t=>Vd(t,0)),this._updateDisplayedPageSizeOptions()}_pageSizeOptions=[];hidePageSize=!1;showFirstLastButtons=!1;selectConfig={};disabled=!1;page=new Pe$2;_displayedPageSizeOptions;initialized=this._initializedStream;constructor(){let e=this._intl,t=h(un,{optional:!0});if(this._intlChanges=e.changes.subscribe(()=>this._changeDetectorRef.markForCheck()),t){let{pageSize:i,pageSizeOptions:r,hidePageSize:o,showFirstLastButtons:g}=t;i!=null&&(this._pageSize=i),r!=null&&(this._pageSizeOptions=r),o!=null&&(this.hidePageSize=o),g!=null&&(this.showFirstLastButtons=g)}this._formFieldAppearance=t?.formFieldAppearance||`outline`}ngOnInit(){this._isInitialized=!0,this._updateDisplayedPageSizeOptions(),this._initializedStream.next()}ngOnDestroy(){this._initializedStream.complete(),this._intlChanges.unsubscribe()}nextPage(){this.hasNextPage()&&this._navigate(this.pageIndex+1)}previousPage(){this.hasPreviousPage()&&this._navigate(this.pageIndex-1)}firstPage(){this.hasPreviousPage()&&this._navigate(0)}lastPage(){this.hasNextPage()&&this._navigate(this.getNumberOfPages()-1)}hasPreviousPage(){return this.pageIndex>=1&&this.pageSize!=0}hasNextPage(){let e=this.getNumberOfPages()-1;return this.pageIndex<e&&this.pageSize!=0}getNumberOfPages(){return this.pageSize?Math.ceil(this.length/this.pageSize):0}_changePageSize(e){let t=this.pageIndex*this.pageSize,i=this.pageIndex;this.pageIndex=Math.floor(t/e)||0,this.pageSize=e,this._emitPageEvent(i)}_nextButtonsDisabled(){return this.disabled||!this.hasNextPage()}_previousButtonsDisabled(){return this.disabled||!this.hasPreviousPage()}_updateDisplayedPageSizeOptions(){this._isInitialized&&(this.pageSize||(this._pageSize=this.pageSizeOptions.length!=0?this.pageSizeOptions[0]:fn),this._displayedPageSizeOptions=this.pageSizeOptions.slice(),this._displayedPageSizeOptions.indexOf(this.pageSize)===-1&&this._displayedPageSizeOptions.push(this.pageSize),this._displayedPageSizeOptions.sort((e,t)=>e-t),this._changeDetectorRef.markForCheck())}_emitPageEvent(e){this.page.emit({previousPageIndex:e,pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.length})}_navigate(e){let t=this.pageIndex;e!==t&&(this.pageIndex=e,this._emitPageEvent(t))}_buttonClicked(e,t){t||this._navigate(e)}static ɵfac=function(t){return new(t||n)};static ɵcmp=Le$2({type:n,selectors:[[`mat-paginator`]],hostAttrs:[`role`,`group`,1,`mat-mdc-paginator`],inputs:{color:`color`,pageIndex:[2,`pageIndex`,`pageIndex`,Vd],length:[2,`length`,`length`,Vd],pageSize:[2,`pageSize`,`pageSize`,Vd],pageSizeOptions:`pageSizeOptions`,hidePageSize:[2,`hidePageSize`,`hidePageSize`,Dt$1],showFirstLastButtons:[2,`showFirstLastButtons`,`showFirstLastButtons`,Dt$1],selectConfig:`selectConfig`,disabled:[2,`disabled`,`disabled`,Dt$1]},outputs:{page:`page`},exportAs:[`matPaginator`],decls:14,vars:14,consts:[[`selectRef`,``],[1,`mat-mdc-paginator-outer-container`],[1,`mat-mdc-paginator-container`],[1,`mat-mdc-paginator-page-size`],[1,`mat-mdc-paginator-range-actions`],[`aria-atomic`,`true`,`aria-live`,`polite`,`role`,`status`,1,`mat-mdc-paginator-range-label`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-first`,3,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-previous`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`viewBox`,`0 0 24 24`,`focusable`,`false`,`aria-hidden`,`true`,1,`mat-mdc-paginator-icon`],[`d`,`M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-next`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`d`,`M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-last`,3,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`aria-hidden`,`true`,1,`mat-mdc-paginator-page-size-label`],[1,`mat-mdc-paginator-page-size-select`,3,`appearance`,`color`],[1,`mat-mdc-paginator-page-size-value`],[`hideSingleSelectionIndicator`,``,3,`selectionChange`,`value`,`disabled`,`aria-labelledby`,`panelClass`,`disableOptionCentering`],[3,`value`],[1,`mat-mdc-paginator-touch-target`,3,`click`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-first`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`d`,`M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z`],[`matIconButton`,``,`type`,`button`,`matTooltipPosition`,`above`,`disabledInteractive`,``,1,`mat-mdc-paginator-navigation-last`,3,`click`,`matTooltip`,`matTooltipDisabled`,`disabled`,`tabindex`],[`d`,`M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z`]],template:function(t,i){t&1&&(va(0,`div`,1)(1,`div`,2),ui$1(2,sn,5,4,`div`,3),va(3,`div`,4)(4,`div`,5),vC(5),Cd(),ui$1(6,dn,3,5,`button`,6),va(7,`button`,7),dv(`click`,function(){return i._buttonClicked(i.pageIndex-1,i._previousButtonsDisabled())}),fh(),va(8,`svg`,8),sv(9,`path`,9),Cd()(),ph(),va(10,`button`,10),dv(`click`,function(){return i._buttonClicked(i.pageIndex+1,i._nextButtonsDisabled())}),fh(),va(11,`svg`,8),sv(12,`path`,11),Cd()(),ui$1(13,cn,3,5,`button`,12),Cd()()()),t&2&&(oi(2),li$1(i.hidePageSize?-1:2),oi(3),xd(` `,i._intl.getRangeLabel(i.pageIndex,i.pageSize,i.length),` `),oi(),li$1(i.showFirstLastButtons?6:-1),oi(),iv(`matTooltip`,i._intl.previousPageLabel)(`matTooltipDisabled`,i._previousButtonsDisabled())(`disabled`,i._previousButtonsDisabled())(`tabindex`,i._previousButtonsDisabled()?-1:null),rr(`aria-label`,i._intl.previousPageLabel),oi(3),iv(`matTooltip`,i._intl.nextPageLabel)(`matTooltipDisabled`,i._nextButtonsDisabled())(`disabled`,i._nextButtonsDisabled())(`tabindex`,i._nextButtonsDisabled()?-1:null),rr(`aria-label`,i._intl.nextPageLabel),oi(3),li$1(i.showFirstLastButtons?13:-1))},dependencies:[xe$1,ii,re$1,_M,mt$1],styles:[`.mat-mdc-paginator {
  display: block;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--%NS%mat-paginator-container-text-color, var(--%NS%mat-sys-on-surface));
  background-color: var(--%NS%mat-paginator-container-background-color, var(--%NS%mat-sys-surface));
  font-family: var(--%NS%mat-paginator-container-text-font, var(--%NS%mat-sys-body-small-font));
  line-height: var(--%NS%mat-paginator-container-text-line-height, var(--%NS%mat-sys-body-small-line-height));
  font-size: var(--%NS%mat-paginator-container-text-size, var(--%NS%mat-sys-body-small-size));
  font-weight: var(--%NS%mat-paginator-container-text-weight, var(--%NS%mat-sys-body-small-weight));
  letter-spacing: var(--%NS%mat-paginator-container-text-tracking, var(--%NS%mat-sys-body-small-tracking));
  --%NS%mat-form-field-container-height: var(--%NS%mat-paginator-form-field-container-height, 40px);
  --%NS%mat-form-field-container-vertical-padding: var(--%NS%mat-paginator-form-field-container-vertical-padding, 8px);
}
.mat-mdc-paginator .mat-mdc-select-value {
  font-size: var(--%NS%mat-paginator-select-trigger-text-size, var(--%NS%mat-sys-body-small-size));
}
.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {
  display: none;
}
.mat-mdc-paginator .mat-mdc-select {
  line-height: 1.5;
}

.mat-mdc-paginator-outer-container {
  display: flex;
}

.mat-mdc-paginator-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  flex-wrap: wrap;
  width: 100%;
  min-height: var(--%NS%mat-paginator-container-size, 56px);
}

.mat-mdc-paginator-page-size {
  display: flex;
  align-items: baseline;
  margin-right: 8px;
}
[dir=rtl] .mat-mdc-paginator-page-size {
  margin-right: 0;
  margin-left: 8px;
}

.mat-mdc-paginator-page-size-label {
  margin: 0 4px;
}

.mat-mdc-paginator-page-size-select {
  margin: 0 4px;
  width: var(--%NS%mat-paginator-page-size-select-width, 84px);
}

.mat-mdc-paginator-range-label {
  margin: 0 32px 0 24px;
}

.mat-mdc-paginator-range-actions {
  display: flex;
  align-items: center;
}

.mat-mdc-paginator-icon {
  display: inline-block;
  width: 28px;
  fill: var(--%NS%mat-paginator-enabled-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {
  fill: var(--%NS%mat-paginator-disabled-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
[dir=rtl] .mat-mdc-paginator-icon {
  transform: rotate(180deg);
}

@media (forced-colors: active) {
  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,
  .mat-mdc-paginator-icon {
    fill: currentColor;
  }
  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {
    outline: solid 1px;
  }
  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {
    color: GrayText;
  }
}
.mat-mdc-paginator-touch-target {
  display: var(--%NS%mat-paginator-touch-target-display, block);
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--%NS%mat-paginator-page-size-select-width, 84px);
  height: var(--%NS%mat-paginator-page-size-select-touch-target-height, 48px);
  background-color: transparent;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
`],encapsulation:2})}return n})();var Vr=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=ge$1({type:n});static ɵinj=ue$2({imports:[OG,ni,Yt$2,pn]})}return n})();var $e=[[[`mat-icon`],[``,`matMenuItemIcon`,``]],`*`];var et=[`mat-icon, [matMenuItemIcon]`,`*`];function tt(a,Ue){a&1&&(fh(),va(0,`svg`,2),sv(1,`polygon`,3),Cd())}var nt=[`*`];function it(a,Ue){if(a&1){let e=jS();pn$1(0,`div`,0),fv(`click`,function(){Jp(e);return eh(zS().closed.emit(`click`))})(`animationstart`,function(n){Jp(e);return eh(zS()._onAnimationStart(n.animationName))})(`animationend`,function(n){Jp(e);return eh(zS()._onAnimationDone(n.animationName))})(`animationcancel`,function(n){Jp(e);return eh(zS()._onAnimationDone(n.animationName))}),pn$1(1,`div`,1),tt$2(2),hn$1()()}if(a&2){let e=zS();fi$1(e._classList),bt$1(`mat-menu-panel-animations-disabled`,e._animationsDisabled)(`mat-menu-panel-exit-animation`,e._panelAnimationState===`void`)(`mat-menu-panel-animating`,e._isAnimating()),uv(`id`,e.panelId),rr(`aria-label`,e.ariaLabel||null)(`aria-labelledby`,e.ariaLabelledby||null)(`aria-describedby`,e.ariaDescribedby||null)}}var q$1=new v$1(`MAT_MENU_PANEL`);var G=(()=>{class a{_elementRef=h(de$1);_document=h(O$1);_focusMonitor=h(mf);_parentMenu=h(q$1,{optional:!0});_changeDetectorRef=h(ny);role=`menuitem`;disabled=!1;disableRipple=!1;_hovered=new U$2;_focused=new U$2;_highlighted=!1;_triggersSubmenu=!1;constructor(){h($t$2).load(Lb),this._parentMenu?.addItem?.(this)}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,t):this._getHostElement().focus(t),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled?`-1`:`0`}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),t=e.querySelectorAll(`mat-icon, .material-icons`);for(let n=0;n<t.length;n++)t[n].remove();return e.textContent?.trim()||``}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static ɵfac=function(t){return new(t||a)};static ɵcmp=Le$2({type:a,selectors:[[``,`mat-menu-item`,``]],hostAttrs:[1,`mat-mdc-menu-item`,`mat-focus-indicator`],hostVars:8,hostBindings:function(t,n){t&1&&dv(`click`,function(s){return n._checkDisabled(s)})(`mouseenter`,function(){return n._handleMouseEnter()}),t&2&&(rr(`role`,n.role)(`tabindex`,n._getTabIndex())(`aria-disabled`,n.disabled)(`disabled`,n.disabled||null),bt$1(`mat-mdc-menu-item-highlighted`,n._highlighted)(`mat-mdc-menu-item-submenu-trigger`,n._triggersSubmenu))},inputs:{role:`role`,disabled:[2,`disabled`,`disabled`,Dt$1],disableRipple:[2,`disableRipple`,`disableRipple`,Dt$1]},exportAs:[`matMenuItem`],ngContentSelectors:et,decls:5,vars:3,consts:[[1,`mat-mdc-menu-item-text`],[`matRipple`,``,1,`mat-mdc-menu-ripple`,3,`matRippleDisabled`,`matRippleTrigger`],[`viewBox`,`0 0 5 10`,`focusable`,`false`,`aria-hidden`,`true`,1,`mat-mdc-menu-submenu-icon`],[`points`,`0,0 5,5 0,10`]],template:function(t,n){t&1&&(or($e),tt$2(0),va(1,`span`,0),tt$2(2,1),Cd(),sv(3,`div`,1),ui$1(4,tt,2,0,`:svg:svg`,2)),t&2&&(oi(3),iv(`matRippleDisabled`,n.disableRipple||n.disabled)(`matRippleTrigger`,n._getHostElement()),oi(),li$1(n._triggersSubmenu?4:-1))},dependencies:[tG],encapsulation:2})}return a})();var at=new v$1(`MatMenuContent`);var st=new v$1(`mat-menu-default-options`,{providedIn:`root`,factory:()=>({overlapTrigger:!1,xPosition:`after`,yPosition:`below`,backdropClass:`cdk-overlay-transparent-backdrop`})});var K=`_mat-menu-enter`;var D=`_mat-menu-exit`;var I=(()=>{class a{_elementRef=h(de$1);_changeDetectorRef=h(ny);_injector=h(X$1);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=no();_allItems;_directDescendantItems=new Kn;_classList={};_panelAnimationState=`void`;_animationDone=new U$2;_isAnimating=Ot$1(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;get panelClass(){return this._previousPanelClass}set panelClass(e){let t=this._previousPanelClass,n=A$1({},this._classList);t&&t.length&&t.split(` `).forEach(i=>{n[i]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(` `).forEach(i=>{n[i]=!0}),this._elementRef.nativeElement.className=``),this._classList=n}_previousPanelClass=``;get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new Pe$2;close=this.closed;panelId=h(_f).getId(`mat-menu-panel-`);constructor(){let e=h(st);this.overlayPanelClass=e.overlayPanelClass||``,this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new Ef(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd(),this._keyManager.tabOut.subscribe(()=>this.closed.emit(`tab`)),this._directDescendantItems.changes.pipe(Bc(this._directDescendantItems),Mc(e=>TD(...e.map(t=>t._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let t=this._keyManager;if(this._panelAnimationState===`enter`&&t.activeItem?._hasFocus()){let n=e.toArray(),i=Math.max(0,Math.min(n.length-1,t.activeItemIndex||0));n[i]&&!n[i].disabled?t.setActiveItem(i):t.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(Bc(this._directDescendantItems),Mc(t=>TD(...t.map(n=>n._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let t=e.keyCode,n=this._keyManager;switch(t){case 27:wb(e)||(e.preventDefault(),this.closed.emit(`keydown`));break;case 37:this.parentMenu&&this.direction===`ltr`&&this.closed.emit(`keydown`);break;case 39:this.parentMenu&&this.direction===`rtl`&&this.closed.emit(`keydown`);break;default:(t===38||t===40)&&n.setFocusOrigin(`keyboard`),n.onKeydown(e);return}}focusFirstItem(e=`program`){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=ed(()=>{let t=this._resolvePanel();if(!t||!t.contains(document.activeElement)){let n=this._keyManager;n.setFocusOrigin(e).setFirstItemActive(),!n.activeItem&&t&&t.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,t=this.yPosition){this._classList=ne$1(A$1({},this._classList),{"mat-menu-before":e===`before`,"mat-menu-after":e===`after`,"mat-menu-above":t===`above`,"mat-menu-below":t===`below`}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let t=e===D;(t||e===K)&&(t&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(t?`void`:`enter`),this._isAnimating.set(!1))}_onAnimationStart(e){(e===K||e===D)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?`enter`:`void`,e){if(this._keyManager.activeItemIndex===0){let t=this._resolvePanel();t&&(t.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(D),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?K:D)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(Bc(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(t=>t._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest(`[role="menu"]`)),e}static ɵfac=function(t){return new(t||a)};static ɵcmp=Le$2({type:a,selectors:[[`mat-menu`]],contentQueries:function(t,n,i){if(t&1&&hv(i,at,5)(i,G,5)(i,G,4),t&2){let s;qS(s=ZS())&&(n.lazyContent=s.first),qS(s=ZS())&&(n._allItems=s),qS(s=ZS())&&(n.items=s)}},viewQuery:function(t,n){if(t&1&&mv(Ur,5),t&2){let i;qS(i=ZS())&&(n.templateRef=i.first)}},hostVars:3,hostBindings:function(t,n){t&2&&rr(`aria-label`,null)(`aria-labelledby`,null)(`aria-describedby`,null)},inputs:{backdropClass:`backdropClass`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],xPosition:`xPosition`,yPosition:`yPosition`,overlapTrigger:[2,`overlapTrigger`,`overlapTrigger`,Dt$1],hasBackdrop:[2,`hasBackdrop`,`hasBackdrop`,e=>e==null?null:Dt$1(e)],panelClass:[0,`class`,`panelClass`],classList:`classList`},outputs:{closed:`closed`,close:`close`},exportAs:[`matMenu`],features:[Fv([{provide:q$1,useExisting:a}])],ngContentSelectors:nt,decls:1,vars:0,consts:[[`tabindex`,`-1`,`role`,`menu`,1,`mat-mdc-menu-panel`,3,`click`,`animationstart`,`animationend`,`animationcancel`,`id`],[1,`mat-mdc-menu-content`]],template:function(t,n){t&1&&(or(),tv(0,it,3,12,`ng-template`))},styles:[`mat-menu {
  display: none;
}

.mat-mdc-menu-content {
  margin: 0;
  padding: 8px 0;
  outline: 0;
}
.mat-mdc-menu-content,
.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  flex: 1;
  white-space: normal;
  font-family: var(--%NS%mat-menu-item-label-text-font, var(--%NS%mat-sys-label-large-font));
  line-height: var(--%NS%mat-menu-item-label-text-line-height, var(--%NS%mat-sys-label-large-line-height));
  font-size: var(--%NS%mat-menu-item-label-text-size, var(--%NS%mat-sys-label-large-size));
  letter-spacing: var(--%NS%mat-menu-item-label-text-tracking, var(--%NS%mat-sys-label-large-tracking));
  font-weight: var(--%NS%mat-menu-item-label-text-weight, var(--%NS%mat-sys-label-large-weight));
}

@keyframes _mat-menu-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-menu-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-menu-panel {
  min-width: 112px;
  max-width: 280px;
  overflow: auto;
  box-sizing: border-box;
  outline: 0;
  animation: _mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
  border-radius: var(--%NS%mat-menu-container-shape, var(--%NS%mat-sys-corner-extra-small));
  background-color: var(--%NS%mat-menu-container-color, var(--%NS%mat-sys-surface-container));
  box-shadow: var(--%NS%mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  will-change: transform, opacity;
}
.mat-mdc-menu-panel.mat-menu-panel-exit-animation {
  animation: _mat-menu-exit 100ms 25ms linear forwards;
}
.mat-mdc-menu-panel.mat-menu-panel-animations-disabled {
  animation: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating {
  pointer-events: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty) {
  display: none;
}
@media (forced-colors: active) {
  .mat-mdc-menu-panel {
    outline: solid 1px;
  }
}
.mat-mdc-menu-panel .mat-divider {
  border-top-color: var(--%NS%mat-menu-divider-color, var(--%NS%mat-sys-surface-variant));
  margin-bottom: var(--%NS%mat-menu-divider-bottom-spacing, 8px);
  margin-top: var(--%NS%mat-menu-divider-top-spacing, 8px);
}

.mat-mdc-menu-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  color: inherit;
  font-size: inherit;
  background: none;
  text-decoration: none;
  margin: 0;
  min-height: 48px;
  padding-left: var(--%NS%mat-menu-item-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-menu-item::-moz-focus-inner {
  border: 0;
}
[dir=rtl] .mat-mdc-menu-item {
  padding-left: var(--%NS%mat-menu-item-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-leading-spacing, 12px);
}
.mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--%NS%mat-menu-item-with-icon-trailing-spacing, 12px);
  padding-right: var(--%NS%mat-menu-item-with-icon-leading-spacing, 12px);
}
.mat-mdc-menu-item, .mat-mdc-menu-item:visited, .mat-mdc-menu-item:link {
  color: var(--%NS%mat-menu-item-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-menu-item .mat-icon-no-color,
.mat-mdc-menu-item .mat-mdc-menu-submenu-icon {
  color: var(--%NS%mat-menu-item-icon-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-menu-item[disabled] {
  cursor: default;
  opacity: 0.38;
}
.mat-mdc-menu-item[disabled]::after {
  display: block;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.mat-mdc-menu-item:focus {
  outline: 0;
}
.mat-mdc-menu-item .mat-icon {
  flex-shrink: 0;
  margin-right: var(--%NS%mat-menu-item-spacing, 12px);
  height: var(--%NS%mat-menu-item-icon-size, 24px);
  width: var(--%NS%mat-menu-item-icon-size, 24px);
}
[dir=rtl] .mat-mdc-menu-item {
  text-align: right;
}
[dir=rtl] .mat-mdc-menu-item .mat-icon {
  margin-right: 0;
  margin-left: var(--%NS%mat-menu-item-spacing, 12px);
}
.mat-mdc-menu-item:not([disabled]):hover {
  background-color: var(--%NS%mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-menu-item:not([disabled]).cdk-program-focused, .mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused, .mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted {
  background-color: var(--%NS%mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) calc(var(--%NS%mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
@media (forced-colors: active) {
  .mat-mdc-menu-item {
    margin-top: 1px;
  }
}

.mat-mdc-menu-submenu-icon {
  width: var(--%NS%mat-menu-item-icon-size, 24px);
  height: 10px;
  fill: currentColor;
  padding-left: var(--%NS%mat-menu-item-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-submenu-icon {
  padding-right: var(--%NS%mat-menu-item-spacing, 12px);
  padding-left: 0;
}
[dir=rtl] .mat-mdc-menu-submenu-icon polygon {
  transform: scaleX(-1);
  transform-origin: center;
}
@media (forced-colors: active) {
  .mat-mdc-menu-submenu-icon {
    fill: CanvasText;
  }
}

.mat-mdc-menu-item .mat-mdc-menu-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
`],encapsulation:2})}return a})();var ot=new v$1(`mat-menu-scroll-strategy`,{providedIn:`root`,factory:()=>{let a=h(X$1);return()=>Ot$2(a)}});var u=new WeakMap;var rt=(()=>{class a{_canHaveBackdrop;_element=h(de$1);_viewContainerRef=h(Zr);_menuItemInstance=h(G,{optional:!0,self:!0});_dir=h(SM,{optional:!0});_focusMonitor=h(mf);_ngZone=h(P);_injector=h(X$1);_scrollStrategy=h(ot);_changeDetectorRef=h(ny);_animationsDisabled=no();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=W$1.EMPTY;_menuCloseSubscription=W$1.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e?(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(t=>{this._destroyMenu(t),(t===`click`||t===`tab`)&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(t)})):this._destroyMenu(),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let t=h(q$1,{optional:!0});this._parentMaterialMenu=t instanceof I?t:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&u.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let t=this._menu;if(this._menuOpen||!t)return;this._pendingRemoval?.unsubscribe();let n=u.get(t);u.set(t,this),n&&n!==this&&n._closeMenu();let i=this._createOverlay(t),s=i.getConfig(),r=s.positionStrategy;this._setPosition(t,r),this._canHaveBackdrop?s.hasBackdrop=t.hasBackdrop==null?!this._triggersSubmenu():t.hasBackdrop:s.hasBackdrop=t.hasBackdrop??!1,i.hasAttached()||(i.attach(this._getPortal(t)),t.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),t.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,t.direction=this.dir,e&&t.focusFirstItem(this._openedBy||`program`),this._setIsMenuOpen(!0),t instanceof I&&(t._setIsOpen(!0),t._directDescendantItems.changes.pipe(yo(t.close)).subscribe(()=>{r.withLockedPosition(!1).reapplyLastPosition(),r.withLockedPosition(!0)}))}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,t):this._element.nativeElement.focus(t)}_destroyMenu(e){let t=this._overlayRef,n=this._menu;!t||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),n instanceof I&&this._ownsMenu(n)?(this._pendingRemoval=n._animationDone.pipe(Cn(1)).subscribe(()=>{t.detach(),u.has(n)||n.lazyContent?.detach()}),n._setIsOpen(!1)):(t.detach(),n?.lazyContent?.detach()),n&&this._ownsMenu(n)&&u.delete(n),this.restoreFocus&&(e===`keydown`||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let t=this._getOverlayConfig(e);this._subscribeToPositions(e,t.positionStrategy),this._overlayRef=Dt$2(this._injector,t),this._overlayRef.keydownEvents().subscribe(n=>{this._menu instanceof I&&this._menu._handleKeydown(n)})}return this._overlayRef}_getOverlayConfig(e){return new j$1({positionStrategy:Et$1(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(`.mat-menu-panel, .mat-mdc-menu-panel`),backdropClass:e.backdropClass||`cdk-overlay-transparent-backdrop`,panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||`ltr`,disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,t){e.setPositionClasses&&t.positionChanges.subscribe(n=>{this._ngZone.run(()=>{let i=n.connectionPair.overlayX===`start`?`after`:`before`,s=n.connectionPair.overlayY===`top`?`below`:`above`;e.setPositionClasses(i,s)})})}_setPosition(e,t){let[n,i]=e.xPosition===`before`?[`end`,`start`]:[`start`,`end`],[s,r]=e.yPosition===`above`?[`bottom`,`top`]:[`top`,`bottom`],[P,R]=[s,r],[T,N]=[n,i],c=0;if(this._triggersSubmenu()){if(N=n=e.xPosition===`before`?`start`:`end`,i=T=n===`end`?`start`:`end`,this._parentMaterialMenu){if(this._parentInnerPadding==null){let Z=this._parentMaterialMenu.items.first;this._parentInnerPadding=Z?Z._getHostElement().offsetTop:0}c=s===`bottom`?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(P=s===`top`?`bottom`:`top`,R=r===`top`?`bottom`:`top`);t.withPositions([{originX:n,originY:P,overlayX:T,overlayY:s,offsetY:c},{originX:i,originY:P,overlayX:N,overlayY:s,offsetY:c},{originX:n,originY:R,overlayX:T,overlayY:r,offsetY:-c},{originX:i,originY:R,overlayX:N,overlayY:r,offsetY:-c}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),t=this._overlayRef.detachments();return TD(e,this._parentMaterialMenu?this._parentMaterialMenu.closed:We$1(),this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(at$3(s=>this._menuOpen&&s!==this._menuItemInstance)):We$1(),t)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new H$1(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return u.get(e)===this}_triggerIsAriaDisabled(){return Dt$1(this._element.nativeElement.getAttribute(`aria-disabled`))}static ɵfac=function(t){Tw()};static ɵdir=et$3({type:a})}return a})();var Bt=(()=>{class a extends rt{_cleanupTouchstart;_hoverSubscription=W$1.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new Pe$2;onMenuOpen=this.menuOpened;menuClosed=new Pe$2;onMenuClose=this.menuClosed;constructor(){super(!0);let e=h(Xn);this._cleanupTouchstart=e.listen(this._element.nativeElement,`touchstart`,t=>{Ti$1(t)||(this._openedBy=`touch`)},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){Ci$1(e)||(this._openedBy=e.button===0?`mouse`:void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let t=e.keyCode;(t===13||t===32)&&(this._openedBy=`keyboard`),this.triggersSubmenu()&&(t===39&&this.dir===`ltr`||t===37&&this.dir===`rtl`)&&(this._openedBy=`keyboard`,this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!==`void`&&(this._openedBy=`mouse`,this._openMenu(!1))}))}static ɵfac=function(t){return new(t||a)};static ɵdir=et$3({type:a,selectors:[[``,`mat-menu-trigger-for`,``],[``,`matMenuTriggerFor`,``]],hostAttrs:[1,`mat-mdc-menu-trigger`],hostVars:3,hostBindings:function(t,n){t&1&&dv(`click`,function(s){return n._handleClick(s)})(`mousedown`,function(s){return n._handleMousedown(s)})(`keydown`,function(s){return n._handleKeydown(s)}),t&2&&rr(`aria-haspopup`,n.menu?`menu`:null)(`aria-expanded`,n.menuOpen)(`aria-controls`,n.menuOpen?n.menu?.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,`mat-menu-trigger-for`,`_deprecatedMatMenuTriggerFor`],menu:[0,`matMenuTriggerFor`,`menu`],menuData:[0,`matMenuTriggerData`,`menuData`],restoreFocus:[0,`matMenuTriggerRestoreFocus`,`restoreFocus`]},outputs:{menuOpened:`menuOpened`,onMenuOpen:`onMenuOpen`,menuClosed:`menuClosed`,onMenuClose:`onMenuClose`},exportAs:[`matMenuTrigger`],features:[Yr]})}return a})();var Lt=(()=>{class a{static ɵfac=function(t){return new(t||a)};static ɵmod=ge$1({type:a});static ɵinj=ue$2({imports:[Bb,ye$2,ro,yt$1]})}return a})();function U(n){n||(n=h(De$1));let e=new M(t=>{if(n.destroyed){t.next();return}return n.onDestroy(t.next.bind(t))});return t=>t.pipe(yo(e))}function T(n,e){let d=!e?.manualCleanup?e?.injector?.get(De$1)??h(De$1):null,l=p(e?.equal),o;e?.requireSync?o=Ot$1({kind:0},{equal:l}):o=Ot$1({kind:1,value:e?.initialValue},{equal:l});let i,b=n.subscribe({next:r=>o.set({kind:1,value:r}),error:r=>{o.set({kind:2,error:r}),i?.()},complete:()=>{i?.()}});if(e?.requireSync&&o().kind===0)throw new g(601,!1);return i=d?.onDestroy(b.unsubscribe.bind(b)),VC(()=>{let r=o();switch(r.kind){case 1:return r.value;case 2:throw r.error;case 0:throw new g(601,!1)}},{equal:e?.equal})}function p(n=Object.is){return(e,t)=>e.kind===1&&t.kind===1&&n(e.value,t.value)}var n=`fincontrol_token`;var d=class t{http=h(sc);router=h(ce);usuarios=h(n$1);tokenAtual=Ot$1(localStorage.getItem(n));token=this.tokenAtual.asReadonly();claims=VC(()=>f$1(this.tokenAtual()));email=VC(()=>this.claims()?.upn??``);isSuperAdmin=VC(()=>this.claims()?.groups?.includes(`SUPER_ADMIN`)??!1);isLoggedIn(){let e=this.claims();return e?e.exp*1e3<=Date.now()?(this.limpar(),!1):!0:!1}login(e){return this.http.post(`${tW}/auth/login`,e).pipe(Zt$2(r=>this.salvar(r.token)))}register(e){return this.http.post(`${tW}/auth/register`,e)}alterarSenha(e){return this.renovar(this.http.put(`${tW}/usuarios/me/senha`,e))}alterarEmail(e,r){return this.renovar(this.http.put(`${tW}/usuarios/me/email`,{novoEmail:e,senhaAtual:r}))}encerrarOutrasSessoes(e){return this.renovar(this.http.post(`${tW}/usuarios/me/encerrar-sessoes`,{senhaAtual:e}))}renovar(e){return e.pipe(Zt$2(r=>this.salvar(r.token)),Mc(()=>this.usuarios.carregarPerfil()))}logout(e){this.limpar(),this.router.navigate([`/login`],{queryParams:e?{motivo:e}:{}})}rotaInicial(){return E(this.usuarios.perfil())}salvar(e){this.usuarios.limpar(),localStorage.setItem(n,e),this.tokenAtual.set(e)}limpar(){localStorage.removeItem(n),this.tokenAtual.set(null),this.usuarios.limpar()}static ɵfac=function(r){return new(r||t)};static ɵprov=R({token:t,factory:t.ɵfac,providedIn:`root`})};function f$1(t){if(!t)return null;try{let e=t.split(`.`)[1].replace(/-/g,`+`).replace(/_/g,`/`),r=decodeURIComponent(atob(e).split(``).map(v=>`%`+v.charCodeAt(0).toString(16).padStart(2,`0`)).join(``));return JSON.parse(r)}catch{return null}}var f=class s{pequeno=Jv(!1);fundoClaro=Jv(!1);cor(){return this.fundoClaro()?`#3B1478`:`#FFFFFF`}static ɵfac=function(r){return new(r||s)};static ɵcmp=Le$2({type:s,selectors:[[`app-logo`]],inputs:{pequeno:[1,`pequeno`],fundoClaro:[1,`fundoClaro`]},decls:14,vars:9,consts:[[1,`logo`],[`viewBox`,`0 0 120 120`,`aria-hidden`,`true`],[`cx`,`60`,`cy`,`60`,`r`,`40`,`fill`,`none`,`stroke-width`,`16`,`stroke-dasharray`,`76.8 174.5`,`transform`,`rotate(45 60 60)`],[`cx`,`60`,`cy`,`60`,`r`,`40`,`fill`,`none`,`stroke-opacity`,`0.72`,`stroke-width`,`16`,`stroke-dasharray`,`60 191.3`,`transform`,`rotate(163 60 60)`],[`cx`,`60`,`cy`,`60`,`r`,`40`,`fill`,`none`,`stroke-opacity`,`0.45`,`stroke-width`,`16`,`stroke-dasharray`,`40.5 210.8`,`transform`,`rotate(257 60 60)`],[`x`,`64`,`y`,`68`,`width`,`9`,`height`,`10`,`rx`,`1.5`,`fill`,`#FACC15`],[`x`,`77`,`y`,`60`,`width`,`9`,`height`,`18`,`rx`,`1.5`,`fill`,`#FACC15`],[`x`,`90`,`y`,`52`,`width`,`9`,`height`,`26`,`rx`,`1.5`,`fill`,`#FACC15`],[`points`,`58,58 74,51 87,42 100.3,26.2`,`fill`,`none`,`stroke-width`,`5`,`stroke-linecap`,`round`,`stroke-linejoin`,`round`],[`points`,`106,18 105.2,29.6 95.4,22.8`],[1,`nome`]],template:function(r,e){r&1&&(pn$1(0,`span`,0),fh(),pn$1(1,`svg`,1),mn$1(2,`circle`,2)(3,`circle`,3)(4,`circle`,4)(5,`rect`,5)(6,`rect`,6)(7,`rect`,7)(8,`polyline`,8)(9,`polygon`,9),hn$1(),ph(),pn$1(10,`span`,10),vC(11,`Fin`),pn$1(12,`strong`),vC(13,`Control`),hn$1()()()),r&2&&(bt$1(`pequeno`,e.pequeno())(`claro`,e.fundoClaro()),oi(2),rr(`stroke`,e.cor()),oi(),rr(`stroke`,e.cor()),oi(),rr(`stroke`,e.cor()),oi(4),rr(`stroke`,e.cor()),oi(),rr(`fill`,e.cor()))},styles:[`.logo[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:10px;color:#fff;font-size:28px;letter-spacing:-.01em;line-height:1}.logo.claro[_ngcontent-%COMP%]{color:#3b1478}svg[_ngcontent-%COMP%]{width:1.45em;height:1.45em}.nome[_ngcontent-%COMP%]{font-weight:400}.nome[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{font-weight:600;color:#facc15}.claro[_ngcontent-%COMP%]   .nome[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:inherit}.pequeno[_ngcontent-%COMP%]{font-size:18px;gap:8px}`]})};var o={DASHBOARD:{rotulo:`Dashboard`,descricao:`Resumo do mês, saldo e gráficos`,icone:`home`,disponivel:!0},CONTAS:{rotulo:`Contas financeiras`,descricao:`Bancos, carteiras e saldos`,icone:`account_balance`,disponivel:!0},RECEITAS:{rotulo:`Receitas`,descricao:`Registrar entradas de dinheiro`,icone:`arrow_downward`,disponivel:!0},DESPESAS:{rotulo:`Despesas`,descricao:`Registrar saídas de dinheiro`,icone:`arrow_upward`,disponivel:!0},LANCAMENTOS:{rotulo:`Lançamentos`,descricao:`Receitas e despesas juntas`,icone:`swap_vert`,disponivel:!0},RECORRENTES:{rotulo:`Lançamentos recorrentes`,descricao:`Contas que se repetem todo mês`,icone:`event_repeat`,disponivel:!1},CARTOES:{rotulo:`Cartões de crédito`,descricao:`Faturas e limites dos cartões`,icone:`credit_card`,disponivel:!1},CATEGORIAS:{rotulo:`Categorias`,descricao:`Organizar os lançamentos`,icone:`sell`,disponivel:!0},TAGS:{rotulo:`Tags`,descricao:`Etiquetas livres nos lançamentos`,icone:`label`,disponivel:!1},ORCAMENTOS:{rotulo:`Orçamentos`,descricao:`Metas de gasto por categoria`,icone:`savings`,disponivel:!1},RELATORIOS:{rotulo:`Relatórios`,descricao:`Análises por período`,icone:`bar_chart`,disponivel:!1},IMPORTACAO:{rotulo:`Importação`,descricao:`Trazer extratos e planilhas`,icone:`upload_file`,disponivel:!1},EXPORTACAO:{rotulo:`Exportação`,descricao:`Baixar dados em planilha`,icone:`download`,disponivel:!1}};var e={SUPER_ADMIN:`Administrador do FinControl`,PESSOAL:`Conta pessoal`};var s=[`Janeiro`,`Fevereiro`,`Março`,`Abril`,`Maio`,`Junho`,`Julho`,`Agosto`,`Setembro`,`Outubro`,`Novembro`,`Dezembro`];function i$1(n,e=0){let t=new Date(n.getFullYear(),n.getMonth()+e,1);return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}`}var l=class n{inicio=Ot$1(new Date(new Date().getFullYear(),new Date().getMonth(),1));mesesAnteriores=Ot$1(null);data=this.inicio.asReadonly();chave=VC(()=>i$1(this.inicio()));nome=VC(()=>s[this.inicio().getMonth()]);rotulo=VC(()=>`${this.nome()} ${this.inicio().getFullYear()}`);ehAtual=VC(()=>this.chave()===i$1(new Date));podeVoltar=VC(()=>{let e=this.mesesAnteriores();return e===null||this.chave()>i$1(new Date,-e)});podeAvancar=VC(()=>this.mesesAnteriores()===null||!this.ehAtual());mover(e){let t=this.inicio();this.inicio.set(new Date(t.getFullYear(),t.getMonth()+e,1))}irParaAtual(){this.inicio.set(new Date(new Date().getFullYear(),new Date().getMonth(),1))}static ɵfac=function(t){return new(t||n)};static ɵprov=R({token:n,factory:n.ɵfac,providedIn:`root`})};var w=n=>({exact:n});var se=()=>({});var pe=(n,t)=>t.titulo;var N=(n,t)=>t.rota;var le=(n,t)=>t.rotulo;function de(n,t){if(n&1){let e=jS();va(0,`div`,7)(1,`button`,31),dv(`click`,function(){Jp(e);return eh(zS().mes.mover(-1))}),va(2,`mat-icon`),vC(3,`chevron_left`),Cd()(),va(4,`span`,32),vC(5),Cd(),va(6,`button`,33),dv(`click`,function(){Jp(e);return eh(zS().mes.mover(1))}),va(7,`mat-icon`),vC(8,`chevron_right`),Cd()()()}if(n&2){let e=zS();oi(),iv(`disabled`,!e.mes.podeVoltar()),oi(4),Tv(e.mes.rotulo()),oi(),iv(`disabled`,!e.mes.podeAvancar())}}function ue(n,t){if(n&1&&(va(0,`span`,8),vC(1),Cd()),n&2){let e=zS();oi(),Tv(e.titulo())}}function me(n,t){if(n&1&&(va(0,`button`,10)(1,`mat-icon`),vC(2,`add`),Cd()()),n&2){zS();iv(`matMenuTriggerFor`,KS(37))}}function fe(n,t){n&1&&sv(0,`span`,34)}function _e(n,t){if(n&1&&(va(0,`span`,35),vC(1),Cd()),n&2){let e=zS().$implicit;oi(),Tv(e.titulo)}}function ge(n,t){if(n&1&&(va(0,`a`,36)(1,`mat-icon`),vC(2),Cd(),va(3,`span`,16),vC(4),Cd()()),n&2){let e=t.$implicit,a=zS(2);iv(`routerLink`,e.rota)(`routerLinkActiveOptions`,NC(6,w,!!e.exato))(`matTooltip`,e.rotulo)(`matTooltipDisabled`,a.menuAberto()),oi(2),Tv(e.icone),oi(2),Tv(e.rotulo)}}function xe(n,t){n&1&&sv(0,`span`,34)}function he(n,t){n&1&&(va(0,`span`,35),vC(1,`Indisponíveis`),Cd())}function be(n,t){if(n&1&&(va(0,`span`,38)(1,`mat-icon`),vC(2),Cd(),va(3,`span`,16),vC(4),va(5,`em`),vC(6),Cd()()()),n&2){let e=t.$implicit;oi(2),Tv(e.icone),oi(2),Tv(e.rotulo),oi(2),Tv(e.motivo)}}function ve(n,t){if(n&1&&AS(0,be,7,3,`span`,38,le),n&2)RS(zS(3).inativos())}function Me(n,t){if(n&1&&(va(0,`span`,37)(1,`mat-icon`),vC(2,`more_horiz`),Cd()()),n&2)iv(`matTooltip`,zS(3).inativos().length+` funcionalidades em breve · clique para ver`)}function Ce(n,t){if(n&1&&(ui$1(0,xe,1,0,`span`,34)(1,he,2,0,`span`,35),ui$1(2,ve,2,0)(3,Me,3,1,`span`,37)),n&2){let e=zS(2);li$1(e.menuAberto()?1:0),oi(2),li$1(e.menuAberto()?2:3)}}function ye(n,t){if(n&1&&(ui$1(0,fe,1,0,`span`,34)(1,_e,2,1,`span`,35),AS(2,ge,5,8,`a`,36,N),ui$1(4,Ce,4,2)),n&2){let e=t.$implicit,a=t.$index,p=t.$count,u=zS();li$1(a===p-1&&!u.menuAberto()?0:u.menuAberto()?1:-1),oi(2),RS(e.itens),oi(2),li$1(a===0&&u.inativos().length?4:-1)}}function Se(n,t){if(n&1&&(va(0,`a`,20)(1,`mat-icon`),vC(2),Cd()()),n&2){let e=t.$implicit;iv(`routerLink`,e.rota)(`routerLinkActiveOptions`,NC(4,w,!!e.exato)),rr(`aria-label`,e.rotulo),oi(2),Tv(e.icone)}}function Pe(n,t){if(n&1&&(va(0,`button`,21)(1,`mat-icon`),vC(2,`add`),Cd()()),n&2){zS();iv(`matMenuTriggerFor`,KS(37))}}function Oe(n,t){if(n&1&&(va(0,`a`,20)(1,`mat-icon`),vC(2),Cd()()),n&2){let e=t.$implicit;iv(`routerLink`,e.rota)(`routerLinkActiveOptions`,NC(4,w,!!e.exato)),rr(`aria-label`,e.rotulo),oi(2),Tv(e.icone)}}function ke(n,t){if(n&1&&(va(0,`a`,24)(1,`mat-icon`),vC(2),Cd(),vC(3),Cd()),n&2){let e=t.$implicit;iv(`routerLink`,e.rota)(`queryParams`,e.queryParams??TC(4,se)),oi(2),Tv(e.icone),oi(),xd(``,e.rotulo,` `)}}function Ee(n,t){if(n&1&&(va(0,`span`),vC(1),Cd()),n&2){let e=zS();oi(),Tv(e.rotulosRole[t.role])}}var re=class n{auth=h(d);mes=h(l);usuarioService=h(n$1);router=h(ce);destroyRef=h(De$1);menuAberto=Ot$1(!1);titulo=Ot$1(``);comMes=Ot$1(!1);perfil=this.usuarioService.perfil;rotulosRole=e;nome=VC(()=>this.perfil()?.nome||this.auth.email());iniciais=VC(()=>Te(this.nome()));secoes=VC(()=>{let t$1=this.perfil();if(!t$1)return[];if(t$1.role===`SUPER_ADMIN`)return Ae();let e=[];r(t$1,`DASHBOARD`)&&e.push({rota:`/dashboard`,icone:`grid_view`,rotulo:`Visão geral`}),r(t$1,...t)&&(e.push({rota:`/transacoes`,icone:`swap_vert`,rotulo:`Lançamentos`}),e.push({rota:`/a-pagar`,icone:`event_upcoming`,rotulo:`Contas a pagar`})),r(t$1,`CONTAS`)&&e.push({rota:`/contas`,icone:`account_balance`,rotulo:`Contas`}),r(t$1,`CATEGORIAS`)&&e.push({rota:`/categorias`,icone:`sell`,rotulo:`Categorias`});let a=[{titulo:`Minhas finanças`,itens:e}];return a.push({titulo:`Conta`,itens:[{rota:`/perfil`,icone:`person_outline`,rotulo:`Meu perfil`},{rota:`/configuracoes`,icone:`tune`,rotulo:`Funcionalidades`}]}),a.filter(u=>u.itens.length)});inativos=VC(()=>Ne(this.perfil()));atalhos=VC(()=>{let t=this.secoes().flatMap(a=>a.itens),e=t.filter(a=>a.rota!==`/perfil`&&a.rota!==`/configuracoes`).slice(0,4);for(let a of t){if(e.length>=4)break;e.includes(a)||e.push(a)}return{esquerda:e.slice(0,2),direita:e.slice(2,4)}});acoesRapidas=VC(()=>{let t=this.perfil();if(!t)return[];if(t.role===`SUPER_ADMIN`)return[{rota:`/admin/usuarios/novo`,icone:`person_add`,rotulo:`Novo usuário`},{rota:`/admin/categorias`,icone:`sell`,rotulo:`Categoria padrão`},{rota:`/admin/usuarios/novo`,icone:`admin_panel_settings`,rotulo:`Novo administrador`,queryParams:{perfil:`SUPER_ADMIN`}}];let e=[],a=i$2(t);return a.includes(`RECEITA`)&&e.push({rota:`/transacoes/nova`,icone:`add_circle_outline`,rotulo:`Receita`,queryParams:{tipo:`RECEITA`}}),a.includes(`DESPESA`)&&e.push({rota:`/transacoes/nova`,icone:`remove_circle_outline`,rotulo:`Despesa`,queryParams:{tipo:`DESPESA`}}),r(t,`CATEGORIAS`)&&e.push({rota:`/categorias/nova`,icone:`sell`,rotulo:`Categoria`}),e});ngOnInit(){this.usuarioService.carregarPerfil().subscribe({error:()=>{}}),this.atualizarRota(),this.router.events.pipe(at$3(t=>t instanceof z$1),U(this.destroyRef)).subscribe(()=>{this.menuAberto.set(!1),this.atualizarRota()})}sair(){this.auth.logout()}aoClicarNoTrilho(t){t.target.closest(`a, .sair`)||this.menuAberto.set(!this.menuAberto())}atualizarRota(){let t=this.router.routerState.snapshot.root;for(;t.firstChild;)t=t.firstChild;this.titulo.set(String(t.title??``).split(` · `)[0]),this.comMes.set(!!t.data.mes)}static ɵfac=function(e){return new(e||n)};static ɵcmp=Le$2({type:n,selectors:[[`app-shell`]],decls:73,vars:22,consts:[[`menuMais`,`matMenu`],[`menuAvisos`,`matMenu`],[`menuConta`,`matMenu`],[1,`topo`],[`aria-label`,`Início`,1,`marca`,3,`routerLink`],[3,`pequeno`],[1,`centro`],[`role`,`group`,`aria-label`,`Mês exibido`,1,`seletor-mes`],[1,`titulo-celular`],[1,`acoes`],[`type`,`button`,`aria-label`,`Adicionar`,1,`btn-redondo`,`amarelo`,`so-computador`,3,`matMenuTriggerFor`],[`type`,`button`,`aria-label`,`Notificações`,1,`btn-redondo`,`translucido`,`so-computador`,3,`matMenuTriggerFor`],[`type`,`button`,`aria-label`,`Minha conta`,1,`avatar`,3,`matMenuTriggerFor`],[1,`fundo-menu`,3,`click`],[`aria-label`,`Menu principal`,1,`trilho`,3,`click`],[`type`,`button`,1,`expandir`],[1,`rotulo`],[`type`,`button`,`matTooltip`,`Sair`,`matTooltipPosition`,`right`,1,`item`,`sair`,3,`click`,`matTooltipDisabled`],[1,`pagina`],[`aria-label`,`Atalhos`,1,`barra-inferior`],[`routerLinkActive`,`ativo`,1,`atalho`,3,`routerLink`,`routerLinkActiveOptions`],[`type`,`button`,`aria-label`,`Adicionar`,1,`mais`,3,`matMenuTriggerFor`],[1,`menu-fc`],[1,`menu-titulo`],[`mat-menu-item`,``,3,`routerLink`,`queryParams`],[1,`menu-vazio`],[1,`menu-info`],[`mat-menu-item`,``,`routerLink`,`/perfil`],[`mat-menu-item`,``,`type`,`button`,1,`so-celular`,3,`click`],[`mat-menu-item`,``,`type`,`button`,1,`so-celular`,3,`matMenuTriggerFor`],[`mat-menu-item`,``,`type`,`button`,1,`menu-sair`,3,`click`],[`type`,`button`,`aria-label`,`Mês anterior`,3,`click`,`disabled`],[`aria-live`,`polite`],[`type`,`button`,`aria-label`,`Próximo mês`,3,`click`,`disabled`],[1,`separador`],[1,`secao`],[`routerLinkActive`,`ativo`,`matTooltipPosition`,`right`,1,`item`,3,`routerLink`,`routerLinkActiveOptions`,`matTooltip`,`matTooltipDisabled`],[`matTooltipPosition`,`right`,1,`item`,`inativo`,3,`matTooltip`],[1,`item`,`inativo`]],template:function(e,a){if(e&1&&(va(0,`header`,3)(1,`a`,4),sv(2,`app-logo`,5),Cd(),va(3,`div`,6),ui$1(4,de,9,3,`div`,7)(5,ue,2,1,`span`,8),Cd(),va(6,`div`,9),ui$1(7,me,3,1,`button`,10),va(8,`button`,11)(9,`mat-icon`),vC(10,`notifications_none`),Cd()(),va(11,`button`,12),vC(12),Cd()()(),va(13,`div`,13),dv(`click`,function(){return a.menuAberto.set(!1)}),Cd(),va(14,`aside`,14),dv(`click`,function(u){return a.aoClicarNoTrilho(u)}),va(15,`button`,15)(16,`mat-icon`),vC(17),Cd(),va(18,`span`,16),vC(19,`Recolher`),Cd()(),va(20,`nav`),AS(21,ye,5,2,null,null,pe),Cd(),va(23,`button`,17),dv(`click`,function(){return a.sair()}),va(24,`mat-icon`),vC(25,`logout`),Cd(),va(26,`span`,16),vC(27,`Sair`),Cd()()(),va(28,`main`,18),sv(29,`router-outlet`),Cd(),va(30,`nav`,19),AS(31,Se,3,6,`a`,20,N),ui$1(33,Pe,3,1,`button`,21),AS(34,Oe,3,6,`a`,20,N),Cd(),va(36,`mat-menu`,22,0)(38,`span`,23),vC(39,`Adicionar`),Cd(),AS(40,ke,4,5,`a`,24,le),Cd(),va(42,`mat-menu`,22,1)(44,`div`,25)(45,`mat-icon`),vC(46,`notifications_none`),Cd(),va(47,`span`),vC(48,`Nenhuma notificação por enquanto.`),Cd()()(),va(49,`mat-menu`,22,2)(51,`div`,26)(52,`strong`),vC(53),Cd(),va(54,`span`),vC(55),Cd(),ui$1(56,Ee,2,1,`span`),Cd(),va(57,`a`,27)(58,`mat-icon`),vC(59,`person_outline`),Cd(),vC(60,`Meu perfil`),Cd(),va(61,`button`,28),dv(`click`,function(){return a.menuAberto.set(!0)}),va(62,`mat-icon`),vC(63,`menu`),Cd(),vC(64,`Todas as telas `),Cd(),va(65,`button`,29)(66,`mat-icon`),vC(67,`notifications_none`),Cd(),vC(68,`Notificações `),Cd(),va(69,`button`,30),dv(`click`,function(){return a.sair()}),va(70,`mat-icon`),vC(71,`logout`),Cd(),vC(72,`Sair`),Cd()()),e&2){let p,u=KS(43),ce=KS(50);oi(),iv(`routerLink`,a.auth.rotaInicial()),oi(),iv(`pequeno`,!0),oi(2),li$1(a.comMes()?4:5),oi(3),li$1(a.acoesRapidas().length?7:-1),oi(),iv(`matMenuTriggerFor`,u),oi(3),bt$1(`admin`,a.perfil()?.role===`SUPER_ADMIN`),iv(`matMenuTriggerFor`,ce),oi(),xd(` `,a.iniciais(),` `),oi(),bt$1(`visivel`,a.menuAberto()),oi(),bt$1(`aberto`,a.menuAberto()),oi(),rr(`aria-expanded`,a.menuAberto())(`aria-label`,a.menuAberto()?`Recolher menu`:`Expandir menu`),oi(2),Tv(a.menuAberto()?`chevron_left`:`chevron_right`),oi(4),RS(a.secoes()),oi(2),iv(`matTooltipDisabled`,a.menuAberto()),oi(8),RS(a.atalhos().esquerda),oi(2),li$1(a.acoesRapidas().length?33:-1),oi(),RS(a.atalhos().direita),oi(6),RS(a.acoesRapidas()),oi(13),Tv(a.nome()),oi(2),Tv(a.auth.email()),oi(),li$1((p=a.perfil())?56:-1,p),oi(9),iv(`matMenuTriggerFor`,u)}},dependencies:[ur,Nt$1,wo,JG,XG,OG,Lt,I,G,Bt,Yt$2,mt$1,f],styles:[`[_nghost-%COMP%]{display:block;min-height:100vh;background:var(--%NS%fc-bg);--%NS%topo: 64px;--%NS%trilho: 64px}.topo[_ngcontent-%COMP%]{position:fixed;inset:0 0 auto;z-index:40;height:var(--%NS%topo);display:flex;align-items:center;gap:12px;padding:0 20px 0 16px;background:var(--%NS%fc-roxo);color:#fff}.marca[_ngcontent-%COMP%]{display:inline-flex;text-decoration:none;margin-left:4px}.centro[_ngcontent-%COMP%]{flex:1;display:flex;justify-content:flex-end;min-width:0}.acoes[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}.btn-redondo[_ngcontent-%COMP%]{width:40px;height:40px;border-radius:50%;border:none;display:grid;place-items:center;background:none;color:#fff;cursor:pointer;flex-shrink:0;transition:background .15s,transform .15s}.btn-redondo[_ngcontent-%COMP%]:hover{background:#ffffff1a}.btn-redondo.amarelo[_ngcontent-%COMP%]{background:var(--%NS%fc-amarelo);color:var(--%NS%fc-roxo-escuro)}.btn-redondo.amarelo[_ngcontent-%COMP%]:hover{transform:scale(1.05)}.btn-redondo.translucido[_ngcontent-%COMP%]{background:#ffffff1a}.btn-redondo.translucido[_ngcontent-%COMP%]:hover{background:#ffffff2e}.seletor-mes[_ngcontent-%COMP%]{display:flex;align-items:center;gap:4px;height:40px;padding:0 4px;border-radius:20px;background:#ffffff1a}.seletor-mes[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{min-width:132px;text-align:center;font-size:15px;white-space:nowrap}.seletor-mes[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:32px;height:32px;border:none;border-radius:50%;background:none;color:#fff;display:grid;place-items:center;cursor:pointer}.seletor-mes[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover:not(:disabled){background:#ffffff1f}.seletor-mes[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{opacity:.3;cursor:default}.titulo-celular[_ngcontent-%COMP%]{display:none}.avatar[_ngcontent-%COMP%]{width:40px;height:40px;border-radius:50%;border:none;background:#fff;color:var(--%NS%fc-roxo);font:inherit;font-size:14px;font-weight:600;display:grid;place-items:center;cursor:pointer;flex-shrink:0}.avatar.admin[_ngcontent-%COMP%]{background:var(--%NS%fc-amarelo);color:var(--%NS%fc-roxo-escuro)}.trilho[_ngcontent-%COMP%]{position:fixed;top:var(--%NS%topo);bottom:0;left:0;z-index:35;width:var(--%NS%trilho);display:flex;flex-direction:column;padding:8px 10px 12px;background:var(--%NS%fc-roxo);overflow-x:hidden;overflow-y:auto;scrollbar-width:none;cursor:pointer;transition:width .2s ease,box-shadow .2s ease}.trilho[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}.expandir[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:14px;height:28px;margin-bottom:6px;border:none;border-radius:8px;background:none;color:#ffffff8c;font:inherit;font-size:13px;cursor:pointer}.expandir[_ngcontent-%COMP%]:hover{color:#fff;background:#ffffff14}.trilho.aberto[_ngcontent-%COMP%]   .expandir[_ngcontent-%COMP%]{justify-content:flex-start;padding:0 10px}.trilho.aberto[_ngcontent-%COMP%]{width:260px;box-shadow:8px 0 32px #14062d4d}.trilho[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:4px}.separador[_ngcontent-%COMP%]{height:1px;margin:10px 8px;background:#ffffff29}.secao[_ngcontent-%COMP%]{margin:14px 10px 4px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#ffffff80;white-space:nowrap}.item[_ngcontent-%COMP%]{position:relative;display:flex;align-items:center;justify-content:center;gap:14px;flex-shrink:0;height:44px;padding:0 10px;border:none;border-radius:12px;background:none;color:#ffffffc7;font:inherit;font-size:14px;text-decoration:none;white-space:nowrap;cursor:pointer;transition:background .15s,color .15s}.item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{flex-shrink:0;font-size:22px;width:22px;height:22px}.item[_ngcontent-%COMP%]:hover{background:#ffffff14;color:#fff}.item.ativo[_ngcontent-%COMP%]{background:#ffffff1f;color:var(--%NS%fc-amarelo)}.rotulo[_ngcontent-%COMP%]{display:none}.trilho.aberto[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{justify-content:flex-start}.trilho.aberto[_ngcontent-%COMP%]   .rotulo[_ngcontent-%COMP%]{display:flex;flex-direction:column}.item[_ngcontent-%COMP%]   .rotulo[_ngcontent-%COMP%]   em[_ngcontent-%COMP%]{font-style:normal;font-size:11px;color:#ffffff80}.item.inativo[_ngcontent-%COMP%]{color:#fff6;cursor:default}.item.inativo[_ngcontent-%COMP%]:hover{background:none;color:#fff6}.sair[_ngcontent-%COMP%]{margin-top:auto}.fundo-menu[_ngcontent-%COMP%]{display:none}.fundo-menu.visivel[_ngcontent-%COMP%]{display:block;position:fixed;inset:var(--%NS%topo) 0 0 0;z-index:34;background:#14062d4d}.pagina[_ngcontent-%COMP%]{margin-left:var(--%NS%trilho);padding:calc(var(--%NS%topo) + 28px) 32px 48px;max-width:1480px}.barra-inferior[_ngcontent-%COMP%]{display:none}@media(max-width:760px){[_nghost-%COMP%]{--%NS%topo: 64px}.topo[_ngcontent-%COMP%]{padding:0 16px}.marca[_ngcontent-%COMP%]   app-logo[_ngcontent-%COMP%]     .nome{display:none}.marca[_ngcontent-%COMP%]{margin:0}.centro[_ngcontent-%COMP%]{justify-content:center}.seletor-mes[_ngcontent-%COMP%]{background:none}.seletor-mes[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{min-width:0;font-size:17px}.titulo-celular[_ngcontent-%COMP%]{display:block;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.so-computador[_ngcontent-%COMP%]{display:none}.trilho[_ngcontent-%COMP%]{width:260px;transform:translate(-100%);transition:transform .2s ease}.trilho.aberto[_ngcontent-%COMP%]{transform:none}.trilho[_ngcontent-%COMP%]   .item[_ngcontent-%COMP%]{justify-content:flex-start}.trilho[_ngcontent-%COMP%]   .rotulo[_ngcontent-%COMP%]{display:flex;flex-direction:column}.expandir[_ngcontent-%COMP%]{display:none}.pagina[_ngcontent-%COMP%]{margin-left:0;padding:calc(var(--%NS%topo) + 20px) 16px 112px}.barra-inferior[_ngcontent-%COMP%]{position:fixed;inset:auto 0 0;z-index:30;height:76px;display:flex;align-items:center;justify-content:space-around;padding:0 8px env(safe-area-inset-bottom);background:var(--%NS%fc-surface);border-radius:24px 24px 0 0;box-shadow:0 -4px 24px #14062d14}.atalho[_ngcontent-%COMP%]{position:relative;width:52px;height:52px;display:grid;place-items:center;color:#8a8f98;text-decoration:none}.atalho[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:28px;width:28px;height:28px}.atalho.ativo[_ngcontent-%COMP%]{color:var(--%NS%fc-roxo)}.atalho.ativo[_ngcontent-%COMP%]:after{content:"";position:absolute;bottom:4px;width:6px;height:6px;border-radius:50%;background:var(--%NS%fc-amarelo)}.mais[_ngcontent-%COMP%]{width:60px;height:60px;margin-top:-18px;border:none;border-radius:50%;background:var(--%NS%fc-roxo);color:var(--%NS%fc-amarelo);display:grid;place-items:center;box-shadow:0 8px 20px -6px #3b147899;cursor:pointer}.mais[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:34px;width:34px;height:34px}}`]})};function Te(n){return n.split(/[\s@.]+/).filter(Boolean).slice(0,2).map(t=>t[0].toUpperCase()).join(``)}function Ae(){return[{titulo:`Gestão do sistema`,itens:[{rota:`/admin/painel`,icone:`grid_view`,rotulo:`Visão geral`},{rota:`/admin/usuarios`,icone:`group`,rotulo:`Usuários`},{rota:`/admin/transacoes`,icone:`swap_vert`,rotulo:`Transações`}]},{titulo:`Configuração`,itens:[{rota:`/admin/categorias`,icone:`sell`,rotulo:`Categorias padrão`},{rota:`/admin/auditoria`,icone:`verified_user`,rotulo:`Auditoria`}]},{titulo:`Conta`,itens:[{rota:`/perfil`,icone:`person_outline`,rotulo:`Meu perfil`}]}]}function Ne(n){return!n||n.role===`SUPER_ADMIN`?[]:n.modulos.filter(t=>!o[t].disponivel).map(t=>({icone:o[t].icone,rotulo:o[t].rotulo,motivo:`Em breve`}))}function J(t){let o=Math.floor(Math.abs(t)),e=t.toString().replace(/^[^.]*\.?/,``).length,a=parseInt(t.toString().replace(/^[^e]*(e([-+]?\d+))?/,`$2`))||0;return o===Math.floor(o)&&o>=0&&o<=1?1:a===0&&o!==0&&o%1e6===0&&e===0||!(a>=0&&a<=5)?4:5}var y=[`pt`,[[`AM`,`PM`]],void 0,[[`D`,`S`,`T`,`Q`,`Q`,`S`,`S`],[`dom.`,`seg.`,`ter.`,`qua.`,`qui.`,`sex.`,`sáb.`],[`domingo`,`segunda-feira`,`terça-feira`,`quarta-feira`,`quinta-feira`,`sexta-feira`,`sábado`],[`dom.`,`seg.`,`ter.`,`qua.`,`qui.`,`sex.`,`sáb.`]],void 0,[[`J`,`F`,`M`,`A`,`M`,`J`,`J`,`A`,`S`,`O`,`N`,`D`],[`jan.`,`fev.`,`mar.`,`abr.`,`mai.`,`jun.`,`jul.`,`ago.`,`set.`,`out.`,`nov.`,`dez.`],[`janeiro`,`fevereiro`,`março`,`abril`,`maio`,`junho`,`julho`,`agosto`,`setembro`,`outubro`,`novembro`,`dezembro`]],void 0,[[`a.C.`,`d.C.`],void 0,[`antes de Cristo`,`depois de Cristo`]],0,[6,0],[`dd/MM/y`,`d 'de' MMM 'de' y`,`d 'de' MMMM 'de' y`,`EEEE, d 'de' MMMM 'de' y`],[`HH:mm`,`HH:mm:ss`,`HH:mm:ss z`,`HH:mm:ss zzzz`],[`{1} {0}`,void 0,void 0,void 0],[`,`,`.`,`;`,`%`,`+`,`-`,`E`,`×`,`‰`,`∞`,`NaN`,`:`],[`#,##0.###`,`#,##0%`,`¤\xA0#,##0.00`,`#E0`],`BRL`,`R$`,`Real brasileiro`,{AUD:[`AU$`,`$`],BYN:[void 0,`р.`],JPY:[`JP¥`,`¥`],PHP:[void 0,`₱`],PTE:[`Esc.`],RON:[void 0,`L`],SYP:[void 0,`S£`],THB:[`฿`],TWD:[`NT$`],USD:[`US$`,`$`]},`ltr`,J];function c(t){let r=h(ce);return h(n$1).garantirPerfil().pipe(K$2(o=>t(o,r)),ho(()=>We$1(r.createUrlTree([`/login`]))))}var A=(t,r)=>{let o=h(d),e=h(ce);return o.isLoggedIn()?c((a,p)=>a.trocarSenha?p.createUrlTree([`/trocar-senha`]):!0):e.createUrlTree([`/login`],{queryParams:{voltar:r.url}})};var j=()=>h(d).isLoggedIn()?c((t,r)=>t.trocarSenha?!0:r.createUrlTree([E(t)])):h(ce).createUrlTree([`/login`]);function i(...t){return()=>c((r$1,o)=>r(r$1,...t)?!0:o.createUrlTree([E(r$1)]))}function v(...t){return()=>c((r,o)=>t.includes(r.role)?!0:o.createUrlTree([E(r)]))}var F=()=>h(d).isLoggedIn()?c((t,r)=>r.createUrlTree([E(t)])):!0;var B=[{path:``,pathMatch:`full`,loadComponent:()=>import(`./chunk-BCLy1Fi42.js`).then(t=>t.Landing),title:`FinControl · Controle das suas finanças pessoais`},{path:`login`,loadComponent:()=>import(`./chunk-Dsz5uSBh.js`).then(t=>t.Login),title:`Entrar · FinControl`,canActivate:[F]},{path:`cadastro`,loadComponent:()=>import(`./chunk-B4NExq93.js`).then(t=>t.Register),title:`Criar conta · FinControl`,canActivate:[F]},{path:`trocar-senha`,loadComponent:()=>import(`./chunk-PljyQLg32.js`).then(t=>t.TrocarSenha),title:`Crie a sua senha · FinControl`,canActivate:[j]},{path:`bem-vindo`,loadComponent:()=>import(`./chunk-KYznUbRR.js`).then(t=>t.ConfiguracaoInicial),title:`Configuração inicial · FinControl`,canActivate:[A]},{path:``,component:re,canActivate:[A],children:[{path:`dashboard`,loadComponent:()=>import(`./chunk-bQNpxiCB.js`).then(t=>t.Dashboard),title:`Visão geral · FinControl`,canActivate:[i(`DASHBOARD`)],data:{mes:!0}},{path:`transacoes`,loadComponent:()=>import(`./chunk-CGUQFZMg2.js`).then(t=>t.TransacaoList),title:`Lançamentos · FinControl`,canActivate:[i(...t)]},{path:`transacoes/nova`,loadComponent:()=>import(`./chunk-B9588I-v.js`).then(t=>t.TransacaoForm),title:`Novo lançamento · FinControl`,canActivate:[i(...t)]},{path:`transacoes/:id`,loadComponent:()=>import(`./chunk-B9588I-v.js`).then(t=>t.TransacaoForm),title:`Editar lançamento · FinControl`,canActivate:[i(...t)]},{path:`a-pagar`,loadComponent:()=>import(`./chunk-QhbqXQ8_.js`).then(t=>t.APagar),title:`Contas a pagar · FinControl`,canActivate:[i(...t)]},{path:`contas`,loadComponent:()=>import(`./chunk-BXemsg_F2.js`).then(t=>t.ContaList),title:`Contas · FinControl`,canActivate:[i(`CONTAS`)],data:{mes:!0}},{path:`categorias`,loadComponent:()=>import(`./chunk-jgY_EDj62.js`).then(t=>t.CategoriaList),title:`Categorias · FinControl`,canActivate:[i(`CATEGORIAS`)]},{path:`categorias/nova`,loadComponent:()=>import(`./chunk-D8Li7tKb2.js`).then(t=>t.CategoriaForm),title:`Nova categoria · FinControl`,canActivate:[i(`CATEGORIAS`)]},{path:`categorias/:id`,loadComponent:()=>import(`./chunk-D8Li7tKb2.js`).then(t=>t.CategoriaForm),title:`Editar categoria · FinControl`,canActivate:[i(`CATEGORIAS`)]},{path:`perfil`,loadComponent:()=>import(`./chunk-BYOShVUI2.js`).then(t=>t.Perfil),title:`Meu perfil · FinControl`},{path:`configuracoes`,loadComponent:()=>import(`./chunk-BtlX6w6e2.js`).then(t=>t.Configuracoes),title:`Funcionalidades · FinControl`,canActivate:[v(`PESSOAL`)]},{path:`admin`,canActivate:[v(`SUPER_ADMIN`)],children:[{path:``,pathMatch:`full`,redirectTo:`painel`},{path:`painel`,loadComponent:()=>import(`./chunk-D2OgVOsd2.js`).then(t=>t.AdminPainel),title:`Visão geral do sistema · FinControl`,data:{mes:!0}},{path:`usuarios`,loadComponent:()=>import(`./chunk-BvWIokf5.js`).then(t=>t.AdminUsuarioList),title:`Usuários · FinControl`},{path:`usuarios/novo`,loadComponent:()=>import(`./chunk-CVXCezqA.js`).then(t=>t.AdminUsuarioForm),title:`Novo usuário · FinControl`},{path:`usuarios/:id/ficha`,loadComponent:()=>import(`./chunk-BdE9GUpo.js`).then(t=>t.AdminUsuarioFicha),title:`Ficha do usuário · FinControl`},{path:`usuarios/:id`,loadComponent:()=>import(`./chunk-CVXCezqA.js`).then(t=>t.AdminUsuarioForm),title:`Editar usuário · FinControl`},{path:`transacoes`,loadComponent:()=>import(`./chunk-G0lKufl02.js`).then(t=>t.AdminTransacoes),title:`Transações do sistema · FinControl`},{path:`categorias`,loadComponent:()=>import(`./chunk-CmgpGTJR.js`).then(t=>t.AdminCategorias),title:`Categorias · FinControl`},{path:`auditoria`,loadComponent:()=>import(`./chunk-9y_kYliV2.js`).then(t=>t.AdminAuditoria),title:`Auditoria · FinControl`}]}]},{path:`**`,redirectTo:``}];var z=(t,r)=>{let o=h(d),e=o.token(),a=t.url.startsWith(tW),p=t.url.startsWith(`${tW}/auth/`);return r(e&&a&&!p?t.clone({setHeaders:{Authorization:`Bearer ${e}`}}):t).pipe(ho(C=>{if(C.status===401&&a&&!p){let b=C.error?.detail??``;o.logout(/desativad/i.test(b)?`desativado`:/encerrada/i.test(b)?`encerrada`:`expirou`)}return kc(()=>C)}))};i$(y);function _(){let t=new mn;return t.itemsPerPageLabel=`Itens por página:`,t.nextPageLabel=`Próxima página`,t.previousPageLabel=`Página anterior`,t.firstPageLabel=`Primeira página`,t.lastPageLabel=`Última página`,t.getRangeLabel=(r,o,e)=>{if(e===0||o===0)return`0 de ${e}`;let a=r*o,p=Math.min(a+o,e);return`${a+1} - ${p} de ${e}`},t}var q={providers:[IE(),Eo(B),LN(PN([z])),{provide:ir,useValue:`pt-BR`},{provide:mn,useFactory:_}]};lN(class t{static ɵfac=function(o){return new(o||t)};static ɵcmp=Le$2({type:t,selectors:[[`app-root`]],decls:1,vars:0,template:function(o,e){o&1&&sv(0,`router-outlet`)},dependencies:[ur],encapsulation:2})},q).catch(t=>console.error(t));export{ln$1 as A,Sn as C,dt as D,Ze as E,x as F,yt as I,Yt$2 as L,rn$1 as M,sn$1 as N,jn as O,tn$1 as P,mt$1 as R,Rn as S,V as T,Gt$1 as _,o as a,On as b,T as c,I as d,Lt as f,Gn as g,pn as h,e as i,pe$1 as j,kn as k,Bt as l,Vr as m,i$1 as n,f as o,Ut as p,l as r,d as s,Te as t,G as u,Kt$1 as v,Tn as w,Pn as x,O as y};