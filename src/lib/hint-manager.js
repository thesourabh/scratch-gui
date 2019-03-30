const highlightDuplicateBlocks = function(state, workspace, analysisInfo) {
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




const populateHintIcons = function(currentTargetName, workspace, analysisInfo) {
    for (let recordKey of Object.keys(analysisInfo['records'])) {
        let record = analysisInfo['records'][recordKey];
        if (record.smell.type === 'DuplicateCode') {
            let fragments = record.smell['fragments'];
            let f = fragments[0]; //use first fragment
            let anchorBlockId = f.stmtIds[0]; //and first block of each fragment clone to place hint
            let block = workspace.getBlockById(anchorBlockId);
            if (block) {
                if (!block.isShadow_ && !block.hint) {
                    block.setHintText(record.smell.id||record.smell.smellId);
                }
                if (block.hint) {
                    block.hint.setVisible(true);
                }
            }
        }
        if(record.smell.type === 'DuplicateSprite'){
            let sprites = record.smell['sprites'];
            let targets = sprites.map(s=>s.spriteName);
            if(targets.indexOf(currentTargetName)>-1){
                console.log('TODO: show hint at this editing target' + currentTargetName);
                const hintData = {"id": record.smell.id||record.smell.smellId};
                workspace.setHint(hintData);
                workspace.showHint();   
            }
        }
    }
}

export {
    highlightDuplicateBlocks,
    populateHintIcons
}