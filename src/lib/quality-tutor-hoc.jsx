import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ScratchBlocks from 'scratch-blocks';
import {emptySprite} from "./empty-assets";
import sharedMessages from "./shared-messages";
const {loadCostume} = require('scratch-vm/src/import/load-costume');

import {IntlProvider} from 'react-intl';
const intlProvider = new IntlProvider({locale: 'en'}, {});
const {intl} = intlProvider.getChildContext();

const isProductionMode = true;
const localService = 'http://localhost:8080/analyze';
const remoteService = 'https://quality-tutor-engine.appspot.com/analyze';

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
        }


        blockListener(e) {
            const inactiveElapseThreshold = 3000;
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(
                    () => {
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
            if (!state) {
                workspace.removeHighlightBox();
                return;
            }
            for (let recordKey of Object.keys(this.analysisInfo['records'])) {
                let record = this.analysisInfo['records'][recordKey];
                if (record.smell.type === 'DuplicateCode') {
                    let fragments = record.smell['fragments'];
                    for (let fNo in fragments) {
                        let blockFragments = fragments[fNo].stmtIds;
                        workspace.drawHighlightBox(blockFragments[0], blockFragments[blockFragments.length - 1]);
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
                    if (block) {
                        if (!block.isShadow_ && !block.hint) {
                            block.setHintText(record.smell.id||record.smell.smellId);
                        }
                        if (block.hint) {
                            block.hint.setVisible(true);
                        }
                    }
                }
            }
        }

        applyTransformation(hintId) {
            let actions = this.analysisInfo.records[hintId].refactoring.actions;
            const workspace = ScratchBlocks.getMainWorkspace();
            let actionSeq = Promise.resolve();
            let newBlock;
            for (let action of actions) {
                actionSeq = actionSeq.then(() => {
                    let result = workspace.blockTransformer.executeAction(action);
                    if (result && result !== true) {
                        newBlock = result;
                    }
                });
            }
            actionSeq.then(() => {
                if (newBlock) {
                    newBlock.setHintText("Edit");
                    if (newBlock.hint) {
                        newBlock.hint.setVisible(true, "edit_procedure");
                    }
                    // ScratchBlocks.Procedures.editProcedureCallback_(newBlock);
                }
            });
        }

        testCopyCostume(){
            const sourceTargetName = "Sprite1";
            const costumeName = "costume1";
            const destinationTargetName = "Parent";
            this.copyCostume(sourceTargetName, costumeName, destinationTargetName);    
        }

        copyCostume(sourceTargetName, costumeName, destinationTargetName){
            let sourceTarget = this.vm.runtime.getSpriteTargetByName(sourceTargetName);
            let costumeIdx = sourceTarget.getCostumeIndexByName(costumeName);
            let costume = sourceTarget.getCostumes()[costumeIdx];
            let clone = Object.assign({}, costume);
            let md5ext = `${clone.assetId}.${clone.dataFormat}`;

            let destinationTarget = this.vm.runtime.getSpriteTargetByName(destinationTargetName);
            loadCostume(md5ext, clone, this.vm.runtime).then(() => {
                if (destinationTarget) {
                    destinationTarget.addCostume(clone);
                    destinationTarget.setCostume(
                        destinationTarget.getCostumes().length - 1
                    );
                }
            });
        }

        createEmptySprite(name) {
            const formatMessage = intl.formatMessage;
            const emptyItem = emptySprite(
                name,
                formatMessage(sharedMessages.pop),
                formatMessage(sharedMessages.costume, {index: 1})
            );

            this.vm.addSprite(JSON.stringify(emptyItem));
        }

        testCreateEmptySprite(){
            this.createEmptySprite("Parent");
        }

        deleteSprite(name) {
            let target = this.vm.runtime.getSpriteTargetByName(name);
            this.vm.deleteSprite(target.id);
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
            for (let i = 0; i < this.vm.runtime.targets.length; i++) {
                const currTarget = this.vm.runtime.targets[i];
                const variableMap = currTarget.variables;
                const variables = Object.keys(variableMap).map(k => variableMap[k]);
                const xmlString = `<${currTarget.isStage ? "stage " : "sprite "} 
                        name="${currTarget.getName()}" x="${currTarget.x}" y="${currTarget.y}"
                        size="${currTarget.size}" direction="${currTarget.direction}" visible="${currTarget.visible}">
                        <xml>
                            <costumes>${currTarget.getCostumes().map(c => '<costume name="' + c.name + '"/>').join('')}</costumes>
                            <variables>${variables.map(v => v.toXML()).join()}</variables>${currTarget.blocks.toXML()}
                        </xml>
                        </${currTarget.isStage ? "stage" : "sprite"}>`;

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