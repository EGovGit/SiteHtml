define(function(){ //取手機版檢測物件

    if( window.CCMS_IsMobile === undefined ) {
        window.CCMS_IsMobile = /(Android|iPhone|iPad|iPod|Windows Phone)/i.test(window.navigator.userAgent);
    }

	return window.CCMS_IsMobile;
});