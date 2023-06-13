//Five types of bullet boxes use this js, please add jQuery to cooperate with it.
//mask layer
let xphosDialogMaskLayer = null;
//Create a mask layer and add it to the body.
function createMaskLayer(){
    if(xphosDialogMaskLayer==null){
        let maskLayerHtml = "<div id='xphosDialogMaskLayer' class='xphosDialogMaskLayer'></div>"
        $("body").append(maskLayerHtml);
        xphosDialogMaskLayer = $("#xphosDialogMaskLayer");
//        xphosDialogMaskLayer.click(()=>{
//            isShowMaskLayer();
//        })
    }else{
        isShowMaskLayer();
    }

}
/**
 * Create a mask layer and add it to the body.
 * @author yl.zhan@timevary.com
 * @date 2023/02/23 10:09
 * @param {?boolean} showFlag If it is useless, it will be in the opposite state of the current state (display = =) and will not be displayed; Don't display = = display)
 * @return {void} There is no return value. If you want to operate the mask layer, you can directly use xphosDialogMaskLayer (global variable).
 */
function isShowMaskLayer(showFlag){
    if(xphosDialogMaskLayer!=null){
        if(showFlag!=null && typeof(showFlag)=='boolean'){
            showFlag?xphosDialogMaskLayer.show():xphosDialogMaskLayer.hide();
        }else{
            xphosDialogMaskLayer.is(":visible")?xphosDialogMaskLayer.hide():xphosDialogMaskLayer.show();
        }
    }else{
        createMaskLayer();
    }
}
//Create a unified background for the bullet box
function createDialogBackground(id){
    let dialogBackgroundHtml = "<div id='"+id+"' class='xphosDialogBackground'></div>"
    $("body").append(dialogBackgroundHtml);
}
//Create the background for loading the bullet box.
function createLoadingDialogBackground(id){
    let dialogLoadingBackgroundHtml = "<div id='"+id+"' class='xphosLoadingDialogBackground'></div>"
    $("body").append(dialogLoadingBackgroundHtml);
}
function closeDialog(id){
    $("#"+id).remove();
    if($(".xphosDialogBackground").length==0){
        isShowMaskLayer(false);
    }
}
//Unified bullet box elements are generated in one step in this method.
/**
 * Generate a unified bullet box element
 * @author yl.zhan@timevary.com
 * @date 2023/02/23 10:19
 * @param {?objet} configObj  The content of the configuration is in the form of an object (Json)
                    {
                        id: "id03" //You can customize the id to close the dialog conveniently.
                        closeButton: 1, //number -1,0,1 Left, None, Right
                        titleText: "title", //string
                        tipsText:"Prompt statement" //string Small red print
                        buttons: [["but1",true],["but2",false],...,"but9",["but10"]]  //The two-dimensional array is preceded by the text of the button, followed by whether the Boolean value is closed, and true means closed.
                        onButtonListening: function(data){...} //Method of listening to button clicks, anonymous method
                    }
 *        {?string} coreObj The core object contains ids group (convenient to get the core content), getValueTypes (what content of the element you want), html text, //listeningFunctionName listening method.
                    {
                        ids:["idA","idB",...],
                        getValueTypes: ["value","check","class",.....],//What attribute's value is used with the previous ids: $('#idA').attr('value'),$('#idA').attr('check')....
                        html:"<div id='idA'>6666<p id='idB'>7777</p></div>",
                        //listeningFunctionName: "listeningFunction"
                    }
 * @return {string} id  Returns the id of this pop-up box, which can be closed by the closeDialog(id) method.
 */
function dialogCommonLayer(configObj,coreObj,currentTime){
    isShowMaskLayer(true);
//    let currentTime = new Date().getTime();
    let defaultConfigObj = {
        id: "dialogCommonLayerDiv"+currentTime,
        closeButton: 1,
        titleText: "Title"
    }
    //initialization configObj
    if(configObj!=null){
        configObj.id = checkValueToDefault(configObj.id,"string",defaultConfigObj.id);
        configObj.closeButton = checkValueToDefault(configObj.closeButton,"number",defaultConfigObj.closeButton);
        configObj.titleText = checkValueToDefault(configObj.titleText,"string",defaultConfigObj.titleText);
    }else{
        configObj = defaultConfigObj;
    }
    //1.Create background
    createDialogBackground(configObj.id);
    //Get the background Div element
    let dialogBackgroundElement = $("#"+configObj.id);
    let titleDivHtml = "<div class='xphosTitleDialogDiv'>"
    //2.Add fork element
    if(configObj.closeButton!=0){
        let closeDialogHtml;
        if(configObj.closeButton==1){//The fork is on the right
            closeDialogHtml = "<a id='xphosCloseDialog"+currentTime+"' class='xphosCloseDialogA xphosCloseDialogARight'>×</a>"
        }else{//The fork is on the left
            closeDialogHtml = "<a id='xphosCloseDialog"+currentTime+"' class='xphosCloseDialogA xphosCloseDialogALeft'>×</a>"
        }
        closeDialogHtml+="</br>"
        titleDivHtml += closeDialogHtml;
//        dialogBackgroundElement.append(closeDialogHtml);
//        $("#xphosCloseDialog"+currentTime).click(()=>{closeDialog(configObj.id)});
    }
    //3.Add headline
    let titleTextHtml = "<span id='xphosTitleText"+currentTime+"' class='xphosTitleText'>"+configObj.titleText+"</span></br>"
    titleDivHtml += titleTextHtml;
//    dialogBackgroundElement.append(titleTextHtml);
    dialogBackgroundElement.append(titleDivHtml);
    $("#xphosCloseDialog"+currentTime).click(()=>{closeDialog(configObj.id)});
    //4.Add core content
    if(coreObj!=null&&coreObj.html!=null){
        dialogBackgroundElement.append(coreObj.html);
    }
    //5. Add a tip (red)
    if(configObj.tipsText!=null){
       let tipsTextHtml = "<span id='xphosTipsText"+currentTime+"' class='xphosTipsText'>"+configObj.tipsText+"</span></br>"
       dialogBackgroundElement.append(tipsTextHtml);
    }
    //6.Add button group
    if(configObj.buttons!=null){
       let buttonsLength = configObj.buttons.length<=10?configObj.buttons.length:10;
       for(let i = 0; i < buttonsLength; i++){
            let buttonContext = configObj.buttons[i];
            let buttonText="";
            let buttonClose=false;
            if(typeof(buttonContext) == "object"){
                buttonText = buttonContext[0];
                if(buttonContext.length==2){
                    buttonClose = buttonContext[1];
                }
            }else{
                buttonText = buttonContext;
            }
            let buttonHtml = "<a id='xphosButton"+i+currentTime+"' class='xphosButton'>"+buttonText+"</a>"
            dialogBackgroundElement.append(buttonHtml);
            let xphosButtonElement = $("#xphosButton"+i+currentTime);
            xphosButtonElement.click(()=>{
                if(configObj.onButtonListening!=null){
                    let resultJson= {
                        id: configObj.id,
                        clickButtonNum : i,
                        clickButtonText: buttonText
                    };
                    if(coreObj!=null&&coreObj.ids!=null&&coreObj.getValueTypes!=null){
                        let content=[];
                        for(let n=0;n<coreObj.ids.length;n++){
                            let coreId = coreObj.ids[n];
                            let coreElement = $("#"+coreId);
                            for(let m=0;m<coreObj.getValueTypes.length;m++){
                                let coreType = coreObj.getValueTypes[m];
                                let elementValue = "";
                                switch (coreType){
                                    case "html":
                                        elementValue = coreElement.html();
                                        break;
                                    case "val":
                                        elementValue = coreElement.val();
                                        break;
                                    case "text":
                                        elementValue = coreElement.text();
                                        break;
                                    default:
                                        elementValue = coreElement.attr(coreType);
                                }
                                content.push([coreId+"."+coreType,elementValue]);
                            }
                        }
                        resultJson.content = content;
                    }
                    //Create a function object and call
                    configObj.onButtonListening(resultJson);
                }
                if(buttonClose){closeDialog(configObj.id);}
            })
       }
    }
    return configObj.id;
}
//This method is to check whether the value is empty and the type is correct, and if one is not satisfied, it will be the default value.
function checkValueToDefault(value,valueType,defaultValue){
    if(value!=null && typeof(value)==valueType){
        return value;
    }else{
        return defaultValue;
    }
}

//Box type 1: notification type box, including element fork, headline, text, tip and button group.
/**
 * Notification type bullet box
 * @author yl.zhan@timevary.com
 * @date 2023/02/23 10:09
 * @param {?object} configObj This parameter is the configuration notification class object (json)
   {
      id：”id01”  ,  //?string  Box ID, you can customize the ID number, which is convenient to close the dialog.
      closeButton:  -1, //?number By default, 1 -1,0,1 left, none and right digits are all none.
      titleText:  “Title”,  //?string Default: "Title"
      context:  “I am the text.”,  //?string
      tipsText:  “I'm a tip”,  //?string Small text with red tips
      buttons: [[“but1”,true],[”but2”,false],...”but10”],  //?Two-dimensional array, [["button name", true]],
                                                            True means click this button to close, and the default is false.
                                                            Up to 10 buttons, all of which
      onButtonListening: function(data){...} //Method of listening to button clicks, anonymous method
  }
 * @return {string} The return value is the ID of the bullet box.
 */
function showNotificationDialog(configObj){
//ids:["idA","idB",...],
//getValueTypes: ["value","check","class",.....],//What attribute's value is used with the previous ids:$('#idA').attr('value'),$('#idA').attr('check')....
//html:"<div id='idA'>6666<p id='idB'>7777</p></div>",
    let currentTime = new Date().getTime();
    let coreObj={};
    if(configObj!=null&&configObj.context!=null){
        coreObj.html = "<span id='xphosContext"+currentTime+"' class='xphosContext'>"+configObj.context+"</span></br>"
        coreObj.ids = ["xphosContext"+currentTime];
        coreObj.getValueTypes = ["class","html","text","val","value"];
    }
    return dialogCommonLayer(configObj,coreObj,currentTime);
}
function showNotificationDialog2(configObj){
    isShowMaskLayer(true);
    let currentTime = new Date().getTime()
    let defaultConfigObj = {
        id: "notificationDialogMainDiv"+currentTime,
        closeButton: 1,
        titleText: "Title"
    }
    //data check
    if(configObj!=null){
       configObj.id = checkValueToDefault(configObj.id,"string",defaultConfigObj.id);
       configObj.closeButton = checkValueToDefault(configObj.closeButton,"number",defaultConfigObj.closeButton);
       configObj.titleText = checkValueToDefault(configObj.titleText,"string",defaultConfigObj.titleText);
    }else{
        configObj = defaultConfigObj;
    }
    //1.Create div background
    createDialogBackground(configObj.id);
    let dialogBackgroundElement = $("#"+configObj.id);
    //2.Create and add elements ×
    if(configObj.closeButton!=0){
        let closeDialogAHtml;
        if(configObj.closeButton==-1){
            closeDialogAHtml = "<a id='xphosCloseDialogA"+currentTime+"' class='xphosCloseDialogA xphosCloseDialogALeft'>×</a>"
        }else{
            closeDialogAHtml = "<a id='xphosCloseDialogA"+currentTime+"' class='xphosCloseDialogA xphosCloseDialogARight'>×</a>"
        }
        closeDialogAHtml+="<br>"
        dialogBackgroundElement.append(closeDialogAHtml);
        $("#xphosCloseDialogA"+currentTime).click(()=>{closeDialog(configObj.id)});
    }
    //3.Create and add headlines
    let titleTextHtml = "<span id='xphosTitleText"+currentTime+"' class='xphosTitleText'>"+configObj.titleText+"</span></br>"
    dialogBackgroundElement.append(titleTextHtml);
    //4.Create and add text
    if(configObj.context!=null){
       let contextHtml = "<span id='xphosContext"+currentTime+"' class='xphosContext'>"+configObj.context+"</span></br>"
       dialogBackgroundElement.append(contextHtml);
    }
    //5.Create and add tips
    if(configObj.tipsText!=null){
       let tipsTextHtml = "<span id='xphosTipsText"+currentTime+"' class='xphosTipsText'>"+configObj.tipsText+"</span></br>"
       dialogBackgroundElement.append(tipsTextHtml);
    }
    //6.Create and add button groups buttons: [["but1",true],["but2",false],"but10"]
    if(configObj.buttons!=null){
       let buttonsLength = configObj.buttons.length<=10?configObj.buttons.length:10;
       for(let i = 0; i < buttonsLength; i++){
            let buttonContext = configObj.buttons[i];
            let buttonText="";
            let buttonClose=false;
            if(typeof(buttonContext) == "object"){
                buttonText = buttonContext[0];
                if(buttonContext.length==2){
                    buttonClose = buttonContext[1];
                }
            }else{
                buttonText = buttonContext;
            }
            let buttonHtml = "<a id='xphosButton"+i+currentTime+"' class='xphosButton'>"+buttonText+"</a>"
            dialogBackgroundElement.append(buttonHtml);
            let xphosButtonElement = $("#xphosButton"+i+currentTime);
            xphosButtonElement.click(()=>{
                if(buttonClose){closeDialog(configObj.id);}
                if(configObj.onButtonListening!=null){
                    //Create a function object and call
                    configObj.onButtonListening({
                        id: configObj.id,
                        clickButtonNum : i,
                        clickButtonText: buttonText
                    })
//                    new buttonListingFunction({
//                        id: configObj.id,
//                        buttonNum : i,
//                        buttonText: buttonText
//                    });
                }
            })
       }
    }
    return configObj.id;
}
//Type 2: a bullet box with an input box, including an element fork, a headline, a name before the input box, an input box, a tip and a button group.
/**
 * Elastic frame with input box
 * @author yl.zhan@timevary.com
 * @date 2023/02/23 13:42
 * @param {
            id: “id03” //You can customize the id to close the dialog conveniently.
            closeButton: 1, //number -1,0,1 Left, nothing, right
            titleText: “title”, //string
            inputTitleText: “Title in front of the input box”,  //string
            inputValue: "defaultValue" //defaultValue
            input:{
                type: “number”, // default text ;color, date, datetime, datetime-local, email,image, month, number, password, range, tel, text, time, url, week
                placeholder:”Gray prompt in the input box”, //string
                maxlength : 100, //number
                minlength: 10 //number
            }
            tipsText:”Prompt statement” //string Small red print
            buttons: [[“but1”,true],[“but2”,false],...,“but9”,[“but10”]]
            onButtonListening: function(data){...}
            onInputChangeListening: function(data){....} //Input control changes the listening method.
        }
 * @return {string} id   Returns the ID number of Dialog.
 */
function showInputDialog(configObj){
    let coreObj = {};
    let currentTime= new Date().getTime();
    //data check
    let inputTitleText = checkValueToDefault(configObj.inputTitleText,"string","");
    let inputValue = checkValueToDefault(configObj.inputValue,"string","");
    let type = "text";
    let placeholder = "";
    let maxlength = 100;
    let minlength = 0;
    if(configObj!=null&&configObj.input!=null){
        type = checkValueToDefault(configObj.input.type,"string","text");
        placeholder = checkValueToDefault(configObj.input.placeholder,"string","");
        maxlength = checkValueToDefault(configObj.input.maxlength,"number",100);
        minlength = checkValueToDefault(configObj.input.minlength,"number",0);
    }
    coreObj.html = inputTitleText+"<input id='xphosInputDialog"+currentTime+"' class='xphosInputDialog' "
                    +"type='"+type+"' "
                    +"placeholder='"+placeholder+"' "
                    +"maxlength='"+maxlength+"' "
                    +"minlength='"+minlength+"' "
                    +"value='"+inputValue+"' "
                    +"/><br>";
    coreObj.ids=['xphosInputDialog'+currentTime];
    coreObj.getValueTypes = ["class","html","text","val","value"];

    let id =  dialogCommonLayer(configObj,coreObj,currentTime);

    if(configObj.onInputChangeListening!=null&&coreObj.ids!=null&&coreObj.ids.length>0){
        for(let i=0;i<coreObj.ids.length;i++){
            let inputElement = $("#"+coreObj.ids[i]);
            inputElement.on("input",function(){
                configObj.onInputChangeListening(inputElement.val());
            })
        }
    }
    return id;
}

//Type 3: a pop-up box with a file selection box, which includes an element fork, a headline, a file input box, a file selection icon, a tip and a button group.
/**
 * Elastic frame with file input box
 * @author yl.zhan@timevary.com
 * @date 2023/02/23 15:12
 * @param {?object} configObj Bullet frame configuration object（json）
    {
        id:”id03”, //
        closeButton: 0, //-1,0,1
        titleText: “title” //string
        input :{
            placeholder:”Please upload zip and gz files.”,
            accept:”appliction/x-zip-compressed”,
            multiple:”multiple” //Multiple file upload
        },
        fileIcon: “Icon address”,
        tipsText: “Small red text prompt”,
        buttons:[[“but1”,true],[“but2”,false].....],
        onButtonListening: function(data){...}
    }
 * @return {string} id   Returns the ID number of Dialog.
 */
function showFileInputDialog(configObj){
    let coreObj = {
        html: "",
        ids: [],
        getValueTypes: []
    };
    let currentTime = new Date().getTime();
    let fileIcon = checkValueToDefault(configObj.fileIcon,"string","images/fileimg.png");
    let placeholder = "";
    let accept = "";
    let multiple = "";
    if(configObj.input!=null){
        placeholder = checkValueToDefault(configObj.input.placeholder,"string","");
        accept = checkValueToDefault(configObj.input.accept,"string","");
        multiple = checkValueToDefault(configObj.input.multiple,"string","");
    }
    coreObj.html = "<div>"
                   +"<input id='xphosFileInputTextDialog"+currentTime+"' class='xphosFileInputTextDialog' disabled='disabled'/> "
                   +"<form id='xphosFormDialog"+currentTime+"' enctype='multipart/form-data' class='xphosFormDialog'"
                   +"style='background:url("+fileIcon+") no-repeat;background-size: 100%;'"
                   +">"
                   +"<input id='xphosFileInputDialog"+currentTime+"' class='xphosFileInputDialog' type='file'"
                   +"placeholder='"+placeholder+"' "
                   +"accept='"+accept+"' ";
    if(multiple!=""){
        coreObj.html += "multiple='"+multiple+"' ";
    }
    coreObj.html += "/>"
                   +"</form><br>"
                   +"</div>"
    coreObj.ids = ["xphosFormDialog"+currentTime,"xphosFileInputTextDialog"+currentTime,"xphosFileInputDialog"+currentTime];
    coreObj.getValueTypes = ["val"];

    let id = dialogCommonLayer(configObj,coreObj,currentTime);

    $("#xphosFileInputDialog"+currentTime).on("change", function () {
        var filePath = $(this).val();
        let filePaths = filePath.split("\\");
        $("#xphosFileInputTextDialog"+currentTime).val(filePaths[filePaths.length-1]);
    });
    return id;
}
//Type 4: Bullet box with progress bar, including element fork, headline, progress bar, values below the progress bar, tips and button groups.
/**
 * Bullet frame with progress bar
 * @author yl.zhan@timevary.com
 * @date 2023/02/24 09:52
 * @param {?object} configObj   Configure the object of the bullet box.(json)
    {
        id:”id04”,
        titleText：“title”,
        progressBar: {
            barColor:”#41D8D6”, //string  ”#FFF”, ”rgb(23,14,23)”, ”rgba(123,43,12,0.3)”
            barValue: 13, //number 0-100
            barValueColor: "#FFF" //string
        },
        context:{
            text:”Main text”,
            color:”white”, //string  ”#FFF”, ”rgb(23,14,23)”, ”rgba(123,43,12,0.3)”
            fontSize: "18px", //string "16px"
        },
        tipsText: “Red tip” ,
        buttons:[[“but1”,true],[“but2”,false].....] //
        onButtonListening: function(data){...} //
    }
 * @return {string} id Returns the ID number of Dialog.
 */
function showProgressBarDialog(configObj){
    let coreObj = {html:"",ids:[],getValueTypes:[]};
    let currentTime = new Date().getTime();
    let barColor = "#41D8D6";
    let barValue = 0;
    let barValueColor = "white";
    //let text = getI18nProp("xSingleprotocol.text.upgrade");
    let text = "升级中..."
    let color = "white";
    let fontSize = "16px";
    if(configObj!=null){
        if(configObj.progressBar!=null){
            barColor = checkValueToDefault(configObj.progressBar.barColor,"string","#41D8D6");
            barValue = checkValueToDefault(configObj.progressBar.barValue,"number",0);
            barValueColor = checkValueToDefault(configObj.progressBar.barValueColor,"string","white");
        }
        if(configObj.context!=null){
            // text = checkValueToDefault(configObj.context.text,"string",getI18nProp("xSingleprotocol.text.upgrade"));
            text = checkValueToDefault(configObj.context.text,"string","升级中...");
            color = checkValueToDefault(configObj.context.color,"string","white");
            fontSize = checkValueToDefault(configObj.context.fontSize,"string","16px");
        }
    }
    coreObj.html += "<div id='xphosTotalProgressBar"+currentTime+"' class='xphosTotalProgressBar'>"
                    +"<div id='xphosUseProgressBar"+currentTime+"' class='xphosUseProgressBar' style='background-color:"+barColor+";width:"+barValue+"%;color:"+barValueColor+";'>"+barValue+"%</div>"
                    +"</div>";
    coreObj.html += "<p id='xphosProgressBarText"+currentTime+"' class='xphosProgressBarText' style='color:"+color+"; fontSize:"+fontSize+";'>"+text+"</p>"
    coreObj.ids = ["xphosUseProgressBar"+currentTime,"xphosProgressBarText"+currentTime];
    coreObj.getValueTypes = ["text","val","value"];
    let id = dialogCommonLayer(configObj,coreObj,currentTime);
    return id;
}
//Modify the progress bar box, a. Modify the value, text color and background color of the progress bar. B. Modify the text, color and size below the progress bar.
/**
 * Modify the contents of the progress bar box
 * @author yl.zhan@timevary.com
 * @date 2023/02/24 11:01
 * @param {string} id Modify the ID number of the progress bar box.
          {Object} configObj Updated configuration object (json)
          {
            progressBar: {
                barColor:”#41D8D6”, //string  ”#FFF”, ”rgb(23,14,23)”, ”rgba(123,43,12,0.3)”
                barValue: 13, //number 0-100
                barValueColor: "#FFF" //string
            },
            context:{
                text:”context”,
                color:”white”, //string  ”#FFF”, ”rgb(23,14,23)”, ”rgba(123,43,12,0.3)”
                fontSize: "18px", //string "16px"
            }
          }
 * @return {void} No return value
 */
function updateProgressBarDialog(id,configObj){
    if(id!=null&&configObj!=null){
//        let progressBarDialogElement = $("#"+id);
        if($("#"+id)!=null){
            if(configObj.progressBar!=null){
                let xphosUseProgressBarElement = $("#"+id+" .xphosUseProgressBar");
                if(configObj.progressBar.barColor){
                    xphosUseProgressBarElement.css("background-color",configObj.progressBar.barColor);
                }
                if(configObj.progressBar.barValue){
                    xphosUseProgressBarElement.text(configObj.progressBar.barValue+"%");
                    xphosUseProgressBarElement.css("width",configObj.progressBar.barValue+"%");
                }
                if(configObj.progressBar.barValueColor){
                   xphosUseProgressBarElement.css("color",configObj.progressBar.barValueColor);
                }
            }
            if(configObj.context!=null){
                let xphosProgressBarTextElement = $("#"+id+" .xphosProgressBarText");
                if(configObj.context.fontSize){
                    xphosProgressBarTextElement.css("fontSize",configObj.context.fontSize);
                }
                if(configObj.context.text){
                    xphosProgressBarTextElement.text(configObj.context.text);
                }
                if(configObj.context.color){
                   xphosProgressBarTextElement.css("color",configObj.context.color);
                }
            }
        }
    }

}

//Type 5: a pop-up box with options, including element forks, headlines, option elements, tips and button groups.
/**
 * Box with option
 * @author yl.zhan@timevary.com
 * @date 2023/02/24 11:01
 * @param {?Object} configObj
            {
                id:”id05”,
                closeButton: -1 //-1,0,1
                titleText: “titleText”,
                selectArray: [[“1.5GHz”,”compose1”，true],[“2.4GHz”,”compose1”,false],[“5.8GHz”,”compose1”],[“900MHz”,”compose2”]....],
                 //Two-dimensional array, the option name is required, and if there is no combined name, it is the same as selecting a name. Select: false by default.
                 //Only three formats are allowed:[[“1.5GHz”,”compose1”，true],...],[[“1.5GHz”],...],[“1.5GHz”,...]
                 //Prohibit incoming:[[“1.5GHz”,true],...]
                tipsText: “Red tip”,
                buttons: [[“but1”,true],[“but2”,false].....],
                onButtonListening: function(data){...}
            }
 * @return {string} id Returns the frame ID.
 */
function showSelectDialog(configObj){
    let coreObj = {html:"",ids:[],getValueTypes:[]};
    let currentTime = new Date().getTime();
    //data check
    let selectArray = [["A","A",false],["B","B",false]];
    if(configObj != null && configObj.selectArray != null){
        selectArray = checkValueToDefault(configObj.selectArray,"object",[["A","A",false],["B","B",false]]);
    }
    //The first selected combination
    let trueCollect = "";
    coreObj.html += "<p>"
    for(let n=0;n<selectArray.length;n++){
        let tmepSelect = selectArray[n];
        let tmepSelectLength = tmepSelect.length;
        if(tmepSelectLength==1){
            tmepSelect = [tmepSelect,tmepSelect,false];
        }else if(tmepSelectLength!=3){
            throw new Error('showSelectDialog:selectArray parameter error, The correct format is as follows:[[“1.5GHz”,”compose1”，true],...],[[“1.5GHz”],...],[“1.5GHz”,...].')
        }
        let labelId = "xphosSelect-"+n+"-"+currentTime;
        if(tmepSelect[2]&&(trueCollect==""||trueCollect==tmepSelect[1])){
            trueCollect = tmepSelect[1];
            coreObj.html += "<label id='"+labelId+"' class='xphosSelect xphosSelect"+tmepSelect[1]+" xphosSelectOn'>"+tmepSelect[0]+"</label>"
        }else{
            coreObj.html += "<label id='"+labelId+"' class='xphosSelect xphosSelect"+tmepSelect[1]+"'>"+tmepSelect[0]+"</label>"
        }
        coreObj.ids.push(labelId);
    }
    coreObj.html += "</p>"
    coreObj.getValueTypes = ["class"];
    let id = dialogCommonLayer(configObj,coreObj,currentTime);
    //Do grouping exclusion
    let labelElementName = "#"+id+" > p > label";
    let labelElement = $(labelElementName);
    labelElement.on("click",function() {
        let clickElement = $(this);
        //1.See if you choose
        if(clickElement.is(".xphosSelectOn")){
            clickElement.removeClass("xphosSelectOn");
        }else{
            clickElement.addClass("xphosSelectOn");
        }
        //2.exclude others
        let clickElementClass = clickElement.attr("class").split(" ");
        let otherLabelName = labelElementName+":not(."+clickElementClass[1]+")";
        $(otherLabelName).removeClass("xphosSelectOn");
	});
    return id;
}
//Gets the currently selected value.
//Returns an array of selected values.[]
function getSelectDialogValue(id){
    let className = "#"+id+" > p > label.xphosSelectOn";
    let selectValues = [];
    for(let i = 0 ;i < $(className).length; i++){
        selectValues.push($(className+":eq("+i+")").text());
    }
    return selectValues;
}
//Type 6: rotating loading progress. The bullet box has rotating pictures and loading text.
/**
 * With rotating picture and loading text.
 * @author yl.zhan@timevary.com
 * @date 2023/04/20 15:44
 * @param {?Object} configObj Configure the object of the bullet box.(Json)
            {
                id:”id06”,
                loadingIcon:"/static/images/loading2.png"//Picture address default:/static/images/loading2.png
                tipsText: “Loading in...”,
            }
 * @return id   ID for creating the bullet box.
 */
function showLoadingDialog(configObj){
    let currentTime = new Date().getTime();
    if(configObj==null){
        configObj = {
            id:"id06"+currentTime,
            loadingIcon:"img/loading2.png",
            tipsText: getI18nProp("common.text.tip.loading")
        }
    }
    isShowMaskLayer(true);
    //1.Create background
    if(configObj.id==null){
        configObj.id = "id06"+currentTime;
    }
    createLoadingDialogBackground(configObj.id);
    //Get the background Div element
    let dialogBackgroundElement = $("#"+configObj.id);
    let loadingDialogHtml = "<div class='loadingDialogDiv'>"
    if(configObj.loadingIcon==null){
        configObj.loadingIcon="/static/images/loading2.png"
    }
    let loadingIconHtml = "<img class='xphosLoadingImg' src='"+configObj.loadingIcon+"'><br>"
    loadingDialogHtml += loadingIconHtml;
//    dialogBackgroundElement.append(loadingIconHtml);

    if(configObj.tipsText==null){
        configObj.tipsText= getI18nProp("common.text.tip.loading")
    }
    let loadingTipsHtml = "<span class='xphosLoadingTips'>"+configObj.tipsText+"</span>"
//    dialogBackgroundElement.append(loadingTipsHtml);
    loadingDialogHtml += loadingTipsHtml+"</div>";
    dialogBackgroundElement.append(loadingDialogHtml);

    return configObj.id;
}