define(function(){
	
	function main(env, opt, file){

		var $set = {
				bindSelector: '.map',
				linkClass: 'map', 
				debug: false
			}

		$.extend($set, opt);

		var $this = $(env),
			$bind = $this.find($set.bindSelector);

		$bind.each(function(i, d){
			var $this = $(this),
				_html = $this.html(),
				_target = '<a class="'+ $set.linkClass +'" target="_blank" href="http://maps.google.com/maps?q='+ encodeURIComponent(_html) +'"></a>';

			if (!!_html){
				$this.wrapInner(_target); //包起來
			}
		});
	}
	
	return main;
});