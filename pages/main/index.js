import {GameCardComponent} from "../../components/game-card/index.js";
import { ProductPage } from "../product/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.data = this.getData();
    }

getData() {
    return [
        { 
            id: 1, 
            title: "Risk of Rain 2", 
            src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632360/header.jpg?t=1775753930", 
            price: "890 ₽", 
            likes: 0,
            description: "Выберитесь с хаотичной неизвестной планеты, отбиваясь от полчищ безумных монстров в одиночку или с друзьями. Неожиданным образом сочетайте найденные предметы и постигайте все особенности персонажей, пока сами не станете разрушительной силой, вселяющей ужас в противников."
        },
        { 
            id: 2, 
            title: "Tom Clancy's Rainbow Six Siege", 
            src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/359550/ac4f6daf0d8afee2754e9964077a9a7d5bdb8ab8/header_alt_assets_20.jpg?t=1775836354", 
            price: "Free to Play", 
            likes: 0,
            description: "Rainbow Six® Осада – эталон тактических командных шутеров, где побеждают высококлассные стратегия и исполнение. Получите бесплатный доступ к быстрым и безрейтинговым играм, а также режиму Dual Front с избранными оперативниками."
        },
        { 
            id: 3, 
            title: "Hollow Knight: Silksong", 
            src: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg?t=1776125736", 
            price: "710 ₽", 
            likes: 0,
            description: "Исследуйте огромное проклятое царство в Hollow Knight: Silksong! Открывайте его тайны, сражайтесь и боритесь за свою жизнь, поднимаясь к вершинам земель, где правят шёлк и песня."
        },
        { 
            id: 4, 
            title: "The Witcher 3", 
            src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg", 
            price: "1199 ₽", 
            likes: 0,
            description: "Вы — Геральт из Ривии, наемный убийца чудовищ. Вы путешествуете по миру, в котором бушует война и на каждом шагу подстерегают чудовища. Вам предстоит выполнить заказ и найти Цири — Дитя Предназначения, живое оружие, способное изменить облик этого мира."
        },
        { 
            id: 5, 
            title: "Elden Ring", 
            src: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", 
            price: "3999 ₽", 
            likes: 0,
            description: "НОВЫЙ ФЭНТЕЗИЙНЫЙ РОЛЕВОЙ БОЕВИК. Восстань, погасшая душа! Междуземье ждёт своего повелителя. Пусть благодать приведёт тебя к Кольцу Элден."
        }
    ];
}

    handleReaction(id, type) {
        const game = this.data.find(item => item.id === id);
        const counterElement = document.getElementById(`counter-${id}`);
        
        if (type === 'like') {
            game.likes++;
        } else {
            game.likes--;
        }

        if (counterElement) {
            counterElement.textContent = game.likes;
        }
    }

get pageRoot() {
    return document.getElementById('main-page');
}

    getHTML() {
        return `
            <div class="container mt-4">
                <div class="main-header-area mb-4">
                    <h2 class="steam-title">МАГАЗИН</h2>
                    <div class="steam-tabs">
                        <span class="active-tab">Новинки</span>
                        <span>Лидеры продаж</span>
                        <span>Популярное</span>
                    </div>
                </div>

                <div id="main-page" class="d-flex flex-wrap justify-content-center"></div>
            </div>
        `;
    }

    render() {
        this.parent.innerHTML = '';

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.data.forEach((item) => {
            const gameCard = new GameCardComponent(this.pageRoot);
            gameCard.render(item, this.handleReaction.bind(this));
        });
        
    }
    render() {
        this.parent.innerHTML = '';

        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        this.data.forEach((item) => {

            const gameCard = new GameCardComponent(this.pageRoot);

            gameCard.render(item, this.handleReaction.bind(this));

            const cardElement = document.getElementById(`card-${item.id}`);
            
            if (cardElement) {
                cardElement.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        const productPage = new ProductPage(this.parent, item);
                        productPage.render();
                    }
                });
            }
        });
    }
}