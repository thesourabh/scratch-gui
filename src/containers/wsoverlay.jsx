import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { setHint, updateHint, putHint, removeHint } from '../reducers/hints-state';
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
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'onTargetsUpdate',
            'blockListener',
            'testGenerateHints',
            'showHintForBlock'
        ]);
        // Asset ID of the current sprite's current costume
        this.decodedAssetId = null;
        this.counter = 0;
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
        const { hintState: { hints } } = this.props;
        if (hints.length < 0) return;
        const block = this.workspace.getBlockById(hints[0].blockId);
        if (!block) return;
        this.showHintForBlock(hints[0].blockId);
    }

    onWorkspaceUpdate(data) {

    }

    onTargetsUpdate() {

    }

    showHint(hintId) {
        const { hintState: { hints } } = this.props;
        this.showHintForBlock(hints[0].blockId);
    }

    showHintForBlock(blockId) {
        const block = this.workspace.getBlockById(blockId);
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

    testGenerateHints() {
        const badBlocks = Object.values(Blockly.getMainWorkspace().blockDB_).filter(b => !b.isShadow_ && b.type === 'motion_movesteps');
        const hints = badBlocks.map(b => {
            let oldHint = this.props.hintState.hints.find(h => b.id === h.blockId);
            if (oldHint) return oldHint;
            let hintId = this.counter++;
            let blockId = b.id;
            return { hintId, blockId };
        });
        this.props.setHint(hints);
        console.log(this.props.hintState);
    }

    blockListener(e) {
        this.testGenerateHints();
        const { hintState: { hints } } = this.props;
        if (hints.length > 0) {
            this.showHint(hints[0].hintId);
        }
    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <div>
                <WsOverlayComponent
                    styles={this.state.styles}
                    {...componentProps}
                />
            </div>
        );
    }
}

WsOverlay.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => {
    const targets = state.scratchGui.targets;
    const currentTargetId = targets.editingTarget;
    return {
        vm: state.scratchGui.vm,
        hintState: state.scratchGui.hintState,
        currentTargetId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setHint: hints => dispatch(setHint(hints))
        // , updateHint, putHint, removeHint
    }
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(WsOverlay);

export default ConnectedComponent;
