module.exports = (app) => {
    app.get("/profile", (req,res,next)=>{
        if(req.isAuthenticated()) return next();

        res.redirect("/login");
    },(req, res) =>{
        res.render('profile',{
            title: "profile",
            user: user.id
        });
    });
}