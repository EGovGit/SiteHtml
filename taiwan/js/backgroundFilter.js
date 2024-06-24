define(function(){ //辨認網站是否正在後台運行

    if( window.CCMS_IsBackground === undefined ) {
        
        if( $('.root.background').length ) {
            window.CCMS_IsBackground = true;
        }else {  
            window.CCMS_IsBackground = false;
        }
    }

    return window.CCMS_IsBackground;
});