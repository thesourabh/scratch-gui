import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ScratchBlocks from 'scratch-blocks';

import { copyCostume, createEmptySprite, deleteSprite } from './transform-api';
import { sendAnalysisReq, getProgramXml } from './qtutor-server-api';
import { highlightDuplicateBlocks, populateHintIcons } from './hint-manager';
import { applyTransformation } from './transform-api';

const isProductionMode = false;

const inactiveElapseThreshold = 3000;

const qualityTutorHOC = function (WrappedComponent) {
    class QualityTutor extends React.Component {
        constructor(props) {
            super(props);
            this.hints = [];
        }

        componentDidMount() {
            this.initializeTutor();
        }

        initializeTutor() {
            this.vm = this.props.vm;
            const workspace = ScratchBlocks.getMainWorkspace();
            this.blockListener = this.blockListener.bind(this);
            workspace.addChangeListener(this.blockListener);
            this.isInactive = false;
            window.tutor = this;

            this.vm.on('workspaceUpdate', () => {
                console.log(workspace.id);
                workspace.hideHint();
            });
        }

        blockListener(e) {
            const workspace = ScratchBlocks.getMainWorkspace(); // update workspace may change

            console.log('TODO: if event is not block editing should not check');
            this.analyzeWhenUserBecomeInactive();

            if (e.type !== 'hint_click') {
                return;
            }

            if (e.interactionType === 'improve_option_click') {
                applyTransformation(e.hintId, workspace, this.analysisInfo);
            }


            if (e.interactionType === 'mouseover') {
                highlightDuplicateBlocks(true, workspace, this.analysisInfo);
            }

            if (e.interactionType === 'mouseout') {
                highlightDuplicateBlocks(false, workspace, this.analysisInfo);
            }
        };

        analyzeWhenUserBecomeInactive() {
            const _vm = this.vm;
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(
                    () => {
                        console.log('Inactivity Detected! ...sending analysis request');
                        Promise.resolve()
                            .then(() => getProgramXml(_vm))
                            .then(xml => sendAnalysisReq('projectId', 'duplicate_sprite', xml, isProductionMode))
                            .then(json => {
                                this.analysisInfo = json;
                                if (this.analysisInfo) {
                                    let targetName = _vm.editingTarget.getName();
                                    populateHintIcons(targetName,ScratchBlocks.getMainWorkspace(), this.analysisInfo);
                                }
                            });
                    }, inactiveElapseThreshold
                );
            }
            else {
                // initial timeout when started 
                this.timerId = setTimeout(() => { }, 2000);
            }
        }

        copyCostume_() {
            const sourceTargetName = "Sprite1";
            const costumeName = "costume1";
            const destinationTargetName = "Parent";
            copyCostume(this.vm, sourceTargetName, costumeName, destinationTargetName);
        }

        createEmptySprite_() {
            createEmptySprite(this.vm, "Parent");
        }

        deleteSprite_() {
            deleteSprite(this.vm, "Parent");
        }

        render() {
            const {
                vm,
                canUseCloud,
                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    canUseCloud={canUseCloud}
                    vm={vm}
                    {...componentProps}
                />
            );
        }
    }

    const maptStateToProps = state => {
        return {};
    };

    const mapDispatchToProps = () => ({});

    return connect(
        maptStateToProps,
        mapDispatchToProps
    )(QualityTutor);
}

export default qualityTutorHOC;