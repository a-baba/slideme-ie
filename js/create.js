slideMe.createDOM = function () {

  // create video dom

    var createVideoPlayer = document.createElement('div');
    createVideoPlayer.setAttribute('id', 'slideme-wrapper');   

    if (slideMe.data.videosourcesmobile !== undefined || slideMe.data.videosources !== undefined) {

      slideMe.thisVideoPlayer = document.createElement('video');

      
      slideMe.addAttributes(slideMe.thisVideoPlayer, {'id': 'videojs', 'controls': ''});

      var videoSources;

      // if (slideMe.data.subtitles !== undefined) {

      //   for (var i = 0; i < slideMe.data.subtitles.length; i++) {

      //     var createSubtitleNode = document.createElement('track');

      //     slideMe.addAttributes(createSubtitleNode, {
      //       'src' : slideMe.data.subtitles[i].src, 
      //       'srclang' : slideMe.data.subtitles[i].srclang,
      //       'label' : slideMe.data.subtitles[i].label
      //     });          

      //     if (slideMe.data.subtitles[i].default === 'true') {
      //       createSubtitleNode.setAttribute('default', '');
      //     }

      //     slideMe.thisVideoPlayer.appendChild(createSubtitleNode);

      //   }

      // }

      if (isMobile !== null) {
        videoSources = slideMe.data.videosourcesmobile;
      } else {
        videoSources = slideMe.data.videosources;
      }

      slideMe.slideMeContainer.appendChild(slideMe.thisVideoPlayer);

      if (slideMe.data.youtube !== 'true') {
        for (var value in videoSources) {
          if (videoSources.hasOwnProperty(value)) {
            var createVideoSource = document.createElement("source");
            slideMe.addAttributes(createVideoSource, {
              "src": videoSources[value],
              "type": value
            });
            slideMe.thisVideoPlayer.appendChild(createVideoSource);
          }
        }

      slideMe.fireVideJs();
        
      } else {
        slideMe.loadAssets('//d3gr29hczmiozh.cloudfront.net/slidemeyt.js', 'script', function() {

          slideMe.fireVideJs();

        });
      }

    }


};
