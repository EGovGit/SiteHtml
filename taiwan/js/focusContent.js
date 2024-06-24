define(['getNode'], function(getNode){

	function main(env, opt, file){

		var $set = {
				auto: false, //是否自動撥放
				event: 'click' //jQuery 事件名稱
			}

		$.extend($set, opt);

		var $env = $(env),
			$a = getNode.getCt($env).find('a');

		$a.on($set.event, function(evt){
			evt.preventDefault();

			var $href = $($a.attr('href')),
				$target = $href.find('a[href], input, select').eq(0);

			$target.focus();
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}

	return main;
});