class Router extends HTMLElement {
    constructor() {
        super();
        this.loaded = false;
        Router.routes.push(this);
    }
    static go(path) {
        window.location.hash = Router.hash_prefix + path;
    }
    static isValidRoute(location_hash) {
        let valid = false;
        let longest_path = "";
        Router.routes.forEach(route => {
            let status = this.getRouteStatus(location_hash, route);
            if (status.visible) {
                valid = true;
                if (status.path.length > longest_path.length) {
                    let matched_path = status.path;
                    for (var key in status.params) {
                        matched_path = matched_path.replace(":" + key, status.params[key]);
                    }
                    longest_path = matched_path;
                }
            }
        });
        return {
            valid: valid,
            longest_path: longest_path
        };
    }
    static getRouteStatus(location_hash, route) {
        let hash_prefix = "#" + Router.hash_prefix;
        let hash = location_hash.split(hash_prefix).slice(1).join(hash_prefix);
        let params = {};
        let path = route.getAttribute("path");
        let hash_array = hash.split("/");
        let path_array = path.split("/");
        let index = 0;
        let hash_part = undefined;
        let path_part = undefined;
        let match = true;
        while (true) {
            hash_part = hash_array[index];
            path_part = path_array[index];
            if (hash_part === undefined || path_part === undefined) {
                match = path_part === undefined;
                break;
            }
            let param_index = path_part.indexOf(":");
            if (param_index > -1) {
                params[path_part.substring(param_index + 1)] = hash_part.substring(param_index);
                hash_part = hash_part.substring(0, param_index);
                path_part = path_part.substring(0, param_index);
            }
            if (hash_part !== path_part) {
                match = false;
                break;
            }
            index++;
        }
        return {
            visible: match,
            params: params,
            path: path
        };
    }
    connectedCallback() {
        this.hidden = true;
        var status = Router.getRouteStatus(window.location.hash, this);
        if (status.visible) {
            this.params = status.params;
            Router.params = status.params;
            if (!this.loaded) {
                return this.load()
                    .then((html) => {
                    this.hidden = false;
                    this.innerHTML = html;
                });
            }
            this.hidden = false;
        }
        else {
            this.hidden = true;
            return this.load();
        }
    }
    async load() {
        let template = this.getAttribute("template");
        if (template) {
            let res = await fetch(template);
            let body = await res.text();
            this.loaded = true;
            return body;
        }
        this.loaded = true;
        return this.innerHTML;
    }
}
Router.hash_prefix = "/";
Router.params = {};
Router.routes = [];
Router.otherwise = "";
window.addEventListener("hashchange", event => {
    let hash = "#" + event.newURL.split("#").pop();
    let res = Router.isValidRoute(hash);
    if (!res.valid) {
        let has_previous_route = event.oldURL.split("#").length > 1;
        if (!has_previous_route) {
            Router.go(Router.otherwise);
        }
        else {
            let old_hash = event.oldURL.split("#").pop();
            if (Router.isValidRoute("#" + old_hash).valid) {
                window.location.hash = old_hash;
                return event.preventDefault();
            }
            else {
                Router.go(Router.otherwise);
            }
        }
    }
    if (res.longest_path.length < hash.length) {
        window.location.hash = Router.hash_prefix + res.longest_path;
        event.preventDefault();
    }
    document.querySelectorAll("sans-route").forEach(element => {
        element instanceof Router && element.connectedCallback();
    });
});
window.customElements.define('sans-route', Router);
