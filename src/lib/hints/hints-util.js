import ScratchBlocks from 'scratch-blocks';
import { DUPLICATE_CODE_SMELL_HINT_TYPE, SHAREABLE_CODE_HINT_TYPE, CONTEXT_MENU_REFACTOR, CONTEXT_MENU_INFO, CONTEXT_MENU_CODE_SHARE } from './constants';

/**
 *  Use blockId specified in hint item as the location target for positioning hint icon
 * @param {*} hint 
 * @param {*} workspace 
 */
const computeHintLocationStyles = function (hint, workspace) {
    const block = workspace.getBlockById(hint.blockId);
    if (!block) return;
    const blockSvg = block.getSvgRoot();
    const blockWidth = block.svgPath_.getBBox().width;
    const hintOffset = 10;
    const computeTop = (blockSvg, workspace) => blockSvg.getBoundingClientRect().y - workspace.svgBackground_.getBoundingClientRect().top;
    const computeLeft = (blockSvg, workspace) => {
        return blockSvg.getBoundingClientRect().x - workspace.svgBackground_.getBoundingClientRect().left + (blockWidth + hintOffset) * workspace.scale;
    }

    const changes = {
        styles: {
            position: 'absolute',
            top: computeTop(blockSvg, workspace) + 'px',
            left: computeLeft(blockSvg, workspace) + 'px'
        }
    };
    return changes;
};

const analysisInfoToHints = function(analysisInfo) {
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


export { getProcedureEntry, formatXmlString, buildHintContextMenu, 
    highlightDuplicateBlocks, computeHintLocationStyles, analysisInfoToHints };