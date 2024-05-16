const app = require('./app');
const swaggerDocs = require('./swagger');



const PORT = process.env.PORT || 3001


app.listen(PORT, () => {
    console.log(`Server running on PORT=${PORT}`);
})
swaggerDocs(app, PORT)