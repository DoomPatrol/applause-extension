var popupScript = popupScript || {
  init: function(){
    popupScript.loadItems();
  },

  loadItems: function(){
    chrome.storage.sync.get(['totalClaps'], function(claps) {
        var totalClaps = claps.totalClaps !== undefined ? claps.totalClaps : 0;
        if($.isEmptyObject(claps)){
          $('.total-claps-content').hide();
        } else {
          $('.tagline').hide();
            $('.total-claps').text(totalClaps);
        }
    });

    chrome.storage.sync.get(['claps'], function(items) {
      if($.isEmptyObject(items)){
        $('.main-popup').append('<div class="clap-card"><p class="sad-panda">Sad panda. You haven\'t clapped for anyone yet. Get to clapping on <a target="_blank" href="https://www.medium.com">Medium</a></p><img class="sad-panda-img" src="../../img/panda.png"></div>');
      } else {
        clapItems = items.claps;
        for(i = 0; i < clapItems.length; i++){
            var clapItem = '<div class="clap-card"><p class="clap-counter">'+ (i + 1) +'.)  '+ clapItems[i].claps +' <img src="../../icons/icon16.png"> for <a target="_blank" href="'+ clapItems[i].url +'">'+ clapItems[i].title +'</a> by '+ clapItems[i].author +'<p></div>'
            $('.main-popup').append(clapItem);
        }
      }
    });
  }
}

popupScript.init();
