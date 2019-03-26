import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HintIcon from './hint-icon.jsx';

const WsOverlayComponent = props => (
    <div>
        <HintIcon styles={props.styles} />
    </div>
);


export default WsOverlayComponent;
