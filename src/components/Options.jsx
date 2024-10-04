import React from 'react'

export default function Options({ questions, currentQuestion, handleOptionSelection }) {
    const currentOption = questions[currentQuestion]?.answers;

    return (
        <div className='answer_section'>
            {Object.entries(currentOption).map(([key, option]) => (
                option && (
                    <button key={key} onClick={() => handleOptionSelection(option.right, option)}>
                        {option}
                    </button>
                )
            ))}
        </div>
    );
}