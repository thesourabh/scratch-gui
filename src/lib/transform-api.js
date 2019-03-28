import { IntlProvider } from 'react-intl';
const intlProvider = new IntlProvider({ locale: 'en' }, {});
const { intl } = intlProvider.getChildContext();
import { emptySprite } from "./empty-assets";
import sharedMessages from "./shared-messages";
const { loadCostume } = require('scratch-vm/src/import/load-costume');

const applyTransformation = function (hintId, vm, workspace, analysisInfo) {
    let actions = analysisInfo.records[hintId].refactoring.actions;
    let actionSeq = Promise.resolve();
    let newBlock;
    for (let action of actions) {
        actionSeq = actionSeq.then(() => {
            if (action.type === "SpriteCreate") {
                return createEmptySprite(vm, action.spriteName);
            } else if (action.type === "CostumeCopy") {
                return copyCostume(vm, action.copySource, action.name, action.copyDestination);
            } else if (action.type === "SpriteDelete") {
                return deleteSprite(vm, action.sprite_name);
            }

            // if blocks related needs to switch to the right target
            if (action.targetName && vm.editingTarget.getName() !== action.targetName) {
                return switchTarget(action.targetName).then(() => {
                    let result = workspace.blockTransformer.executeAction(action);
                    if (result && result !== true) {
                        newBlock = result;
                    }
                })
            } else {
                let result = workspace.blockTransformer.executeAction(action);
                if (result && result !== true) {
                    newBlock = result;
                }
            }
        });
    }
    actionSeq.then(() => {
        if (newBlock) {
            workspace.cleanUp();
        }
    });
}

const switchTarget = function (vm, targetName) {
    console.log("switch target to:" + target);
    let targetId = Scratch.vm.runtime.targets.filter(t => t.getName() === targetName)[0].id;
    return vm.setEditingTarget(targetId);
}

const copyCostume = function (vm, sourceTargetName, costumeName, destinationTargetName) {
    let sourceTarget = vm.runtime.getSpriteTargetByName(sourceTargetName);
    let costumeIdx = sourceTarget.getCostumeIndexByName(costumeName);
    let costume = sourceTarget.getCostumes()[costumeIdx];
    let clone = Object.assign({}, costume);
    let md5ext = `${clone.assetId}.${clone.dataFormat}`;

    let destinationTarget = vm.runtime.getSpriteTargetByName(destinationTargetName);
    return loadCostume(md5ext, clone, vm.runtime).then(() => {
        if (destinationTarget) {
            destinationTarget.addCostume(clone);
            destinationTarget.setCostume(
                destinationTarget.getCostumes().length - 1
            );
        }
    });
}

const createEmptySprite = function (vm, name) {
    const formatMessage = intl.formatMessage;
    const emptyItem = emptySprite(
        name,
        formatMessage(sharedMessages.pop),
        formatMessage(sharedMessages.costume, { index: 1 })
    );

    return vm.addSprite(JSON.stringify(emptyItem));
}

const deleteSprite = function (vm, name) {
    let target = vm.runtime.getSpriteTargetByName(name);
    vm.deleteSprite(target.id);
}

export {
    applyTransformation,
    copyCostume,
    createEmptySprite,
    deleteSprite
}