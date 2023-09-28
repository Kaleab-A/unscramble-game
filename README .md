<!-- Project Title -->
<h1 align="center">Unscramble Letter Game</h1>

<!-- Project Description -->
<p align="center">
  Welcome to the Unscramble Letter Game! This interactive word game challenges users to unscramble a given set of letters to form a word. The program sources words from the Free Random Word Generator API and is built using React.js for the frontend and Express.js for the backend.
</p>

<!-- Table of Contents -->
## Table of Contents

- [How to Run](#how-to-run)
- [How It Works](#how-it-works)

<!-- How to Run -->
## How to Run

To run the Unscramble Letter Game on your local machine, follow these steps:

1. **Clone the Repository**:
   - Clone this repository to your local machine using the following command:
     ```
     git clone https://github.com/ChangePlusPlusVandy/change-coding-challenge-2023-Kaleab-A.git
     ```

2. **Run the Backend**:
   - Navigate to the `backend` folder in your terminal.
   - Run the backend server by executing the following command:
     ```
     npm run devStart
     ```

3. **Run the Frontend**:
   - Open a new terminal window and navigate to the `frontend` folder.
   - Start the frontend by running the following command:
     ```
     npm start
     ```

4. **Access the Game**:
   - Open your web browser and visit `http://localhost:3000` to access and play the Unscramble Letter Game.

<!-- How It Works -->
## How It Works

1. **Word Retrieval from API**:
   - The program starts by requesting a word from the [Free Random Word Generator API](https://random-word-api.vercel.app/).

2. **Scrambling**:
   - The retrieved word is then scrambled at the backend of the application.

3. **Session Management**:
   - The backend utilizes Express.js and `express-session` for session management, ensuring that data is maintained within the same session.

4. **User Input and Validation**:
   - Users are presented with a scrambled word and are expected to input their unscrambled guess.
   - Upon submitting a guess, it is sent to the backend for validation.

5. **Hint Feature**:
   - Users can request a hint for a word by clicking a dedicated button.
   - The backend randomly chooses a letter to expose as a hint.

6. **Score Calculation**:
   - Scores are calculated based on the time it takes to solve a word and the number of hints used.

7. **Iterative Gameplay**:
   - After successfully unscrambling a word, the program requests a new random word from the API.
   - This loop continues for a set number of rounds (typically 5 words).


Feel free to explore and enjoy the Unscramble Letter Game! Have fun unscrambling words and improving your word skills.
</p>
