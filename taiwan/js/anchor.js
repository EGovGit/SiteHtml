define(function(){
	
	function main(env, opt, file){

		var $set = {
				bindNode: 'body',
				speed: 300,
				debug: false
			}

		$.extend($set, opt);

		var $env = $('html,body'),
			$a = $(env).find('a');

		var _eventNmae = file; //事件名稱

		$a.on(_eventNmae, function(){

			var $this = $(this),
				$href = $($this.attr('href'));

			var $fixed_h = $('.is-fixed').outerHeight() || 0; //浮動高度

			if( !$href.length ) { $href = $($set.bindNode) }

			$env.stop().animate({
				scrollTop : ( $href.offset().top ) - $fixed_h
			}, $set.speed );
		});

		$a.on('click', function(evt){ //觸發事件
			evt.preventDefault();

			$(this).trigger(_eventNmae);
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});