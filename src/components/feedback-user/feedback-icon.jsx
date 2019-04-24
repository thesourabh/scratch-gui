import PropTypes from 'prop-types';
import React from 'react';
import Floater from 'react-floater';

import styles from './feedback-user.css';

const FeedbackIcon = props => {
    const {floaterContent, onclick, openModal} = props;
    return (
        <Floater
            content={floaterContent}
            placement="left"
            open={openModal}
        >
            <img
                onClick={onclick}
                className={styles.feedbackIcon}
            />
        </Floater>
    )
};

FeedbackIcon.propTypes = {
    submitFeedback: PropTypes.func
};

export default FeedbackIcon;