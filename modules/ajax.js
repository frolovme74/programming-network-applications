class Ajax {
    async _send(method, url, data = null) {
        const options = {
            method: method,
            headers: {}
        };

        if (data) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            if (response.status === 204 || method === 'DELETE') {
                return true;
            }

            return await response.json();
        } catch (error) {
            console.error(`Ошибка при выполнении [${method}] запроса к ${url}:`, error);
            return null;
        }
    }

    async get(url) { return this._send('GET', url); }
    async post(url, data) { return this._send('POST', url, data); }
    async patch(url, data) { return this._send('PATCH', url, data); }
    async delete(url) { return this._send('DELETE', url); }
}

export const ajax = new Ajax();
