import { GameCardComponent } from "../../components/game-card/index.js";
import { ProductPage } from "../product/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div id="main-page" class="container mt-5">
                <h1 class="text-white mb-4">Магазин игр</h1>
                <div class="row row-cols-1 row-cols-md-3 g-4" id="cards-container">
                    </div>
            </div>
        `;
    }

    getData() {
        // 1. Делаем GET запрос к серверу за списком игр
        ajax.get(stockUrls.getStocks(), (data) => {
            if (data) {
                this.renderData(data);
            }
        });
    }

    renderData(items) {
        const container = document.getElementById('cards-container');
        if (!container) return;

        // 2. Отрисовываем каждую карточку из полученного массива
        items.forEach((item) => {
            const gameCard = new GameCardComponent(container);
            gameCard.render(item, this.clickCard.bind(this));
        });
    }

    clickCard(data) {
        // ВАЖНО: Передаем в конструктор страницы только id, а не весь объект
        const productPage = new ProductPage(this.parent, data.id);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        
        // Запрашиваем данные после того, как каркас страницы появился в DOM
        this.getData();
    }
}