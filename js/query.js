define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				speed: 300,
				interval: 1, //彈跳間隔時間(days)
				cookieName: 'query',
				cookieValue: 'oka',
				hideBtn: false, //隱藏 是&否
				debug: false
			}

		$.extend($set, opt);

		var $env = $(env),
			$ct = getNode.getCt(env),
			$span = $ct.find('span'),
			$ft = getNode.getFt(env),
			$btn = $ft.find('a'),
			$allow = $ft.find('.allow').find('a'),
			$deny = $ft.find('.deny').find('a'),
			$close = $ft.find('.close').find('a');

		if( $set.hideBtn ) {
			$allow.hide();
			$deny.hide();
		}

		if( !$.cookie($set.cookieName) ) {

			$env.fadeIn($set.speed);

			$allow.on('click', function(evt){
				evt.preventDefault();

				//...
				queryClose();
			});

			$deny.on('click', function(evt){
				evt.preventDefault();

				//...
				queryClose();
			});

			$close.on('click', function(evt){
				evt.preventDefault();

				//...
				queryClose();
			});
		}

		function queryClose(){

			$env.fadeOut($set.speed, function(){
				$env.remove();
			});

			$.cookie($set.cookieName, $set.cookieValue, {expires: $set.interval});
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});