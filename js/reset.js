define(function(){
	
	function main(env, opt, file){

		var $set = {
				debug: false
			}

		$.extend($set, opt);

		var $this = $(env),
			$btn = $('input[type="reset"]'),
			_event = 'form.reset';

		var $select = $this.find('select'),
			$text = $this.find('[type="text"]'),
			$password = $this.find('[type="password"]'),
			$date = $this.find('[type="date"]'),
			$number = $this.find('[type="number"]'),
			$search = $this.find('[type="search"]'),
			$email = $this.find('[type="email"]'),
			$radio = $this.find('[type="radio"]'),
			$checkbox = $this.find('[type="checkbox"]'),
			$textarea = $this.find('textarea');


		$btn.on(_event, function(){
			reset();
		});

		$btn.on('click', function(evt){
			evt.preventDefault()

			$btn.trigger(_event);
		});

		function reset() {
			$text.val('');
			$password.val('');
			$date.val('');
			$number.val('');
			$search.val('');
			$email.val('');
			$textarea.val('');

			$select.each(function(i, d){
				d.selectedIndex = 0;
			});

			$radio.each(function(i, d){
				d.checked = false;
			});

			$checkbox.each(function(i, d){
				d.checked = false;
			});
		}

		if($set.debug) {
			console.log('預設值:', $set);
			console.log('檔案 '+ file +'.js 已順利執行。');
		}
	}
	
	return main;
});