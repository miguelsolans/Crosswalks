/* Entry Point
 * Authors: César Borges, Fábio Senra, Miguel Solans
 */
require('dotenv').config();

const app     = require('./config/server');
const PORT    = process.env.PORT || process.env.APP_PORT;

app.listen(PORT, () => console.log(`Magic Port ${PORT}`));
