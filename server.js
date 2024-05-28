const app = require("./src/app");
require('dotenv')

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with port ${PORT}`);
})

// process.on('SIGINT', () => {
//     server.close(()=> console.log('Exit server Express'))
//     // app.notify.send( ping ... )
// })