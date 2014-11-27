(function()
 {
    
    var body = document.getElementsByTagName("body")[0];
    var genre = document.getElementById("genre");
    var genreWindow = document.getElementById("action-up-nav-popup-window");
    var toolsWindow = document.getElementById("tools");
    var main = document.getElementsByTagName("main")[0];
    
    var movingTool;
    
    var bookListTemplate = '<section class = "main-cardcluster main-cardcluster-nobackground"><div class = "cardcluster-header content" href = "https://play.google.com/store/books/collection/promotion_1001065_toppaid_bookkr"><h1><%=ListTitle=></h1><button>더보기</button></div><div class = "background"><ul class = "card-list content"><%=BookList=></ul></div></section>'
    
    var bookElementTemplate = '<li><section><div class = "bookcover"><a class = "action" href = "<%=Src=>"></a><div class = "cover"><img src = "<%=ImgSrc=>"></img></div></div><div class = "detail"><a href = "<%=Src=>"><h1><%=Title=></h1></a><a href = "<%=Src=>"><h2><%=Author=></h2></a></div><div class = "price"><button><h3>₩<%=Price=></h3></button></div></section></li>'
    
    body.ondragover = function(){
        return false;   
    }
    
    //Event Listener
    //장르 열고 닫기.
    function eLGenreOpen(event)
    {
        if(event.target.id === "button-up-nav-popup" || event.target.parentNode.id === "button-up-nav-popup")
        {
            genreWindow.style.display = "block";
        }
        else
        {
            genreWindow.style.display = "none";
        }
    }
    body.addEventListener('click', eLGenreOpen, false);
    //Event Listener
    //장르 선택
    function eLGenreSelect(event)
    {
        var bookCluster;
        switch(event.target.innerText)
        {
            case "가족/관계":
                ajReplaceBookCluster("family");
                break;
            case "건강/웰빙":
                ajReplaceBookCluster("health");
                break;
            case "경영/경제":
                ajReplaceBookCluster("business");
                break;
            case "과학/수학":
                ajReplaceBookCluster("science");
                break;
        }
        
    }
    body.addEventListener('click', eLGenreSelect, false);

    //Event Listener
    //Tools 창 열기
    function eLToolsOpen(event)
    {
        if(event.target.parentNode.id === "tools"
          || event.target.parentNode.parentNode.id === "tools"
          || event.target.parentNode.parentNode.parentNode.id === "tools")
        {
            tools.querySelector("ul").style.display = "block";   
        }
        else
        {
            tools.querySelector("ul").style.display = "none";
        }
    }
    body.addEventListener('click', eLToolsOpen, false);

    //Event Listener
    //Tools 안에서 Tool옮기기
    //
    function eLToolsMoveStart(event)
    {
        if(event.target.parentNode.classList.contains("tool")
          || event.target.classList.contains("tool"))
        {
            movingTool = event.target;
            for( ; !movingTool.classList.contains("tool") ; movingTool = movingTool.parentNode);
        }
    }
    toolsWindow.addEventListener('mousedown', eLToolsMoveStart, false);
    function isOnNextSiblingsOf(target, base){
        for(base = base.nextSibling; base !== null; base = base.nextSibling)
        {
            if(base === target) return true;   
        }
        return false;
    }
    function eLToolsMoving(event)
    {
        if((event.target.parentNode.classList.contains("tool")
          || event.target.classList.contains("tool"))
          && movingTool !== null)
        {
            var targetTool = event.target;
            for( ; !targetTool.classList.contains("tool") ; targetTool = targetTool.parentNode);
            if(targetTool.id === movingTool.id) return;
            else if(isOnNextSiblingsOf(targetTool, movingTool)) 
            {
                toolsWindow.querySelector("ul").insertBefore(movingTool, targetTool.nextSibling);
            }
            else 
            {
                toolsWindow.querySelector("ul").insertBefore(movingTool, targetTool);
            }
                
        }
    }
    toolsWindow.addEventListener('mousemove', eLToolsMoving, false);
    toolsWindow.ondragstart = function(){ return false; };
    function eLToolsMoveEnd(event)
    {
        if(movingTool !== null) movingTool = null;   
    }
    toolsWindow.addEventListener('mouseup', eLToolsMoveEnd, false);
        
        
        
    function ajReplaceBookCluster(str)
    {
        if(typeof(str) !== "string") return;
        var result = "a";
        var url = "http://127.0.0.1:8000/data/booklist_"+str+".json";
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send(null);
        
        request.onreadystatechange = function()
        {
            if(request.readyState === 4 && request.status == 200)
            {
                result = "";
                var resultText = request.responseText;
                main.innerHTML = makeBookCluster(JSON.parse(resultText));
            }
        }
        return result;
    }
    function eLBookClusterMore(event)
    {
        if(event.target.parentNode.classList.contains("cardcluster-header"))
        {
            var targetEle = event.target.parentNode.parentElement;
            if(targetEle.querySelector(".card-list").style.overflow !== "auto")
            {
                var removeHeaderEle = [ 
                    targetEle.querySelector(".cardcluster-header > h2"), 
                    targetEle.querySelector(".cardcluster-header > button")
                ];
                targetEle.querySelector(".cardcluster-header").height = "none";
                if(removeHeaderEle[0] !== null)
                {
                    targetEle.querySelector(".cardcluster-header").removeChild(removeHeaderEle[0]);
                }
                if(removeHeaderEle[1] !== null)
                {
                    targetEle.querySelector(".cardcluster-header").removeChild(removeHeaderEle[1]);
                }
                
                if(targetEle.classList.contains("main-cardcluster-background"))
                {
                    targetEle.querySelector(".card-list").removeChild(targetEle.querySelector(".card-list li:first-child"));
                    targetEle.classList.remove("main-cardcluster-background");
                    targetEle.classList.add("main-cardcluster-nobackground");
                }
                targetEle.querySelector(".card-list").style.overflow = "auto";
                targetEle.querySelector(".card-list").style.maxHeight = "none";

                main.innerHTML = "";
                main.appendChild(targetEle);
            }
        }
    }
    function makeBookCluster(bookCluster)
    {
        var result = "";             
        bookCluster.forEach(function(item){
            var rTemplate = bookListTemplate.replace("<%=ListTitle=>", item.listTitle).replace("<%=BookList=>", makeBookList(item.bookList));
            result += rTemplate;
        });
        return result;
    }
    function makeBookList(bookList)
    {
        var result = "";
        bookList.forEach(function(item){
            var rTemplate = bookElementTemplate.replace("<%=Title=>", item.title)
            .replace("<%=ImgSrc=>", item.imgSrc)
            .replace("<%=Src=>", item.src)
            .replace("<%=Author=>", item.author)
            .replace("<%=Price=>", item.price);
            result += rTemplate;
        });
        return result;
    }
    


    main.addEventListener('click', eLBookClusterMore, false);

})();