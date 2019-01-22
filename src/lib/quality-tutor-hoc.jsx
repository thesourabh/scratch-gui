import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ScratchBlocks from 'scratch-blocks';

const qualityTutorHOC = function (WrappedComponent) {
    class QualityTutor extends React.Component {
        constructor(props){
            super(props);
            this.hints = [];
        }

        mockHintGeneration() {
            const workspace = ScratchBlocks.getMainWorkspace();
            const blockIds = Object.keys(workspace.blockDB_);
            if(blockIds.length>0){
                const block = workspace.getBlockById(blockIds[0]); 
                if (!block.isShadow_ && !block.hint) { 
                    block.setHintText("hintId");
                }
                if(block.hint){
                    block.hint.setVisible(true);
                }
            }
        }

        componentDidMount () {
          this.initializeTutor();
        }

        initializeTutor () {
            console.log('initialize tutor');
            const vm = this.vm = this.props.vm;
            const workspace = ScratchBlocks.getMainWorkspace();

            this.blockListener = this.blockListener.bind(this);
            workspace.addChangeListener(this.blockListener);
            
            new Promise( (resolve, reject) => {
                resolve(Blockly.Xml.workspaceToDom(workspace));
            } ).then(dom =>{
                console.log(Blockly.Xml.domToText(dom));
            });
        }

        blockListener (e) {
            if(e.type==='hint_click'){
                console.log("TODO: apply transformation for ",e.hintId);
            }
            this.mockHintGeneration();
        }

        render () {
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