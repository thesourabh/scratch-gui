import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HintIcon from './hint-icon.jsx';

const WsOverlayComponent = props => {
    const { hints } = props.hintState;
    return (
        <div>
            {hints
                .filter(h => h.styles)
                .map(h => <HintIcon key={h.hintId} hint={h}
                    onHandleHintMenuItemClick={() => props.onHandleHintMenuItemClick(h.hintId)} />)
            }
        </div>
    );
};


export default WsOverlayComponent;
