;(() => {
    const ALL_COMPONENTS = {}

    const getScopeVal = (keyString, scope) => {
        const keyParts = keyString.trim().split('.')
    
        let value = scope
        for (const part of keyParts) {
            value = value[part]
            if (!value) return undefined
        }
    
        return value
    }
    
    const parseConditional = (string, conditional) => {
        const parts = string.split(conditional)
        if (parts.length <= 1) return null
    
        const left = parts.shift()
        const right = parts.join(conditional)
    
        return [ left, right ]
    }
    
    const evaluateTemplate = (template, scope) => {    
        const ternaryConditions = parseConditional(template, '?')
        if (ternaryConditions) {
            const [ condition, results ] = ternaryConditions
            const [ _true, _false ] = parseConditional(results, ':')
            return evaluateTemplate(condition.trim(), scope)
                ? evaluateTemplate(_true.trim(), scope)
                : evaluateTemplate(_false.trim(), scope)
        }
    
        const andConditions = parseConditional(template, '&&')
        if (andConditions) {
            const [ left, right ] = andConditions
            return evaluateTemplate(left.trim(), scope) && evaluateTemplate(right.trim(), scope)
        }
    
        const orConditions = parseConditional(template, '||')
        if (orConditions) {
            const [ left, right ] = orConditions
            return evaluateTemplate(left.trim(), scope) || evaluateTemplate(right.trim(), scope)
        }
    
        return getScopeVal(template, scope)
    }
    
    const parseTemplateString = (string, scope) => {
        return string.replace(/\${.*}/g, val => {
            return val
                .slice(2, -1)
                .trim()
                .split('|')
                .reduce((current, template) => {
                    const value = evaluateTemplate(template.replace(/&amp;/g, '&'), scope)
    
                    return value instanceof Function
                        ? value.bind(scope)(current)
                        : value
                }, null)
        })
    }

    const create = (name, scope) => {
        class CustomElement extends HTMLElement {
            constructor () {
                super()

                this.scope = new Proxy(scope, {
                    set: (scope, key, value) => {
                        scope[key] = value
                        this.render()
                        return true
                    }
                })
                
                CustomElement.all.push(this)
            }

            init () {
                this.bind()
                this.render()
            }

            bind () {
                const bindings = this.getAttributeNames().reduce((bindings, key) => {
                    const keyParts = key.split('.')
                    if (keyParts.length > 1 && keyParts.shift() === 'bind') {
                        bindings[keyParts.pop()] = this.getAttribute(key)
                    }
                    return bindings
                }, {})
                
                if (this.observer) this.observer.disconnect()
                this.observer = new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        const attr = mutation.attributeName

                        const key = this.bindings[attr]
                        const value = this.getAttribute(attr)

                        if (this.scope[key] !== value) this.scope[key] = value
                    }
                })
                this.observer.observe(this, {
                    attributes: true,
                    attributeFilter: Object.keys(bindings),
                })

                this.bindings = bindings
            }

            render () {
                const attrs = this.attrs || this.getAttributeNames().map(key => [key, this.getAttribute(key)])
                for (const [key, value] of attrs) {
                    this.setAttribute(key, parseTemplateString(value, this.scope))
                }
                this.attrs = attrs

                const template = this.template || this.innerHTML
                this.innerHTML = parseTemplateString(template, this.scope)
                this.template = template

                for (const attr in this.bindings) {
                    this.setAttribute(attr, this.scope[this.bindings[attr]])
                }
            }
        }
        CustomElement.all = []

        ALL_COMPONENTS[name] = CustomElement
        customElements.define(name, CustomElement)

        return CustomElement
    }

    const init = () => {
        for (const name in ALL_COMPONENTS) {
            const Component = ALL_COMPONENTS[name]
            for (const component of Component.all) {
                component.init()
            }
        }
    }
    const render = () => {
        for (const name in ALL_COMPONENTS) {
            const Component = ALL_COMPONENTS[name]
            for (const component of Component.all) {
                component.render()
            }
        }
    }

    if (window.define instanceof Function) {
        return define(() => ({
            create,
            parseTemplateString,
            render,
            init,
        }))
    }

    window.component = {
        create,
        parseTemplateString,
        render,
        init,
    }
    document.addEventListener('DOMContentLoaded', init)
})()

component.create('my-component', {
    fname: 'john',
    lname: 'doe',
    get fullname () {
        return `${this.fname} ${this.lname}`
    },
    filters: {
        toUpperCase (v) {
            return v
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')
        }
    }
})