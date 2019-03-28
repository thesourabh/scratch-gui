
import ScratchBlocks from 'scratch-blocks';

export const testBlocks = {
    simpleDuplicate: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='3GgSEq2C3!UUHbO~!2wG' x='220' y='272'><next><block type='motion_movesteps' id=':L6MsjJxAuqwuVSw^8oO'><value name='STEPS'><shadow type='math_number' id='TXZwH5e3}+[}[RJz#DH)'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='BKf`Tu?`rziW2g!-*QpM'><value name='DEGREES'><shadow type='math_number' id='JJ-pr9fYpv$me2!%C=K3'><field name='NUM'>15</field></shadow></value><next><block type='motion_pointindirection' id='#u=Td#wrIT0]I*9N:`s/'><value name='DIRECTION'><shadow type='math_angle' id='!z#aH]hyO|NfSDT]%/;}'><field name='NUM'>90</field></shadow></value><next><block type='motion_movesteps' id='m%)5Z67I8g-ofd@LwgX`'><value name='STEPS'><shadow type='math_number' id='+6ij{vIyaYP{9#X,QV/B'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='%Cqf}+0Pz[Y^7w~Y{{VT'><value name='DEGREES'><shadow type='math_number' id='atI.x%~WQb$X?s.n8:V*'><field name='NUM'>15</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>",
    simpleDuplicate2: "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='o[+*9r6kPW8O,c|7VyMO' x='241' y='165'><next><block type='looks_nextcostume' id='U,j^uxoJ+1PA}`O4Ds,i'><next><block type='motion_movesteps' id='HiF1qve#4!](~aB@xg,g'><value name='STEPS'><shadow type='math_number' id='[YQpbIvnJY@Hb+f#RUQ#'><field name='NUM'>10</field></shadow></value><next><block type='control_wait' id='5H6+d/_q]hJ7njS3,!_}'><value name='DURATION'><shadow type='math_positive_number' id='xa8ltNzQ0cDZ%3T;H@L='><field name='NUM'>1</field></shadow></value><next><block type='looks_nextcostume' id='s!WL@Z;B*oD}?DrVdCM]'><next><block type='motion_movesteps' id='+Y~y#x(DB(CCi$.-IeJ*'><value name='STEPS'><shadow type='math_number' id='L3C60jHNaJYunKzw6}*@'><field name='NUM'>10</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>"
}

const addBlocksToWorkspace = function (workspace, rootBlockXml) {
    const dom = ScratchBlocks.Xml.textToDom(rootBlockXml).firstChild;
    ScratchBlocks.Xml.domToBlock(dom, workspace);
}

const getTestHints = function (workspace, hintState) {
    return;
    const blocksDb = Object.values(workspace.blockDB_);
    const badBlocks = blocksDb.filter(b => !b.isShadow_ && b.type === 'motion_movesteps');
    const procedureDefs = blocksDb.filter(b => !b.isShadow_ && b.type === 'procedures_definition');
    const smellHints = badBlocks.map(b => {
        let oldHint = hintState.hints.find(h => b.id === h.blockId);
        if (oldHint) return oldHint;
        let blockId = b.id;
        let hintId = blockId; //hintId is also block id;

        const hintMenuItems = buildHintContextMenu(DUPLICATE_CODE_SMELL_HINT_TYPE);
        return { type: DUPLICATE_CODE_SMELL_HINT_TYPE, hintId, blockId, hintMenuItems };
    });

    const shareableCodeHints = procedureDefs.map(b => {
        let oldHint = hintState.hints.find(h => b.id === h.blockId);
        if (oldHint) return oldHint;
        let blockId = b.id;
        let hintId = blockId; //hintId is also block id;

        const hintMenuItems = buildHintContextMenu(SHAREABLE_CODE_HINT_TYPE);
        return { type: SHAREABLE_CODE_HINT_TYPE, hintId, blockId, hintMenuItems };
    });

    const allHints = [...smellHints, ...shareableCodeHints];

    return allHints;
}

export { addBlocksToWorkspace, getTestHints };