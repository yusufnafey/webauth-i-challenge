const server = require("./server");

const port = 3333;

server.listen(port, () => {
  console.log(`===== Listening on port ${port} =====`);
});
