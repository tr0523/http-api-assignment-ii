const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const type = request.headers['content-type'];
        request.body = JSON.parse(bodyString);

        handler(request, response);
    });
};

const onRequest = (request, response) => {
    console.log(request.url);

    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    switch (parsedUrl.pathname){
        case '/':
            htmlHandler.getIndex(request, response);
            break;
        case '/home':
            htmlHandler.getIndex(request, response);
            break;
        case '/style.css':
            htmlHandler.getCSS(request, response);
            break;
        case '/getUsers':
            jsonHandler.getUsers(request, response);
            break;
        case '/addUser':
            parseBody(request,response,jsonHandler.addUser);
            break;
        case '/notReal':
            jsonHandler.getNotFound(request, response);
            break;
        default:
            jsonHandler.getNotFound(request, response);
            break;
    }
};

http.createServer(onRequest).listen(port, () =>{
    console.log(`Listening on 127.0.0.1:${port}`);
});