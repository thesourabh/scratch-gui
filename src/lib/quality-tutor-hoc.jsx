import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ScratchBlocks from 'scratch-blocks';

const isProductionMode = true;
const localService = 'http://localhost:8080/analyze';
const remoteService = 'https://quality-tutor-engine.appspot.com/analyze';

const qualityTutorHOC = function (WrappedComponent) {
    class QualityTutor extends React.Component {
        constructor(props) {
            super(props);
            this.hints = [];
        }

        mockHintGeneration() {
            const workspace = ScratchBlocks.getMainWorkspace();
            const blockIds = Object.keys(workspace.blockDB_);
            if (blockIds.length > 0) {
                const block = workspace.getBlockById(blockIds[0]);
                if (!block.isShadow_ && !block.hint) {
                    block.setHintText("hintId");
                }
                if (block.hint) {
                    block.hint.setVisible(true);
                }
            }
        }

        componentDidMount() {
            this.initializeTutor();
        }

        initializeTutor() {
            console.log('initialize tutor');
            const vm = this.vm = this.props.vm;
            const workspace = ScratchBlocks.getMainWorkspace();

            this.blockListener = this.blockListener.bind(this);
            workspace.addChangeListener(this.blockListener);
            this.isInactive = false;
        }


        blockListener(e) {
            // this.mockHintGeneration();
            const inactiveElapseThreshold = 3000;
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(
                    () => {
                        const workspace = ScratchBlocks.getMainWorkspace();
                        new Promise((resolve, reject) =>
                            resolve(this.getProgramXml()))
                            .then(xml => this.sendAnalysisReq('projectId', 'duplicate_code', xml))
                            .then(json => {
                                console.log(json);
                                this.analysisInfo = json;
                                this.populateHintIcons();
                            });

                        console.log('User Inactive Detected!');
                    },
                    inactiveElapseThreshold
                );
            } else {
                this.timerId = setTimeout(
                    () => { },
                    2000
                );
            }

            if (e.type !== 'hint_click') {
                return;
            }
           
            if(e.interactionType==='improve_option_click'){
                this.applyTransformation(e.hintId);    
            }

            if(e.interactionType==='mouseover'){
                this.highlightDuplicateBlocks(true);
            }

            if (e.interactionType === 'mouseout') {
                this.highlightDuplicateBlocks(false);
            }
        };

        highlightDuplicateBlocks (state) {
            const workspace = ScratchBlocks.getMainWorkspace();
            for (let recordKey of Object.keys(this.analysisInfo['records'])) {
                let record = this.analysisInfo['records'][recordKey];
                if (record.smell.type === 'DuplicateCode') {
                    let fragments = record.smell['fragments'];
                    for (let fNo in fragments) {
                        workspace.highlightBlock(fragments[fNo].stmtIds[0], state);
                    }
                }
            }
        };

        populateHintIcons() {
            const workspace = ScratchBlocks.getMainWorkspace();
            for (let recordKey of Object.keys(this.analysisInfo['records'])) {
                let record = this.analysisInfo['records'][recordKey];
                if (record.smell.type === 'DuplicateCode') {
                    let fragments = record.smell['fragments'];
                    let f = fragments[0]; //use first fragment
                    let anchorBlockId = f.stmtIds[0]; //and first block of each fragment clone to place hint
                    let block = workspace.getBlockById(anchorBlockId);
                    if (!block.isShadow_ && !block.hint) {
                        block.setHintText(record.smell.id);
                    }
                    if (block.hint) {
                        block.hint.setVisible(true);
                    }
                }
            }
        }

        applyTransformation(hintId) {
            let actions = this.analysisInfo.records[hintId].refactoring.actions;
            const workspace = ScratchBlocks.getMainWorkspace();
            console.log(actions);
            let actionSeq = Promise.resolve();
            for (let action of actions) {
                actionSeq = actionSeq.then(() => workspace.blockTransformer.executeAction(action));
            }
        }

        sendAnalysisReq(projectId, analysisType, xml) {
            const url = isProductionMode? remoteService: localService;
            return fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                headers: {
                    "Content-Type": "text/xml",
                    "id": projectId,
                    "type": analysisType
                },
                body: xml,
            }).then(res => res.json())
        }

        getProgramXml() {
            let targets = "";
            const stageVariables = this.vm.runtime.getTargetForStage().variables;
            for (let i = 0; i < this.vm.runtime.targets.length; i++) {
                const currTarget = this.vm.runtime.targets[i];
                const currBlocks = currTarget.blocks._blocks;
                const variableMap = currTarget.variables;
                const variables = Object.keys(variableMap).map(k => variableMap[k]);
                const xmlString = `<${currTarget.isStage ? "stage " : "sprite "} name="${currTarget.getName()}"><xml><variables>${variables.map(v => v.toXML()).join()}</variables>${currTarget.blocks.toXML()}</xml></${currTarget.isStage ? "stage" : "sprite"}>`;

                targets += xmlString;
            }
            var str = `<program>${targets}</program>`;
            str = str.replace(/\s+/g, ' '); // Keep only one space character
            str = str.replace(/>\s*/g, '>');  // Remove space after >
            str = str.replace(/\s*</g, '<');  // Remove space before <

            return str;
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