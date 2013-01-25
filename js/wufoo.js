var highlight_array = [];

/*--------------------------------------------------------------------------*/

//http://www.robertnyman.com/2005/11/07/the-ultimate-getelementsbyclassname/
function getElementsByClassName(oElm, strTagName, strClassName){
    var arrElements = (strTagName === "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = [];
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i<arrElements.length; i++){
        oElement = arrElements[i];
        if(oRegExp.test(oElement.className)){
            arrReturnElements.push(oElement);
        }
    }
    return (arrReturnElements);
}

//http://www.bigbold.com/snippets/posts/show/2630
function addClassName(objElement, strClass, blnMayAlreadyExist){
   if ( objElement.className ){
      var arrList = objElement.className.split(' ');
      if ( blnMayAlreadyExist ){
         var strClassUpper = strClass.toUpperCase();
         for ( var i = 0; i < arrList.length; i++ ){
            if ( arrList[i].toUpperCase() === strClassUpper ){
               arrList.splice(i, 1);
               i--;
             }
           }
      }
      arrList[arrList.length] = strClass;
      objElement.className = arrList.join(' ');
   }
   else{
      objElement.className = strClass;
      }
}

//http://www.bigbold.com/snippets/posts/show/2630
function removeClassName(objElement, strClass){
   if ( objElement.className ){
      var arrList = objElement.className.split(' ');
      var strClassUpper = strClass.toUpperCase();
      for ( var i = 0; i < arrList.length; i++ ){
         if ( arrList[i].toUpperCase() === strClassUpper ){
            arrList.splice(i, 1);
            i--;
         }
      }
      objElement.className = arrList.join(' ');
   }
}

function disableSubmitButton() {
    document.getElementById('saveForm').disabled = true;
}

// for radio and checkboxes, they have to be cleared manually, so they are added to the
// global array highlight_array so we dont have to loop through the dom every time.

function highlight(el, depth){
    var fieldContainer;
    if(depth === 2){fieldContainer = el.parentNode.parentNode;}
    if(depth === 3){fieldContainer = el.parentNode.parentNode.parentNode;}
    if(depth === 4){fieldContainer = el.parentNode.parentNode.parentNode.parentNode;}
    
    addClassName(fieldContainer, 'focused', true);
    var focusedFields = getElementsByClassName(document, "*", "focused");
    
    for(var i = 0; i < focusedFields.length; i++) {
        if(focusedFields[i] !== fieldContainer){
            removeClassName(focusedFields[i], 'focused');
        }
    }
}

function initializeFocus(){
    var fields = getElementsByClassName(document, "*", "field");
    
    for(var i = 0; i < fields.length; i++) {
        if(fields[i].type === 'radio' || fields[i].type === 'checkbox') {
            fields[i].onclick = function() {highlight(this, 4);};
            fields[i].onfocus = function() {highlight(this, 4);};
        }
        else if(fields[i].className.match('addr') || fields[i].className.match('other')) {
            fields[i].onfocus = function(){highlight(this, 3);};
        }
        else {
            fields[i].onfocus = function(){highlight(this, 2); };
        }
    }
}

function ifInstructs(){
    var container = document.getElementById('public');
    if(container){
        removeClassName(container,'noI');
        var instructs = getElementsByClassName(document,"*","instruct");
        if(instructs === ''){
            addClassName(container,'noI',true);
        }
        if(container.offsetWidth <= 450){
            addClassName(container,'altInstruct',true);
        }
    }
}

function showRangeCounters(){
    var counters = getElementsByClassName(document, "em", "currently");
    for(var i = 0; i < counters.length; i++) {
        counters[i].style.display = 'inline';
    }
}

function validateRange(ColumnId, RangeType) {
    if(document.getElementById('rangeUsedMsg'+ColumnId)) {
        var field = document.getElementById('Field'+ColumnId);
        var msg = document.getElementById('rangeUsedMsg'+ColumnId);

        switch(RangeType) {
            case 'character':
                msg.innerHTML = field.value.length;
                break;
                
            case 'word':
                var val = field.value;
                val = val.replace(/\n/g, " ");
                var words = val.split(" ");
                var used = 0;
                for(var i =0; i < words.length; i++) {
                    if(words[i].replace(/\s+$/,"") !== "") { used++; }
                }
                msg.innerHTML = used;
                break;
                
            case 'digit':
                msg.innerHTML = field.value.length;
                break;
        }
    }
}

//http://ejohn.org/projects/flexible-javascript-events/
function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj["e"+type+fn] = fn;
    obj[type+fn] = function() { obj["e"+type+fn]( window.event ); };
    obj.attachEvent( "on"+type, obj[type+fn] );
  }
  else{
    obj.addEventListener( type, fn, false );
  }
}

function initForm(){
    initializeFocus();
    var activeForm = document.getElementsByTagName('form')[0];
    addEvent(activeForm, 'submit', disableSubmitButton);
    ifInstructs();
    showRangeCounters();
}

addEvent(window, 'load', initForm);