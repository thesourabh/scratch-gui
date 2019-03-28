
import ScratchBlocks from 'scratch-blocks';
export const simpleDuplicateXml = "<xml xmlns='http://www.w3.org/1999/xhtml'><block type='event_whenflagclicked' id='3GgSEq2C3!UUHbO~!2wG' x='220' y='272'><next><block type='motion_movesteps' id=':L6MsjJxAuqwuVSw^8oO'><value name='STEPS'><shadow type='math_number' id='TXZwH5e3}+[}[RJz#DH)'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='BKf`Tu?`rziW2g!-*QpM'><value name='DEGREES'><shadow type='math_number' id='JJ-pr9fYpv$me2!%C=K3'><field name='NUM'>15</field></shadow></value><next><block type='motion_pointindirection' id='#u=Td#wrIT0]I*9N:`s/'><value name='DIRECTION'><shadow type='math_angle' id='!z#aH]hyO|NfSDT]%/;}'><field name='NUM'>90</field></shadow></value><next><block type='motion_movesteps' id='m%)5Z67I8g-ofd@LwgX`'><value name='STEPS'><shadow type='math_number' id='+6ij{vIyaYP{9#X,QV/B'><field name='NUM'>10</field></shadow></value><next><block type='motion_turnright' id='%Cqf}+0Pz[Y^7w~Y{{VT'><value name='DEGREES'><shadow type='math_number' id='atI.x%~WQb$X?s.n8:V*'><field name='NUM'>15</field></shadow></value></block></next></block></next></block></next></block></next></block></next></block></xml>";

const addBlocksToWorkspace = function (workspace, rootBlockXml) {
    const dom = ScratchBlocks.Xml.textToDom(rootBlockXml).firstChild;
    ScratchBlocks.Xml.domToBlock(dom, workspace);
}

export { addBlocksToWorkspace };