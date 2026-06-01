import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class ProductPage {
    // Изменили: теперь принимаем id вместо gameData
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.game = null; // Данные изначально пустые
    }

    getHTML() {
        // Если данные еще не скачались, показываем заглушку
        if (!this.game) {
            return `<div class="container mt-5 text-center text-white"><h3>Загрузка данных об игре...</h3></div>`;
        }

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

    getData() {
        // Делаем запрос к API по ID игры
        ajax.get(stockUrls.getStockById(this.id), (data) => {
            if (data) {
                this.game = data; // Сохраняем скачанные данные
                this.renderData(); // Перерисовываем страницу уже с данными
            }
        });
    }

    addListeners(onVote) {
        // Проверяем, появились ли кнопки (чтобы не было ошибки)
        const likeBtn = document.getElementById('like-btn');
        const dislikeBtn = document.getElementById('dislike-btn');
        
        if (likeBtn && dislikeBtn && onVote) {
            likeBtn.onclick = () => onVote(this.game.id, 'like');
            dislikeBtn.onclick = () => onVote(this.game.id, 'dislike');
        }
    }

    renderData() {
        // Метод для финальной отрисовки, когда данные уже пришли
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        // Временная функция-заглушка для лайков (ее можно доработать под твой вариант)
        this.addListeners((id, type) => {
            console.log(`Проголосовали за игру ${id}, тип: ${type}`);
        });

        const backBtnContainer = document.getElementById('back-btn-container');
        if (backBtnContainer) {
            const backButton = new BackButtonComponent(backBtnContainer);
            backButton.render(() => {
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            });
        }
    }

    render() {
        // Сначала очищаем экран и пишем "Загрузка..."
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        // Запускаем скачивание
        this.getData();
    }
}