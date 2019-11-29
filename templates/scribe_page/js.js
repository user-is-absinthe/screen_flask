var SelectedTag = -1;
var ColorTagArray = ["#E52B50", "#9966CC", "#007FFF"];
var LabelsList = ["Лицо", "Организация", "Местоположение"];
var idChooseDeleteOrChangeTag = "";
var MapIdSelectAnnotateText = new Map();

function ChooseTag(a) {
    SelectedTag = a.getAttribute("data-idlabel");
    var elements = document.getElementsByClassName('ui mini label choose-label');
    elements[0].classList.remove('choose-label');
    a.classList.add('choose-label');
    return SelectedTag;
}

function SelectAnnotateText(a) {
    var selection = window.getSelection();
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
                    
                    text = "<span id='annotatedspan' data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: white; font-size:1.4rem' onclick='UnHiddeAnnotationModal(this)'>" + SelectedString + "</span>";
                    FullText = selection.anchorNode.parentElement.innerHTML.substring(0, DataId1) + text + selection.anchorNode.parentElement.innerHTML.substring(DataId2, selection.anchorNode.parentElement.innerHTML.length);
                    MapIdSelectAnnotateText.set(DataId1 + '-' + DataId2, SelectedTag);
                    console.log(MapIdSelectAnnotateText);
                    return a.innerHTML = FullText;
                }
                else {
                    var SelectedString = selection.toString();
                    var previousSiblingDataId = Number.parseInt(selection.anchorNode.previousSibling.getAttribute("data-id").split('-')[1]);
                    var IndexpreviousSibling = selection.anchorNode.parentElement.innerHTML.indexOf(selection.anchorNode.previousSibling.outerHTML);

                    if (selection.anchorOffset + previousSiblingDataId < selection.focusOffset + previousSiblingDataId) {
                        var DataId1 = selection.anchorOffset + previousSiblingDataId;
                        var DataId2 = selection.focusOffset + previousSiblingDataId;
                        if (selection.toString()[0] == " ") {
                            DataId1 += 1;
                            SelectedString = SelectedString.substring(1, SelectedString.length);
                        }
                        if (selection.toString()[selection.toString().length - 1] == " ") {
                            DataId2 -= 1;
                            SelectedString = SelectedString.substring(0, SelectedString.length - 1);
                        }
                    }
                    else {
                        var DataId2 = selection.anchorOffset + previousSiblingDataId;
                        var DataId1 = selection.focusOffset + previousSiblingDataId;
                        if (selection.toString()[0] == " ") {
                            DataId1 += 1;
                            SelectedString = SelectedString.substring(1, SelectedString.length);
                        }
                        if (selection.toString()[selection.toString().length - 1] == " ") {
                            DataId2 -= 1;
                            SelectedString = SelectedString.substring(0, SelectedString.length - 1);
                        }
                    }
                    if (selection.anchorNode != selection.focusNode) {
                        return;
                    }
                    text = "<span id='annotatedspan' data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: white; font-size:1.4rem' onclick='UnHiddeAnnotationModal(this)'>" + selection.toString() + "</span>";
                    if (selection.anchorOffset + previousSiblingDataId < selection.focusOffset + previousSiblingDataId) {
                        FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selection.anchorOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selection.focusOffset, selection.anchorNode.parentElement.innerHTML.length);
                    }
                    else {
                        FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selection.focusOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selection.anchorOffset, selection.anchorNode.parentElement.innerHTML.length);
                    }
                    MapIdSelectAnnotateText.set(DataId1 + '-' + DataId2, SelectedTag);
                    console.log(MapIdSelectAnnotateText);
                    return a.innerHTML = FullText;
                }
            }
        }
    }
}

function DeleteAnnotation(a,b) {
    console.log("DeleteAnnotation");
    console.log(b);
    if (b != undefined) {
        idChooseDeleteOrChangeTag = b;
    }
    var annotated_span = document.querySelector('.annotated-span[data-id="' + idChooseDeleteOrChangeTag + '"]');
    annotated_span_parentElement = annotated_span.parentElement;
    annotated_span_text = annotated_span.innerHTML;
    annotated_span.remove();
    MapIdSelectAnnotateText.delete(idChooseDeleteOrChangeTag);
    var previousTextLength = Number.parseInt(idChooseDeleteOrChangeTag.split('-')[0]);
    if (annotated_span_parentElement.getAttribute('id') == "annotationDoc")
    {
        console.log("annotationDoc");
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
        return annotated_span_parentElement.innerHTML = annotated_span_parentElement.innerHTML.substring(0, previousTextLength) + annotated_span_text + annotated_span_parentElement.innerHTML.substring(previousTextLength, annotated_span_parentElement.innerHTML.lenght);
    }
    else {

    }
    annotated_span = document.createTextNode(annotated_span_text);

    HiddeAnnotationModal(a);

}

function Start(a) {
    console.log("Start");
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
}

function ChangeLabel(a,IndexChangeLabel) {
    console.log("ChangeLabel");
    HiddeAnnotationModal(a);
    MapIdSelectAnnotateText.set(idChooseDeleteOrChangeTag, IndexChangeLabel);
    console.log(MapIdSelectAnnotateText);
    return document.querySelector('.annotated-span[data-id="' + idChooseDeleteOrChangeTag + '"]').style.backgroundColor = ColorTagArray[IndexChangeLabel];

}

function HiddeAnnotationModal(a){
    console.log("HiddeAnnotationModal");
    return document.getElementsByClassName('annotation-modal')[0].setAttribute('style', 'top: 131.85px; display:none');
}

function UnHiddeAnnotationModal(a) {
    if (SelectedTag == -2) {
        DeleteAnnotation(a, a.getAttribute('data-id'));
    }
    else {
        console.log("UnHiddeAnnotationModal");
        console.log(a);
        idChooseDeleteOrChangeTag = a.getAttribute('data-id');
        console.log(idChooseDeleteOrChangeTag);
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
}
function HiddeGenerelMenu(a) {
    document.getElementsByClassName('MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionFixed jss105 jss106 MuiAppBar-colorPrimary mui-fixed')[0].setAttribute('class', 'MuiPaper-root MuiPaper-elevation4 MuiAppBar-root MuiAppBar-positionFixed jss105 MuiAppBar-colorPrimary mui-fixed');
    document.getElementsByClassName('MuiButtonBase-root MuiIconButton-root jss107 jss108 MuiIconButton-colorInherit MuiIconButton-edgeStart')[0].setAttribute('class', 'MuiButtonBase-root MuiIconButton-root jss107 MuiIconButton-colorInherit MuiIconButton-edgeStart');
    document.getElementsByClassName('MuiDrawer-root MuiDrawer-docked jss98 jss109')[0].setAttribute('class', 'MuiDrawer-root MuiDrawer-docked jss98 jss110');
    document.getElementsByClassName('MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper jss109 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft')[0].setAttribute('class', 'MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper jss110 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft');
}