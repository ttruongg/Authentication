import express from "express";
import 'dotenv/config';
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";

const app = express();
const { PORT, KEY_SESSION } = process.env;

const store = session.MemoryStore();

app.use(session({
    saveUninitialized: false,
    secret: KEY_SESSION,
    resave: false,
    cookie: {
        maxAge: 1000 * 10 //10s
    },
    store
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.json());

app.get("/status", (req, res) => {
    res.status(200).json({
        status: "sucess",
        message: "ok"
    })
});

app.listen(PORT, () => {
    console.log("Server is running at Port " + PORT);
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}), (req, res) => {
    try {
        res.json({
            body: req.body
        })
    } catch (error) {
        res.json({ error: error.stack });
    }
});
const user = {
    userId: 1,
    username: "dev@gmail.com",
    password: "dev123"
}

passport.use(new Strategy((username, password, done) => {
    if (username === user.username && password === user.password) {
        return done(null, user);
    }
    done(null, false);

}));

passport.serializeUser((user, done) => {
    done(null, user.userId)
});

passport.deserializeUser((userId, done) => {
    if (userId === user.userId) {
        return done(null, {
            userId,
            active: true
        })
    }
    done(null, false);
});

app.get('/profile', (req, res) => {
    if(req.isAuthenticated()){
        return res.status(200).json({
            status: 'success',
            data: {
                name: 'HawlDev',
                age: 22,
                blog: 'HawlDev.com'
            }
        })
    }
    res.status(200).json({
        status: 'failed',
        message: 'Missing'
    })
    
})