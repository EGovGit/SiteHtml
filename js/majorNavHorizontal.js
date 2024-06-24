define(['getNode', 'mobileFilter'], function(getNode, mobileFilter){
	
	function main(env, opt, file){

		var $set = {
				activeClass: 'is-active',
				parentClass: 'is-parent',
				clickToRemove: true,
				event: 'mouseenter', //jQuery 事件名稱
				debug: false
			}

		$.extend($set, opt);

		var $env = $(env),
			$li = getNode.getCtItem(env), //取 li
			$child_node = getNode.getChildGroup(env), //取 group nav
			$child_node_header = getNode.getHd($child_node),
			$child_node_content = getNode.getCt($child_node),
			$a = $child_node_header.find('a'),
			$a_length = $a.length,
			$last_a = $env.find('a').eq(-1);

		//幫 .content 裡有 a 的物件加上 is-active
		$child_node.each(function(i, d){

			var $this = $(this),
				$li_parent = $this.parent('li'),
				$a = getNode.getCt($this).find('a');

			if( $a.length ) {
				$li_parent.addClass($set.parentClass);
			}
		});

		//為該 li 加入 class name，並刪除其他 li 的 class
		$a.on(file, function(){
			var $this = $(this),
				$li_parent = $this.closest('li');

			$li.removeClass($set.activeClass);
			$li_parent.addClass($set.activeClass);
		});

		$a.on($set.event, function(){ //觸發事件
			$(this).trigger(file);
		});

		if( $set.event === 'mouseenter' ) {

			$env.on('mouseleave', function(){
				$li.removeClass($set.activeClass);
			});
		}

		if( $set.clickToRemove ) {
			var $body = $('body');

			$env.on('click', function(evt){
				evt.stopPropagation();
			});

			$body.on('click', function(){
				$li.removeClass($set.activeClass);
			});

			var _c = 67,
				_u = 85,
				_l = 76,
				_z = 90;

			$body.on('keydown', function(evt){
				
				if( ( evt.which === _c || evt.which === _u || evt.which === _l || evt.which === _z ) && evt.ctrlKey ) {
					$li.removeClass($set.activeClass);
				}
			});
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});