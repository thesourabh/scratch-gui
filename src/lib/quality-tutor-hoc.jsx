import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ScratchBlocks from 'scratch-blocks';

import { copyCostume, createEmptySprite, deleteSprite } from './transform-api';
import { sendAnalysisReq, getProgramXml } from './qtutor-server-api';
import { highlightDuplicateBlocks, populateHintIcons } from './hint-manager';
import { applyTransformation } from './transform-api';
import { setHint, updateHint, putHint, removeHint, setUpdateStatus } from '../reducers/hints-state';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE } from '../lib/hints/constants';
import {getProcedureEntry, buildHintContextMenu} from '../lib/hints/hints-util';

const isProductionMode = true;

const inactiveElapseThreshold = 3000;
const dummyJson = null;//{"records":{"69df1af241b4dfd1":{"id":"69df1af241b4dfd1","smell":{"type":"DuplicateSprite","smellId":"69df1af241b4dfd1","sprites":[{"spriteName":"glass water costume"},{"spriteName":"parrot costume"}],"metadata":{"group_size":2,"instance_size":3,"_id":"69df1af241b4dfd1","sprites":["glass water costume","parrot costume"]}},"refactoring":{"smellId":"69df1af241b4dfd1","actions":[{"type":"SpriteCreate","spriteName":"parent"},{"type":"CostumeCopy","name":"glass water","copyDestination":"parent","copySource":"glass water costume"},{"type":"CostumeCopy","name":"parrot-a","copyDestination":"parent","copySource":"parrot costume"},{"type":"BlockCreateAction","blockId":null,"info":null,"targetName":"parent","block_xml":"<block type='event_whenflagclicked' id='lr'>\n      <next><block type='looks_hide' id='Ee'>\n      <next><block type='looks_switchcostumeto' id='Xg' x='0' y='0'>\n      <value name='COSTUME'><shadow type='looks_costume' id='JR'><field name='COSTUME'>glass water</field></shadow></value><next><block type='motion_gotoxy' id='F3' x='0' y='0'>\n      <value name='X'><shadow type='math_number' id='du'><field name='NUM'>-51</field></shadow></value><value name='Y'><shadow type='math_number' id='1c'><field name='NUM'>-73</field></shadow></value><next><block type='control_create_clone_of' id='Et' x='0' y='0'>\n      <value name='CLONE_OPTION'><shadow type='control_create_clone_of_menu' id='dU'><field name='CLONE_OPTION'>_myself_</field></shadow></value><next><block type='looks_switchcostumeto' id='r2' x='0' y='0'>\n      <value name='COSTUME'><shadow type='looks_costume' id='qb'><field name='COSTUME'>parrot-a</field></shadow></value><next><block type='motion_gotoxy' id='Qq' x='0' y='0'>\n      <value name='X'><shadow type='math_number' id='Zg'><field name='NUM'>-123</field></shadow></value><value name='Y'><shadow type='math_number' id='Tl'><field name='NUM'>29</field></shadow></value><next><block type='looks_setsizeto' id='3t' x='0' y='0'>\n      <value name='SIZE'><shadow type='math_number' id='FP'><field name='NUM'>50</field></shadow></value><next><block type='control_create_clone_of' id='tf' x='0' y='0'>\n      <value name='CLONE_OPTION'><shadow type='control_create_clone_of_menu' id='Hf'><field name='CLONE_OPTION'>_myself_</field></shadow></value>\n    </block></next>\n    </block></next>\n    </block></next>\n    </block></next>\n    </block></next>\n    </block></next>\n    </block></next>\n    </block></next>\n    </block>"},{"type":"BlockCreateAction","blockId":null,"info":null,"targetName":"parent","block_xml":"<block type='control_start_as_clone' id='Xh'>\n      <next><block type='looks_show' id='60'>\n      \n    </block></next>\n    </block>"},{"type":"BlockCreateAction","blockId":null,"info":null,"targetName":"parent","block_xml":"<block type='control_start_as_clone' id='rH'>\n      <next><block type='control_forever' id='7K'>\n      <statement name='SUBSTACK'><block type='control_repeat' id='DP'>\n      <value name='TIMES'><shadow type='math_whole_number' id='4q'><field name='NUM'>30</field></shadow></value><statement name='SUBSTACK'><block type='looks_changeeffectby' id='YB'>\n      <field name='EFFECT'>GHOST</field><value name='CHANGE'><shadow type='math_number' id='op'><field name='NUM'>5</field></shadow></value>\n    </block></statement><next><block type='control_repeat' id='Ig'>\n      <value name='TIMES'><shadow type='math_whole_number' id='U2'><field name='NUM'>30</field></shadow></value><statement name='SUBSTACK'><block type='looks_changeeffectby' id='5a'>\n      <field name='EFFECT'>GHOST</field><value name='CHANGE'><shadow type='math_number' id='xh'><field name='NUM'>-5</field></shadow></value>\n    </block></statement>\n    </block></next>\n    </block></statement>\n    </block></next>\n    </block>"},{"type":"BlockCreateAction","blockId":null,"info":null,"targetName":"parent","block_xml":"<block type='control_start_as_clone' id='Y^OJV(wr:O{C8LXT[pWp'>\n      <next><block type='control_forever' id=']ygLb@k;A3~n_,.]KNES'>\n      <statement name='SUBSTACK'><block type='control_if' id='uSu-3[21l=I(,Q2K)Pf6'>\n      <value name='CONDITION'><block type='operator_and' id='=7D[5E2~Hlpf:vN6Fskb'>\n      <value name='OPERAND1'><block type='sensing_mousedown' id='U6f5;]MGCYghE?f+(v0V'>\n      \n    </block></value><value name='OPERAND2'><block type='sensing_touchingobject' id=';6).a6gK}9Y1@`ldsa[P'>\n      <value name='TOUCHINGOBJECTMENU'><shadow type='sensing_touchingobjectmenu' id='t0D3Sn4f#H;g$J+[2krw'><field name='TOUCHINGOBJECTMENU'>_mouse_</field></shadow></value>\n    </block></value>\n    </block></value><statement name='SUBSTACK'><block type='looks_hide' id='L8'>\n      <next><block type='control_wait_until' id='_wait_until_not_clicked_'>\n      <value name='CONDITION'><block type='operator_not' id='N#r5^4W;K-i+YxxzwZ)w'>\n      <value name='OPERAND'><block type='sensing_mousedown' id='/!?68c+:!krjk^?rU_bk'>\n      \n    </block></value>\n    </block></value>\n    </block></next>\n    </block></statement>\n    </block></statement>\n    </block></next>\n    </block>"},{"type":"BlockCreateAction","blockId":null,"info":null,"targetName":"parent","block_xml":"<block type='event_whenkeypressed' id='V~6Zj=k+[Spa[3#ix,Vs' x='0' y='432'>\n      <field name='KEY_OPTION'>space</field><next><block type='looks_show' id='T9Veg;jAt@$FB?6=iPSy'>\n      \n    </block></next>\n    </block>"},{"type":"SpriteDelete","sprite_name":"glass water costume"},{"type":"SpriteDelete","sprite_name":"parrot costume"}],"metadata":{"success":true,"_id":"69df1af241b4dfd1","sprites":["glass water costume","parrot costume"]}}}},"projectId":"projectId"};


const qualityTutorHOC = function (WrappedComponent) {
    class QualityTutor extends React.Component {
        constructor(props) {
            super(props);
            this.hints = [];
        }

        componentDidMount() {
            // this.initializeTutor();
        }

        initializeTutor() {
            this.vm = this.props.vm;
            const workspace = ScratchBlocks.getMainWorkspace();
            this.blockListener = this.blockListener.bind(this);
            workspace.addChangeListener(this.blockListener);
            this.isInactive = false;
            window.tutor = this;

            this.vm.on('workspaceUpdate', () => {
                workspace.hideHint();
            });
        }

        blockListener(e) {
            const workspace = ScratchBlocks.getMainWorkspace(); // update workspace may change
            // this.analyzeWhenUserBecomeInactive();

            if (e.type !== 'hint_click') {
                return;
            }

            if (e.interactionType === 'improve_option_click') {
                applyTransformation(e.hintId, this.vm, workspace, this.analysisInfo);
            }


            if (e.interactionType === 'mouseover') {
                highlightDuplicateBlocks(true, workspace, this.analysisInfo);
            }

            if (e.interactionType === 'mouseout') {
                highlightDuplicateBlocks(false, workspace, this.analysisInfo);
            }
        };

        analysisInfoToHints(currentTargetName, workspace, analysisInfo) {
            console.log('TODO: map smells to hints', analysisInfo);
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
        }

        analyzeWhenUserBecomeInactive() {
            const _vm = this.vm;
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = setTimeout(
                    () => {
                        console.log('Inactivity Detected! ...sending analysis request');
                        Promise.resolve()
                            .then(() => getProgramXml(_vm))
                            .then(xml => dummyJson || sendAnalysisReq('projectId', 'all', xml, isProductionMode))
                            .then(json => {
                                console.log(json);
                                this.analysisInfo = json;
                                if (this.analysisInfo) {
                                    let targetName = _vm.editingTarget.getName();
                                    // populateHintIcons(targetName,ScratchBlocks.getMainWorkspace(), this.analysisInfo);
                                    this.analysisInfoToHints(targetName, ScratchBlocks.getMainWorkspace(), this.analysisInfo);
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