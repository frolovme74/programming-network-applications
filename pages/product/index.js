import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";

export class ProductPage {
    constructor(parent, gameData) {
        this.parent = parent;
        this.game = gameData;
    }

getHTML() {
    return `
        <div id="product-page" class="container mt-5">
            <div class="row bg-dark-steam p-4 shadow-lg">
                <div class="col-md-6">
                    <img src="${this.game.src}" class="img-fluid rounded border border-secondary" alt="${this.game.title}">
                </div>
                
                <div class="col-md-6 text-white d-flex flex-column">
                    <h1 class="display-5 fw-bold">${this.game.title}</h1>
                    <p class="text-info h4 mb-3">${this.game.price}</p>
                    
                    <div class="mb-3">
                        <span class="badge bg-secondary p-2">Рейтинг: ${this.game.likes} 👍</span>
                    </div>

                    <div class="game-description mt-2">
                        <h6 class="text-uppercase small fw-bold">Об этой игре:</h6>
                        <p style="color: #acb2b8; line-height: 1.6;">
                            ${this.game.description}
                        </p>
                    </div>

                    <div id="back-btn-container" class="mt-auto"></div>
                </div>
            </div>
        </div>
    `;
}

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const backBtnContainer = document.getElementById('back-btn-container');
        const backButton = new BackButtonComponent(backBtnContainer);
        backButton.render(() => {
            const mainPage = new MainPage(this.parent);
            mainPage.render();
        });
    }
}