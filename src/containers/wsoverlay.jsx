import React from "react";
import bindAll from 'lodash.bindall';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import VM from 'scratch-vm';
import ScratchBlocks from 'scratch-blocks';

import { setHint, updateHint, putHint, removeHint, setUpdateStatus } from '../reducers/hints-state';
import WsOverlayComponent from '../components/wsoverlay/wsoverlay.jsx';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from '../lib/hints/constants';
import { getProcedureEntry, buildHintContextMenu, highlightDuplicateBlocks } from '../lib/hints/hints-util';
import { sendAnalysisReq, getProgramXml } from '../lib/qtutor-server-api';
import { applyTransformation } from '../lib/transform-api';
import { addBlocksToWorkspace, simpleDuplicateXml } from '../lib/hints/hint-test-workspace-setup';

const isProductionMode = true;
const inactiveElapseThreshold = 3000;

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
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'onTargetsUpdate',
            'blockListener',
            'onHandleHintMenuItemClick',
            'onMouseEnter',
            'onMouseLeave'
        ]);
        // Asset ID of the current sprite's current costume
        this.decodedAssetId = null;
    }

    componentDidUpdate(prevProps) {

    }

    componentDidMount() {
        this.workspace = ScratchBlocks.getMainWorkspace();
        this.attachVM();
        console.log('todo: setup testing code');
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

    onWorkspaceUpdate(data) {
        if (!this.alreadySetup) {
            addBlocksToWorkspace(this.workspace, simpleDuplicateXml);
        }
        this.alreadySetup = true;
    }

    onTargetsUpdate() {

    }

    onWorkspaceMetricsChange() {
        const { hintState: { hints } } = this.props;

        //disregard metrics change when workspace for custom block is shown
        const isProcedureEditorOpened = this.workspace.id !== Blockly.getMainWorkspace().id;
        if (hints.length <= 0 || isProcedureEditorOpened) return;
        this.showHint();
    }

    showHint() {
        const { hintState: { hints } } = this.props;
        hints.map(h => this.updateHintTracking(h));
    }

    updateHintTracking(hint) {
        const block = this.workspace.getBlockById(hint.blockId);
        if (!block) return;
        const blockSvg = block.getSvgRoot();
        const blockWidth = block.svgPath_.getBBox().width;
        const hintOffset = 10;
        const computeTop = (blockSvg, workspace) => blockSvg.getBoundingClientRect().y - workspace.svgBackground_.getBoundingClientRect().top;
        const computeLeft = (blockSvg, workspace) => {
            return blockSvg.getBoundingClientRect().x - workspace.svgBackground_.getBoundingClientRect().left + (blockWidth + hintOffset) * this.workspace.scale;
        }

        const changes = {
            styles: {
                position: 'absolute',
                top: computeTop(blockSvg, this.workspace) + 'px',
                left: computeLeft(blockSvg, this.workspace) + 'px'
            }
        };


        this.props.onUpdateHint(hint.hintId, changes);
    }

    onHandleHintMenuItemClick(hintId, itemAction) {
        const { hintState: { hints } } = this.props;
        const hint = hints.find(h => h.hintId === hintId);

        switch (itemAction) {
            case CONTEXT_MENU_REFACTOR: {
                console.log('Apply refactoring for ' + hintId);
                applyTransformation(hintId, this.props.vm, this.workspace, this.analysisInfo);
                //DELETE HINT
                this.props.removeHint(hintId);
                console.log(this.props.hintState.hints);
                return;
            }
            case CONTEXT_MENU_CODE_SHARE: {
                console.log('Post request to save procedure to library');
                const block = this.workspace.getBlockById(hint.blockId);
                const entry = getProcedureEntry(block);
                console.log(entry);
                return;
            }
        }
    }

    getTestHints() {
        return;
        const blocksDb = Object.values(this.workspace.blockDB_);
        const badBlocks = blocksDb.filter(b => !b.isShadow_ && b.type === 'motion_movesteps');
        const procedureDefs = blocksDb.filter(b => !b.isShadow_ && b.type === 'procedures_definition');
        const smellHints = badBlocks.map(b => {
            let oldHint = this.props.hintState.hints.find(h => b.id === h.blockId);
            if (oldHint) return oldHint;
            let blockId = b.id;
            let hintId = blockId; //hintId is also block id;

            const hintMenuItems = buildHintContextMenu(DUPLICATE_CODE_SMELL_HINT_TYPE);
            return { type: DUPLICATE_CODE_SMELL_HINT_TYPE, hintId, blockId, hintMenuItems };
        });

        const shareableCodeHints = procedureDefs.map(b => {
            let oldHint = this.props.hintState.hints.find(h => b.id === h.blockId);
            if (oldHint) return oldHint;
            let blockId = b.id;
            let hintId = blockId; //hintId is also block id;

            const hintMenuItems = buildHintContextMenu(SHAREABLE_CODE_HINT_TYPE);
            return { type: SHAREABLE_CODE_HINT_TYPE, hintId, blockId, hintMenuItems };
        });

        const allHints = [...smellHints, ...shareableCodeHints];

        this.props.setHint(allHints);
    }

    analyzeWhenUserBecomeInactive() {
        const _vm = this.props.vm;
        return Promise.resolve()
            .then(() => getProgramXml(_vm))
            .then(xml => sendAnalysisReq('projectId', 'duplicate_code', xml, isProductionMode))
            .then(json => {
                const analysisInfo = this.analysisInfo = json;
                if (analysisInfo) {
                    let targetName = _vm.editingTarget.getName();
                    return this.analysisInfoToHints(analysisInfo);
                }
                return [];
            }).then(hints => {
                this.props.setHint(hints);
                return true;
            });
    }

    analysisInfoToHints(analysisInfo) {
        if(analysisInfo.error) return [];
        const hints = [];
        for (let recordKey of Object.keys(analysisInfo['records'])) {
            let record = analysisInfo['records'][recordKey];
            let { type, smellId, target, fragments } = record.smell;
            if (type === 'DuplicateCode') {
                let f = fragments[0]; //use first fragment
                let anchorBlockId = f.stmtIds[0]; //and first block of each fragment clone to place hint


                const hintMenuItems = buildHintContextMenu(DUPLICATE_CODE_SMELL_HINT_TYPE);
                const hint = {
                    type: DUPLICATE_CODE_SMELL_HINT_TYPE,
                    hintId: smellId,
                    blockId: anchorBlockId,
                    hintMenuItems
                };
                hints.push(hint);
            }
        }
        return hints;
    }

    blockListener(e) {
        if (this.workspace.isDragging()) return;
        const { hintState: { hints } } = this.props;
        if (hints.length === 0) {
            this.getTestHints();
            this.analyzeWhenUserBecomeInactive().then(res => {
                if (this.props.hintState.hints.length > 0) {
                    this.showHint();
                }
            });
        }
    }

    onMouseEnter(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        const { type } = hint;
        switch (type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(true, this.workspace, this.analysisInfo);
                return;
            default:
                return;
        }
    }

    onMouseLeave(hintId) {
        const hint = this.props.hintState.hints.find(h => h.hintId === hintId);
        const { type } = hint;
        switch (type) {
            case DUPLICATE_CODE_SMELL_HINT_TYPE:
                highlightDuplicateBlocks(false, this.workspace, this.analysisInfo);
                return;
            default:
                return;
        }

    }

    render() {
        const componentProps = omit(this.props, ['asset', 'vm']);
        return (
            <div>
                <WsOverlayComponent
                    styles={this.state.styles}
                    hints={this.state.hintState}
                    onHandleHintMenuItemClick={this.onHandleHintMenuItemClick}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
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
        setHint: hints => {
            dispatch(setHint(hints));
        },
        onUpdateHint: (hintId, changes) => {
            dispatch(updateHint(hintId, changes));
        },
        setUpdateStatus: isUpdating => dispatch(setUpdateStatus(isUpdating)),
        removeHint: hintId => {
            dispatch(removeHint(hintId))
        }
        , putHint
    }
};

const ConnectedComponent = connect(
    mapStateToProps, mapDispatchToProps
)(WsOverlay);

export default ConnectedComponent;
