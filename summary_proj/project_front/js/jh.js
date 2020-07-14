var eventHolding;
var bd = document.getElementById('body');
bd.onclick = function () {
    // optionMenu.style.display='none';
    var om = document.getElementById('optionMenu');
    if (om != null) om.parentNode.remove();
}
bd.onauxclick = rightClick;
bd.ondragover = preventD;
bd.ondrop = drop;
bd.oncontextmenu = function () { return false }

var iconMap = {};
var folderMap = {};
var folderTree = {};
folderMap['body'] = []
var folderNumber = 1;
var zIndices = [0];
var folderPositionDet = 0;
var folderPositionRpt = 4;
var folderPositionIntervalX = 200;
var folderPositionIntervalY = 150;
var nextNewFolderPositionX = 150;
var nextNewFolderPositionY = 100;
function preventD(e) {
    e.preventDefault();
}
function dragStart(e) {
    if(e.target.className.includes('iconStarter')) e.dataTransfer.setData('id', e.target.parentNode.parentNode.parentNode.id);
    else e.dataTransfer.setData('id', e.target.id);
}
// if tg is body, left,top update

function drop(e) {
    e.preventDefault();
    e.stopPropagation();
    var id = e.dataTransfer.getData('id');
    var grabbed = document.getElementById(id);
    var parentOfGrabbed = grabbed.parentNode;
    if (grabbed.className.includes('folder')) grabbedIsFolder = true;
    else grabbedIsFolder = false;

    var tg;
    if (e.target.className.includes('openFolder')) tg = e.target;
    else if (e.target.id == 'body') tg = e.target;
    else tg = e.target.parentNode;


    /////////////////////////////////////////////////////////////////
    // when a folder is dropped to itself
    // when a folder is dropped to its open folder
    // when a folder in an open folder is dropped to the same folder icon outside
    // when a folder with a parent is dropped to one of his ancestors.
    if (tg.id == id || tg.connectedFolderId == id || tg.id == parentOfGrabbed.connectedFolderId) return;

    var pId;
    if (tg.connectedFolderId != null) pId = tg.connectedFolderId;
    else pId = tg.id;
    while (folderTree[pId] != undefined) {
        pId = folderTree[pId];
        if (id == pId) {
            alert('대상폴더가 원본폴더의 하위폴더입니다');
            return;
        }
    }
    /////////////////////////////////////////////////////////////////
    // getElementsByClassName returns NodeList, not HTMLCollection
    // need to convert nodelist into array form to use filter and such functions
    /////////////////////////////////////////////////////////////////

    parentOfGrabbed.removeChild(parentOfGrabbed.children[Array.from(parentOfGrabbed.children).indexOf(grabbed)]);
    if(grabbedIsFolder){
        if (parentOfGrabbed.className.includes('openFolder')) {
            folderMap[parentOfGrabbed.connectedFolderId].splice(folderMap[parentOfGrabbed.connectedFolderId].indexOf(grabbed), 1);
        }
        else folderMap[parentOfGrabbed.id].splice(folderMap[parentOfGrabbed.id].indexOf(grabbed), 1)
    }
    else folderMap[folderTree[id]].splice(folderMap[folderTree[id]].indexOf(grabbed), 1);
    
    if (tg.className.includes('folder')) {
        folderMap[tg.id].push(grabbed);
        folderTree[id] = tg.id;
        if (tg.isOpen == 1) {
            var openFolders = document.getElementsByClassName('openFolder');
            openFolders = Array.prototype.slice.call(openFolders);
            var tgOpenFolder = openFolders.filter(function (elem) {
                if (elem.connectedFolderId == tg.id) return true;
            })[0];
            tgOpenFolder.appendChild(grabbed);
        }
    }
    else if (tg.className.includes('openFolder')) {
        folderMap[tg.connectedFolderId].push(grabbed);
        folderTree[id] = tg.connectedFolderId;
        tg.appendChild(grabbed);
    }
    else {
        folderMap[tg.id].push(grabbed);
        folderTree[id] = tg.id;
        tg.appendChild(grabbed);
    }
}

function newFolderWindow(fid) {
    var nf = document.createElement('div');
    nf.className = 'openFolder';
    // nf.draggable = true;
    nf.ondragover = preventD;
    nf.ondrop = drop;
    nf.connectedFolderId = fid;
    nf.onauxclick = rightClick;

    var folderInnerMenu = document.createElement('div');
    folderInnerMenu.classList.add('folderInnerMenu');
    var folderPathTreeP = document.createElement('p');
    folderPathTreeP.classList.add('folderPathTreeP');
    var str = '';
    pId = fid;
    while (pId != 'body' ) {
        str = pId + ' > ' + str;
        pId = folderTree[pId];
    }
    folderPathTreeP.innerText = str;
    var exitBtn = document.createElement('button');
    exitBtn.innerText = 'X';
    folderInnerMenu.appendChild(folderPathTreeP);
    folderInnerMenu.appendChild(exitBtn);
    nf.appendChild(folderInnerMenu);

    var newZ=1+zIndices.reduce(function(a,b){
        return Math.max(a,b);
    });
    zIndices.push(newZ);
    nf.style.zIndex=newZ;
    nf.style.left = nextNewFolderPositionX + folderPositionDet * folderPositionIntervalX + 'px';
    nf.style.top = nextNewFolderPositionY + folderPositionDet * folderPositionIntervalY + 'px';
    folderPositionDet = (folderPositionDet + 1) % folderPositionRpt;

    bd.appendChild(nf);
    exitBtn.onclick = function () {
        this.parentNode.parentNode.remove();
        // document.getElementById(fid).isOpen = 0;
        iconMap[fid].isOpen = 0;
        var currZ=this.parentNode.parentNode.style.zIndex;
        zIndices=zIndices.filter(function(elem){
            if(elem==currZ) return false;
            else return true;
        })
    }
    return nf;
}

function folderDblclick(e) {
    var tg = e.target.parentNode;
    if (tg.isOpen == 1) return;
    tg.isOpen = 1;
    var nf = newFolderWindow(tg.id);
    if (tg.id in folderMap) {
        for (var edom of folderMap[tg.id]) {
            nf.appendChild(edom);
        }
    }
}

function rightClick(e) {
    var om = document.getElementById('optionMenu');
    if (om != null) om.parentNode.remove();
    // var isRightMB;
    e = e || window.event;
    e.stopPropagation();
    eventHolding = e;

    // if ("which" in e) // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
    // isRightMB = e.which == 3;
    // else if ("button" in e) // IE, Opera
    // isRightMB = e.button == 2;

    var nf = document.createElement('div');
    nf.id = 'optionMenuDiv';
    var optionMenu = document.createElement('p');
    optionMenu.id = 'optionMenu';
    optionMenu.innerText = '새 폴더(N)';
    optionMenu.setAttribute('onclick', 'createFolderIcon(eventHolding)');

    var p1=document.createElement('p');
    p1.innerText='보기(V)'
    var p2=document.createElement('p');
    p2.innerText='정렬(O)'
    var p3=document.createElement('p');
    p3.innerText='새로고침(E)'
    var hrLine=document.createElement('hr');
    var p4=document.createElement('p');
    p4.innerText='디스플레이 설정(D)'
    var p5=document.createElement('p');
    p5.innerText='개인설정(R)'

    nf.appendChild(optionMenu);
    nf.appendChild(p1);
    nf.appendChild(p2);
    nf.appendChild(p3);
    nf.appendChild(hrLine);
    nf.appendChild(p4);
    nf.appendChild(p5);

    bd.appendChild(nf);

    nf.style.left = e.clientX + 'px';
    nf.style.top = e.clientY + 'px';
    nf.style.zIndex=1+zIndices.reduce(function(a,b){
        return Math.max(a,b);
    });
}

function createFolderIcon(e) {
    /////////////////////////////////////////////////////////////////
    // e is eventHolding coming from rightClick event
    // e means the dom location where rightClick event occurred
    /////////////////////////////////////////////////////////////////


    var om = document.getElementById('optionMenu');
    if (om != null) om.parentNode.remove();


    /////////////////////////////////////////////////////////////////
    // nf dom creation + nf.id set + folderMap,folderTree, iconMap registration
    var nf = document.createElement('div');
    if (folderNumber == 1) {
        nf.id = '새 폴더';
        folderNumber++;
    }
    else nf.id = '새 폴더(' + (folderNumber++) + ')';
    folderMap[nf.id] = [];
    if (e.target.id == '') folderTree[nf.id] = e.target.connectedFolderId;
    else folderTree[nf.id] = e.target.id;
    iconMap[nf.id] = nf;
    /////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////
    // there are 2 locations where a new folder can be created
    // openFolder and desktop
    if (e.target.className.includes('openFolder')) folderMap[e.target.connectedFolderId].push(nf);
    else folderMap[e.target.id].push(nf);
    /////////////////////////////////////////////////////////////////


    var subDiv = document.createElement('div');
    var subP = document.createElement('p');
    nf.appendChild(subDiv);
    nf.appendChild(subP);
    subP.innerText = nf.id;
    nf.classList.add('icon');
    nf.classList.add('folder');
    subDiv.classList.add('folderImg');
    subP.classList.add('iconName');
    // nf.position=e.target.id; // body id is necessary
    nf.isOpen = 0;


    /////////////////////////////////////////////////////////////////
    // event registration
    nf.draggable = true;
    nf.ondragstart = dragStart;
    nf.ondragover = preventD;
    nf.ondblclick = folderDblclick;
    nf.ondrop = drop;
    // nf.onauxclick=rightClick;
    // nf.oncontextmenu=function(){return false}
    /////////////////////////////////////////////////////////////////

    e.target.appendChild(nf);
}

function createIcon(s,imgPath,exePath){
    var nf = document.createElement('div');
    nf.id=s;
    folderTree[nf.id]='body';
    folderMap['body'].push(nf);
    iconMap[nf.id]=nf;

    var subDiv = document.createElement('div');
    var subP = document.createElement('p');
    var subA=document.createElement('a');
    var subImg=document.createElement('img');
    subA.appendChild(subImg);
    subDiv.appendChild(subA);
    nf.appendChild(subDiv);
    nf.appendChild(subP);
    subP.innerText = s;
    subImg.src=imgPath;
    subA.target='iframe';
    subA.href=exePath;
    // subA.onclick=function(){
    //     return false;
    // }

    nf.classList.add('icon');
    subP.classList.add('iconName');
    subImg.classList.add('iconStarter');
    
    /////////////////////////////////////////////////////////////////
    // event registration
    nf.draggable = true;
    nf.ondragstart = dragStart;
    nf.ondragover = preventD;
    // nf.ondblclick = folderDblclick;
    nf.ondrop = drop;
    /////////////////////////////////////////////////////////////////

    bd.appendChild(nf);
}