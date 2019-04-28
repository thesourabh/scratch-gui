import PropTypes from 'prop-types';
import React from 'react';
import StarRatingComponent from 'react-star-ratings';
import Quiz from 'react-quiz-component';

import styles from './feedback-user.css';


const getTitle = function (key, titleText, _classNames = "") {
    let className = styles.feedbackQuestion + " " + _classNames;
    return <a className={className} key={key}>{titleText}</a>;
};

const getTextArea = function (key, placeholder, ref, _classNames = "") {
    let className = styles.feedbackAnswer + " " + _classNames;
    return <textarea placeholder={placeholder} key={key}
                     className={className} ref={ref}/>
};

const getStarRating = function (key, rating, onChangeRating, starDimension, starHoverColor, starRatedColor, _classNames = "") {
    let className = styles.feedbackRating + " " + _classNames;
    return <StarRatingComponent className={className} key={key}
                                rating={rating}
                                changeRating={onChangeRating} starDimension={starDimension}
                                starHoverColor={starHoverColor} starRatedColor={starRatedColor}
    >
    </StarRatingComponent>
};

const getButton = function (key, buttonText, onClick, _classNames = "") {
    let className = styles.submitButton + " " + _classNames;
    return <input type="button" key={key} className={className} value={buttonText} onClick={onClick}/>
};

const getHtmlElement = function (key, html, _classNames = "") {
    let className = styles.feedbackHtml + " " + _classNames;
    return <div key={key} dangerouslySetInnerHTML={{__html: html}} className={className}></div>
};

const getQuiz = function (key, quizJSON) {
    return <Quiz key={key} quiz={quizJSON} showInstantFeedback={true} continueTillCorrect={true}/>
};


const FeedbackModal = props => {

    const QUIZ_JSON = {
        "quizTitle": "Title of the Quiz",
        "quizSynopsis": "This is the synopsis of the quiz",
        "questions": [
            {
                "question": "How do you correct the duplicated code problem?",
                "questionType": "text",
                "answers": [
                    "Right click on hint and click Extract Procedure",
                    "Don't do anything",
                    "Type \"fix code\" in the terminal",
                ],
                "correctAnswer": "1",
                "messageForCorrectAnswer": "Correct answer. Good job.",
                "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
                "explanation": "Right clicking the hint icon brings up the options to fix the code automatically"
            },
            {
                "question": "Guess what number was hardcoded here?",
                "questionType": "text",
                "answers": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "correctAnswer": "2",
                "messageForCorrectAnswer": "Correct answer. Good job.",
                "messageForIncorrectAnswer": "Incorrect answer. Please try again.",
                "explanation": "2 was hardcoded here."
            }
        ]
    };

    const FEEDBACK_JSON = [
        {'type': 'a_text', 'text': "How would you rate the code hints?"},
        {
            'type': 'textarea',
            'id': "feedback-text",
            'placeholder': "Enter your feedback",
            'ref': props.feedbackTextRef
        },
        {
            'type': 'star_rating',
            'rating': props.rating,
            'onChangeRating': props.changeRating,
            'starDimension': '22px',
            'starHoverColor': '#FFD700',
            'starRatedColor': '#FFD700'
        },
        {
            'type': 'quiz',
            'quizJSON': QUIZ_JSON
        },
        {
            'type': 'html_element',
            'html': '<img src="https://zhenyong.github.io/react/img/logo.svg">'
        },
        {
            'type': 'button',
            'buttonText': "Submit",
            'onClick': props.submitFeedback
        },
    ];

    let modalElements = [];
    for (let i = 0; i < FEEDBACK_JSON.length; i++) {
        let obj = FEEDBACK_JSON[i];
        let newElem = null;
        switch (obj.type) {
            case 'a_text':
                newElem = getTitle(i, obj.text);
                break;
            case 'textarea':
                newElem = getTextArea(i, obj.placeholder, obj.ref);
                break;
            case 'star_rating':
                newElem = getStarRating(i, obj.rating, obj.onChangeRating, obj.starDimension, obj.starHoverColor, obj.starRatedColor);
                break;
            case 'button':
                newElem = getButton(i, obj.buttonText, obj.onClick);
                break;
            case 'html_element':
                newElem = getHtmlElement(i, obj.html);
                break;
            case 'quiz':
                newElem = getQuiz(i, obj.quizJSON);
                break;
        }
        modalElements.push(newElem);
    }
    return (
        <div className={styles.feedbackForm}>
            {modalElements}
        </div>
    )
};

FeedbackModal.propTypes = {
    feedbackTextRef: PropTypes.func,
    submitFeedback: PropTypes.func
};

export default FeedbackModal;