window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})

// Auto-number citations that link to reference IDs (href="#ref-...")
function autoNumberCitations() {
  var anchors = Array.from(document.querySelectorAll('a[href^="#ref-"]'));
  var refMap = new Map();
  var counter = 1;

  anchors.forEach(function(a) {
    // skip anchors that are inside the sources list (we'll update those separately)
    if (a.closest('#sources')) return;
    var href = a.getAttribute('href');
    if (!href) return;
    var refId = href.slice(1);
    if (!refMap.has(refId)) {
      refMap.set(refId, counter);
      counter += 1;
    }
    var num = refMap.get(refId);

    // Replace the anchor content with a numbered citation in superscript
    var sup = document.createElement('sup');
    var link = document.createElement('a');
    link.setAttribute('href', '#' + refId);
    link.className = 'auto-cite';
    link.textContent = '[' + num + ']';
    sup.appendChild(link);

    // Replace the original anchor with the superscripted numbered link
    a.parentNode.replaceChild(sup, a);
  });

  // Update the sources list entries to show their assigned numbers
  refMap.forEach(function(num, refId) {
    var li = document.getElementById(refId);
    if (!li) return;
    // avoid duplicating numbers if script runs twice
    if (li.querySelector('.ref-number')) return;
    var span = document.createElement('span');
    span.className = 'ref-number';
    span.style.fontWeight = 'bold';
    span.textContent = '[' + num + '] ';
    li.insertBefore(span, li.firstChild);
  });
}

// Run after DOM ready if available, else on window load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoNumberCitations);
} else {
  autoNumberCitations();
}
