define(['getNode'], function(getNode){
	
	function main(env, opt, file){

		var $set = {
				activeClass: 'is-active',
				singleClass: 'is-single',
				debug: false
			}

		$.extend($set, opt);
		
		var $li = getNode.getCtItem(env), //取 li
			$child_node_in = getNode.getIn($li.children('[data-type]'));

		var $child_node_in = $child_node_in.filter(function(i) { //過濾 .content 裡沒有 a 的物件

				var $this = $(this),
					$child_len = $this.children('.ct').find('a').length;

				if( !$child_len ) { //如果裡面沒東西

					$this.closest('li').addClass($set.singleClass);

					return false;
				}else {
					return true;
				}
			}),
			$child_node_header = $child_node_in.children('.hd'),
			$a = $child_node_header.find('a');

		var _eventNmae = file, //事件名稱
			_active = $set.activeClass; //被選擇的 class name

		$a.on(_eventNmae, function(){
			var $this = $(this),
				_index = $this.closest('li').index();

			$li.eq(_index).toggleClass(_active);
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