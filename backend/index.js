const express = require('express');
const axios = require('axios');
var cors = require('cors');
const session = require('express-session');

const app = express();

TIME_FACTOR = 1.04;

// Enable CORS for specific origin and methods
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
}));

// Initialize session middleware
app.use(session({
    secret: 'dm3oi3SD#$idas',
    resave: false,
    saveUninitialized: false, // Prevents saving uninitialized sessions
}));

const PORT = process.env.PORT || 4000;

// Endpoint to get a word based on level and new flag
app.get('/api/getWord/:level/:new', (req, res) => {
    const level2Length = { 0: 4, 1: 5, 2: 6 }

    // API to get a random word based on the level of difficulty
    const url = `https://random-word-api.vercel.app/api?words=1&length=${level2Length[req.params["level"]]}`;

    axios.get(url).then((word) => {
        // Store the word in the session to check guesses later
        if (req.params["new"] == 1 || req.session.word == undefined) {
            req.session.word = word.data[0];
            req.session.hintUsed = 0;
            req.session.hintIndexs = [];
            req.session.startTime = new Date().getTime();

            for (let i = 0; i < req.session.word.length; i++) {
                req.session.hintIndexs.push(i);
            }

            // Initialize the score if it's undefined
            if (req.session.score == undefined) {
                initizeSessionVars(req);
            }
        }
        console.log("Word:", req.session.word)
        res.send([shuffleString(req.session.word)]);
    })
});

// Endpoint to check a guessed word
app.get('/api/checkword/:guess/:level/:hint', (req, res) => {
    if (req.params["guess"].toUpperCase() == req.session.word.toUpperCase()) {
        let timeDiff = new Date().getTime() - req.session.startTime;

        currentScore = calculateScore(req.params["hint"], timeDiff, req.params["level"]);

        // Averaging the performance score with the previous scores
        req.session.score *= (req.session.wordN - 1);
        req.session.score += currentScore;
        req.session.score /= req.session.wordN;
        req.session.score = Math.round(req.session.score * 100) / 100;

        req.session.wordN += 1;

        res.send({ "correct": 1, "score": req.session.score });

    } else {
        res.send({ "correct": 0, "score": req.session.score })
    }
});

// Endpoint to get a hint for the word
app.get("/api/getHint", (req, res) => {
    if (!req.session.hintIndexs) {
        initizeSessionVars(req);
        console.log("!!!!!!!!!!!!!!!!! Initialized session variables again")
    }
    req.session.hintUsed += 1

    let randomIndex = req.session.hintIndexs[Math.floor(Math.random() * req.session.hintIndexs.length)];

    req.session.hintIndexs.splice(req.session.hintIndexs.indexOf(randomIndex), 1);

    response = {
        "atIndex": randomIndex,
        "letter": req.session.word[randomIndex],
        "hintUsed": req.session.hintUsed
    }

    res.send(response);
});

// Endpoint to initialize game data
app.get("/api/init", (req, res) => {
    res.send({
        "score": req.session.score,
        "wordN": req.session.wordN,
        "hintUsed": req.session.hintUsed,
    });
});

// Endpoint to get the current score
app.get("/api/getScore", (req, res) => {
    res.send({ "score": req.session.score });
});

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));

const initizeSessionVars = (req) => {
    req.session.score = 0;
    req.session.hintUsed = 0;
    req.session.wordN = 1;
    req.session.hintIndexs = [];
    req.session.startTime = new Date().getTime();

    for (let i = 0; i < req.session.word.length; i++) {
        req.session.hintIndexs.push(i);
    }
    console.log("Initialized session variables", req.session.hintIndexs);
};

const shuffleString = (str) => {
    let shuffledStr = "";
    let strCopy = str;

    while (strCopy.length > 0) {
        let randomIndex = Math.floor(Math.random() * strCopy.length);
        shuffledStr += strCopy[randomIndex];
        strCopy = strCopy.slice(0, randomIndex) + strCopy.slice(randomIndex + 1);
    }

    return shuffledStr;
};

const calculateScore = (hint, timeUsed, level) => {
    // TODO: 45 seconds is the max time

    // hintFactor is how much fraction of the final score the hint is worth
    let hintFactor = hint / (level + 4 - 1);

    // timeFactor penalizes more for longer time
    let timeFactor = 1 - modifiedSigmoid(timeUsed / 1000)

    let score = 100 * (1 - hintFactor) * timeFactor;

    return score;
};

const modifiedSigmoid = (x) => {
    return (1 / (1 + Math.pow(TIME_FACTOR, -x))) * 2 - 1;
}