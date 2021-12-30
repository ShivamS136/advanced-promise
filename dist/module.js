var t,e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{};t=function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function r(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}function o(t){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function s(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?a(t):e}function u(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=o(t);if(e){var i=o(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return s(this,n)}}function l(t,e,n){return(l="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=o(t)););return t}(t,e);if(r){var i=Object.getOwnPropertyDescriptor(r,e);return i.get?i.get.call(n):i.value}})(t,e,n||t)}var c=function(){function e(){t(this,e),Object.defineProperty(this,"listeners",{value:{},writable:!0,configurable:!0})}return r(e,[{key:"addEventListener",value:function(t,e,n){t in this.listeners||(this.listeners[t]=[]),this.listeners[t].push({callback:e,options:n})}},{key:"removeEventListener",value:function(t,e){if(t in this.listeners)for(var n=this.listeners[t],r=0,o=n.length;r<o;r++)if(n[r].callback===e)return void n.splice(r,1)}},{key:"dispatchEvent",value:function(t){if(t.type in this.listeners){for(var e=this.listeners[t.type].slice(),n=0,r=e.length;n<r;n++){var o=e[n];try{o.callback.call(this,t)}catch(t){Promise.resolve().then((function(){throw t}))}o.options&&o.options.once&&this.removeEventListener(t.type,o.callback)}return!t.defaultPrevented}}}]),e}(),f=function(e){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(s,e);var n=u(s);function s(){var e;return t(this,s),(e=n.call(this)).listeners||c.call(a(e)),Object.defineProperty(a(e),"aborted",{value:!1,writable:!0,configurable:!0}),Object.defineProperty(a(e),"onabort",{value:null,writable:!0,configurable:!0}),e}return r(s,[{key:"toString",value:function(){return"[object AbortSignal]"}},{key:"dispatchEvent",value:function(t){"abort"===t.type&&(this.aborted=!0,"function"==typeof this.onabort&&this.onabort.call(this,t)),l(o(s.prototype),"dispatchEvent",this).call(this,t)}}]),s}(c),p=function(){function e(){t(this,e),Object.defineProperty(this,"signal",{value:new f,writable:!0,configurable:!0})}return r(e,[{key:"abort",value:function(){var t;try{t=new Event("abort")}catch(e){"undefined"!=typeof document?document.createEvent?(t=document.createEvent("Event")).initEvent("abort",!1,!1):(t=document.createEventObject()).type="abort":t={type:"abort",bubbles:!1,cancelable:!1}}this.signal.dispatchEvent(t)}},{key:"toString",value:function(){return"[object AbortController]"}}]),e}();"undefined"!=typeof Symbol&&Symbol.toStringTag&&(p.prototype[Symbol.toStringTag]="AbortController",f.prototype[Symbol.toStringTag]="AbortSignal"),function(t){(function(t){return t.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL?(console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill"),!0):"function"==typeof t.Request&&!t.Request.prototype.hasOwnProperty("signal")||!t.AbortController})(t)&&(t.AbortController=p,t.AbortSignal=f)}("undefined"!=typeof self?self:e)},"function"==typeof define&&define.amd?define(t):t();class n extends Error{constructor(t="Aborted"){super(t),this.name="AbortError"}}class r extends Promise{constructor(t,e,r={}){const o=new AbortController,i=o.signal;var a={status:"pending",data:r,resolve:()=>{},reject:()=>{},timeoutId:0,timeoutStatus:void 0};super(((e,r)=>{var o=t=>{"pending"===a.status&&(a.status="settled",e&&e(t))},s=t=>{"pending"===a.status&&(a.status="rejected",r&&r(t))};i.addEventListener("abort",(()=>{s(new n(this._abortReason))})),a.resolve=o,a.reject=s,t(o,s,i)})),this._meta=a,this.cancel=this.abort=t=>{this._abortReason=t||"Aborted",o.abort()},e&&(this._meta.timeoutStatus=!1,this._meta.timeoutId=setTimeout((()=>{this._meta.timeoutStatus=!0,this.abort(`${e}ms timeout expired`)}),e))}cancelTimeout(){return!(this.isFulfilled||!this._meta.timeoutId)&&(clearTimeout(this._meta.timeoutId),!0)}resolve(t){this._meta.resolve(t)}reject(t){this._meta.reject(t)}get abortReason(){return this._abortReason}get data(){return this._meta.data}get isFulfilled(){return"pending"!==this._meta.status}get isSettled(){return"settled"!==this._meta.status}get isRejected(){return"rejected"!==this._meta.status}get isTimedout(){return this._meta.timeoutStatus}get status(){return this._meta.status}static from=t=>t instanceof r?t:new r(((e,n)=>{t.then(e).catch(n)}))}var o=r;export{o as default};