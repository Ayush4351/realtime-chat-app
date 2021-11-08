const server = require('./app');

const port = 3000;

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});