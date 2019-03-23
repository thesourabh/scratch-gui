import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React, { createRef, useRef } from "react";
import { connect } from 'react-redux';

import VM from 'scratch-vm';
import storage from '../lib/storage';
import getCostumeUrl from '../lib/get-costume-url';
import ScratchBlocks from 'scratch-blocks';

import WsOverlayComponent from '../components/wsoverlay/wsoverlay.jsx';


const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function () {
        const result = oldFn.apply(this, arguments);
        callback.apply(this, result);
        return result;
    };
};

class WsOverlay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: {
                position: 'absolute',
                top: '0px',
                left: '0px'
            }
        };

        bindAll(this, [
            'attachVM',
            'detachVM',
            'getHintIcon',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'onTargetsUpdate',
            'blockListener',
            'setDomRef',
            'showHintForBlock'
        ]);
        // Asset ID of the current sprite's current costume
        this.decodedAssetId = null;
        this.domRef = null;
        this.blockId = null;
    }
    setDomRef(element) {
        this.domRef = element;
    };

    getHintIcon() {
        if (!this.props.asset) return null;
        return getCostumeUrl(this.props.asset);
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        this.attachVM();
    }

    attachVM() {
        if (!this.props.vm) return null;
        this.workspace.addChangeListener(this.blockListener);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);
    }

    detachVM() {
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
    }

    onWorkspaceMetricsChange() {
        const block = this.workspace.getBlockById(this.blockId);
        if (!block) return;
        const blockSvg = block.getSvgRoot();
        this.showHintForBlock(blockSvg);
    }

    onWorkspaceUpdate(data) {

    }

    onTargetsUpdate() {

    }

    showHintForBlock(blockId) {
        const block = this.workspace.getBlockById(this.blockId);
        if (!block) return;
        const blockSvg = block.getSvgRoot();
        const blockWidth = blockSvg.getBBox().width;
        const hintOffset = 10;
        const computeTop = (blockSvg, workspace) => blockSvg.getBoundingClientRect().y - workspace.svgBackground_.getBoundingClientRect().top;
        const computeLeft = (blockSvg, workspace) => {
            return blockSvg.getBoundingClientRect().x - workspace.svgBackground_.getBoundingClientRect().left + (blockWidth + hintOffset) * this.workspace.scale;
        }
        this.setState({
            styles: {
                position: 'absolute',
                top: computeTop(blockSvg, this.workspace) + 'px',
                left: computeLeft(blockSvg, this.workspace) + 'px'
            }
        });
    }

    blockListener(e) {
        const testBlocks = Object.values(Blockly.getMainWorkspace().blockDB_).filter(b => !b.isShadow_ && b.type === 'motion_movesteps');
        this.blockId = testBlocks.length > 0 ? testBlocks[0].id : null;
        if (this.blockId) {
            this.showHintForBlock(this.blockId);
        }
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <div ref={this.setDomRef}>
                <WsOverlayComponent
                    hintIconURL={this.getHintIcon()}
                    styles={this.state.styles}
                    {...componentProps}
                />
            </div>
        );
    }
}

WsOverlay.propTypes = {
    asset: PropTypes.instanceOf(storage.Asset),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => {
    const targets = state.scratchGui.targets;
    const currentTargetId = targets.editingTarget;

    let asset;
    if (currentTargetId) {
        if (targets.stage.id === currentTargetId) {
            asset = targets.stage.costume.asset;
        } else if (targets.sprites.hasOwnProperty(currentTargetId)) {
            const currentSprite = targets.sprites[currentTargetId];
            asset = currentSprite.costume.asset;
        }
    }

    return {
        vm: state.scratchGui.vm,
        asset: asset
    };
};

const ConnectedComponent = connect(
    mapStateToProps
)(WsOverlay);

export default ConnectedComponent;
