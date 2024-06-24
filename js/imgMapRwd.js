define(function(){
	
	function main(env, opt, file){

		var $set = {
				debug: false
			}

		$.extend($set, opt);

		var $window = $(window),
			$this = $(env),
			$map = $this.find('map');

		$map.each(function(i, d){
			var $this = $(d),
				$area = $this.find('area'),
				$img = $('[usemap="#'+ $this.attr('name') +'"]'),
				$img_na_w = $img.get(0).naturalWidth; // 圖片現在寬度

			if( $img.get(0).style.width.match('px') ) {
				$img_na_w = parseInt($img.get(0).style.width, 10);
			}
			
			if( $img.attr('width') ) {
				$img_na_w = parseInt($img.attr('width'), 10);
			}

			$window.on('resize', function(){
				setRwd($map);
			}).resize();

			function setRwd() {
				var _size = $img.width() / $img_na_w;
	
				$area.each(function(i, d){
					var $this = $(d),
						$coords = $this.attr('data-coords');

					if( $coords === undefined ) {
						var _orange = $this.attr('coords');

						$this.attr('data-coords', _orange);
						$coords = _orange;
					}

					$coords = $coords.split(','); //轉為陣列

					var $coords_len = $coords.length;

					for( var _i = 0; _i < $coords_len; _i++ ) {
						$coords[_i] = parseInt($coords[_i], 10) * _size;
					}

					$this.attr('coords', $coords.toString());
				});
			}
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});