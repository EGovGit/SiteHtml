define(function(){
	
	function main(env, opt, file){

		var $set = {
				activeClass: 'is-fixed',
				speed: 300,
				debug: false
			}

		$.extend($set, opt);

		var $win = $(window),
			$menu = $(env),
			$in = $menu.children('.in'),
			$in_h = $in.outerHeight(),
			$in_t = $in.offset().top;

		var _eventNmae = file, //事件名稱
			_active = $set.activeClass; //被選擇的 class name

		$win.on(_eventNmae, function () { //開始監測滾動多少的事件
			var $win_t = $win.scrollTop();

			if ($win_t > $in_t) {
				$menu.css({'height': $in_h});
				$menu.addClass(_active);
			} else {
				$menu.css({'height': 'auto'});
				$menu.removeClass(_active);
			}
		});

		$win.on('scroll resize', function(){
			$win.trigger(_eventNmae);
		});

		$win.trigger(_eventNmae);

		//錨點程式

		var $env = $('html,body'),
			$a = $('a[href^="#"]').filter(function(i) {
				var $this = $(this),
					$closest = $this.closest('[data-type]');

				return ( $($this.attr('href')).length !== 0 && !$closest.hasClass('list-text tab'));
			});

		$a.on(_eventNmae, function(){

			var $this = $(this)
				$href = $($this.attr('href'));

			$env.stop().animate({
				scrollTop : ( $href.offset().top ) - $in_h
			}, $set.speed );
		});

		$a.on('click', function(evt){ //觸發事件

			$(this).trigger(_eventNmae);
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});