(function() {
    function aSync_load()
    {
        var main = document.createElement("script");
        //main.type = "text/javascipt";
        main.src = "js/mainMobile.js"
        document.body.appendChild(main);
    }
    window.addEventListener("load", aSync_load, false);
})();