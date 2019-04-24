import PropTypes from 'prop-types';
import React from 'react';
import StarRatingComponent from 'react-star-ratings';

import styles from './feedback-user.css';


const getTitle = function (key, titleText, _classNames = "") {
    let className = styles.feedbackQuestion + _classNames;
    return <a className={className} key={key}>{titleText}</a>;
};

const getTextArea = function (key, placeholder, ref, _classNames = "") {
    let className = styles.feedbackAnswer + _classNames;
    return <textarea placeholder={placeholder} key={key}
                     className={className} ref={ref}/>
};

const getStarRating = function (key, rating, onChangeRating, starDimension, starHoverColor, starRatedColor, _classNames = "") {
    let className = styles.feedbackRating + _classNames;
    return <StarRatingComponent className={className} key={key}
                                rating={rating}
                                changeRating={onChangeRating} starDimension={starDimension}
                                starHoverColor={starHoverColor} starRatedColor={starRatedColor}
    >
    </StarRatingComponent>
};

const getButton = function (key, buttonText, onClick, _classNames = "") {
    let className = styles.submitButton + _classNames;
    return <input type="button" key={key} className={className} value={buttonText} onClick={onClick}/>
};


const FeedbackModal = props => {

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
            'type': 'button',
            'buttonText': "Submit",
            'onClick': props.submitFeedback
        },
    ];

    // const {feedbackTextRef, rating, changeRating, submitFeedback} = props;
    // return (
    //     <div className={styles.feedbackForm}>
    //         <a className={styles.feedbackQuestion}>How would you rate the code hints?</a>
    //         <textarea placeholder="Enter your feedback" className={styles.feedbackAnswer} ref={feedbackTextRef}/>
    //         <StarRatingComponent name="feedback_rating" className={styles.feedbackRating}
    //                              rating={rating}
    //                              changeRating={changeRating} starDimension="22px"
    //                              starHoverColor="#FFD700" starRatedColor="#FFD700"
    //         >
    //         </StarRatingComponent>
    //         <input type="button" className={styles.submitButton} value={"Submit"} onClick={submitFeedback}/>
    //     </div>
    // )

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