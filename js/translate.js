define(function(){
	
	function main(){

        window.googleTranslateElementInit = function () {
            new google.translate.TranslateElement({
                pageLanguage: 'zh-TW',includedLanguages: 'en,zh-TW',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
        }
	}
	
	return main;
});