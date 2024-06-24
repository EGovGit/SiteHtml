define(['getNode'], function (getNode) {

	function main(env, opt, file) {

		var $set = {
			cookie: 'classify',
			class :'is-active',
			debug: false
		}

		$.extend($set, opt);

		var $li = getNode.getCtItem(env);


		if ($.cookie($set.cookie) != undefined) {
			var _i =Number($.cookie($set.cookie)); 
		
			$li.eq(_i-1).find('a').focus();
			document.cookie = $set.cookie+"=" + undefined;
			

		}

		$li.each(function () { 
			 var $a = $(this).find('a');
			 var _i = $(this).attr('data-index');
			
			$a.click(function (e) { 
				document.cookie = $set.cookie+"=" + _i;
				
			 });
			
		});

		

		if ($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 ' + file + '.js 已順利執行。');
		}
	}

	return main;
});