// v0.02
function slideMeJs(jsonUrl, reqJson) {

  var slideMeContainer = document.querySelectorAll('[data-slidemejs]')[0];
  var getHead = document.getElementsByTagName('head')[0];
  var data;
  var ismobile = navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i);
  var thisPlayer;
  var thisPlayerEl;
  var isVideoSlide;
  var haveSource;
  var thisVideoPlayer;
  var timeList = [];
  var addClicks;
  var createImgContainer;
  var firstImage;
  var preloaderWrapper;

  // fix later subtitles
  var createSubtitleNode;
  var createImgContainerWrapper;

  function errorThat(thisError, thisContainer) {

    var errorDiv = 'Player error:<br>' + thisError + '';
    thisContainer.setAttribute('class', 'slideme-error');
    thisContainer.innerHTML = errorDiv;

  }

  function addAttributes(element, attribute) {

    for (var value in attribute) {
       element.setAttribute(value, attribute[value]);
    }

  }

// remy throttle fn

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
      var context = scope || this;

      var now = +new Date(),
          args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }


///////////////////////////////////
///////////////////////////////////
  // preloader
///////////////////////////////////
///////////////////////////////////

  function addPreloader() {

    var preloaderDom = '<i class="icon-spinner">.</i>';
    preloaderWrapper = document.createElement('div');
    preloaderWrapper.setAttribute('id', 'slideme-preloader');
    preloaderWrapper.innerHTML = preloaderDom;
    slideMeContainer.appendChild(preloaderWrapper);

  }

  addPreloader();

///////////////////////////////////
///////////////////////////////////
  // set presentation slides
///////////////////////////////////
///////////////////////////////////

  function slideMePresentation() {

    var videoSlides = data.videoslides;
    var videoSlidesLength = videoSlides.length;

  // create dom for slides

    var createPresentationContainer = document.createElement('div');
    createPresentationContainer.setAttribute('id', 'slideme-container');
    slideMeContainer.appendChild(createPresentationContainer);

    if (!haveSource) {
      createPresentationContainer.style.float = 'none';
      createPresentationContainer.style.margin = 'auto';
      createPresentationContainer.style.width = '480px';
    }

    
    createImgContainer = document.createElement('div');
    createImgContainer.setAttribute('id', 'slideme-list');
   

    createImgContainerWrapper = document.createElement('div');
    createImgContainerWrapper.setAttribute('id', 'slideme-list-wrapper');

    if (data.videoslidestype === 'images') {

      var createButtons = '<div id="slideme-btn-prev"><i class="icon-prevslide"><</i></div><div id="slideme-btn-next"><i class="icon-nextslide">></i></div>';
      createImgContainerWrapper.innerHTML = createButtons;

    } else {

      slideMeContainer.style.height = '360px';

    }

    slideMeContainer.appendChild(createImgContainerWrapper);
    createImgContainerWrapper.appendChild(createImgContainer);

  // create slider next/prev buttons

  if (data.videoslidestype === 'images') {

    var animated = false;
    var imgContainerWidth = 0;

    document.getElementById('slideme-btn-next').addEventListener('click', function() {

      var imgContainerPosition = createImgContainer.offsetLeft;

      if (animated === false && imgContainerPosition > - imgContainerWidth + 500) {

        animated = true;        
        createImgContainer.style.left = imgContainerPosition - 200 + 'px';

        setTimeout(function(){
          animated = false;
        }, 325);

      }

    }, false);

    document.getElementById('slideme-btn-prev').addEventListener('click', function() {

      var imgContainerPosition = createImgContainer.offsetLeft;

      if (animated === false && imgContainerPosition < 50) {

        animated = true; 
        var slideThatMuch;

        if (imgContainerPosition < -50) {
          slideThatMuch = 200;
        } else {
          slideThatMuch = 100;
        }
        createImgContainer.style.left = imgContainerPosition + slideThatMuch + 'px';
        setTimeout(function(){
          animated = false;
        }, 325);

      }

    }, false);   

  }

  // set nodes for slides

    function setContent(isImg) {

      for (var i = 0; i < videoSlidesLength; i++) {

        var thisContent = videoSlides[i].slidecontent;
        var thisContentTime = 60 * videoSlides[i].timemin + parseInt(videoSlides[i].timesec);
        var createSlideNode;

        if (isImg) {

          createSlideNode = document.createElement('img');
          addAttributes(createSlideNode, {'src' : thisContent, 'data-slideme-time' : thisContentTime});
          imgContainerWidth = 100 * videoSlidesLength;
          createImgContainer.style.width = imgContainerWidth + 'px';


        } else {

          createImgContainerWrapper.setAttribute('class', 'slideme-text');
          createSlideNode = document.createElement('div');
          createSlideNode.innerHTML = '<p class="slideme-list-time">' + videoSlides[i].timemin + ':' + videoSlides[i].timesec + '</p><p class="slideme-list-content">' + thisContent + '</p>';
          createSlideNode.setAttribute('data-slideme-time', thisContentTime);

        }
        
        timeList.push(thisContentTime);

        createImgContainer.appendChild(createSlideNode);

      }

    // set first slide


      if (isImg) {

        var getFirstImg = videoSlides[0].slidecontent;
        firstImage = document.createElement('img');
        firstImage.setAttribute('src', getFirstImg);
        createPresentationContainer.appendChild(firstImage);

      } else {

        createSubtitleNode = document.createElement('div');
        createSubtitleNode.setAttribute('id', 'slideme-subtitle');
        document.getElementById('videojs').appendChild(createSubtitleNode);
        var firstSubtitle = document.querySelectorAll('[data-slideme-time]')[0];
        createSubtitleNode.innerHTML = firstSubtitle.getElementsByClassName('slideme-list-content')[0].innerHTML;

      }

      console.log('slider content set');


      preloaderWrapper.remove();


    // add click to slides

      addClicks = document.querySelectorAll('[data-slideme-time]');
      addClicks[0].setAttribute('class', 'slideme-img-active');

      for (var i = 0; i <  addClicks.length; i++) {

          addClicks[i].addEventListener('click', function() {

            if (haveSource) {

              var thisTime = this.getAttribute('data-slideme-time');
              thisPlayer.currentTime(thisTime);
              thisPlayer.play();

            } else {

              firstImage.setAttribute('src', this.getAttribute('src'));

            }

            if (data.videoslidestype === 'images' && this !== addClicks[0]) {

              createImgContainer.style.left = 150 - this.offsetLeft + 'px';

            }

            document.getElementsByClassName('slideme-img-active')[0].classList.remove('slideme-img-active');
            this.setAttribute('class', 'slideme-img-active');

          }, false);

      }
      
    }

  // check if img or other 

    if (data.videoslidestype === 'images') {

      var ajaxImgCount = 0;

      for (var i = 0; i < videoSlidesLength; i++) {

        (function () {

          var thisImg = videoSlides[i].slidecontent;

          var reqImg = new Image();
          
          reqImg.src = thisImg;

          reqImg.onload = function() {

            ajaxImgCount = ajaxImgCount + 1;

            if (ajaxImgCount === videoSlidesLength) {

              setContent(true);

            }

          };

          reqImg.onerror = function() {

            errorThat('cannot load image', slideMeContainer);

          };


          
        }) ();

      }

    } else {

      setContent(false);

    }

  }


  // click events on slides

    var currentArrayNr = '00';

    function setNewSlide() {

      var getCurrentTime = Math.round(thisPlayer.currentTime());
      
      var arrayNr;

      for (var i = 0; i < timeList.length; i++) {   

        if (getCurrentTime >= timeList[i]) {
          arrayNr = timeList[i];
        }

      }

      if (currentArrayNr !== arrayNr) {

        currentArrayNr = arrayNr;

        var getSlideFromDom = document.querySelectorAll('[data-slideme-time="' + arrayNr + '"]')[0];

        if (data.videoslidestype === 'images') {
          
          if (getSlideFromDom !== addClicks[0]) {

            createImgContainer.style.left =  150 - getSlideFromDom.offsetLeft + 'px';

          } else { 

            createImgContainer.style.left =  50 - getSlideFromDom.offsetLeft + 'px' ;

          }

          firstImage.setAttribute('src', getSlideFromDom.getAttribute('src'));

        } else {

          createImgContainerWrapper.scrollTop = getSlideFromDom.offsetTop;
          createSubtitleNode.innerHTML = getSlideFromDom.getElementsByClassName('slideme-list-content')[0].innerHTML;

        }

        document.getElementsByClassName('slideme-img-active')[0].classList.remove('slideme-img-active');
        getSlideFromDom.setAttribute('class', 'slideme-img-active');

      }

    }

///////////////////////////////////
///////////////////////////////////
  // create player nodes
///////////////////////////////////
///////////////////////////////////

  function createPlayer() {


    isVideoSlide = data.videoslides;
    haveSource = data.videosources !== undefined;

    // create player dom

      var videoPlayerLayout;

      var createVideoPlayer = document.createElement('div');
      createVideoPlayer.setAttribute('id', 'slideme-wrapper');   

      if (isVideoSlide !== undefined && haveSource) {

        videoPlayerLayout = '<video id="videojs" width="640" height="360" controls ></video>';

      }

      if (isVideoSlide === undefined && haveSource){

        videoPlayerLayout = '<video id="videojs" width="942" height="530" controls ></video>';
        slideMeContainer.style.height = '530px';
        createVideoPlayer.style.float = 'none';
        createVideoPlayer.style.margin = 'auto';

      }



      if (haveSource) {
      
        createVideoPlayer.innerHTML = videoPlayerLayout;
        slideMeContainer.appendChild(createVideoPlayer);
  
        thisVideoPlayer = document.getElementById('videojs');
      
      }

  }


///////////////////////////////////
///////////////////////////////////
  // fire up videojs
///////////////////////////////////
///////////////////////////////////

  function fireVideJs() {

   //player source

      var videoSources;

      if (data.videosourcesmobile !== undefined && ismobile !== null) {
        videoSources = data.videosourcesmobile;
      } else {
        videoSources = data.videosources;
      }

      for (var value in videoSources) {

        var createVideoSource = document.createElement("source");

        addAttributes(createVideoSource,
          {
            "src" : videoSources[value],
            "type" : value
          }
        );

        thisVideoPlayer.appendChild(createVideoSource);

      }



      addAttributes(thisVideoPlayer, {

        'class' : 'video-js vjs-default-skin',
        'poster': data.poster,
        'preload' : data.preload

      });


    // player settings

      if (data.preload === undefined || '') {

        data.preload = 'metadata';

      }

      if (data.poster !== undefined || '') {

        data.poster = 'http://s3.amazonaws.com/production.hubs/images/sources/000/000/937/medium/road_small.jpg?1417623786';

      }
      

        thisPlayer = videojs('videojs');

        // get ads if available

        if (data.adTagUrl !== undefined) {

          var options = {

            id: 'videojs',
            adTagUrl: data.adTagUrl
          
          };

          var getSdkJs = document.createElement('script');
          getSdkJs.type = 'text/javascript';
          getSdkJs.src = '//imasdk.googleapis.com/js/sdkloader/ima3.js';
          getHead.appendChild(getSdkJs);

          if (data.adJs !== undefined) {
          
            var getAdJs = document.createElement('script');
            getAdJs.type = 'text/javascript';
            getAdJs.src = data.adJs;
            getHead.appendChild(getAdJs);
            getAdJs.onload = function() {
  
              thisPlayer.ima(options);
              thisPlayer.ima.initializeAdDisplayContainer();
              thisPlayer.ima.requestAds();
  
            };

            getAdJs.onerror = function() {
              console.log('cannot load ad js');
            };


            console.log('ad script loaded');

          } else {

            // get script from assets - hubs only

            var getAdJs = document.createElement('script');
            getAdJs.type = 'text/javascript';
            getAdJs.src = '<%= asset_path("slidemeads.js") %>';
            getHead.appendChild(getAdJs);
            getAdJs.onload = function() {
  
              thisPlayer.ima(options);
              thisPlayer.ima.initializeAdDisplayContainer();
              thisPlayer.ima.requestAds();
  
            };

            getAdJs.onerror = function() {
              console.log('cannot load ad js');
            };

            console.log('ad script loaded');

            // console.log('please define path to ad js!');

          }


        }

        thisPlayer.ready(function() {

          thisPlayer = this;
          thisPlayerEl = this.tag;

          console.log('player created');

          if (isVideoSlide === undefined) {

            preloaderWrapper.remove();

          } 

          if (data.autoplay !== undefined && data.autoplay !== 'false') {
            thisPlayer.play();
          }

          if (haveSource) {

            document.getElementsByTagName('video')[0].addEventListener('timeupdate', throttle(function () {

              setNewSlide();

            }, 1000));

          }
        

        });

      }


  function loadVideoJs() {

    if (typeof vjs === 'undefined') {
    
      var getVideoJs = document.createElement('script');
      getVideoJs.type = 'text/javascript';
      getVideoJs.src = 'https://vjs.zencdn.net/4.11.2/video.js';
      getHead.appendChild(getVideoJs);

      getVideoJs.onload = function() {

        fireVideJs();

      };

    } else {

      fireVideJs();

    }

  }


  function loadJson(jsonUrl) {
    var request = new XMLHttpRequest();
    request.open('GET', jsonUrl, true);

    request.onload = function() {

      if (request.status >= 200 && request.status < 400) {

        data = JSON.parse(request.responseText); 
        console.log('json fetched');
        createPlayer();
        if (isVideoSlide !== undefined) {
          slideMePresentation();
        }
        if (haveSource) {
          loadVideoJs();
        }

        playList();

      } else {

        errorThat('cannot connect', slideMeContainer);

      }

    };

    request.onerror = function() {
      errorThat('cannot connect', slideMeContainer);
    };

    request.send();
  }


  function reloadSlideMeJs(jsonfile) {

    thisPlayer.dispose();

    while(slideMeContainer.firstChild) {
      slideMeContainer.removeChild(slideMeContainer.firstChild);
    }
    addPreloader();
    loadJson(jsonfile);

  }

  function playList() {

    var createPlaylist = document.createElement('div');
    createPlaylist.setAttribute('id', 'slideme-playlist');
    createPlaylist.innerHTML = '<div id="slideme-playlist-title">Playlist<div id="slideme-playlist-drop">></div></div><div id="slideme-playlist-list"></div>';
    slideMeContainer.appendChild(createPlaylist);

    slideMeContainer.style.margin = '0 auto 50px auto';


    var playListTitle = document.getElementById('slideme-playlist-title');
    var playListList = document.getElementById('slideme-playlist-list');

    for (var i = 0; i < data.playlist.length; i++) {

      if (data.playlist[i].type === 'json'){

        var newElemnt = document.createElement('p');
        newElemnt.innerHTML = data.playlist[i].title;
        newElemnt.setAttribute('data-json', data.playlist[i].link);

        playListList.appendChild(newElemnt);

        newElemnt.addEventListener('click', function(){

          reloadSlideMeJs(this.getAttribute('data-json'));
          return false;

        });

      } else {

        var newElemnt = document.createElement('a');
        newElemnt.innerHTML = data.playlist[i].title;
        newElemnt.setAttribute('href', data.playlist[i].link);

        playListList.appendChild(newElemnt);

      }

    }


    var open = false;
    playListTitle.addEventListener('click', function() {

      if (open === false) {

        open = true;
        playListList.style.display = 'block';
        playListTitle.classList.add('slideme-drop-active');

      } else {

        open = false;
        playListList.style.display = 'none';
        playListTitle.classList.remove('slideme-drop-active');

      }
      
    });

  }

  ///////////////////////////////////
  ///////////////////////////////////
    // request json file
  ///////////////////////////////////
  ///////////////////////////////////

    if (reqJson !== false) {

      loadJson(jsonUrl);


    } else {

      data = jsonUrl;

      if (data === undefined) {

        errorThat('no config', slideMeContainer);
        return false;

      }
      
      if (data) {

        createPlayer();
        if (isVideoSlide !== undefined) {
          slideMePresentation();
        }
        if (haveSource) {
          loadVideoJs();
        }

        playList();

      } else {

        errorThat('no config', slideMeContainer);

      }
    
    }
  
}