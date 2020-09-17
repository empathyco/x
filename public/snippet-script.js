function getURLParameter(name) {
    return decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
}

var instance = getURLParameter('instance') || 'juguettos';
var env = getURLParameter('env') || undefined;
var scope = getURLParameter('scope') || 'default';
var lang = getURLParameter('lang') || 'es';
var searchLang = getURLParameter('searchLang') || lang;
var currency = getURLParameter('currency') || 'EUR';
var consent = getURLParameter('consent') === 'true' || false;
var documentDirection = getURLParameter('doc-dir') || 'ltr';

/*window.initX = function() {
  return {
    instance,
    env,
    scope,
    lang,
    searchLang,
    currency,
    consent,
    documentDirection
  };
};*/

window.initX = {
    instance,
    env,
    scope,
    lang,
    searchLang,
    currency,
    consent,
    documentDirection
};

