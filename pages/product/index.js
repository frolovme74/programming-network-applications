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
                <div class="row bg-dark-steam p-4 shadow-lg text-white">
                    <div class="col-md-6">
                        <img src="${this.game.src}" class="img-fluid rounded border border-secondary" alt="${this.game.title}">
                    </div>
                    <div class="col-md-6 d-flex flex-column">
                        <h1 class="display-5 fw-bold">${this.game.title}</h1>
                        <p class="text-info h4 mb-3">${this.game.price}</p>
                        

                        <div class="game-description mt-2">
                            <p style="color: #acb2b8;">${this.game.description}</p>
                        </div>
                        <div class="mb-3 d-flex align-items-center gap-3">
                            <div class="btn-group">
                                <button type="button" class="btn btn-outline-success" id="like-btn">👍</button>
                                <button type="button" class="btn btn-outline-danger" id="dislike-btn">👎</button>
                            </div>
                            <span class="h4 mb-0" id="counter-${this.game.id}">
                                ${this.game.likes > 0 ? '+' + this.game.likes : this.game.likes}
                            </span>
                        </div>
                        <div id="back-btn-container" class="mt-auto"></div>
                    </div>
                </div>
            </div>
        `;
    }

    addListeners(onVote) {
        document.getElementById('like-btn').onclick = () => onVote(this.game.id, 'like');
        document.getElementById('dislike-btn').onclick = () => onVote(this.game.id, 'dislike');
    }


render(onVote) {
    this.parent.innerHTML = '';
    this.parent.insertAdjacentHTML('beforeend', this.getHTML());

    this.addListeners(onVote);

    const backBtnContainer = document.getElementById('back-btn-container');
    
    if (backBtnContainer) {
        const backButton = new BackButtonComponent(backBtnContainer);
        
        backButton.render(() => {
            const mainPage = new MainPage(this.parent);
            mainPage.render();
        });
    } else {
        console.error("Контейнер 'back-btn-container' не найден в HTML");
    }
}
}