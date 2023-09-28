import React, { useEffect, useState } from 'react';
import RowContainer from './RowContainer';
import "./Home.css";

const Home = () => {
    // State variables to manage game data
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [word, setWord] = useState([""]);

    const [score, setScore] = useState(0);
    const [timeUsed, setTimeUsed] = useState("00:00");
    const [hintN, setHintN] = useState(0);

    const [guessedWord, setGuessedWord] = useState([]);
    const [wordLeft, setWordLeft] = useState(5);

    const [level, setLevel] = useState(0);

    const WORD_ASKED = 5;

    useEffect(() => {
        let isCancelled = false;

        // Function to fetch a word from the API
        const fetchWord = async () => {
            const url = `http://localhost:4000/api/getWord/${level}/0`;

            // Simulating a delay with setTimeout for loading purposes
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!isCancelled) {
                fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setWord(data[0].toUpperCase().split(""));
                        setLoading(false);
                        fetchInit(); // Initialize game data
                        startTimer();
                        console.log("Word: " + data[0]);
                    })
                    .catch((err) => {
                        setError(err);
                        console.log(err);
                    });
            }
        }

        fetchWord();

        return () => {
            isCancelled = true;
        }
    }, []);

    let timer = null;

    // Function to fetch a new word from the API
    const fetchNewWord = async () => {
        const url = "http://localhost:4000/api/getWord/0/1";

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setWord(data[0].toUpperCase().split(""));
                setLoading(false);
                fetchInit();
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    }

    // Function to initialize game data
    const fetchInit = async () => {
        let url = "http://localhost:4000/api/init";
        console.log("Initializing game...");

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setWordLeft(WORD_ASKED - data.wordN);
                setHintN(data.hintUsed);
                setScore(data.score);
            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    }

    // Function to get a hint for the word
    const getHint = async () => {
        const url = "http://localhost:4000/api/getHint";

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setHintN(data.hintUsed);

                let guessedWordCopy = [...guessedWord];

                if (guessedWordCopy.length === 0) {
                    for (let i = 0; i < word.length; i++) {
                        guessedWordCopy.push("");
                    }
                }

                guessedWordCopy[data.atIndex] = data.letter;
                setGuessedWord(guessedWordCopy);

            })
            .catch((err) => {
                setError(err);
                console.log(err);
            });
    }

    // Function to start the timer
    const startTimer = () => {
        const duration = 45; // TODO: Duration: 45 seconds

        const now = new Date().getTime();

        setInterval(() => {
            let distance = (now + duration * 1000) - new Date().getTime();

            let minutesUsed = Math.floor((duration * 1000 - distance) / (1000 * 60));
            let secondsUsed = Math.floor((duration * 1000 - distance) / 1000) % 60;

            if (secondsUsed < 10) {
                secondsUsed = "0" + secondsUsed;
            }
            if (minutesUsed < 10) {
                minutesUsed = "0" + minutesUsed;
            }

            setTimeUsed(minutesUsed + ":" + secondsUsed);

        }, 1000);
    }


    // Function to fetch a new word and start a new round
    const newWord = () => {
        fetchNewWord();
    }

    return (
        <div>
            <nav className="navbar navbar-light bg-light">
                <span className="navbar-brand mb-0 h1">Un-Scramble</span>
            </nav>

            <div className='game-status-container'>
                <div className="game-status">Score: {score}</div>
                <div className="game-status">Time Used: {timeUsed}</div>
                {/* <div className="game-status">Words Left: {wordLeft}</div> */}
                <div className="game-status">Hints Used: {hintN}</div>
            </div>

            <RowContainer inputWord={word} bgColor="#F3F" cellN={word.length} edittable={false} />
            <RowContainer inputWord={guessedWord} cellN={word.length} edittable={true} setScore={setScore} level={level} hint={hintN} timeUsed={timeUsed} setWordLeft={setWordLeft} newWord={newWord} />
            <button onClick={getHint} className="btn btn-primary hintBtn">Hint</button>
        </div>
    );
}

export default Home;
