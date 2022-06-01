function ensureAuthenticated2(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Please login in to view this resource')
    res.redirect('/users/login2')
}

function forwardAuthenticated2(req, res, next) {
    if(req.isAuthenticated()) {
        res.redirect('/busno')
    }
    return next()
}

module.exports = { ensureAuthenticated2, forwardAuthenticated2 }