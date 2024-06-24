define(['getNode', 'langFilter'], function(getNode, langFilter){
	
	function main(env, opt, file){

		var $set = {
				navLen: 10,
				text: 'more...',
				chText: '更多...',
				debug: false
			}

		$.extend($set, opt);

		if( $set.navLen === 0 ) {
			return false;
		}

		var $groupList_nav = $(env),
			$group_navs = getNode.getChildGroup($groupList_nav);

		var _navLen = parseInt($groupList_nav.data('setnavlen'), 10) || $set.navLen,
			_text = $set.text;

		if( langFilter ) {
			_text = $set.chText;
		}

		$group_navs.each(function(i, d){
			var $group_nav = $(d),
				$listText_navs = $group_nav.find('.list-text.nav');

			$listText_navs.each(function(){
				var $listText_nav = $(d),
					$listText_nav_list = $listText_nav.find('.ct ul'),
					$listText_nav_item = $listText_nav_list.find('li'),
					$listText_nav_item_len = $listText_nav_item.length;

				if( $listText_nav_item_len > _navLen ) {
					var _href = $listText_nav.find('.hd a').attr('href');

					$listText_nav_item.slice(_navLen).remove();
					$listText_nav_list.append('<li class="is-more"><span><a title="'+ _text +'" href="'+ _href +'">'+ _text +'</a></span></li>')

				}
			});
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});