const users = {};

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    response.writeHead(status, headers);

    response.write(content);

    response.end();
};

const getUsers = (request, response) => {
    const responseJSON = {
        users,
    };

    return respondJSON(request, response, 200, responseJSON);
    
};

const createUser = (request, response, name, age) => {
    const newUser = {
        name: name,
        age: age
    };

    users[newUser.name] = newUser;

    return respondJSON(request, response, 201, newUser);
};

const updateUser = (request, response, name, age) => {
    const newUser = {
        name: name,
        age: age
    };

    users[newUser.name] = newUser;

    return respondJSON(request, response, 204, newUser);
};

const userError = (request, response) => {
    const responseJSON = {
        message: 'Name and age are both required.',
        id: 'userMissingParameters',
    };

    return respondJSON(request, response, 400, responseJSON);
};

const addUser = (request, response) => {
    const { name, age } = request.body;

    if(name && age){
        if(users[name]){
            return updateUser(request, response, name, age);
        }
        else{
            return createUser(request, response, name, age);
        }
    }
    else{
        return userError(request, response);
    }
};

const getNotFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getUsers,
    addUser,
    getNotFound,
};