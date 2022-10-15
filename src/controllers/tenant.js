const Auth = require('../middleware/auth.middleware');

module.exports = function (app) {

    app.post(path('tenant/create'), Auth, async (req, res) => {

    })

}