var SelectedTag = -1;
var ColorTagArray = [];
var LabelsList = [];
var idChooseDeleteOrChangeTag = "";
var MapIdSelectAnnotateText = new Map();
// var ListColl = [];
var ListDoc = [];
var ListAnn = [];
var ListAnnId = [];
var ListAnnLabels = [];
var IdCurrentText = 0;
var ListIdText = [];
var LinkToDocs = "";
var ListDocStatus = [];
var eviosannotatedspan = 0;
var truestatus = 0;
var falsestatus = 0;
var Text = "Россия рассчитывает на конструктивное воздействие США на Грузию\n" +
    "\n" +
    "04/08/2008 12:08\n" +
    "\n" +
    "МОСКВА, 4 авг - РИА Новости. Россия рассчитывает, что США воздействуют на Тбилиси в связи с обострением ситуации в зоне грузино-осетинского конфликта. Об этом статс-секретарь - заместитель министра иностранных дел России Григорий Карасин заявил в телефонном разговоре с заместителем госсекретаря США Дэниэлом Фридом.\n" +
    "\n" +
    "\"С российской стороны выражена глубокая озабоченность в связи с новым витком напряженности вокруг Южной Осетии, противозаконными действиями грузинской стороны по наращиванию своих вооруженных сил в регионе, бесконтрольным строительством фортификационных сооружений\", - говорится в сообщении.\n" +
    "\n" +
    "\"Россия уже призвала Тбилиси к ответственной линии и рассчитывает также на конструктивное воздействие со стороны Вашингтона\", - сообщил МИД России.";

function ChooseTag(a) {
    SelectedTag = a.getAttribute("data-idlabel");
    var elements = document.getElementsByClassName('ui mini label choose-label');
    elements[0].classList.remove('choose-label');
    a.classList.add('choose-label');
    return SelectedTag;
}

function SelectAnnotateText(a) {
    var selection = window.getSelection();
    console.log(selection);
    var text = "";
    var FullText = "";
    if (SelectedTag > -1 && SelectedTag < ColorTagArray.length) {
        if (selection.anchorNode.parentElement.id == "annotationDoc") {
            if (selection.anchorOffset !== selection.focusOffset) {
                if (selection.anchorNode.previousSibling == null) {
                    if (selection.anchorNode != selection.focusNode) {
                        return;
                    }
                    var SelectedString = selection.toString();
                    if (selection.anchorOffset < selection.focusOffset) {
                        var DataId1 = selection.anchorOffset;
                        var DataId2 = selection.focusOffset;
                        if (selection.toString()[0] == " ") {
                            DataId1 += 1;
                            SelectedString = SelectedString.substring(1, SelectedString.length);
                        }
                        if (selection.toString()[selection.toString().length-1] == " ") {
                            DataId2 -= 1;
                            SelectedString = SelectedString.substring(0, SelectedString.length - 1);
                        }
                    }
                    else {
                        var DataId2 = selection.anchorOffset;
                        var DataId1 = selection.focusOffset;
                        if (selection.toString()[0] == " ") {
                            DataId1 += 1;
                            SelectedString = SelectedString.substring(1, SelectedString.length);
                        }
                        if (selection.toString()[selection.toString().length-1] == " ") {
                            DataId2 -= 1;
                            SelectedString = SelectedString.substring(0, SelectedString.length - 1);
                        }
                    }
                    text = "<span id='annotatedspan' data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: " + ColorInveror(ColorTagArray[SelectedTag]) + "; font-size:1.4rem' onclick='UnHiddeAnnotationModal(this)'>" + SelectedString + "</span>";
                    FullText = selection.anchorNode.parentElement.innerHTML.substring(0, DataId1) + text + selection.anchorNode.parentElement.innerHTML.substring(DataId2, selection.anchorNode.parentElement.innerHTML.length);
                    var LineBreakCharacter = (selection.anchorNode.parentElement.innerHTML.substring(0, DataId1).split(/\r\n|\r|\n/g).length - 1);
                    DataId1 += LineBreakCharacter;
                    DataId2 += LineBreakCharacter;
                    MapIdSelectAnnotateText.set(DataId1 + '-' + DataId2, [SelectedTag, SelectedString]);
                    console.log(MapIdSelectAnnotateText);
                    ListAnn.push(SelectedString);
                    ListAnnLabels.push(SelectedTag);
                    ListAnnId.push('' + DataId1 + '-' + DataId2);
                    console.log(SelectedString,SelectedTag,'' + DataId1 + '-' + DataId2);
                    AddElemLabelsAnn(SelectedString,SelectedTag,'' + DataId1 + '-' + DataId2);
                    SortListLabelsAnn(a);
                    return a.innerHTML = FullText;
                }
                else {
                    var SelectedString = selection.toString();
                    var previousSiblingDataId = Number.parseInt(selection.anchorNode.previousSibling.getAttribute("data-id").split('-')[1]);
                    var IndexpreviousSibling = selection.anchorNode.parentElement.innerHTML.indexOf(selection.anchorNode.previousSibling.outerHTML);

                    if (selection.anchorOffset + previousSiblingDataId < selection.focusOffset + previousSiblingDataId) {
                        var selectionfocusOffset = selection.focusOffset;
                        var selectionanchorOffset = selection.anchorOffset;
                        var DataId1 = selection.anchorOffset + previousSiblingDataId;
                        var DataId2 = selection.focusOffset + previousSiblingDataId;
                        if (selection.toString()[0] == " ") {
                            selectionanchorOffset = selectionanchorOffset + 1;
                            DataId1 += 1;
                            SelectedString = SelectedString.substring(1, SelectedString.length);
                        }
                        if (selection.toString()[selection.toString().length - 1] == " ") {
                            selectionfocusOffset = selectionfocusOffset - 1;
                            DataId2 -= 1;
                            SelectedString = SelectedString.substring(0, SelectedString.length - 1);
                        }
                    }
                    else {
                        var selectionfocusOffset = selection.focusOffset;
                        var selectionanchorOffset = selection.anchorOffset;
                        var DataId2 = selection.anchorOffset + previousSiblingDataId;
                        var DataId1 = selection.focusOffset + previousSiblingDataId;
                        if (selection.toString()[0] == " ") {
                            selectionfocusOffset = selectionfocusOffset + 1;
                            DataId1 += 1;
                            SelectedString = SelectedString.substring(1, SelectedString.length);
                        }
                        if (selection.toString()[selection.toString().length - 1] == " ") {
                            
                            selectionanchorOffset = selectionanchorOffset - 1;
                            DataId2 -= 1;
                            SelectedString = SelectedString.substring(0, SelectedString.length - 1);
                        }
                    }
                    if (selection.anchorNode != selection.focusNode) {
                        return;
                    }
                    text = "<span id='annotatedspan' data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: " + ColorInveror(ColorTagArray[SelectedTag]) + "; font-size:1.4rem' onclick='UnHiddeAnnotationModal(this)'>" + SelectedString + "</span>";
                    if (selection.anchorOffset + previousSiblingDataId < selection.focusOffset + previousSiblingDataId) {
                        FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selectionanchorOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selectionfocusOffset, selection.anchorNode.parentElement.innerHTML.length);
                    }
                    else {
                        FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selectionfocusOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selectionanchorOffset, selection.anchorNode.parentElement.innerHTML.length);
                    }
                    var LineBreakCharacter = (selection.anchorNode.parentElement.textContent.substring(0, DataId1).split(/\r\n|\r|\n|\n\n/g).length - 1);
                    DataId1 += LineBreakCharacter;
                    DataId2 += LineBreakCharacter;
                    MapIdSelectAnnotateText.set(DataId1 + '-' + DataId2, [SelectedTag, SelectedString]);
                    console.log(MapIdSelectAnnotateText);
                    ListAnn.push(SelectedString);
                    ListAnnLabels.push(SelectedTag);
                    ListAnnId.push('' + DataId1 + '-' + DataId2);
                    console.log(SelectedString,SelectedTag,'' + DataId1 + '-' + DataId2);
                    AddElemLabelsAnn(SelectedString, SelectedTag,'' + DataId1 + '-' + DataId2);
                    SortListLabelsAnn(a);
                    return a.innerHTML = FullText;
                }
            }
        }
    }
}

function SelectOldAnnoyateText(sellab,id) {
    // var selection = window.getSelection();
    // console.log(selection);
    console.log(sellab);
    console.log(id);
    var text = "";
    var FullText = "";
    DataId1 = Number.parseInt(id.split('-')[0]);
    console.log(DataId1);
    DataId2 = Number.parseInt(id.split('-')[1]);
    console.log(DataId2);
    console.log(ColorTagArray[sellab]);
    console.log(eviosannotatedspan);
    console.log(document.getElementById('annotationDoc').innerHTML.substring(DataId1+eviosannotatedspan, DataId2+eviosannotatedspan));
    text = "<span id='annotatedspan' data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[sellab] + "; color: " + ColorInveror(ColorTagArray[sellab]) + "; font-size:1.4rem' onclick='UnHiddeAnnotationModal(this)'>" + document.getElementById('annotationDoc').innerHTML.substring(DataId1+eviosannotatedspan, DataId2+eviosannotatedspan) + "</span>";
    console.log(text);
    FullText = document.getElementById('annotationDoc').innerHTML.substring(0, DataId1+eviosannotatedspan) + text + document.getElementById('annotationDoc').innerHTML.substring(DataId2+eviosannotatedspan, document.getElementById('annotationDoc').innerHTML.length);
    console.log(FullText);
    MapIdSelectAnnotateText.set(DataId1 + '-' + DataId2, [sellab, document.getElementById('annotationDoc').innerHTML.substring(DataId1+eviosannotatedspan, DataId2+eviosannotatedspan)]);
    console.log(MapIdSelectAnnotateText);
    ListAnn.push(document.getElementById('annotationDoc').innerHTML.substring(DataId1+eviosannotatedspan, DataId2+eviosannotatedspan));
    // ListAnnLabels.push(SelectedTag);
    // ListAnnId.push('' + DataId1 + '-' + DataId2);
    console.log(document.getElementById('annotationDoc').innerHTML.substring(DataId1+eviosannotatedspan, DataId2+eviosannotatedspan),sellab,'' + DataId1 + '-' + DataId2);
    eviosannotatedspan = eviosannotatedspan + text.length - document.getElementById('annotationDoc').innerHTML.substring(DataId1+eviosannotatedspan, DataId2+eviosannotatedspan).length;
    // SortListLabelsAnn(a);
    return document.getElementById('annotationDoc').innerHTML = FullText;
    //
    // var SelectedString = selection.toString();
    // var previousSiblingDataId = Number.parseInt(selection.anchorNode.previousSibling.getAttribute("data-id").split('-')[1]);
    // var IndexpreviousSibling = selection.anchorNode.parentElement.innerHTML.indexOf(selection.anchorNode.previousSibling.outerHTML);
    //
    // if (selection.anchorOffset + previousSiblingDataId < selection.focusOffset + previousSiblingDataId) {
    //     var selectionfocusOffset = selection.focusOffset;
    //     var selectionanchorOffset = selection.anchorOffset;
    //     var DataId1 = selection.anchorOffset + previousSiblingDataId;
    //     var DataId2 = selection.focusOffset + previousSiblingDataId;
    //     if (selection.toString()[0] == " ") {
    //         selectionanchorOffset = selectionanchorOffset + 1;
    //         DataId1 += 1;
    //         SelectedString = SelectedString.substring(1, SelectedString.length);
    //     }
    //     if (selection.toString()[selection.toString().length - 1] == " ") {
    //         selectionfocusOffset = selectionfocusOffset - 1;
    //         DataId2 -= 1;
    //         SelectedString = SelectedString.substring(0, SelectedString.length - 1);
    //     }
    // }
    // else {
    //     var selectionfocusOffset = selection.focusOffset;
    //     var selectionanchorOffset = selection.anchorOffset;
    //     var DataId2 = selection.anchorOffset + previousSiblingDataId;
    //     var DataId1 = selection.focusOffset + previousSiblingDataId;
    //     if (selection.toString()[0] == " ") {
    //         selectionfocusOffset = selectionfocusOffset + 1;
    //         DataId1 += 1;
    //         SelectedString = SelectedString.substring(1, SelectedString.length);
    //     }
    //     if (selection.toString()[selection.toString().length - 1] == " ") {
    //
    //         selectionanchorOffset = selectionanchorOffset - 1;
    //         DataId2 -= 1;
    //         SelectedString = SelectedString.substring(0, SelectedString.length - 1);
    //     }
    // }
    // if (selection.anchorNode != selection.focusNode) {
    //     return;
    // }
    // text = "<span id='annotatedspan' data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: " + ColorInveror(ColorTagArray[SelectedTag]) + "; font-size:1.4rem' onclick='UnHiddeAnnotationModal(this)'>" + SelectedString + "</span>";
    // if (selection.anchorOffset + previousSiblingDataId < selection.focusOffset + previousSiblingDataId) {
    //     FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selectionanchorOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selectionfocusOffset, selection.anchorNode.parentElement.innerHTML.length);
    // }
    // else {
    //     FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selectionfocusOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selectionanchorOffset, selection.anchorNode.parentElement.innerHTML.length);
    // }
    // var LineBreakCharacter = (selection.anchorNode.parentElement.textContent.substring(0, DataId1).split(/\r\n|\r|\n|\n\n/g).length - 1);
    // DataId1 += LineBreakCharacter;
    // DataId2 += LineBreakCharacter;
    // MapIdSelectAnnotateText.set(DataId1 + '-' + DataId2, [SelectedTag, SelectedString]);
    // console.log(MapIdSelectAnnotateText);
    // ListAnn.push(SelectedString);
    // ListAnnLabels.push(SelectedTag);
    // ListAnnId.push('' + DataId1 + '-' + DataId2);
    // console.log(SelectedString,SelectedTag,'' + DataId1 + '-' + DataId2);
    // AddElemLabelsAnn(SelectedString, SelectedTag,'' + DataId1 + '-' + DataId2);
    // // SortListLabelsAnn(a);
    // return a.innerHTML = FullText;
}

function DeleteAnnotation(a,b) {
    if (b != undefined) {
        idChooseDeleteOrChangeTag = b;
    }
    var annotated_span = document.querySelector('.annotated-span[data-id="' + idChooseDeleteOrChangeTag + '"]');
    annotated_span_parentElement = annotated_span.parentElement;
    annotated_span_text = annotated_span.innerHTML;
    annotated_span.remove();
    MapIdSelectAnnotateText.delete(idChooseDeleteOrChangeTag);
    console.log(MapIdSelectAnnotateText);
    var previousTextLength = Number.parseInt(idChooseDeleteOrChangeTag.split('-')[0]);
    if (annotated_span_parentElement.getAttribute('id') == "annotationDoc")
    {
        var bool_test = true;
        var i = 0;
        
        while (bool_test && i < annotated_span_parentElement.childElementCount)
        {
            if (Number.parseInt(annotated_span_parentElement.children[i].getAttribute('data-id').split('-')[0]) > Number.parseInt(idChooseDeleteOrChangeTag.split('-')[0])) {
                bool_test = false;
            }
            else {
                previousTextLength = previousTextLength + Number.parseInt(annotated_span_parentElement.children[i].outerHTML.length) - Number.parseInt(annotated_span_parentElement.children[i].innerHTML.length);
                i++;
            }
        }
        HiddeAnnotationModal(a);
        MapIdSelectAnnotateText.delete(idChooseDeleteOrChangeTag);
        console.log(MapIdSelectAnnotateText);
        DeleteElemLabelsAnn(a,idChooseDeleteOrChangeTag);
        return annotated_span_parentElement.innerHTML = annotated_span_parentElement.innerHTML.substring(0, previousTextLength) + annotated_span_text + annotated_span_parentElement.innerHTML.substring(previousTextLength, annotated_span_parentElement.innerHTML.lenght);
    }
    else {

    }
    annotated_span = document.createTextNode(annotated_span_text);

    HiddeAnnotationModal(a);

}

function DeleteElemLabelsAnn(a,b){
    console.log(a,b);
    let tem = document.getElementsByClassName('MuiChip-root jss3134 jss3138 MuiChip-outlined jss3135 MuiChip-clickable');
    console.log(tem);
}

function StartEditor(a) {
    console.log("Start");
    IdCurrentText = document.getElementsByTagName('body')[0].getAttribute('data-currenttextid');
    Text = document.getElementsByTagName('body')[0].getAttribute('data-text');
    document.getElementsByClassName('document')[0].textContent = Text;
    Text = '' + Text.slice(1,Text.length-2);
    let List = document.getElementsByTagName('body')[0].getAttribute('data-listann');
    List = List.split(' ');
    List.splice(List.length-1,1);
    for(elem in List){
        ListAnnLabels.push(List[elem].split('-')[0]);
        ListAnnId.push(List[elem].split('-')[1] + '-' + List[elem].split('-')[2])
    }

    List = document.getElementsByTagName('body')[0].getAttribute('data-listcoll');
    List = List.split(' ');
    List.splice(List.length-1,1);
    for(elem in List){
        LabelsList.push(List[elem].split('\t')[0]);
        ColorTagArray.push(List[elem].split('\t')[1]);
    }
    for(let i = 0; i < LabelsList.length; i++){
        let newelem = document.createElement('div');
        newelem.setAttribute('name','' + LabelsList[i]);
        newelem.setAttribute('class','ui mini label');
        newelem.setAttribute('style','margin: 0.2%; background-color:' + ColorTagArray[i] + ';color:' + ColorInveror(ColorTagArray[i]) + ';');
        newelem.setAttribute('data-idlabel','' + i);
        newelem.setAttribute('onclick','ChooseTag(this);');
        newelem.innerText = LabelsList[i];
        document.getElementById('ChooseTagDiv').appendChild(newelem);
    }

    ListDoc = document.getElementsByTagName('body')[0].getAttribute('data-listdoc');
    ListDoc = ListDoc.slice(2,ListDoc.length-2);
    if(ListDoc.length != 0){
        ListDoc = ListDoc.split('\', \'');
    }
    else {
        ListDoc = [];
    }

    ListIdText = document.getElementsByTagName('body')[0].getAttribute('data-listid');
    ListIdText = ListIdText.slice(1,ListIdText.length-1);
    ListIdText = ListIdText.split(', ');

    LinkToDocs = document.getElementsByTagName('body')[0].getAttribute('data-linktodoc');

    ListDocStatus = document.getElementsByTagName('body')[0].getAttribute('data-docstatus');
    ListDocStatus = ListDocStatus.slice(1,ListDocStatus.length-1);
    ListDocStatus = ListDocStatus.split(', ');

    List = [];
    console.log(ListAnnId);
    for(let i=0;i<ListAnnId.length;i++){
        List.push(Number.parseInt(ListAnnId[i].split('-')[0]));
    }
    List.sort(function(a, b){return a-b});
    console.log(List);
    for(let i=0;i<List.length;i++){
        for(let j=0;j<ListAnnId.length;j++) {
            if(List[i] == Number.parseInt(ListAnnId[j].split('-')[0])){
                console.log(List[i]);
                console.log(Number.parseInt(ListAnnId[j].split('-')[0]));
                SelectOldAnnoyateText(ListAnnLabels[j],ListAnnId[j]);
            }
        }
    }

    var MenuListbox = document.getElementsByClassName('visible menu transition listbox');
    var element = document.createElement('div');
    element.setAttribute('class', 'item');
    element.setAttribute('role', 'option');
    element.setAttribute('style', 'pointer-events: auto');
    element.setAttribute('onclick', 'DeleteAnnotation(this)');
    var childelement = document.createElement('span');
    childelement.setAttribute('class', 'text');
    childelement.insertAdjacentHTML('afterBegin', 'Убрать выделение');
    element.appendChild(childelement);
    MenuListbox[0].appendChild(element);
    for (let i = 0; i < LabelsList.length ; i++) {
        element = document.createElement('div');
        element.setAttribute('class', 'item');
        element.setAttribute('role', 'option');
        element.setAttribute('style', 'pointer-events: auto; background-color:' + ColorTagArray [i] + ';');
        element.setAttribute('onclick', 'ChangeLabel(this,'+i+')');
        var childelement = document.createElement('span');
        childelement.setAttribute('class', 'text');
        childelement.insertAdjacentHTML('afterBegin', LabelsList[i]);
        element.appendChild(childelement);
        MenuListbox[0].appendChild(element);        
    }
    // var ElemColl = document.getElementById('listcol');
    var ElemDoc = document.getElementById('listdoc');
    var ElemAnn = document.getElementById('listann');
    // for (let i = 0; i < ListColl.length; i++) {
    //     let newchild = document.createElement('div');
    //     newchild.setAttribute('role', 'button');
    //     newchild.setAttribute('class', 'MuiChip-root jss3134 jss3138 MuiChip-outlined jss3135 MuiChip-clickable');
    //     newchild.setAttribute('tabindex', '0');
    //     let newchildspan = document.createElement('span');
    //     newchildspan.setAttribute('class', 'MuiChip-label');
    //     newchildspan.innerText = ListColl[i];
    //     newchild.appendChild(newchildspan);
    //     ElemColl.appendChild(newchild)
    // }
    for (let i = 0; i < ListDoc.length; i++) {
        let newchild = document.createElement('div');
        newchild.setAttribute('role', 'button');
        newchild.setAttribute('class', 'MuiChip-root jss3134 jss3138 MuiChip-outlined jss3135 MuiChip-clickable');
        newchild.setAttribute('tabindex', '0');        
        let newchildchild = document.createElement('img');
        newchildchild.setAttribute('width', '50');
        newchildchild.setAttribute('alt', 'logo');
        newchild.setAttribute('onclick', 'gotofile(this);');
        newchild.setAttribute('data-indextext', '' + ListIdText[i]);
        if (ListDocStatus[i] != 'None'){
            newchildchild.setAttribute('src', 'static/gg.png');
            truestatus = truestatus + 1;
        }
        else {
            newchildchild.setAttribute('src', 'static/rk.png');
            falsestatus = falsestatus + 1;
        }
        newchildchild.setAttribute('style', 'width: 25px;height: 25px;');
        newchild.appendChild(newchildchild);
        let newchildspan = document.createElement('span');
        newchildspan.setAttribute('class', 'MuiChip-label');
        newchildspan.innerText = ListDoc[i];
        newchild.appendChild(newchildspan);
        ElemDoc.appendChild(newchild);
    }
    document.getElementsByClassName('MuiTypography-root MuiTypography-caption MuiTypography-alignCenter')[0].innerHTML = 'Всего документов: ' + ListDocStatus.length;
    document.getElementsByClassName('MuiTypography-root MuiTypography-caption MuiTypography-alignCenter')[1].innerHTML = 'Всего выполнено: ' + truestatus;
    document.getElementsByClassName('MuiTypography-root MuiTypography-caption MuiTypography-alignCenter')[2].innerHTML = 'Всего в очереди: ' + falsestatus;
    var ElemLabelsAnn = document.getElementById('listlabelsann');
    for (let i = 0; i < LabelsList.length; i++) {
        let newchild = document.createElement('div');
        newchild.setAttribute('role', 'button');
        newchild.setAttribute('class', 'MuiButtonBase-root MuiListItem-root jss1422 MuiListItem-gutters MuiListItem-button');
        newchild.setAttribute('tabindex', '0');
        newchild.setAttribute('aria-disabled', 'false');
        newchild.setAttribute('onclick', 'funCollectOuter(this)');
        let newchildchild = document.createElement('div');
        newchildchild.setAttribute('class', 'MuiListItemText-root jss1424 MuiListItemText-multiline');

        let newspan = document.createElement('span');
        newspan.setAttribute('class', 'MuiTypography-root MuiListItemText-primary MuiTypography-body1');
        newspan.setAttribute('style', 'color:rgb(0,0,0)');
        newspan.innerText = LabelsList[i];

        newchildchild.appendChild(newspan);
        newchild.appendChild(newchildchild);
        ElemLabelsAnn.appendChild(newchild);

        let newcontainer = document.createElement('div');
        newcontainer.setAttribute('class', 'MuiCollapse-container jss1423 MuiCollapse-entered');
        newcontainer.setAttribute('style', 'min-height: 0px; height: auto; transition-duration: 232ms;');
        let newcontainerChild = document.createElement('div');
        newcontainerChild.setAttribute('class', 'MuiCollapse-wrapperInner');
        let newcontainerChildChild = document.createElement('div');
        newcontainerChildChild.setAttribute('class', 'MuiGrid-root MuiGrid-container MuiGrid-spacing-xs-1 MuiGrid-justify-xs-space-around');
        newcontainerChildChild.setAttribute('id', LabelsList[i]);
        newcontainerChild.appendChild(newcontainerChildChild);
        newcontainer.appendChild(newcontainerChild);
        ElemLabelsAnn.appendChild(newcontainer);

        for (let j = 0; j < ListAnnLabels.length; j++) {
            if (i==ListAnnLabels[j]) {
                let ElemLabels = document.getElementById('' + LabelsList[i]);
                let newchild = document.createElement('div');
                newchild.setAttribute('role', 'button');
                newchild.setAttribute('class', 'MuiChip-root jss3134 jss3138 MuiChip-outlined jss3135 MuiChip-clickable');
                newchild.setAttribute('tabindex', '0');
                newchild.setAttribute('data-id', ListAnnId[j]);
                newchild.setAttribute('data-label', ListAnnLabels[j]);
                newchild.setAttribute('style', 'border: 2px solid ' + ColorTagArray[ListAnnLabels[j]]);
                let newchildspan = document.createElement('span');
                newchildspan.setAttribute('class', 'MuiChip-label');
                newchildspan.innerText = ListAnn[j];
                newchild.appendChild(newchildspan);
                ElemLabels.appendChild(newchild);
            }
        }
        // newchild.setAttribute('data-id',ListAnnId[i]);
        // newchild.setAttribute('data-label',ListAnnLabels[i]);
        // newchild.setAttribute('style','border: 2px solid ' + ColorTagArray[ListAnnLabels[i]]);
        // let newchildspan = document.createElement('span');
        // newchildspan.setAttribute('class', 'MuiChip-label');
        // newchildspan.innerText = ListAnn[i] + ' \'' + LabelsList[ListAnnLabels[i]] + '\'';
        // newchild.appendChild(newchildspan);
        // ElemLabelsAnn.appendChild(newchild);
    }
    // for (let i = 0; i < ListAnn.length; i++) {
    //     let newchild = document.createElement('div');
    //     newchild.setAttribute('role', 'button');
    //     newchild.setAttribute('class', 'MuiChip-root jss3134 jss3138 MuiChip-outlined jss3135 MuiChip-clickable');
    //     newchild.setAttribute('tabindex', '0');
    //     newchild.setAttribute('data-id',ListAnnId[i]);
    //     newchild.setAttribute('data-label',ListAnnLabels[i]);
    //     newchild.setAttribute('style','border: 2px solid ' + ColorTagArray[ListAnnLabels[i]]);
    //     let newchildspan = document.createElement('span');
    //     newchildspan.setAttribute('class', 'MuiChip-label');
    //     newchildspan.innerText = ListAnn[i] + ' \'' + LabelsList[ListAnnLabels[i]] + '\'';
    //     newchild.appendChild(newchildspan);
    //     ElemAnn.appendChild(newchild);
    // }
    SortListLabelsAnn(a);
}

function AddElemLabelsAnn(a,b,c){
    let ElemLabels = document.getElementById('listlabelsann').childNodes[b*2+2].childNodes[0].childNodes[0];
    let newchild = document.createElement('div');
    newchild.setAttribute('role', 'button');
    newchild.setAttribute('class', 'MuiChip-root jss3134 jss3138 MuiChip-outlined jss3135 MuiChip-clickable');
    newchild.setAttribute('tabindex', '0');
    newchild.setAttribute('data-id', '' + c);
    newchild.setAttribute('data-label', b);
    newchild.setAttribute('style', 'border: 2px solid ' + ColorTagArray[b]);
    let newchildspan = document.createElement('span');
    newchildspan.setAttribute('class', 'MuiChip-label');
    newchildspan.innerText = a;
    newchild.appendChild(newchildspan);
    ElemLabels.appendChild(newchild);
}

function ChangeLabel(a,IndexChangeLabel) {
    HiddeAnnotationModal(a);
    let text = MapIdSelectAnnotateText.get(idChooseDeleteOrChangeTag)[1];
    MapIdSelectAnnotateText.set(idChooseDeleteOrChangeTag, [IndexChangeLabel,text]);
    console.log(MapIdSelectAnnotateText);
    return document.querySelector('.annotated-span[data-id="' + idChooseDeleteOrChangeTag + '"]').style.backgroundColor = ColorTagArray[IndexChangeLabel];

}

function HiddeAnnotationModal(a){
    return document.getElementsByClassName('annotation-modal')[0].setAttribute('style', 'top: 131.85px; display:none');
}

function UnHiddeAnnotationModal(a) {
    if (SelectedTag == -2) {
        DeleteAnnotation(a, a.getAttribute('data-id'));
    }
    else {
        idChooseDeleteOrChangeTag = a.getAttribute('data-id');
        var element = document.getElementsByClassName('annotation-text')[0];
        element.innerHTML = a.innerHTML;
        return document.getElementsByClassName('annotation-modal')[0].setAttribute('style', 'top: 131.85px; display:inline');
    }
}

function funCollectEnter(a) {
    var NextElem = a.nextElementSibling;
    a.setAttribute('onclick', 'funCollectOuter(this)');
    return NextElem.setAttribute('class', 'MuiCollapse-container jss1423 MuiCollapse-entered');
}

function funCollectOuter(a) {
    var NextElem = a.nextElementSibling;
    a.setAttribute('onclick', 'funCollectEnter(this)');
    return NextElem.setAttribute('class', 'MuiCollapse-container jss1423 MuiCollapse-outered');
}

function UnHiddeGenerelMenu(a) {
    document.getElementsByClassName('MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionFixed jss105 MuiAppBar-colorPrimary mui-fixed')[0].setAttribute('class', 'MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionFixed jss105 jss106 MuiAppBar-colorPrimary mui-fixed');
    document.getElementsByClassName('MuiButtonBase-root MuiIconButton-root jss107 MuiIconButton-colorInherit MuiIconButton-edgeStart')[0].setAttribute('class', 'MuiButtonBase-root MuiIconButton-root jss107 jss108 MuiIconButton-colorInherit MuiIconButton-edgeStart');
    document.getElementsByClassName('MuiDrawer-root MuiDrawer-docked jss98 jss110')[0].setAttribute('class', 'MuiDrawer-root MuiDrawer-docked jss98 jss109');
    document.getElementsByClassName('MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper jss110 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft')[0].setAttribute('class', 'MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper jss109 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft');
    document.getElementsByClassName('MuiButtonBase-root MuiIconButton-root')[0].setAttribute('oncick','HiddeGenerelMenu(this)');
}

function HiddeGenerelMenu(a) {
    document.getElementsByClassName('MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionFixed jss105 jss106 MuiAppBar-colorPrimary mui-fixed')[0].setAttribute('class', 'MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionFixed jss105 MuiAppBar-colorPrimary mui-fixed');
    document.getElementsByClassName('MuiButtonBase-root MuiIconButton-root jss107 jss108 MuiIconButton-colorInherit MuiIconButton-edgeStart')[0].setAttribute('class', 'MuiButtonBase-root MuiIconButton-root jss107 MuiIconButton-colorInherit MuiIconButton-edgeStart');
    document.getElementsByClassName('MuiDrawer-root MuiDrawer-docked jss98 jss109')[0].setAttribute('class', 'MuiDrawer-root MuiDrawer-docked jss98 jss110');
    document.getElementsByClassName('MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper jss109 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft')[0].setAttribute('class', 'MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper jss110 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft');
}

function Submit(a){
    console.log('Submit');
    var xhr = new XMLHttpRequest();
    var url = "url";
    xhr.open("POST", '/scribe', true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         var json = JSON.parse(xhr.responseText);
    //         console.log(json.email + ", " + json.password);
    //     }
    // };
    let NextIdCurrentText = ListIdText.indexOf(IdCurrentText);
    if(NextIdCurrentText+1 == ListIdText.length){
        NextIdCurrentText = ListIdText[0];
    }
    else {
        NextIdCurrentText = ListIdText[NextIdCurrentText+1];
    }
    console.log(NextIdCurrentText);
    let List = [];
    for(let [key,value] of MapIdSelectAnnotateText){
        List.push([key,value[0],value[1]]);
        console.log(List);
    }

    var data = JSON.stringify({"IdCurrentText": IdCurrentText, "NextIdCurrentText": NextIdCurrentText, "MapIdSelectAnnotateText": List});
    // var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
    console.log(data);
    xhr.send(data);
}

function AddGenLabel(a){
    var newchild = document.createElement('input');
    newchild.setAttribute('id', 'field_name');
    newchild.setAttribute('name', 'field_name');
    newchild.setAttribute('type', 'text');
    newchild.setAttribute('style', 'margin:5px');
    a.previousElementSibling.appendChild(newchild);
    var newchild = document.createElement('input');
    newchild.setAttribute('type', 'color');
    newchild.setAttribute('name', 'bg');
    newchild.setAttribute('style', 'margin:5px');
    a.previousElementSibling.appendChild(newchild);
    var newchild = document.createElement('input');
    newchild.setAttribute('type', 'button');
    newchild.setAttribute('value', 'Удалить');
    newchild.setAttribute('id', 'removeButton');
    newchild.setAttribute('style', 'margin:5px');
    newchild.setAttribute('onclick', 'DeleteGenLabel(this)');
    a.previousElementSibling.appendChild(newchild);
    a.previousElementSibling.appendChild(document.createElement('br'));
    let list = {
        listdual: []
    };
    let field_nameList = document.querySelectorAll('input[id="field_name"]');
    let colorList = document.querySelectorAll('input[type="color"]');
    for(let i=0;i<field_nameList.length;i++){
        list.listdual.push([field_nameList[i].nodeValue,colorList[i].nodeValue]);
    }
    let json = JSON.stringify(list);
}

function DeleteGenLabel(a){
    a.previousElementSibling.remove();
    a.previousElementSibling.remove();
    a.nextElementSibling.remove();
    a.remove();
}

function SortListLabelsAnn(a) {
    for(let i=0;i<LabelsList.length;i++){
        let ListLabelsAnn = document.getElementById('' + LabelsList[i]);
        let list = [];
        for (let j=0;j<ListAnnLabels.length;j++){
            if (i == ListAnnLabels[j]){
                list.push(Number.parseInt(ListAnnId[j].split('-')[0]));
            }
        }
        list.sort(function(a, b){return a-b});
        for(let k = 0; k<list.length;k++){
            for(let m = 0; m<ListAnnId.length;m++){
                if(list[k]==Number.parseInt(ListAnnId[m].split('-')[0])){
                    let tem = document.getElementById('' + LabelsList[i]).childNodes[k];
                    tem.setAttribute('data-id',ListAnnId[m]);
                    tem.childNodes[0].innerText = ListAnn[m];
                    break;
                }
            }

        }
    }
}

function ColorInveror(a) {
    let str = '#';
    for(let i = 1; i < a.length; i++){
        if(a[i] == 'f'){
            str += '0';
        }
        if(a[i] == 'e'){
            str += '1';
        }
        if(a[i] == 'd'){
            str += '2';
        }
        if(a[i] == 'c'){
            str += '3';
        }
        if(a[i] == 'b'){
            str += '4';
        }
        if(a[i] == 'a'){
            str += '5';
        }
        if(a[i] == '9'){
            str += '6';
        }
        if(a[i] == '8'){
            str += '7';
        }
        if(a[i] == '7'){
            str += '8';
        }
        if(a[i] == '6'){
            str += '9';
        }
        if(a[i] == '5'){
            str += 'a';
        }
        if(a[i] == '4'){
            str += 'b';
        }
        if(a[i] == '3'){
            str += 'c';
        }
        if(a[i] == '2'){
            str += 'd';
        }
        if(a[i] == '1'){
            str += 'e';
        }
        if(a[i] == '0'){
            str += 'f';
        }
    }
    return str;
}

function gotofile(a) {
    var xhr = new XMLHttpRequest();
    var url = "url";
    xhr.open("POST", '/scribe', true);

    var data = JSON.stringify({"NextIdCurrentText": a.getAttribute('data-indextext')});
    console.log(data);
    xhr.send(data);
}