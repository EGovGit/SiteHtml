define(function(){
	
	function main(env, opt, file){

		var $set = {
				activeClass: 'is-toggle',
				speed: 300,
				debug: false
			}

		$.extend($set, opt);

		var $env = $(env),
			$div = $env.find('.div');

		$div.wrapInner('<div class="div" />').children(0).unwrap();
		
		var $caption = $env.find('.caption'),
			$p = $env.find('.p');

		$caption.css({
			'cursor': 'pointer'
		});

		$caption.on('click', function(evt){
			evt.stopPropagation();

			$env.toggleClass($set.activeClass);
			$p.slideToggle($set.speed);
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});