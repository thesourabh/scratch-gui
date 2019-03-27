import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import lightBulb from './light-bulb.svg';
import iconStyles from './light-bulb.css';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ContextMenu, MenuItem } from '../context-menu/context-menu.jsx';

const HintIcon = props => {
    const { hintId, styles, hintMenuItems } = props.hint;
    return (
        <div style={styles}>
            <ContextMenuTrigger id={hintId}>
                <img
                    className={classNames(
                        "light-bulb",
                        iconStyles.lightBulb
                    )}
                    src={lightBulb}
                />
            </ContextMenuTrigger>
            <ContextMenu id={hintId} hideOnLeave={true}>
                {
                    hintMenuItems.map((menuItem,key) => (
                        <MenuItem key={key} onClick={props.onHandleHintMenuItemClick}>
                            {menuItem.item_name}
                        </MenuItem>
                    ))
                }

            </ContextMenu>
        </div>
    );
};

HintIcon.propTypes = {
    hintIconURL: PropTypes.string,
    styles: PropTypes.object
};

export default HintIcon;
