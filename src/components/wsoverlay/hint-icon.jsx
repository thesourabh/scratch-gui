import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import lightBulbIcon from './light-bulb-icon.svg';
import codeShareIcon from './share-icon.svg';

import iconStyles from './hint-icon.css';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ContextMenu, MenuItem } from '../context-menu/context-menu.jsx';
import {DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE} from '../../lib/hints/constants';



const getIconSpec = (type) => {
    switch (type) {
        case DUPLICATE_CODE_SMELL_HINT_TYPE:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
        case SHAREABLE_CODE_HINT_TYPE:
            return {
                className: "light-bulb",
                iconSvg: codeShareIcon,
                iconStyles: iconStyles.lightBulb
            }
    }

}

const HintIcon = props => {
    const { type, hintId, styles, hintMenuItems } = props.hint;
    const { className, iconSvg, iconStyles } = getIconSpec(type);
    return (
        <div style={styles}>
            <ContextMenuTrigger id={hintId}>
                <img
                    className={classNames(
                        className, iconStyles
                    )}
                    src={iconSvg}
                />
            </ContextMenuTrigger>
            <ContextMenu id={hintId} hideOnLeave={true}>
                {
                    hintMenuItems.map((menuItem, key) => (
                        <MenuItem key={key} onClick={() => props.onHandleHintMenuItemClick()(menuItem.item_action)}>
                            {menuItem.item_name}
                        </MenuItem>
                    ))
                }

            </ContextMenu>
        </div>
    );
};


export default HintIcon;
