import {MainPage} from "./pages/main/index.js";

class App {
    constructor() {
        this.root = document.getElementById('root');
    }

    render() {

        const mainPage = new MainPage(this.root);
        
        // Вызываем отрисовку
        mainPage.render();
    }
}

const app = new App();
app.render();