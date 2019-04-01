import React from 'react';
import Floater from 'react-floater';
import HintIcon from './hint-icon.jsx';
import {DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE} from "../../lib/hints/constants";

const getHintOverlayText = function (type) {
    switch (type) {
        case DUPLICATE_CODE_SMELL_HINT_TYPE:
            return "Reuse the repeated code by creating procedure. Right click to see options.";
        case SHAREABLE_CODE_HINT_TYPE:
            return "Sharable code found here.";
        default:
            return "Code hint available."
    }
};

const HintOverlayComponent = props => {
    const { hints } = props.hintState;
    return (
        <div>
            {hints
                .filter(h => h.styles)
                .map(h => <Floater
                    content={getHintOverlayText(h.type)}
                    event="hover"
                    key={h.hintId + "_floater"}
                    target={".hint_icon_" + h.hintId}
                    placement="right"
                >
                    <HintIcon key={h.hintId} hint={h}
                              onHandleHintMenuItemClick={() => itemAction => props.onHandleHintMenuItemClick(h.hintId, itemAction)}
                              onMouseEnter={() => props.onMouseEnter(h.hintId)}
                              onMouseLeave={() => props.onMouseLeave(h.hintId)}
                    />
                </Floater>)
            }
        </div>
    );
};


export default HintOverlayComponent;
