import { GameCardComponent } from "../../components/game-card/index.js";
import { ProductPage } from "../product/index.js";
import { CreatePage } from "../create/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div id="main-page" class="container mt-5">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="text-white m-0">Магазин игр</h1>
                    <button id="add-game-btn" class="btn-steam btn-steam-green">Добавить игру</button>
                </div>
                <div class="row row-cols-1 row-cols-md-3 g-4" id="cards-container">
                    </div>
            </div>
        `;
    }

    getData() {
        ajax.get(stockUrls.getStocks(), (data) => {
            if (data) {
                this.renderData(data);
            }
        });
    }

    renderData(items) {
        const container = document.getElementById('cards-container');
        if (!container) return;

        container.innerHTML = '';

        items.forEach((item) => {
            const gameCard = new GameCardComponent(container);
            gameCard.render(item, this.clickCard.bind(this));
        });
    }

    clickCard(data) {
        const productPage = new ProductPage(this.parent, data.id);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        
        this.getData();

        const addGameBtn = document.getElementById('add-game-btn');
        if (addGameBtn) {
            addGameBtn.onclick = (e) => {
                e.preventDefault();
                const createPage = new CreatePage(this.parent);
                createPage.render();
            };
        }
    }
}