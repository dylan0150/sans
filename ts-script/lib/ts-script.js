try {
    class TsScript extends HTMLElement {
        constructor() {super()}
        connectedCallback() {
            var src = this.getAttribute("src")
            var src_parts = src.split('.')
            var ext = src_parts.pop()
            if ( ext !== "ts" ) {
                throw new Error("Unsupported extention"+ext+this.toString())
            }
            var script = document.createElement("script")
            var version = this.getSupportedVersion()
            src_parts.push(version)
            src_parts.push("js")
            script.setAttribute("src", src_parts.join("."))
            document.head.appendChild(script)
        }
        getSupportedVersion() {
            var version = "es3"
            try {
                eval('"use strict";\
                var a={get a(){return this.a},set a(b){this.a=b},new:1,};var a="a"[0];var b=[0,]')
                version = "es5"
            } catch (e) { return version }
            try {
                eval("let a=1;const b=2;(a=1,...args)=>{ if (`${a}` !== String(a)) throw a;}")
                version = "es6"
            } catch (e) { return version }
            try {
                eval("2**2;")
                version = "es2016"
            } catch (e) { return version }
            try {
                eval("async function a(b,){return await b};function* b(a,){yield a}")
                version = "es2017"
            } catch (e) { return version }
            try {
                eval("async function f(){ for await (const x of createAsyncIterable(['a','b'])){}};function a({a,...rest}){return{a, ...rest}}")
                version = "es2018"
            } catch (e) { return version }
            return version
        }
    }
    window.customElements.define('ts-script', TsScript)
} catch (e) {
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        }
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var TsScript = /** @class */ (function (_super) {
        __extends(TsScript, _super);
        function TsScript() {
            return _super.call(this) || this;
        }
        TsScript.prototype.connectedCallback = function () {
            var src = this.getAttribute("src");
            var src_parts = src.split('.');
            var ext = src_parts.pop();
            if (ext !== "ts") {
                throw new Error("Unsupported extention" + ext + this.toString());
            }
            var script = document.createElement("script");
            var version = this.getSupportedVersion();
            src_parts.push(version);
            src_parts.push("js");
            script.setAttribute("src", src_parts.join("."));
            document.head.appendChild(script);
        };
        TsScript.prototype.getSupportedVersion = function () {
            var version = "es3";
            try {
                eval('"use strict";\
                var a={get a(){return this.a},set a(b){this.a=b},new:1,};var a="a"[0];var b=[0,]');
                version = "es5";
            }
            catch (e) {
                return version;
            }
            try {
                eval("let a=1;const b=2;(a=1,...args)=>{ if (`${a}` !== String(a)) throw a;}");
                version = "es6";
            }
            catch (e) {
                return version;
            }
            try {
                eval("2**2;");
                version = "es2016";
            }
            catch (e) {
                return version;
            }
            try {
                eval("async function a(b,){return await b};function* b(a,){yield a}");
                version = "es2017";
            }
            catch (e) {
                return version;
            }
            try {
                eval("async function f(){ for await (const x of createAsyncIterable(['a','b'])){}};function a({a,...rest}){return{a, ...rest}}");
                version = "es2018";
            }
            catch (e) {
                return version;
            }
            return version;
        };
        return TsScript;
    }(HTMLElement));
    window.customElements.define('ts-script', TsScript);    
}