var isChrome = !!window.chrome && !!window.chrome.webstore;
var isEdge = !window.isIE && !!window.StyleMedia;
var isIE = /*@cc_on!@*/false || !!document.documentMode;
var screenwidth = 1920;

getScreeWidth();

function getScreeWidth(){
    screenwidth = screen.width;
    widthChange();
}

function widthChange(){
  if(screenwidth >= 900){
    if(isEdge != true && isIE != true){
      document.body.style.overflow="hidden";
      window.addEventListener('wheel', scrollToLocked);
    }else{
      document.body.style.overflow="auto";
      window.removeEventListener('wheel', scrollToLocked);
    }
  } else {
    closeNavMenu();
    document.body.style.overflow="auto";
    window.removeEventListener('wheel', scrollToLocked);
  }
}

document.getElementById('mobileMenuButton').addEventListener("click", mobileBtnClicked);

function mobileBtnClicked(){
  if(document.getElementById('navMenu').style.left=="0%"){
      closeNavMenu();
  }
  else {
    showNavMenu();
  }
}

function showNavMenu(){
  document.getElementById('navMenu').style.left="0%";
  document.body.style.overflow = "hidden";
  document.querySelector('body').classList.add("mobileBtnCross");
}

function closeNavMenu(){
  document.getElementById('navMenu').style.left="-80%";
  document.body.style.overflow = "scroll";
  document.querySelector('body').classList.remove("mobileBtnCross");

}

var startingX;
var startingY;

var width = window.innerWidth;

var clickzone = width/4*3;

var declickzone = width/5*4


function p1hanleTouchStart(evt){
  startingX = evt.touches[0].clientX;
  startingY = evt.touches[0].clientY;

  if(startingX > declickzone){
    closeNavMenu();
  }

}

function p1hanleTouchMove(evt){
  var touch = evt.touches[0];
  var changeX = startingX - touch.clientX;
  var changeY = startingY - touch.clientY;


  if(startingX < clickzone){
    if(changeX < -30){
      if(changeY < 10 && changeY > -10){
        showNavMenu();
      }
    }
  }


  if(changeX > 30){
    if(changeY < 10 && changeY > -10){
      closeNavMenu();
    }
  }
}


var privateTimeout = 0;
var lastScrollZeroTimeout;

var lastScroll=0;

function scrollToLocked(e){

  clearTimeout(lastScrollZeroTimeout);

  if (e.deltaY < 0 && e.deltaY < lastScroll && privateTimeout == 0) {
    scrollPage("prev");
    startScrollTimeout();
  } else if (e.deltaY > 0 && e.deltaY > lastScroll && privateTimeout == 0) {
    scrollPage("next");
    startScrollTimeout();
  }

  lastScroll = e.deltaY*2;


  lastScrollZeroTimeout = setTimeout(function(){
    lastScroll = 0;
   }, 500);

}

function startScrollTimeout(){
  privateTimeout=1;
  setTimeout(function(){
    privateTimeout=0;
  }, 500);
}


activateTopLinks();


function activateTopLinks(){
  document.getElementById("rowClick1").addEventListener('click', linkScroll);
  document.getElementById("rowClick2").addEventListener('click', linkScroll);
  document.getElementById("rowClick3").addEventListener('click', linkScroll);
  document.getElementById("rowClick4").addEventListener('click', linkScroll);
}

function deActivateTopLinks(){
  document.getElementById("rowClick1").removeEventListener('click', linkScroll);
  document.getElementById("rowClick2").removeEventListener('click', linkScroll);
  document.getElementById("rowClick3").removeEventListener('click', linkScroll);
  document.getElementById("rowClick4").removeEventListener('click', linkScroll);
}


function linkScroll(){

  var targetElmnt = "row" + (this.id).substr(-1);
  deActivateTopLinks();
  setTimeout(function(){activateTopLinks()},500);
  scrollPage(targetElmnt);

}


var oldScrollTarget = "row1";

function scrollPage(elmnt){

  if(screenwidth<900){
    closeNavMenu();
  }
  var docTop = document.scrollingElement.scrollTop;
  var numRows = document.querySelectorAll('.row').length
  if(elmnt == "next"){
    scrollTarget = String("row"+numRows);
    for(var i=1; i<=numRows; i++){
      var rowVar = String("row"+i);
      if(document.getElementById(rowVar).offsetTop > docTop+100 && rowVar != oldScrollTarget){
        scrollTarget = rowVar;
        i=numRows+1;
      }
    }

  } else if(elmnt == "prev"){
    scrollTarget = "row1";
    for(var i=numRows; i>0; i--){
      var rowVar = String("row"+i);
      if(document.getElementById(rowVar).offsetTop < docTop-100 && rowVar != oldScrollTarget){
        scrollTarget = rowVar;
        i=-1;
      }
    }
  } else {
    scrollTarget = elmnt;
  }


    oldScrollTarget = scrollTarget;
    var elmntTop = document.getElementById(scrollTarget).offsetTop-50;
    var scrollDistance = elmntTop - docTop;
    var percentage = 0;
    var percentageSum = 0;
    var scrollTimeInterval = setInterval(smoothScroll, 25);

  function smoothScroll(){

    document.body.style.overflow = "hidden";

    if(percentage == 0){
      percentage = 0.125;
    } else if(percentageSum < 15.75){
      percentage = percentage*2;
    } else if(percentageSum < 84.125){
      percentage = 11.375;
    } else if(percentageSum==84.125){
      percentage = 8;
    } else if(percentageSum < 99.875){
      percentage = percentage/2;
    } else {
      percentage = 0;
      percentageSum = 100;
      clearInterval(scrollTimeInterval);
    }

    percentageSum = percentageSum + percentage;

    scrollX = docTop + (scrollDistance*(percentageSum/100));

    window.scrollTo(0, scrollX);

    if(screenwidth>=900){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }

  }
}


document.body.addEventListener("keydown", keyEvent);

function keyEvent(e){

  e = e || window.event;

  switch(e.keyCode){
    case 40:
      scrollPage("next");
      keyTimeout();
    break;
    case 39:
      scrollPage("next");
      keyTimeout();
    break;
    case 34:
      scrollPage("next");
      keyTimeout();
    break;
    case 32:
      scrollPage("next");
      keyTimeout();
    break;
    case 38:
      scrollPage("prev");
      keyTimeout();
    break;
    case 37:
      scrollPage("prev");
      keyTimeout();
    break;
    case 33:
      scrollPage("prev");
      keyTimeout();
    break;
  }

  function keyTimeout(){
    document.body.removeEventListener("keydown", keyEvent);
    setTimeout(function(){
      document.body.addEventListener("keydown", keyEvent);
    },500);

  }
}
