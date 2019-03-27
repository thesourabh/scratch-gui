import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import lightBulbIcon from './light-bulb-icon.svg';
import codeShareIcon from './light-bulb-icon.svg';

import iconStyles from './light-bulb.css';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ContextMenu, MenuItem } from '../context-menu/context-menu.jsx';

const SMELL_ICON = "SMELL_ICON";
const SHARE_ICON = "SHARE_ICON";

const getIconSpec = (type) => {
    switch (type) {
        case SMELL_ICON:
            return {
                className: "light-bulb",
                iconSvg: lightBulbIcon,
                iconStyles: iconStyles.lightBulb
            }
        case SHARE_ICON:
            return {
                className: "light-bulb",
                iconSvg: codeShareIcon,
                iconStyles: iconStyles.lightBulb
            }
    }

}

const HintIcon = props => {
    const { hintId, styles, hintMenuItems } = props.hint;
    const { className, iconSvg, iconStyles } = getIconSpec(SMELL_ICON);
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
