import PropTypes from 'prop-types';
import React from 'react';

import styles from './watermark.css';

const WsOverlay = props => (
    <div style={props.styles}>
        <img
            className={styles.spriteImage}
            src={props.hintIconURL}
        />
    </div>
);

WsOverlay.propTypes = {
    hintIconURL: PropTypes.string,
    styles: PropTypes.object
};

export default WsOverlay;
