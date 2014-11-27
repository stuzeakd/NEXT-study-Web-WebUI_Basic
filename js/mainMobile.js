(function(){
    var main = document.getElementsByTagName("main")[0];
    var direc = "none";
    var startX;
    var startY;
    var startTime;
    var distX;
    var distY;
    var timeInterval;
    var threshold = 100;
    var restraint = 50;
    var allowedTime = 200;
    
    var cardWidth = document.getElementsByClassName("card")[0].offsetWidth + 10;
    var cardCountInPage = parseInt(window.innerWidth / cardWidth);
    var cardStack = new Array(); ;
    
    function eLSetCardCount(event)
    {
        cardCountInPage = parseInt(window.innerWidth / cardWidth);
    }
    window.addEventListener("resize", eLSetCardCount, false);
    
    //card-list 의 맨 앞에, 화면에 나타난 카드개수만큼 cardStack에서 읽어 card를 붙여넣는다.   
    function seeLeft(targetCardList)
    {
        //예외처리
        if(typeof(targetCardList) !== "object" && targetCardList.classList.contains("card-list")){
            return;  
        }
        for(var i = 0; i < cardCountInPage && cardStack.length != 0 ; ++i)
        {
            targetCardList.insertBefore(cardStack.pop(), targetCardList.firstChild);
        }
    }
    //card-list의 맨앞부터, 화면에 나타난 카드개수만큼 cardStack에 잘라넣는다. 
    function seeRight(targetCardList)
    {
        //예외처리
        if(typeof(targetCardList) !== "object" && targetCardList.classList.contains("card-list")){
            return;  
        }
        
        //남은 card의 개수가 한번에 넘겨지는 card의 개수보다 작을때.
        if(targetCardList.getElementsByTagName("li").length <= cardCountInPage) return;
        
        for(var i = 0; i < cardCountInPage ; ++i)
        {
            var card = targetCardList.querySelector("li:first-of-type");
            //카드가 없으면 빠져나온다.
            if(card === null) break;
            
            cardStack.push(card);
            targetCardList.removeChild(card);
        }
    }
    
    main.addEventListener("touchstart", function(event){
        var touchObj = event.changedTouches[0];
        startX = touchObj.screenX;
        startY = touchObj.screenY;
        startTime = new Date().getTime();
    }, true);
    
    main.addEventListener("touchend", function(event){
        var touchObj = event.changedTouches[0];
        distX = touchObj.screenX - startX;
        distY = touchObj.screenY - startY;
        timeInterval = new Date().getTime() - startTime;
        if(Math.abs(distX) > threshold && Math.abs(distY) < restraint && timeInterval < allowedTime){
            direc = (distX < 0) ? "left" : "right";
        }
        else if(Math.abs(distY) > threshold && Math.abs(distX) < restraint && timeInterval < allowedTime){
            direc = (distY < 0) ? "up" : "down";
        }
        
        //card 위에서 손가락을 쓸었을 때.
        if((event.target.parentNode.parentNode.classList.contains("card")
           || event.target.parentNode.classList.contains("card")
           || event.target.classList.contains("card"))
           && direc !== "none"){
            var targetCardList = event.target;
            
            //card-list를 찾는다.
            for( ; !targetCardList.classList.contains("card-list")  ; targetCardList = targetCardList.parentNode);
            //오른쪽으로 쓸었을 때
            if(direc === "right")
            {
                seeLeft(targetCardList);
            }
            //왼쪽으로 쓸었을 때
            if(direc === "left")
            {
                seeRight(targetCardList);
            }
        }
        direc = "none";
    }, false);
    
})();