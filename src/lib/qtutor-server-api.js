const localService = 'http://localhost:8080/analyze';
const remoteService = 'https://quality-tutor-engine.appspot.com/analyze';

const sendAnalysisReq = function(projectId, analysisType, xml, isProductionMode) {
    const url = isProductionMode? remoteService: localService;
    return fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "text/xml",
            "id": projectId,
            "type": analysisType
        },
        body: xml,
    }).then(res => res.json());
}

const getProgramXml = function(vm) {
    let targets = "";
    for (let i = 0; i < vm.runtime.targets.length; i++) {
        const currTarget = vm.runtime.targets[i];
        const variableMap = currTarget.variables;
        const variables = Object.keys(variableMap).map(k => variableMap[k]);
        const xmlString = `<${currTarget.isStage ? "stage " : "sprite "} 
                name="${currTarget.getName()}" x="${currTarget.x}" y="${currTarget.y}"
                size="${currTarget.size}" direction="${currTarget.direction}" visible="${currTarget.visible}">
                <xml>
                    <costumes>${currTarget.getCostumes().map(c => '<costume name="' + c.name + '"/>').join('')}</costumes>
                    <variables>${variables.map(v => v.toXML()).join()}</variables>${currTarget.blocks.toXML()}
                </xml>
                </${currTarget.isStage ? "stage" : "sprite"}>`;

        targets += xmlString;
    }
    var str = `<program>${targets}</program>`;
    str = str.replace(/\s+/g, ' '); // Keep only one space character
    str = str.replace(/>\s*/g, '>');  // Remove space after >
    str = str.replace(/\s*</g, '<');  // Remove space before <

    return str;
}

export {
    sendAnalysisReq,
    getProgramXml
}