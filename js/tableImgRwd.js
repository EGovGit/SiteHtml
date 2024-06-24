define(function(){
	
	function main(env, opt, file){

		var $set = {
				windowSize: 768,
				maxSize: 0.5, //最大的寬度，變數 0 ~ 1
				debug: false
			}

		$.extend($set, opt);

		var $window = $(window),
			$this = $(env),
			$tds = $this.find('td');

		$tds.each(function(i, d){
			var $td = $(d),
				$imgs = $td.find('img');

			$imgs.each(function(i, d){
				var $img = $(d),
					_display = $img.css('display') || 'inline',
					_margin = $img.css('margin') || '0px',
					_float = $img.css('float') || 'none';

				$img.attr('data-display', _display);
				$img.attr('data-margin', _margin);
				$img.attr('data-float', _float);
			});
		});

		$window.on('resize', function(){

			if( $set.windowSize > $window.width() ) {
				imgResize($tds);
			}
		}).resize();

		function imgResize($tds){

			$tds.each(function(i, d){
				var $td = $(d),
					$td_w = $td.width(),
					$td_w_base = $td_w * $set.maxSize, //td 的百分之幾
					$imgs = $td.find('img');

				$imgs.each(function(i, d){
					var $img = $(d),
						$img_w = $img.width();

					if( $img_w > $td_w_base ) {
						$img.css({
							'display': 'block',
							'margin': '0 auto',
							'float': 'none'
						});
					}else {
						$img.css({
							'display': $imgs.data('display'),
							'margin': $imgs.data('margin'),
							'float': $imgs.data('float')
						});
					}
				});
			});
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});