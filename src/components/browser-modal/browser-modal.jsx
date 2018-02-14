import PropTypes from 'prop-types';
import React from 'react';
import ReactModal from 'react-modal';
import Box from '../box/box.jsx';

import styles from './browser-modal.css';

const BrowserModal = props => (
    <ReactModal
        isOpen
        className={styles.modalContent}
        contentLabel="Internet Explorer is not supported"
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onBack}
    >
        <Box className={styles.illustration} />

        <Box className={styles.body}>
            <h2>Internet Explorer is not supported</h2>
            <p>
                We&apos;re very sorry, but Scratch 3.0 does not support Internet Explorer.
                We recommend trying a newer browser such as Google Chrome, Mozilla Firefox, or Microsoft Edge.
            </p>

            <Box className={styles.buttonRow}>
                <button
                    className={styles.backButton}
                    onClick={props.onBack}
                >
                    Back
                </button>

            </Box>
            <div className={styles.faqLinkText}>
                To learn more, go to the {' '}
                <a
                    className={styles.faqLink}
                    href="//scratch.mit.edu/preview-faq"
                >
                    preview FAQ
                </a>.
            </div>
        </Box>
    </ReactModal>
);

BrowserModal.propTypes = {
    onBack: PropTypes.func.isRequired
};

export default BrowserModal;
