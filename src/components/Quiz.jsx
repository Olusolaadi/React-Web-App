
import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import Options from './Options';
import './Quiz.css';

// Initial state for the reducer
const initialState = {
    questions: [],
    currentQuestion: 0,
    showScore: false,
    score: 0,
    selectedOptions: [],
    quizSubmitted: false,
};

// Reducer function for managing state

    function quizReducer(state, action) {
    switch (action.type) {

        case 'setQuestions':
            return { ...state, questions: action.payload };

        case 'chooseOption':
            const { rightOption, answer } = action.payload;
            const newScore = rightOption ? state.score + 1 : state.score;
            const newOptions = [...state.selectedOptions];
            const nextQuestion = state.currentQuestion + 1;
            newOptions[state.currentQuestion] = answer;
            
            if (nextQuestion < state.questions.length) {
                return {
                    ...state,
                    score: newScore,
                    selectedOptions: newOptions,
                    currentQuestion: nextQuestion
                };
            } else {
                return {
                    ...state,
                    score: newScore,
                    selectedOptions: newOptions,
                    showScore: true
                };
            }

            case 'previousQuestion':
                const prevQuestion = state.currentQuestion - 1;
                if (prevQuestion >= 0) {
                return {
                    ...state,
                    currentQuestion: prevQuestion
                }
                };

        case 'resetQuiz':
            return { ...initialState, questions: state.questions }; 
        default:
            return state;
    }
};

// Quiz function.
    export default function Quiz() {
    const [state, dispatch] = useReducer(quizReducer, initialState);

    // Fetch data from the API
    
        async function getQuestions() {
        try {
            const response = await axios.get('https://quizapi.io/api/v1/questions?apiKey=3LbxpDvqfanW3VqeMQFYYotSOd2IRtM2CqejYECW&limit=20');
            dispatch({ type: 'setQuestions', payload: response.data });
            console.log(response.data)
        } catch (error) {
            console.error('Questions cannot be fetched:', error);
        }
    }

    useEffect(() => {
        getQuestions();
    }, []);

    // Handle Option Selection Click
        function handleOptionSelection(rightOption, answer) {
            dispatch({ type: 'chooseOption', payload: { rightOption, answer } });
        }
        
    // Handle Reset Quiz Button
        function handleResetQuiz() {
        dispatch({ type: 'resetQuiz' });
    }

    return (
        <div className='quiz_app'>
            <h1>Quiz App</h1>
            {state.showScore ? (
                <div className='score_section'>
                    <h2>You scored {state.score} out of {state.questions.length}</h2>
                    <h3>Review your answers:</h3>
                    {state.questions.map((question, index) => (
                        <div key={index} className="review_section">
                            <p>Q{index + 1}: {question.question}</p>
                            <p>Your Answer: {state.selectedOptions[index] || "Not answered"}</p>
                            <p>Correct Answer: {Object.entries(question.correct_answers)
                                .filter(([key, value]) => value === "true")
                                .map(([key]) => question.answers[key.replace('_correct', '')])
                            }</p>
                        </div>
                    ))}
                    <button className='reset_quiz' onClick={handleResetQuiz}>Reset Quiz</button>
                </div>
            ) : (
                <>
                    {state.questions.length > 0 ? (
                        <div className='question_section'>
                            <div className='question_no'>
                                <span>{state.currentQuestion + 1}</span>/{state.questions.length}
                            </div>
                            <div className='question_text'>
                                {state.questions[state.currentQuestion]?.question}
                            </div>

                            <Options 
                                questions={state.questions} 
                                currentQuestion={state.currentQuestion} 
                                handleOptionSelection={handleOptionSelection} 
                            />

                            <div className='nav_btn'>
                                {state.currentQuestion > 0 && (
                                    <button onClick={() => dispatch({ type: 'previousQuestion', payload: { rightOption: true, answer: null } })}>Previous</button>
                                )}
                                {state.currentQuestion < state.questions.length && (
                                    <button onClick={() => dispatch({ type: 'chooseOption', payload: { rightOption: true, answer: null } })}>Next</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </>
            )}
        </div>
    );
};