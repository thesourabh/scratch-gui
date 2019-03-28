import ScratchBlocks from 'scratch-blocks';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from './constants';


const buildHintContextMenu = (type) => {
    switch (type) {
        case DUPLICATE_CODE_SMELL_HINT_TYPE:
            return [
                {
                    item_name: 'Help me extract method',
                    itemAction: CONTEXT_MENU_REFACTOR
                },
                {
                    item_name: 'Learn more',
                    itemAction: CONTEXT_MENU_INFO
                }
            ];
        case SHAREABLE_CODE_HINT_TYPE:
            return [
                {
                    item_name: 'Share this procedure',
                    itemAction: CONTEXT_MENU_CODE_SHARE
                }
            ]
    }
};

const highlightDuplicateBlocks = function (state, workspace, analysisInfo) {
    if (!state) {
        workspace.removeHighlightBox();
        return;
    }
    for (let recordKey of Object.keys(analysisInfo['records'])) {
        let record = analysisInfo['records'][recordKey];
        if (record.smell.type === 'DuplicateCode') {
            let fragments = record.smell['fragments'];
            for (let fNo in fragments) {
                let blockFragments = fragments[fNo].stmtIds;
                workspace.drawHighlightBox(blockFragments[0], blockFragments[blockFragments.length - 1]);
            }
        }
    }
};

const getProcedureEntry = function (block) {
    const dom = ScratchBlocks.Xml.blockToDom(block);
    const xmlStr = ScratchBlocks.Xml.domToText(dom);
    const innerBlock = block.getInput('custom_block').connection.targetBlock();
    const comment = block.getCommentText();
    return {
        procCode: innerBlock.getProcCode(),
        xml: formatXmlString(xmlStr),
        comment
    }
}

const formatXmlString = function (xmlStr) {
    let str = xmlStr;
    str = str.replace(/\s+/g, ' '); // Keep only one space character
    str = str.replace(/>\s*/g, '>');  // Remove space after >
    str = str.replace(/\s*</g, '<');  // Remove space before <
    str = str.replace(/"/g, "'"); //replace double quote with single quote
    return str;
}


export { getProcedureEntry, formatXmlString, buildHintContextMenu, highlightDuplicateBlocks };