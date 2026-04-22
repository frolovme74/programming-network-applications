export class GameCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

getHTML(data) {
    return `
        <div class="card" id="card-${data.id}">
            <img src="${data.src}" class="card-img-top" alt="${data.title}">
            <div class="card-body">
                <h5 class="card-title">${data.title}</h5>
                <p class="card-text">${data.price}</p>
                
                <div class="reaction-area">
                    <button class="btn-steam-like" id="like-${data.id}" data-id="${data.id}">
                        👍
                    </button>
                    <button class="btn-steam-dislike" id="dislike-${data.id}" data-id="${data.id}">
                        👎
                    </button>
                    
                    <span id="counter-${data.id}" class="count-badge">
                        ${data.likes > 0 ? '+' + data.likes : data.likes}
                    </span>
                </div>
            </div>
        </div>
    `;
}

    addListeners(data, listener) {
        document.getElementById(`like-${data.id}`).addEventListener("click", (e) => {
            listener(data.id, 'like');
        });
        document.getElementById(`dislike-${data.id}`).addEventListener("click", (e) => {
            listener(data.id, 'dislike');
        });
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }
}