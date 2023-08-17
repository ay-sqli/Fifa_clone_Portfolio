var audioPlayer = document.getElementById("audioPlayer");

      function toggleAudio() {
        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      }

// Get the modal and the image
var modal = document.getElementById("myModal");
var modalImage = document.getElementById("modalImage");
var cardImage = document.querySelector(".card img");

// When the user clicks on the image, open the modal
cardImage.onclick = function () {
  modal.style.display = "block";
  modalImage.src = cardImage.src;
};

// When the user clicks on the close button, close the modal
var closeModal = document.getElementsByClassName("close")[0];
closeModal.onclick = function () {
  modal.style.display = "none";
};

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function() {
  const contentMap = {
    "homeLink": { contentId: "Home", display: "grid" },
    "aproposLink": { contentId: "About", display: "flex" },
    "aproposdiv": { contentId: "About", display: "flex" },
    "apropoButton": { contentId: "About", display: "flex" },
    "projectsLink": { contentId: "Project", display: "flex" },
    "projectsdiv": { contentId: "Project", display: "flex" },
    "contactLink": { contentId: "Contact", display: "flex" }
  };

  for (const linkId in contentMap) {
    const link = document.getElementById(linkId);
    const contentInfo = contentMap[linkId];

    if (link) {
      link.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllContent();
        const content = document.getElementById(contentInfo.contentId);
        if (content) {
          content.style.display = contentInfo.display;
        }
      });
    }
  }

  function hideAllContent() {
    for (const contentInfo of Object.values(contentMap)) {
      const content = document.getElementById(contentInfo.contentId);
      if (content) {
        content.style.display = "none";
      }
    }
  }

  var preloader = document.getElementById("preloader");
  
  preloader.style.display = "flex";
  hideAllContent();

  setTimeout(function() {
    preloader.style.display = "none";
    const homeContent = document.getElementById("Home");
    if (homeContent) {
      homeContent.style.display = "grid";
    }
   
  }, 6000);
});

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
  this.repeatCounter = 0; // New property to keep track of the number of repeats
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

  var that = this;
  var delta = 100 - Math.random() * 50; // Adjust speed here

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    if (this.loopNum === this.toRotate.length - 1) { // Stop after one cycle
      return;
    }
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 200; // Faster speed when deleting
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};



window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }

  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #FF006A }";
  document.body.appendChild(css);
};


const slider = (function(){
	
	//const
	const slider = document.getElementById("slider"); 
	console.log(slider);
	const sliderContent = document.querySelector(".slider-content"); 
	console.log(sliderContent);
	const sliderWrapper = document.querySelector(".slider-content-wrapper"); 
	const elements = document.querySelectorAll(".slider-content__item"); 
	const sliderContentControls = createHTMLElement("div", "slider-content__controls"); 
	let dotsWrapper = null; 
	let prevButton = null;
	let nextButton = null;
	let autoButton = null;
	let leftArrow = null; 
	let rightArrow = null;
	let intervalId = null;
	
	const itemsInfo = {
		offset: 0, 
		position: {
			current: 0, 
			min: 0, 
			max: elements.length - 1 
		},
		intervalSpeed: 2000, 

		update: function(value) {
			this.position.current = value;
			this.offset = -value;
		},
		reset: function() {
			this.position.current = 0;
			this.offset = 0;
		}	
	};

	const controlsInfo = {
		buttonsEnabled: false,
		dotsEnabled: false,
		prevButtonDisabled: true,
		nextButtonDisabled: false
	};



	function init(props) {
		let {intervalSpeed, position, offset} = itemsInfo;
		
		if (slider && sliderContent && sliderWrapper && elements) {
			if (props && props.intervalSpeed) {
				intervalSpeed = props.intervalSpeed;
			}
			if (props && props.currentItem) {
				if ( parseInt(props.currentItem) >= position.min && parseInt(props.currentItem) <= position.max ) {
					position.current = props.currentItem;
					offset = - props.currentItem;	
				}
			}
			if (props && props.buttons) {
				controlsInfo.buttonsEnabled = true;
			}
			if (props && props.dots) {
				controlsInfo.dotsEnabled = true;
			}
			
			_updateControlsInfo();
			_createControls(controlsInfo.dotsEnabled, controlsInfo.buttonsEnabled);
			_render();	
		} else {
			console.log("Разметка слайдера задана неверно. Проверьте наличие всех необходимых классов 'slider/slider-content/slider-wrapper/slider-content__item'");
		}
	}

	function _updateControlsInfo() {
		const {current, min, max} = itemsInfo.position;
		controlsInfo.prevButtonDisabled = current > min ? false : true;
		controlsInfo.nextButtonDisabled = current < max ? false : true;
	}

	function _createControls(dots = false, buttons = false) {
		
		sliderContent.append(sliderContentControls);

		
		createArrows();
		buttons ? createButtons() : null;
		dots ? createDots() : null;
		
		// Arrows function
		function createArrows() {
			const dValueLeftArrow = "M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z";
			const dValueRightArrow = "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z";
			const leftArrowSVG = createSVG(dValueLeftArrow);
			const rightArrowSVG = createSVG(dValueRightArrow);
			
			leftArrow = createHTMLElement("div", "prev-arrow");
			leftArrow.append(leftArrowSVG);
			leftArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
			
			rightArrow = createHTMLElement("div", "next-arrow");
			rightArrow.append(rightArrowSVG);
			rightArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

			sliderContentControls.append(leftArrow, rightArrow);
			
			// SVG function
			function createSVG(dValue, color="currentColor") {
				const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				svg.setAttribute("viewBox", "0 0 256 512");
				const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				path.setAttribute("fill", color);
				path.setAttribute("d", dValue);
				svg.appendChild(path);	
				return svg;
			}
		}

		// Dots function
		function createDots() {
			dotsWrapper = createHTMLElement("div", "dots");			
			for(let i = 0; i < itemsInfo.position.max + 1; i++) {
				const dot = document.createElement("div");
				dot.className = "dot";
				dot.addEventListener("click", function() {
					updateItemsInfo(i);
				})
				dotsWrapper.append(dot);		
			}
			sliderContentControls.append(dotsWrapper);	
		}
		
	}

	function setClass(options) {
		if (options) {
			options.forEach(({element, className, disabled}) => {
				if (element) {
					disabled ? element.classList.add(className) : element.classList.remove(className)	
				} else {
					console.log("Error: function setClass(): element = ", element);
				}
			})
		}
	}


	function updateItemsInfo(value) {
		itemsInfo.update(value);
		_slideItem(true);	
	}


	function _render() {
		const {prevButtonDisabled, nextButtonDisabled} = controlsInfo;
		let controlsArray = [
			{element: leftArrow, className: "d-none", disabled: prevButtonDisabled},
			{element: rightArrow, className: "d-none", disabled: nextButtonDisabled}
		];
		if (controlsInfo.buttonsEnabled) {
			controlsArray = [
				...controlsArray, 
				{element:prevButton, className: "disabled", disabled: prevButtonDisabled},
				{element:nextButton, className: "disabled", disabled: nextButtonDisabled}
			];
		}
		
		setClass(controlsArray);

		sliderWrapper.style.transform = `translateX(${itemsInfo.offset*100}%)`;	
		
		if (controlsInfo.dotsEnabled) {
			if (document.querySelector(".dot--active")) {
				document.querySelector(".dot--active").classList.remove("dot--active");	
			}
			dotsWrapper.children[itemsInfo.position.current].classList.add("dot--active");
		}
	}


	function _slideItem(autoMode = false) {
		if (autoMode && intervalId) {
			clearInterval(intervalId);
		}
		_updateControlsInfo();
		_render();
	}

	function createHTMLElement(tagName="div", className, innerHTML) {
		const element = document.createElement(tagName);
		className ? element.className = className : null;
		innerHTML ? element.innerHTML = innerHTML : null;
		return element;
	}

	return {init};
}())

slider.init({
	// intervalSpeed: 1000,
	currentItem: 0,
	buttons: true,
	dots: true
});