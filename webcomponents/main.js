;(function NBS() {
    const ALL_CUSTOM_ELEMENTS = new Map()

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
                        ? value(current)
                        : value
                }, null)
        })
    }

    const createElement = (name, scope={}) => {
        class CustomElement extends HTMLElement {
            constructor() {
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
        
            connectedCallback() {
                
            }
    
            render() {
                const attrs = this.attrs || new Map(this.getAttributeNames().map(attr => [attr, this.getAttribute(attr)]))
                for (const [key, value] of attrs) {
                    this.setAttribute(key, parseTemplateString(value, this.scope))
                }
                this.attrs = attrs
    
                const template = this.template || this.innerHTML
                this.innerHTML = parseTemplateString(template, this.scope)
                this.template = template
            }
        }
        CustomElement.all = []
    
        ALL_CUSTOM_ELEMENTS.set(name, CustomElement)
        window.customElements.define(name, CustomElement)
    }

    window.NBS = {
        createElement
    }
    
    window.addEventListener('DOMContentLoaded', event => {
        for (const [name, element] of ALL_CUSTOM_ELEMENTS) {
            for (const instance of element.all) {
                instance.render()
            }
        }
    })
})()

NBS.createElement('my-component', {
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