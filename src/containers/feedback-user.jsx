import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import FeedbackIconComponent from '../components/feedback-user/feedback-icon.jsx';
import FeedbackModalComponent from '../components/feedback-user/feedback-modal.jsx';

const {
    Stitch,
    RemoteMongoClient,
    AnonymousCredential
} = require('mongodb-stitch-browser-sdk');

const client = Stitch.initializeDefaultAppClient('feedback-test-hdydy');
const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('feedback');
const feedbackCollection = db.collection('scratch-feedback');

class FeedbackUser extends React.Component {
    constructor(props) {
        super(props);
        let _this = this;
        this.feedbackTextRef = null;
        this.state = {
            rating: 0,
            openModal: false,
            showIcon: false
        };
        client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
            feedbackCollection.find({'user_id': user.id}).toArray().then(items => {
                console.log(items);
                if (items.length === 0) {
                    _this.setState({showIcon: true});
                }
            })
        });
        bindAll(this, []);
    }

    openModal() {
        this.setState({openModal: true});
    }

    changeRating(rating) {
        this.setState({rating: rating});
    }

    submitFeedback() {
        const newItem = {
            "rating": this.state.rating,
            "feedback_text": this.feedbackTextRef.value,
            "user_id": "anonymous"
        };
        client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
                if (user) {
                    newItem['user_id'] = user.id;
                }
                console.log(user);
                feedbackCollection.insertOne(newItem)
                    .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
                    .catch(err => console.error(`Failed to insert item: ${err}`));
            }
        ).then(() => {
            console.log(arguments);
        }).catch(err => {
            console.error(err);
        });
        this.feedbackTextRef.value = "";
        this.setState({openModal: false, rating: 0, showIcon: false});
    }

    render() {
        const componentProps = this.props;
        return (this.state.showIcon ?
                <FeedbackIconComponent
                    onclick={this.openModal.bind(this)} openModal={this.state.openModal}
                    floaterContent={<FeedbackModalComponent feedbackTextRef={el => this.feedbackTextRef = el}
                                                            submitFeedback={this.submitFeedback.bind(this)}
                                                            rating={this.state.rating}
                                                            changeRating={this.changeRating.bind(this)}
                    />}
                    {...componentProps}
                /> : null
        );
    }
}

FeedbackUser.propTypes = {};

const mapStateToProps = state => {
    return {};
};

const ConnectedComponent = connect(
    mapStateToProps
)(FeedbackUser);

export default ConnectedComponent;
