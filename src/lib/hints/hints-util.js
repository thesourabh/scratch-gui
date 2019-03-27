import ScratchBlocks from 'scratch-blocks';

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

export { getProcedureEntry };