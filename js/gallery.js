define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				debug: false
			}

		$.extend($set, opt);

		var $content_in = getNode.getCtIn(env),
			$gallery_box = $content_in.children();

		$gallery_box.lightGallery($set);

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});