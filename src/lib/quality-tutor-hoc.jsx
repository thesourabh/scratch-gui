import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ScratchBlocks from 'scratch-blocks';

const qualityTutorHOC = function (WrappedComponent) {
    class QualityTutor extends React.Component {
        constructor(props){
            super(props);
        }

        componentDidMount () {
          this.initializeTutor();
        }

        initializeTutor () {
            console.log('initialize tutor');
            const workspace = ScratchBlocks.getMainWorkspace();
            
            new Promise( (resolve, reject) => {
                resolve(Blockly.Xml.workspaceToDom(workspace));
            } ).then(dom =>{
                console.log(Blockly.Xml.domToText(dom));
            });
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