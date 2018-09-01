(function TsScriptWrapper(){
    try {
        eval(`
class TsScript extends HTMLElement {
    constructor() { super(); }
    connectedCallback() {
        var src_parts = this.getAttribute("src").split('.');
        var script = document.createElement("script");
        src_parts.pop();
        src_parts.push(TsScript.version);
        src_parts.push("js");
        script.setAttribute("src", src_parts.join("."));
        this.appendChild(script);
    }
}
TsScript.version = (function () {
    var version = "es3";
    try {
        eval('"use strict";\
            var a={get a(){return this.a},set a(b){this.a=b},new:1,};var a="a"[0];var b=[0,]');
        version = "es5";
        eval("let a=1;const b=2;(a=1,...args)=>{ if (`+"`${a}`"+` !== String(a)) throw a;}");
        version = "es6";
        eval("2**2;");
        version = "es2016";
        eval("async function a(b,){return await b};function* b(a,){yield a}");
        version = "es2017";
        eval("async function f(){ for await (const x of createAsyncIterable(['a','b'])){}};function a({a,...rest}){return{a, ...rest}}");
        version = "es2018";
    } catch (e) {}
    return version;
})();
window.customElements.define('ts-script', TsScript);
        `)
    } catch (e) {
        class TsScript extends HTMLElement {
            constructor() { super(); }
            static version = (function () {
                var version = "es3";
                try {
                    eval('"use strict";\
                        var a={get a(){return this.a},set a(b){this.a=b},new:1,};var a="a"[0];var b=[0,]');
                    version = "es5";
                } catch (e) {}
                return version;
            })();
            connectedCallback() {
                var src_parts = this.getAttribute("src").split('.');
                var script = document.createElement("script");
                src_parts.pop();
                src_parts.push(TsScript.version);
                src_parts.push("js");
                script.setAttribute("src", src_parts.join("."));
                this.appendChild(script);
            }
        }
        window.customElements.define('ts-script', TsScript);
    }
})()