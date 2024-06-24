define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				debug: false
			}

		$.extend($set, opt);

		var $content_in = getNode.getCtIn(env),
			$player_box = $content_in.find('.video');

		$player_box.flowplayer($set);

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});