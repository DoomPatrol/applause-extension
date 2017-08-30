// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
var bgScript = bgScript || {
  init: function() {
    bgScript.messaging.listener();
  },
  messaging: {
    listener: function(){
      chrome.extension.onMessage.addListener(
        function(request, sender, sendResponse) {
          if(request.method === 'medium'){
            bgScript.save.saveClaps(request);
          }
          // sendResponse();
        });
    }
  },

  save: {
    saveClaps: function(request){
      chrome.storage.sync.get(['claps'], function(claps) {
          var clapArray = claps.claps !== undefined ? claps.claps : [];
          function findExistingURL(item){
            return item.url === request.url;
          }
          var clapExists = clapArray.findIndex(findExistingURL);


          if(clapExists !== -1){
            clapArray[clapExists]['claps'] += request.claps;
            var newClaps = clapArray[clapExists];
            clapArray.splice(clapExists,1);
            clapArray.unshift(newClaps);

          } else {
            clapArray.unshift(request);

          }

          clapArray = clapArray.slice(0,50);

          chrome.storage.sync.set({'claps': clapArray}, function() {
          });

      });

      chrome.storage.sync.get(['totalClaps'], function(claps) {
          var totalClaps = claps.totalClaps !== undefined ? claps.totalClaps : 0;
          totalClaps += parseInt(request.claps);
          chrome.storage.sync.set({'totalClaps': totalClaps}, function() {
          });
//
      });
    }
  }

}

bgScript.init();
