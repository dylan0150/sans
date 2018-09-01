(function TsScriptWrapper() {
    try {
        eval("\nclass TsScript extends HTMLElement {\n    constructor() { super(); }\n    connectedCallback() {\n        var src_parts = this.getAttribute(\"src\").split('.');\n        var script = document.createElement(\"script\");\n        src_parts.pop();\n        src_parts.push(TsScript.version);\n        src_parts.push(\"js\");\n        script.setAttribute(\"src\", src_parts.join(\".\"));\n        this.appendChild(script);\n    }\n}\nTsScript.version = (function () {\n    var version = \"es3\";\n    try {\n        eval('\"use strict\";            var a={get a(){return this.a},set a(b){this.a=b},new:1,};var a=\"a\"[0];var b=[0,]');\n        version = \"es5\";\n        eval(\"let a=1;const b=2;(a=1,...args)=>{ if (" + "`${a}`" + " !== String(a)) throw a;}\");\n        version = \"es6\";\n        eval(\"2**2;\");\n        version = \"es2016\";\n        eval(\"async function a(b,){return await b};function* b(a,){yield a}\");\n        version = \"es2017\";\n        eval(\"async function f(){ for await (const x of createAsyncIterable(['a','b'])){}};function a({a,...rest}){return{a, ...rest}}\");\n        version = \"es2018\";\n    } catch (e) {}\n    return version;\n})();\nwindow.customElements.define('ts-script', TsScript);\n        ");
    }
    catch (e) {
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
        var TsScript_1 = /** @class */ (function (_super) {
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
                }
                catch (e) { }
                return version;
            })();
            return TsScript;
        }(HTMLElement));
        window.customElements.define('ts-script', TsScript_1);
    }
})();
