import { BackButtonComponent } from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        this.game = null;
    }

    getHTML() {
        if (!this.game) {
            return `<div class="container mt-5 text-center text-white"><h3>Загрузка данных об игре...</h3></div>`;
        }

        return `
            <div id="product-page" class="container mt-5">
                <div class="row bg-dark-steam p-4 shadow-lg text-white mb-4">
                    <div class="col-md-6">
                        <img src="${this.game.src}" class="img-fluid rounded border border-secondary" alt="${this.game.title}">
                    </div>
                    <div class="col-md-6 d-flex flex-column">
                        <h1 class="display-5 fw-bold">${this.game.title}</h1>
                        <p class="text-info h4 mb-3">${this.game.price}</p>

                        <div id="description-block" class="game-description mt-2">
                            <p id="game-desc-text" style="color: #acb2b8;">${this.game.description}</p>
                        </div>

                        <div class="mb-3 d-flex align-items-center gap-3 mt-3">
                            <div class="btn-group">
                                <button type="button" class="btn btn-outline-success" id="like-btn">👍</button>
                                <button type="button" class="btn btn-outline-danger" id="dislike-btn">👎</button>
                            </div>
                            <span class="h4 mb-0" id="counter-${this.game.id}">
                                ${this.game.likes > 0 ? '+' + this.game.likes : this.game.likes}
                            </span>
                        </div>

                        <div class="mt-3 d-flex gap-2" id="action-buttons-container">
                            <button class="btn-steam btn-steam-blue" id="edit-btn">Редактировать описание</button>
                            <button class="btn-steam btn-steam-red" id="delete-btn">Удалить игру</button>
                        </div>

                        <div id="back-btn-container" class="mt-auto pt-3"></div>
                    </div>
                </div>
            </div>
        `;
    }

    async getData() {
        const data = await ajax.get(stockUrls.getStockById(this.id));
        if (data) {
            this.game = data;
            this.renderData();
        }
    }

    addListeners() {
        const likeBtn = document.getElementById('like-btn');
        const dislikeBtn = document.getElementById('dislike-btn');
        const editBtn = document.getElementById('edit-btn');
        const deleteBtn = document.getElementById('delete-btn');

        if (likeBtn && dislikeBtn) {
            likeBtn.onclick = (e) => { e.preventDefault(); this.updateLikes(1); };
            dislikeBtn.onclick = (e) => { e.preventDefault(); this.updateLikes(-1); };
        }

        if (editBtn) {
            editBtn.onclick = (e) => {
                e.preventDefault();
                this.turnOnEditMode();
            };
        }

        if (deleteBtn) {
            deleteBtn.onclick = async (e) => {
                e.preventDefault();
                    const success = await ajax.delete(stockUrls.removeStockById(this.id));
                    if (success) {
                        const mainPage = new MainPage(this.parent);
                        mainPage.render();
                    }

            };
        }
    }

    turnOnEditMode() {
        const descBlock = document.getElementById('description-block');
        const editBtn = document.getElementById('edit-btn');
        if (!descBlock || !editBtn) return;

        editBtn.style.display = 'none';

        descBlock.innerHTML = `
            <div id="edit-form-inline">
                <textarea class="form-control bg-dark text-white border-secondary mb-2" id="edit-desc-textarea" rows="4">${this.game.description}</textarea>
                <div class="d-flex gap-2">
                    <button class="btn-steam btn-steam-green" id="save-desc-btn">Сохранить</button>
                    <button class="btn-steam btn-steam-blue" id="cancel-desc-btn">Отмена</button>
                </div>
            </div>
        `;

        document.getElementById('save-desc-btn').onclick = async (e) => {
            e.preventDefault();
            const newDesc = document.getElementById('edit-desc-textarea').value;

            if (newDesc && newDesc !== this.game.description) {
                const updatedData = await ajax.patch(stockUrls.updateStockById(this.id), { description: newDesc });
                if (updatedData) {
                    this.game.description = updatedData.description;
                }
            }
            this.turnOffEditMode();
        };

        document.getElementById('cancel-desc-btn').onclick = (e) => {
            e.preventDefault();
            this.turnOffEditMode();
        };
    }

    turnOffEditMode() {
        const descBlock = document.getElementById('description-block');
        const editBtn = document.getElementById('edit-btn');
        if (!descBlock || !editBtn) return;

        editBtn.style.display = 'inline-block';
        descBlock.innerHTML = `<p id="game-desc-text" style="color: #acb2b8;">${this.game.description}</p>`;
    }

    async updateLikes(change) {
        const newLikes = this.game.likes + change;
        const updatedData = await ajax.patch(stockUrls.updateStockById(this.id), { likes: newLikes });
        if (updatedData) {
            this.game.likes = updatedData.likes;
            const counterSpan = document.getElementById(`counter-${this.id}`);
            if (counterSpan) {
                counterSpan.innerText = this.game.likes > 0 ? '+' + this.game.likes : this.game.likes;
            }
        }
    }

    renderData() {
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

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.getData();
    }
}
