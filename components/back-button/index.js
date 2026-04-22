export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const btn = document.getElementById("back-button");
        if (btn) {
            btn.addEventListener("click", listener);
        }
    }

    getHTML() {
        return `
            <button id="back-button" class="btn btn-steam-back" type="button">
                ← Назад в магазин
            </button>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}