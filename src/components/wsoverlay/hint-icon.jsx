import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import lightBulb from './light-bulb.svg';
import styles from './light-bulb.css';

const HintIcon = props => (
    <div style={props.styles}>
        <img
            className={classNames(
                "light-bulb",
                styles.lightBulb
            )}
            src={lightBulb}
        />
    </div>
);

HintIcon.propTypes = {
    hintIconURL: PropTypes.string,
    styles: PropTypes.object
};

export default HintIcon;
