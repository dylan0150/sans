class TestComponent extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = "TEST COMPONENT"
    }
}
window.customElements.define("test-component", TestComponent)