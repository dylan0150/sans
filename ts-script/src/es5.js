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
/**
 * @class TsScript
 *
 * Replace a <ts-script src="{*}.ts"></ts-script> tag with dynamically decided script based on EMCAScript version:
 *
 * <script src="{*}.es3.js"></script>
 * <script src="{*}.es5.js"></script>
 * <script src="{*}.es6.js"></script>
 * <script src="{*}.es2016.js"></script>
 * <script src="{*}.es2017.js"></script>
 * <script src="{*}.es2018.js"></script>
 */
var TsScript = /** @class */ (function (_super) {
    __extends(TsScript, _super);
    function TsScript() {
        return _super.call(this) || this;
    }
    TsScript.prototype.connectedCallback = function () {
        var src_parts = this.getAttribute("src").split('.');
        var script = document.createElement("script");
        src_parts.pop();
        src_parts.push(TsScript.version);
        src_parts.push("js");
        script.setAttribute("src", src_parts.join("."));
        this.appendChild(script);
    };
    TsScript.version = (function () {
        var version = "es3";
        try {
            eval('"use strict";\
            var a={get a(){return this.a},set a(b){this.a=b},new:1,};var a="a"[0];var b=[0,]');
            version = "es5";
            eval("let a=1;const b=2;(a=1,...args)=>{ if (`${a}` !== String(a)) throw a;}");
            version = "es6";
            eval("2**2;");
            version = "es2016";
            eval("async function a(b,){return await b};function* b(a,){yield a}");
            version = "es2017";
            eval("async function f(){ for await (const x of createAsyncIterable(['a','b'])){}};function a({a,...rest}){return{a, ...rest}}");
            version = "es2018";
        }
        catch (e) { }
        return version;
    })();
    return TsScript;
}(HTMLElement));
window.customElements.define('ts-script', TsScript);
