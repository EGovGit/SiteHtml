define(function(){
	
	function main(env, opt, file){

		var $set = {
				debug: false,
				activeClass: 'is-open'
			}

		$.extend($set, opt);

		var $env = $(env),
			$input = $env.find('input'),
			$list = $env.find('.list'),
			$li = $list.find('li'),
			$a = $li.find('a');

		var _esc_key = 27,
			_flag = false, //指標是否在區塊內
			_key_word = '';

		$input.on('keyup click', function(evt){

			if( $input.val() && evt.which !== _esc_key ) { //如果 input 有資料而且不是 esc 鍵
				var _val = $input.val();

				if(_val){
					$env.addClass($set.activeClass);
					displayItem(_val);
				}else {
					$env.removeClass($set.activeClass);
				}
			}else {
				$env.removeClass($set.activeClass);
			}
		});

		$input.on('keydown', function(evt){

			if( evt.which === _esc_key ) { //esc 鍵
				$env.removeClass($set.activeClass);
			}
		});

		$env.on('mouseover', function(evt){
			_flag = true;
		});

		$env.on('mouseleave', function(evt){
			_flag = false;
		});

		$input.on('focusout', function(evt){ //$input 失焦

			if (!_flag) {
				$env.removeClass($set.activeClass);
			}
		});

		$a.on('click', function(evt){
			evt.preventDefault();

			$input.val($(this).text());
			$env.removeClass($set.activeClass);
		});

		function displayItem(string) { //輸入字串並篩選出結果
			var regex = new RegExp(string, 'i');

			$li.each(function(i, d) {
				var $this = $(this),
					$this_t = $.trim($this.text()); //取出物件的文字並 trim

				if( $this_t.match(regex) && $this_t !== string ) {
					$this.show();
				}else {
					$this.hide();
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