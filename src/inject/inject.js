// // store url on load
var currentPage = window.location.href;
var clickedButton = false;

// listen for changes
setInterval(function()
{
    if (currentPage != window.location.href)
    {
        // page has changed, set new page as 'current'
        currentPage = window.location.href;
				$(document).ready(function() {
					setTimeout(function() {
						injectScript.init();
					}, 3000);
				});

        // do your thing...
    }
}, 1000);
		var injectScript = injectScript || {

			init: function(){
				injectScript.listeners.siteListener();
			}, // end of init

			listeners: {
				messageListener: function(){
					chrome.extension.onMessage.addListener(
			      function(request, sender, sendResponse) {
			      });
				},
				siteListener: function(){
					if((location.href.match(/:\/\/medium.com\/[a-zA-Z]/)) || $('[property="al:ios:app_name"]').attr('content') === 'Medium'){
							var clickBox = '<div class="applause-click-box">'+
																'<span class="applause-error-handler"></span>'+
														    '<input class="applause-input-claps" type="text" placeholder="# of claps" />'+
																'<button class="applause-button">Applause! 👏</button>'+
														  '</div>';
							$($('[data-action="multivote"][data-action-source="post_actions_footer"]')[0]).parent().parent().append(clickBox);
							$($('[data-action="multivote"][data-action-source="post_share_widget"]')[0]).parent().parent().append(clickBox);

						var startTime, endTime;
						$('[data-action="multivote"]').mousedown(function() {
              if(clickedButton === false){
                startTime = new Date().getTime();
              } else {

              }
						});

						$('[data-action="multivote"]').mouseup(function() {
              if(clickedButton === false){
							endTime = new Date().getTime();
							var timeHeld = endTime - startTime;
							var clapCalc = Math.round((timeHeld/200) + 1);
							var clapData = {
								url: window.location.href,
								method: 'medium',
								claps: clapCalc,
								title: $('.graf--title').text(),
								author: $('[property="article:author"]').attr('content') !== undefined ? $('[property="article:author"]').attr('content') : $('[property="author"]').attr('content')
							}

							injectScript.messaging.sendMessage(clapData);
            } else {
              clickedButton = false;
            }
						});

						$('.applause-button').on('click', function() {
              clickedButton = true;
							var applauseInput = $(this).prev('input').val();

							var applauseLength;
							if(!!applauseInput && !isNaN(parseFloat(applauseInput)) && applauseInput > 0) {
								$('.applause-error-handler').text('');
								applauseLength = Math.round((100 + (((1 /applauseInput) * (applauseInput - 2)) * 100)) * applauseInput) + 1;
								var down = new MouseEvent('mousedown', {
									bubbles: true,
									cancelable: true,
									view: window
								});
								var up = new MouseEvent('mouseup', {
									bubbles: true,
									cancelable: true,
									view: window
								})

								var applauseButton = $('[data-action="multivote"]')[0];

								applauseButton.dispatchEvent(down);
								cancelClick();
								function cancelClick() {
									setTimeout(function() {
										applauseButton.dispatchEvent(up);
									}, applauseLength)
								}


								var clapData = {
									url: window.location.href,
									method: 'medium',
									claps: parseInt(applauseInput),
									title: $('.graf--title').text(),
									author: $('[property="article:author"]').attr('content') !== undefined ? $('[property="article:author"]').attr('content') : $('[property="author"]').attr('content')
								}

								injectScript.messaging.sendMessage(clapData);

							} else {
								$('.applause-error-handler').text('Number larger than 0 plz');
							}
						}); // end of click
					} else {
					}
				}
			}, // end of listeners

			messaging: {
				sendMessage: function(data){
					chrome.runtime.sendMessage(data, function(response) {
						return response;
					});
				}
			}
		} // end of injectScript
