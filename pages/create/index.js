import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class CreatePage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div class="container mt-5 text-white">
                <h2>Добавить новую игру</h2>
                <form id="create-game-form" class="mt-4 bg-dark p-4 rounded shadow">
                    <div class="mb-3">
                        <label class="form-label">Название игры</label>
                        <input type="text" class="form-control" id="game-title" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Цена</label>
                        <input type="text" class="form-control" id="game-price" placeholder="Например: 1500 ₽" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ссылка на картинку (URL)</label>
                        <input type="url" class="form-control" id="game-src" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Описание</label>
                        <textarea class="form-control" id="game-desc" rows="3" required></textarea>
                    </div>
                    <button type="submit" class="btn-steam btn-steam-green">Создать</button>
                    <div id="back-btn-container" class="mt-3 d-inline-block ms-3"></div>
                </form>
            </div>
        `;
    }

    addListeners() {
        const form = document.getElementById('create-game-form');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newGame = {
                title: document.getElementById('game-title').value,
                price: document.getElementById('game-price').value,
                src: document.getElementById('game-src').value,
                description: document.getElementById('game-desc').value,
                likes: 0
            };

            const data = await ajax.post(stockUrls.createStock(), newGame);
            if (data) {
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            }
        });
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        this.addListeners();

        const backBtnContainer = document.getElementById('back-btn-container');
        if (backBtnContainer) {
            const backButton = new BackButtonComponent(backBtnContainer);
            backButton.render(() => {
                const mainPage = new MainPage(this.parent);
                mainPage.render();
            });
        }
    }
}
