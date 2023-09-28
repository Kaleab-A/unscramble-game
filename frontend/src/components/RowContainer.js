import React, { useRef, useState, useEffect } from "react";
import Cell from "./Cell";
import "./RowContainer.css";

const RowContainer = (props) => {
    const inputContainer = useRef();
    const [cells, setCells] = useState([]);

    useEffect(() => {
        // Create and set cells when inputWord or cellN changes
        setCells(createCells());
    }, [props.inputWord, props.cellN]);

    const createCells = () => {
        let cells = [];
        let inputWord = props.inputWord;

        // Create Cell components for each letter in inputWord
        for (let i = 0; i < props.cellN; i++) {
            let cell = <Cell id={"input" + (i + 1)} letter={inputWord[i]} edittable={props.edittable} key={i.toString() + inputWord[i]} />;
            cells.push(cell);
        }
        return cells;
    };

    const handePress = (e) => {
        let inputChildren = inputContainer.current.childNodes;

        // Convert the pressed key to uppercase
        e.key = e.key.toUpperCase();

        let activeElementIndex = 0;

        // Find the index of the currently focused input element
        for (let i = 0; i < inputChildren.length; i++) {
            if (inputChildren[i] === document.activeElement) {
                activeElementIndex = i;
                break;
            }
        }

        if (e.key.length === 1 && "A" <= e.key && e.key <= "Z") {
            if (document.activeElement.value !== "") {
                if (activeElementIndex < inputChildren.length - 1) {
                    inputChildren[activeElementIndex + 1].focus();
                }
            }
            if (document.activeElement.value === "") {
                document.activeElement.value = e.key;
            }
        } else if (e.key === "BACKSPACE") {
            inputChildren[activeElementIndex].value = "";
            if (activeElementIndex > 0) {
                inputChildren[activeElementIndex - 1].focus();
            }
        }

        if (e.key === "ENTER") {
            checkGuess();
        }
    }

    const checkGuess = () => {
        let inputChildren = inputContainer.current.childNodes;
        let guess = "";

        // Construct the guess from input values
        for (let i = 0; i < inputChildren.length; i++) {
            guess += inputChildren[i].value;
        }

        const url = `http://localhost:4000/api/checkword/${guess}/${props.level}/${props.hint}`;
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.correct === 1) {
                    alert("Correct");
                    getScore();
                    props.newWord();
                } else {
                    inputContainer.current.classList.add("error");
                    setTimeout(() => {
                        inputContainer.current.classList.remove("error");
                    }, 1000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const getScore = () => {
        const url = "http://localhost:4000/api/getScore";

        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                props.setScore(data.score);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div ref={inputContainer} onKeyDown={(e) => handePress(e)} className="d-flex flex-row justify-content-center">
            {cells.map((cell) => {
                return cell;
            })}
        </div>
    );
}

export default RowContainer;
