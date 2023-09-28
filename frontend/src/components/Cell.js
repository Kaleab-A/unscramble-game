import React, { useEffect, useState } from "react";
import "./Cell.css";

const Cell = (props) => {

    const [letter, setLetter] = useState(props.letter);

    useEffect(() => {
        setLetter(props.letter);
    }, [props.letter])


    return <input type="text" className="cell-input" maxLength="1" defaultValue={letter} readOnly />
}

export default Cell;

// TODO: Remove value of guess when user guess is correct
// TODO: Add a hint for user to press Enter
// TODO: Add Length Functionality
