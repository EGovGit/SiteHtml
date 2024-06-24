define(function(){
	
	function main(env, opt, file){

		var $set = {
				top: 100,
				showSpeed: 600,
				hideSpeed: 400,
				debug: false
			}

		$.extend($set, opt);

		var $win = $(window),
			$this = $(env);

		$win.scroll(function() {

			if ($win.scrollTop() > $set.top ) {
				$this.fadeIn($set.showSpeed);
			} else {
				$this.fadeOut($set.hideSpeed);
			}
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});
