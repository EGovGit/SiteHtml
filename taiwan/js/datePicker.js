define(['langFilter'], function(langFilter){
	
	function main(env, opt, file){

		var $set = {
				language: 'en',
				todayButton: new Date(),
				debug: false
			}

		$.extend($set, opt);

		if( langFilter ) { //如果是中文
			$set.language = 'zh-tw';
			$set.navTitles = {
				'days': '<i>民國 rrr 年</i> &nbsp; MM',
				'months': '民國 rrr 年',
				'years': '民國 rrr1 至 rrr2 年'
			}
		}

		var $this = $(env),
			$date = $this.find('[type="date"]');

		$date.on('keydown', function(evt){
			var $this = $(this),
				_enter = 13;

			if( evt.which === 13 ) {
				evt.preventDefault();
			}
		});

		$date.each(function(i,n){
			var $this = $(this),
				_val = $this.attr('value');

			$this.attr('type', 'text');
			$this.val(_val);

			$(n).datepicker($set);
		});

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});

