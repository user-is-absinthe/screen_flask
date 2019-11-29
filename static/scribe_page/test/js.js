var SelectedTag = -1;
var ColorTagArray = ["#E52B50", "#9966CC", "#007FFF"];
function ChooseTag(a) {
    //alert(a.getAttribute("data-idlabel"));
    SelectedTag = a.getAttribute("data-idlabel");
    return SelectedTag;
}
function SelectAnnotateText(a) {
    var text = "";
    var FullText = "";
    var selection = window.getSelection();
    if (SelectedTag > -1 && SelectedTag < ColorTagArray.length) {
        if (selection.anchorNode.parentElement.id == "annotationDoc") {
            if (selection.anchorOffset !== selection.focusOffset) {
                if (selection.anchorNode.previousSibling == null) {
                text = "<span data-id='" + selection.anchorOffset + "-" + selection.focusOffset + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: white; font-size:1.4rem'>" + selection.toString() + "</span>";
                FullText = selection.anchorNode.parentElement.innerHTML.substring(0, selection.anchorOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(selection.focusOffset, selection.anchorNode.parentElement.innerHTML.length);
                return a.innerHTML = FullText;
                }
                else {
                    var previousSiblingDataId = Number.parseInt(selection.anchorNode.previousSibling.getAttribute("data-id").split('-')[1]);
                    var IndexpreviousSibling = selection.anchorNode.parentElement.innerHTML.indexOf(selection.anchorNode.previousSibling.outerHTML);
                    var DataId1 = selection.anchorOffset + previousSiblingDataId;
                    var DataId2 = selection.focusOffset + previousSiblingDataId;
                    text = "<span data-id='" + DataId1 + "-" + DataId2 + "' class='annotated-span' style='display:inline; background-color:" + ColorTagArray[SelectedTag] + "; color: white; font-size:1.4rem'>" + selection.toString() + "</span>";
                    FullText = selection.anchorNode.parentElement.innerHTML.substring(0, IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length) + selection.anchorNode.nodeValue.toString().substring(0, selection.anchorOffset) + text + selection.anchorNode.parentElement.innerHTML.substring(IndexpreviousSibling + selection.anchorNode.previousElementSibling.outerHTML.length + selection.focusOffset, selection.anchorNode.parentElement.innerHTML.length);
                    return a.innerHTML = FullText;
                }
            }
        }
    }
    //console.log(selection.toString());
    //console.log(selection);
}