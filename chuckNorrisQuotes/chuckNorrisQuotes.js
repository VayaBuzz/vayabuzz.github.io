var currentQuote = '';
var tweetURL = '';

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function openURL(url) {
  window.open(
    url,
    'Share',
    'width=550, height=400, toolbar=0, scrollbars=1 ,location=0 ,statusbar=0,menubar=0, resizable=0'
  );
}

function getQuote() {
  console.log('entering getQuote()');
  $.ajax({
    url: 'https://api.icndb.com/jokes/random',
    success: function (response) {
      console.log(response);
      currentQuote = response.value.joke;
      currentQuote = currentQuote.replace(/&quot;/g, '"');
      tweetURL =
        'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' +
        encodeURIComponent('"' + currentQuote + '"');
      if (inIframe()) {
        $('#tweet-quote').attr('href', tweetURL);
      }
      $('#text').text(currentQuote);
    }, // success
  }); // ajax
} // getQuote

$(document).ready(function () {
  getQuote();
  $('#new-quote').on('click', getQuote);
  $('#tweet-quote').on('click', function () {
    if (!inIframe()) {
      openURL(tweetURL);
    }
  });
});
