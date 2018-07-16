import { defaultVM } from './vm';

var smellType = 0;
var sprite = 0;
var smellNumber = -1;
var response = null;
const smellNames = ["LongScript","UncommunicativeName","DuplicateCode","DuplicateExpression"];

const checkCode = function () {

    // var oReq = new XMLHttpRequest();
    //oReq.open("GET", "http://localhost:8080/sb3webservice/sb3analysis?ID=149974792");
    // oReq.onload = function() {
    //     var responseText = oReq.responseText;
    //     Blockly.getMainWorkspace().explainHighlightBox(responseText);
    //     console.log(responseText);
    // };
    // oReq.send();

    smellType = 0;
    sprite = 0;
    smellNumber = -1;


    var xhr = new XMLHttpRequest();
    //var url = "http://0.0.0.0:8080/analyze";
    var url = "https://engine.q4blocks.org/analyze";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onload = function() {
        response = JSON.parse(xhr.responseText);
        var workspace = Blockly.getMainWorkspace();
        var smellPresent = 0;
        smellNames.forEach(function(smellName) {
            var i = 0;
            if(smellName=="UncommunicativeName" && response[smellName].length>0){
                smellPresent = 1;
            }
            for(i=0;i<response[smellName].length;i++){
                if(response[smellName][i].length>0){
                    smellPresent = 1;
                    break;
                }
            }
        });
        if(smellPresent==1){
            var str = '<g id="learnImprovable" style="cursor:pointer;"><rect height="40" width="250" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="35" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="65" y="75">Learn about Improvables</text></g><g id="startButton" style="pointer-events: auto;cursor: pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="175">Start Improving!</text></g>';
            workspace.explainHighlightBox("Hey there! \n That's great work! \n But guess what? This code can be made even better. Would you like to find how?",0,1);
            document.getElementById('options').innerHTML=str;
            if(document.getElementById("startButton")) document.getElementById("startButton").onclick = function() {
                clearBoxes();
                nextSmell(1);
            }
        } else {
            workspace.explainHighlightBox("Hey there! \n That's great work! \n This code is a perfect masterpiece!",0,1);
        }
    };
    var data = defaultVM.toJSON();
    console.log(data);
    xhr.send(data);
    return {
        type: null,
        menu: null
    };

    // nextSmell(1);
    // const f = Blockly.getMainWorkspace().getFlyout();
    // f.setScrollPos(7100);
    // f.drawHighlightBox(["`jEk@4|i[#Fk?(8x)AV.-my variable"]);

};
const clearBoxes = function () {
    Blockly.getMainWorkspace().removeHighlightBox();
    Blockly.getMainWorkspace().getFlyout().removeHighlightBox();
    return {
        type: null,
        menu: null
    };
};

const nextSmell = function(num) {
    
    if(((smellNumber+num)>=0) && ((smellNumber+num)<response[smellNames[smellType]][sprite].length)){
        smellNumber = smellNumber+num;
    } else {
        if((sprite+num)>=0 && ((sprite+num)<response[smellNames[smellType]].length)){
            sprite = sprite+num;
            smellNumber = 0;
            document.getElementsByClassName("sprite-selector_sprite_21WnR")[sprite].click();
        } else {
            if((smellType+num)>=0 && ((smellType+num)<smellNames.length)){
                smellType = smellType+num;
                sprite = 0;
                smellNumber = 0;
                document.getElementsByClassName("sprite-selector_sprite_21WnR")[sprite].click();
            } else {
                document.getElementsByClassName("sprite-selector_sprite_21WnR")[0].click();
                return;
            }
        }
    }
    var workspace = Blockly.getMainWorkspace();
    workspace.removeHighlightBox();
    workspace.getFlyout().removeHighlightBox();

    switch(smellNames[smellType]){
        case "LongScript":
        handleLongScript(response, workspace);
        break;
        case "UncommunicativeName":
        handleUncommunicativeName(response, workspace);
        break;
        case "DuplicateCode":
        handleDuplicateCode(response, workspace);
        break;
        case "DuplicateExpression":
        handleDuplicateExpr(response,workspace);
        break;
    }
    return {
        type: null,
        menu: null
    };
    

};
const handleLongScript = function (response, workspace) {
    if(response[smellNames[smellType]][sprite].length==0) {
        nextSmell(1);
        return;
    }
    var lastClickedBlock1, lastClickedBlock2;
    var smell = response[smellNames[smellType]][sprite][smellNumber];
    workspace.centerOnBlock(smell.topBlock);
    workspace.drawHighlightBox(smell.topBlock, smell.bottomBlock);
    //var str = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(0,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
    var str = '<g id="exampleButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="65" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See an Example</text></g><g id="divdingButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="100" y="175">Start Dividing!</text>'
    workspace.explainHighlightBox("This code can look better if we break it down. \n This maybe the right place to use the concept of 'Dividable Script'. \n What do you think?", 0);
    document.getElementById('options').innerHTML=str;
    document.getElementById("exampleButton").onclick = function() {
        // var strEx = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(350,200) scale(0.675)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
        var strEx = '<g id="doneButton" style="pointer-events: auto;cursor: pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="130" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="195" y="175">Done!</text></g>';
        var strGif = '<g transform="translate(0,50)"><image href="https://media.giphy.com/media/22OOIdmSEZTBn70oyO/giphy.gif"></image></g>';
        clearBoxes();
        workspace.drawBox(500,500);
        document.getElementById("options").innerHTML=strEx;
        document.getElementById("options2").innerHTML=strGif;
        document.getElementById("doneButton").onclick = function() {
            clearBoxes();
            handleLongScript(response,workspace);
        };
    };
    document.getElementById("divdingButton").onclick = function() {
        while(document.getElementById('options').childNodes.length!=0) {document.getElementById('options').childNodes.forEach(function(each){each.remove();})}
        str = '<text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" y="25">1. </text> <g id="createBlockButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="30"></rect><text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="65" y="25">Make a Block</text></g> <text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" y="70">2. Select the first and the last block to move to </text> <text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" y="100">new custom block </text> <text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold;font-size:0.95rem;" y="140">3. </text> <g id="moveBlockButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="30" y="115"></rect><text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="75" y="140">Move Blocks</text></g>';
        document.getElementById("options").innerHTML=str;
        var newBlock = null, prevBlock = null, nextBlock = null, newBlockCall = null, newBlockId = null;
        if(document.getElementById("createBlockButton")) document.getElementById("createBlockButton").onclick = function() {
            var text = '<xml xmlns="http://www.w3.org/1999/xhtml"> <variables></variables> <block type="procedures_definition" id="'+generateRandomID()+'" x="800" y="95"><statement name="custom_block"><shadow type="procedures_prototype" id="'+generateRandomID()+'"><mutation proccode="New Block" argumentids="[]" argumentnames="[]" argumentdefaults="[]" warp="false"></mutation></shadow></statement></block> </xml>';
            var xml = Blockly.Xml.textToDom(text);
            newBlockId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
            newBlock = workspace.getBlockById(newBlockId);
            document.addEventListener("pointerup", storeLastClickedBlock);
        }
        var storeLastClickedBlock = function() {
            if(lastClickedBlock1==null) {
                lastClickedBlock1 = workspace.reportSelectedBlock();
                lastClickedBlock1.setGlowBlock(true);
            }
            else {
                lastClickedBlock2 = workspace.reportSelectedBlock();
                lastClickedBlock2.setGlowBlock(true);
                prevBlock = lastClickedBlock1.getPreviousBlock();
                nextBlock = lastClickedBlock2.getNextBlock();
            }
        };

        if(document.getElementById("moveBlockButton")) document.getElementById("moveBlockButton").onclick = function() {
            var text = '<xml xmlns="http://www.w3.org/1999/xhtml"> <variables></variables> <block type="procedures_call" id="'+generateRandomID()+'" x="280" y="257"><mutation proccode="New Block" argumentids="[]" warp="false"></mutation></block> </xml>';
            var xml = Blockly.Xml.textToDom(text);
            var newBlockCallId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
            newBlockCall = workspace.getBlockById(newBlockCallId);
            window.newBlockCall = newBlockCall;
            window.prevBlock = prevBlock;
            if(newBlockCall) {
                prevBlock.connectToBlock(newBlockCall);
                newBlockCall.connectToBlock(nextBlock);
            }
            if(lastClickedBlock1) newBlock.connectToBlock(lastClickedBlock1)
                document.removeEventListener("pointerup", storeLastClickedBlock);
            lastClickedBlock1.setGlowBlock(false);
            lastClickedBlock2.setGlowBlock(false);
            workspace.removeHighlightBox();
            showEditMsg(workspace, newBlockId);
        }
    }
};

const handleUncommunicativeName = function (response, workspace) {
    var msg = "";
    var smell = response[smellNames[smellType]][smellNumber];
    var str="";

    str='<text style="fill: black;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold">Give another another name to this variable</text> <foreignObject width="200" height="100" y="30" x="70"> <input xmlns="http://www.w3.org/1999/xhtml" type="text" id="input" name="firstname" style="height:45px" required> </foreignObject> <g  id="button" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="100"></rect><text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="90" y="125">Rename Variable</text></g>'
    msg = "Can "+smell.name+" be renamed better? \n This maybe the right place to use the concept of 'Conventional Name'. \n What do you think?";

    const f = workspace.getFlyout();
    f.setScrollPos(7100);
    f.drawHighlightBox([smell.varBlock]);
    workspace.explainHighlightBox(msg, 1);
    document.getElementById('options').innerHTML=str;
    if(document.getElementById("button")) document.getElementById("button").onclick = function() {
        var newName = document.getElementById("input").value;
        workspace.variableMap_.renameVariableById(smell.varBlock, newName);
        workspace.refreshToolboxSelection_();
        workspace.removeHighlightBox();
        workspace.getFlyout().removeHighlightBox();
        nextSmell(1);
    }
};

const handleDuplicateCode = function (response, workspace) {
    if(response[smellNames[smellType]][sprite].length==0) {
        nextSmell(1);
        return;
    }
    var smell = response[smellNames[smellType]][sprite][smellNumber];
    workspace.centerOnBlock(smell.groups[0].topBlock);
    var i=0;
    for(i=0;i<smell.noOfGroups;i++) {
        workspace.drawHighlightBox(smell.groups[i].topBlock, smell.groups[i].bottomBlock);
    }
    var newBlocks = [];
    //var str = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(0,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
    var str = '<g id="exampleButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="65" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See an Example</text><g id="reusingButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="100" y="175">Start Re-Using!</text>'
    workspace.explainHighlightBox("This code can look better if we removed all the repeated code and instead used a single block for it. \n This maybe the right place to use the concept of 'Reusable Repeats'. \n What do you think?", 0);
    document.getElementById('options').innerHTML=str;
    if(document.getElementById("reusingButton")) document.getElementById("reusingButton").onclick = function() {
        while(document.getElementById('options').childNodes.length!=0) {document.getElementById('options').childNodes.forEach(function(each){each.remove();})}
        str = '<g id="navigateButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="70" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See Next Repeat</text><g id="reusingButton" style="cursor:pointer;"><rect height="40" width="250" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="40" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="65" y="175">Make a Block and Re-Use!</text></g></g>'
        document.getElementById("options").innerHTML=str;
        var eachRepeat = 1;
        document.getElementById("navigateButton").onclick = function() {
            workspace.centerOnBlock(smell.groups[eachRepeat].topBlock);
            eachRepeat++;
            if(eachRepeat==smell.noOfGroups) eachRepeat = 0;
        };
        document.getElementById("reusingButton").onclick = function() {
            //custom block generation
            var topBlock = workspace.getBlockById(smell.groups[0].topBlock);
            var prevBlock = topBlock.getPreviousBlock();
            var bottomBlock = workspace.getBlockById(smell.groups[0].bottomBlock).getNextBlock();

            var text = '<xml xmlns="http://www.w3.org/1999/xhtml"> <variables></variables> <block type="procedures_definition" id="'+generateRandomID()+'" x="800" y="95"><statement name="custom_block"><shadow type="procedures_prototype" id="'+generateRandomID()+'"><mutation proccode="New Block" argumentids="[]" argumentnames="[]" argumentdefaults="[]" warp="false"></mutation></shadow></statement></block> </xml>';
            var xml = Blockly.Xml.textToDom(text);
            var newBlockId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
            var newBlock = workspace.getBlockById(newBlockId);
            var text = '<xml xmlns="http://www.w3.org/1999/xhtml"> <variables></variables> <block type="procedures_call" id="'+generateRandomID()+'" x="280" y="257"><mutation proccode="New Block" argumentids="[]" warp="false"></mutation></block> </xml>';
            var xml = Blockly.Xml.textToDom(text);
            var newBlockCallId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
            newBlocks.push(newBlockCallId);
            var newBlockCall = workspace.getBlockById(newBlockCallId);
            if(newBlockCall) {
                prevBlock.connectToBlock(newBlockCall);
                if(bottomBlock) newBlockCall.connectToBlock(bottomBlock);
            }
            newBlock.connectToBlock(topBlock);

            for(i=1;i<smell.noOfGroups;i++) {
                var topBlock = workspace.getBlockById(smell.groups[i].topBlock);
                var prevBlock = topBlock.getPreviousBlock();
                var bottomBlock = workspace.getBlockById(smell.groups[i].bottomBlock).getNextBlock();
                var text = '<xml xmlns="http://www.w3.org/1999/xhtml"> <variables></variables> <block type="procedures_call" id="'+generateRandomID()+'" x="280" y="257"><mutation proccode="New Block" argumentids="[]" warp="false"></mutation></block> </xml>';
                var xml = Blockly.Xml.textToDom(text);
                var newBlockCallId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
                newBlocks.push(newBlockCallId);
                var newBlockCall = workspace.getBlockById(newBlockCallId);
                if(newBlockCall) {
                    if(prevBlock) prevBlock.connectToBlock(newBlockCall);
                    if(bottomBlock) newBlockCall.connectToBlock(bottomBlock);
                    topBlock.dispose();
                } 
            }
            workspace.removeHighlightBox();
            workspace.getFlyout().removeHighlightBox();
            showEditMsg(workspace, newBlockId, 0, 1, newBlocks);
        };
    } 
}

const handleDuplicateExpr = function (response, workspace) {
    if(response[smellNames[smellType]][sprite].length==0) {
        nextSmell(1);
        return;
    }
    var smell = response[smellNames[smellType]][sprite][smellNumber];
    workspace.centerOnBlock(smell.groups[0].exprBlock);
    var i=0;
    for(i=0;i<smell.noOfGroups;i++) {
        workspace.drawHighlightBox(smell.groups[i].exprBlock);
    }
    //var str = '<g class="blocklyDraggable blocklySelected" data-shapes="c-block c-1 hat" transform="translate(0,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0, 0 a 20,20 0 0,1 20,-20 H 149.82195663452148 a 20,20 0 0,1 20,20 v 60  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-shapes="stack" transform="translate(59.58120346069336,0)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF4D6A" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 98.24075317382812 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="43.12037658691406" transform="translate(8, 24) ">Reset&nbsp;game</text></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="21.79060173034668" transform="translate(8, 24) ">define</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,64)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 180.90317916870117 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(68.46145629882812,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><g data-argument-type="text number" data-shapes="argument round" transform="translate(136.90317916870117,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">0</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="26.230728149414062" transform="translate(8, 24) ">go&nbsp;to&nbsp;x:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="6.220861434936523" transform="translate(116.46145629882812, 24) ">y:</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000028)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-right.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text><g class="blocklyDraggable" data-shapes="stack" data-category="control" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFAB19" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 159.59375 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(48,8)"><path class="blocklyPath blocklyBlockBackground" stroke="#CF8B17" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">2</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="14.2265625" transform="translate(8, 24) ">wait</text><path class="blocklyPath" style="visibility: hidden" d="" fill="#CF8B17"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="29.796875" transform="translate(96, 24) ">seconds</text><g class="blocklyDraggable" data-shapes="stack" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#FF3355" fill="#FF6680" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 122.24165344238281 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="55.120826721191406" transform="translate(8, 24) ">Reset&nbsp;variables</text><g class="blocklyDraggable" data-shapes="stack" data-category="motion" transform="translate(0,48)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#4C97FF" fill-opacity="1" d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 185.3660068511963 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"></path><g data-argument-type="text number" data-shapes="argument round" transform="translate(75.56236839294434,8.000000000000057)"><path class="blocklyPath blocklyBlockBackground" stroke="#3373CC" fill="#FFFFFF" fill-opacity="1" d="m 0,0 m 16,0 H 24 a 16 16 0 0 1 0 32 H 16 a 16 16 0 0 1 0 -32 z"></path><g class="blocklyEditableText" transform="translate(8, 0) " style="cursor: text;"><text class="blocklyText" x="12" y="18" dominant-baseline="middle" dy="0" text-anchor="middle">15</text></g></g><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="13.781184196472168" transform="translate(8, 24) ">turn</text><g transform="translate(43.562368392944336, 12) "><image height="24px" width="24px" xlink:href="./static/blocks-media/rotate-left.svg"></image></g><path class="blocklyPath" style="visibility: hidden" d="" fill="#3373CC"></path><text class="blocklyText" y="2" text-anchor="middle" dominant-baseline="middle" dy="0" x="28.901819229125977" transform="translate(123.56236839294434, 24) ">degrees</text></g></g></g></g></g></g>';
    var str = '<g id="exampleButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="65" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See an Example</text><g id="reusingButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="100" y="175">Start Re-Using!</text>'
    workspace.explainHighlightBox("This code can look better if we removed all the repeated expressions and instead used a single variable for it. \n This maybe the right place to use the concept of 'Reusable Expressions'. \n What do you think?", 0);
    document.getElementById('options').innerHTML=str;
    if(document.getElementById("reusingButton")) document.getElementById("reusingButton").onclick = function() {
        while(document.getElementById('options').childNodes.length!=0) {document.getElementById('options').childNodes.forEach(function(each){each.remove();})}
        str = '<g id="navigateButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="65" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See Next Repeat</text><g id="reusingButton" style="cursor:pointer;"><rect height="40" width="255" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="40" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="60" y="175">Make a Variable and Re-Use!</text></g></g>'
        document.getElementById("options").innerHTML=str;
        var eachRepeat = 1;
        document.getElementById("navigateButton").onclick = function() {
            workspace.centerOnBlock(smell.groups[eachRepeat].exprBlock);
            eachRepeat++;
            if(eachRepeat==smell.noOfGroups) eachRepeat = 0;
        };
        document.getElementById("reusingButton").onclick = function() {
            //custom variable generation
            var exprBlock = workspace.getBlockById(smell.groups[0].exprBlock);
            var parentBlock = exprBlock.getParent();
            var prevBlock = parentBlock.getPreviousBlock();

            var newVariableId = generateRandomID();
            var newVariableName = generateVariableName(exprBlock.type);
            var text = '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="data_setvariableto" id="'+generateRandomID()+'" gap="20"> <field name="VARIABLE" id="'+newVariableId+'" variabletype="">'+newVariableName+'</field> <value name="VALUE"> <shadow type="text"> <field name="TEXT">0</field> </shadow> </value> </block></xml>';
            var xml = Blockly.Xml.textToDom(text);
            var newBlockId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
            var newBlock = workspace.getBlockById(newBlockId);
            newBlock.inputList[0].connection.connect(exprBlock.outputConnection);

            if(prevBlock) prevBlock.connectToBlock(newBlock);
            var superParent = parentBlock;
            while(superParent.category_.search("operators")>=0 || superParent.category_.search("sensing")>=0) {superParent=superParent.getParent();}
            newBlock.connectToBlock(superParent);
            
            var text = '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="data_variable" id="'+generateRandomID()+'" x="481" y="88"><field name="VARIABLE" id="'+newVariableId+'" variabletype="">'+newVariableName+'</field></block></xml>';
            var xml = Blockly.Xml.textToDom(text);
            var newVarId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
            var newVarCall = workspace.getBlockById(newVarId);
            parentBlock.inputList[0].connection.connect(newVarCall.outputConnection);


            for(i=1;i<smell.noOfGroups;i++) {
                var exprBlock = workspace.getBlockById(smell.groups[i].exprBlock);
                var parentBlock = exprBlock.getParent();
                exprBlock.dispose();
                var text = '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="data_variable" id="'+generateRandomID()+'" x="481" y="88"><field name="VARIABLE" id="'+newVariableId+'" variabletype="">'+newVariableName+'</field></block></xml>';
                var xml = Blockly.Xml.textToDom(text);
                var newVarId = Blockly.Xml.domToWorkspace(xml, workspace)[0];
                var newVarCall = workspace.getBlockById(newVarId);
                parentBlock.inputList[0].connection.connect(newVarCall.outputConnection);
            }
            workspace.removeHighlightBox();
            workspace.getFlyout().removeHighlightBox();
            workspace.toolbox_.refreshSelection();
            showEditMsg(workspace, newBlockId, 1);
        };
    } 
}

const showEditMsg = function (workspace, blockId, isVariable=0, isDuplicate=0, newBlocks=null) {
    workspace.centerOnBlock(blockId);
    var type = "block";
    var strToAddPar = "Add block parameters if required."
    if(isVariable) {
        type = "variable";
        strToAddPar = "";
    }
    workspace.explainHighlightBox("You can now edit this "+type+" as you wish. Don't forget to give a 'Conventional name' for the "+type+"! "+strToAddPar+" \n Click 'Done' to proceed to the next smell.", isVariable);
    var str='<g  id="button" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="100"></rect><text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="135" y="125">Done</text></g>';
    if(isDuplicate) {
        str = '<g id="navigateButton" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(243, 139, 45);stroke-width:5;stroke: rgb(243, 139, 45);" x="65" y="50"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="95" y="75">See Next Repeat</text><g id="button" style="cursor:pointer;"><rect height="40" width="180" rx="5" ry="5" style="fill: rgb(77, 150, 253);stroke-width:5;stroke:rgb(77, 150, 253);" x="65" y="150"> </rect> <text style="fill: white;font-family: \'Helvetica Neue\', Helvetica, sans-serif;font-weight: bold" x="135" y="175">Done!</text></g></g>'
    }
    document.getElementById('options').innerHTML=str;
    document.getElementById("button").onclick = function() {
        workspace.removeHighlightBox();
        workspace.getFlyout().removeHighlightBox();
        nextSmell(1);
    };
    var eachRepeat = 0;
    if(document.getElementById("navigateButton")) document.getElementById("navigateButton").onclick = function() {
        workspace.centerOnBlock(newBlocks[eachRepeat]);
        eachRepeat++;
        if(eachRepeat==newBlocks.length) eachRepeat = 0;
    };
}


const generateRandomID = function () {
    var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@%^*(:;{[,=.";
    return Array(20).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
};

const generateVariableName = function (opcode) {
    switch (opcode){
        case "operator_add": return "sum";
        case "operator_subtract": return "difference";
        case "operator_multiply": return "product";
        case "operator_divide": return "result";
        case "operator_random": return "randomNumber";
        case "operator_lt": return "isLessThan";
        case "operator_gt": return "isGreaterThan";
        case "operator_equals": return "isEqual";
        case "operator_and": return "andResult";
        case "operator_or": return "orResult";
        case "operator_not": return "notResult";
        case "operator_join": return "joinedWord";
        case "operator_letter_of": return "letter";
        case "operator_mod": return "result";
        case "operator_round": return "roundResult";
        default: return "result";
    }
};

export {
    checkCode,
    clearBoxes,
    nextSmell,
};
