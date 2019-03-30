import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HintIcon from './hint-icon.jsx';

const HintOverlayComponent = props => {
    const { hints } = props.hintState;
    return (
        <div>
            {hints
                .filter(h => h.styles)
                .map(h => <HintIcon key={h.hintId} hint={h}
                    onHandleHintMenuItemClick={() => itemAction => props.onHandleHintMenuItemClick(h.hintId, itemAction)}
                    onMouseEnter={()=>props.onMouseEnter(h.hintId)}
                    onMouseLeave={()=>props.onMouseLeave(h.hintId)}
                />)
            }
        </div>
    );
};


export default HintOverlayComponent;
