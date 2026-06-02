import { MainPage } from "./pages/main/index.js";

const root = document.getElementById('root');
const mainPage = new MainPage(root);

document.addEventListener("DOMContentLoaded", () => {
    mainPage.render();
    mainPage.getData();
});

class App {
    constructor() {
        this.root = document.getElementById('root');
    }

    render() {

        const mainPage = new MainPage(this.root);

        mainPage.render();
    }
}

const app = new App();
app.render();
