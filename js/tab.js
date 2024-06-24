define(['getNode', 'mobileFilter'], function(getNode, mobileFilter){
	
	function main(env, opt, file){

		var $set = {
				auto: false, //是否自動撥放
				delay: 5000, //停留時間
				event: 'click', //jQuery 事件名稱
				activeClass: 'is-active', //啟動的 class
				hiddenID: null,//俊仁
				defaulttab:0,
				debug: false
			}

		$.extend($set, opt);		
		if($(env).attr('class').indexOf('aside-tab')>0)
		{
			$set.defaulttab=1;
		}		
		var $env = $(env),
			$li = getNode.getCtItem(env),
			$tab = $li.eq(0).children('.tab'),
			$tab_li = $tab.find('li'),
			$tab_li_length = $tab_li.length,
			$tab_a = $tab_li.find('a'),
			$items = $li.filter(function(i) { //過濾第一個 jquery 物件，也就是 tab
				return !!i;
			});

		var _delegation = false, //是否有 input[type="hideen"] 代理事件
			$delegationNode = $(),
			_index = 0;

		if( $set.hiddenID !== null && $('input[id*="'+ $set.hiddenID +'"]').length === 1 ) {
			_delegation = true;
			$delegationNode = $('input[id*="'+ $set.hiddenID +'"]');
			
			var _val = parseInt($delegationNode.val(), 10);
			
			if( _val !== NaN && _val < $tab_li_length ) {
				_index = _val;
			}
		}

		//如果不是手機就開啟無障礙尋覽功能
		if( !mobileFilter ) {
			var _tab_key = 9;

			for( var i = 0; i < $tab_li_length; i++ ) {

				(function(i){
					var $this = $tab_a.eq(i),
						$item = $items.eq(i),
						$before_item = $items.eq(i - 1);
					
					//移除 hd
					getNode.getHd($item.children('[data-index]')).remove();

					var $item_all_a = $item.find('[href], input, [tabindex="0"]'),
						$before_item_all_a = $before_item.find('[href], input, [tabindex="0"]');

					var _isFirst = ( i === 0 ),
						_isLast = ( i === $tab_li_length - 1 );

					//先寫內頁 a 的邏輯

					var $item_first_a = $item_all_a.eq(0),
						$item_last_a = $item_all_a.eq(-1),
						$before_item_first_a = $before_item_all_a.eq(0),
						$before_item_last_a = $before_item_all_a.eq(-1);

					// 觸發 this 就 focus 目標裡的第一個 a
					$this.on('keydown', function(evt){

						if( evt.which === _tab_key && !evt.shiftKey ) {
							evt.preventDefault();

							slider(i);

							if( $item_all_a.length ) {
								$item_first_a.focus();
							}else {
								$tab_a.eq(i + 1).focus();
							}

						}else if( evt.which === _tab_key && evt.shiftKey && !_isFirst ) {
							evt.preventDefault();

							slider(i - 1);

							if( $before_item_all_a.length ) {
								$before_item_last_a.focus();
							}else {
								$tab_a.eq(i - 1).focus();
							}
						}
					});

					$item_first_a.on('keydown', function(evt){

						if( evt.which === _tab_key && evt.shiftKey ) {
							evt.preventDefault();

							$tab_a.eq(i).focus();
						}
					});	
					
					$item_last_a.on('keydown', function(evt){

						if( evt.which === _tab_key && !evt.shiftKey && !_isLast ) {
							evt.preventDefault();

							$tab_a.eq(i + 1).focus();
						}
					});
				})(i);
			}
		}

		//代理事件
		$tab_a.on(file, function(){
			var $this = $(this),
				_index = $this.closest('li').index();

			slider(_index);
		});

		//觸發事件舊觸發代理事件
		$tab_a.on($set.event, function(evt){
			evt.preventDefault();

			$(this).trigger(file);
		});
		if($set.defaulttab==0){
			slider(_index);
		}else{
			console.log($set.defaulttab)
			slider($set.defaulttab);
		}
		
		function slider(_index) {
			$tab_li.removeClass($set.activeClass);
			$tab_li.eq(_index).addClass($set.activeClass);
			$items.hide();
			$items.eq(_index).show();

			if( _delegation ) {
				$delegationNode.val(_index);
			}
		}

		if ($set.auto) { //如果要輪播
			var timer; //設定計時器

			function auto() { //設定自動撥放涵式

				_index = (_index + 1 + $tab_li_length) % $tab_li_length; //算出第幾個要被撥放

				slider(_index); //預設向右撥放
				timer = setTimeout(auto, $set.delay);
			}

			function autoStart(){
				clearTimeout(timer);
				timer = setTimeout(auto, $set.delay);
			}

			function autoClear(){
				clearTimeout(timer);
			}
			
			$env.on('mouseenter', function(){ //設定滑進滑出項目
				autoClear();
			});

			$env.on('mouseleave', function(){
				autoStart();
			});

			timer = setTimeout(auto, $set.delay); //輪播開始
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});