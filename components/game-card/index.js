export class GameCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card" id="card-${data.id}" style="cursor: pointer;">
                <img src="${data.src}" class="card-img-top" alt="${data.title}">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">${data.price}</p>
                    <div class="reaction-display">
                        <span class="badge bg-secondary">
                            <!-- ВАЖНО: Добавлен id="counter-${data.id}" -->
                            Рейтинг: <span id="counter-${data.id}">${data.likes > 0 ? '+' + data.likes : data.likes}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    render(data, onClick) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        document.getElementById(`card-${data.id}`).onclick = () => onClick(data);
    }
}