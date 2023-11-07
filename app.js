const { response } = require('express');
const http = require('http');

const todos = [
    { id: 1, text: "1 One" },
    { id: 2, text: "2 Two" },
    { id: 3, text: "3 Three" },
];

const server = http.createServer((req, res) => {
    const { method, url } = req;
    let body = [];

    req
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            body = Buffer.concat(body).toString();

            let status = 404;
            const response = {
                succes: false,
                data: [],
                error: ''
            };

            if (method === 'GET' && url === '/todos') {
                status = 200;
                response.succes = true;
                response.data = todos;
            } else if (method === "POST" && url === '/todos'){

                const {id, text} = JSON.parse(body);

                if (!id || !text) {
                    status = 400;
                    response.error = 'please add id and text';
                } else {
                    todos.push({id, text});
                    status = 200;
                    response.succes = true;
                    response.data = todos;
                }
            }

            res.writeHead(404, {
                'Content-Type': 'application/json',
                'X-Powered-By': 'Node.js',
            });

            res.end(JSON.stringify(response));
        });
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));