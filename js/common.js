//Dark Mode
const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme) document.documentElement.setAttribute("data-theme", storedTheme)

function ToggleDarkMode() {
	let targetTheme = "light";
	if (document.documentElement.getAttribute("data-theme") === "light") targetTheme = "dark";
	document.documentElement.setAttribute("data-theme", targetTheme)
	localStorage.setItem('theme', targetTheme);
}
function ToggleNavDropdown() {
	ToggleHideShow(document.getElementById("navDropdown"));
}
function ToggleHideShow(x) {
	if (x.className.indexOf(" show") === -1) x.className += " show";
	else x.className = x.className.replace(" show", "");
}
function MakeGalleryParent(id, items, func) {
	let parent = document.getElementById(id);
	if (items.length < 1) return;
	//Indicators
	if (items.length > 1) {
		let indicators = document.createElement("ol");
		indicators.className = "carousel-indicators";
		for (let i = 0; i < items.length; i++) {
			let indicator = document.createElement("li");
			indicator.setAttribute("data-target", "#" + id);
			indicator.setAttribute("data-slide-to", "" + i);
			if (i === 0) indicator.className = "active";
			indicators.append(indicator);
		}
		parent.append(indicators);
	}
	//Wrapper for Slides
	let wrapper = document.createElement("div");
	wrapper.className = "carousel-inner";
	for (let i = 0; i < items.length; i++) {
		let carouselItem = document.createElement("div");
		carouselItem.className = "item";
		if (i === 0) carouselItem.className += " active";
		let innerItem = func(items[i]);
		carouselItem.appendChild(innerItem);
		wrapper.appendChild(carouselItem);
	}
	parent.appendChild(wrapper);
	//Left and Right Controls
	if (items.length > 1) {
		//Left
		let leftControl = document.createElement("a");
		leftControl.className = "left carousel-control";
		leftControl.href = "#" + id;
		leftControl.setAttribute("data-slide", "prev");
		let leftImg = document.createElement("img");
		leftImg.src = "/resources/icon/chevron-left.svg";
		leftImg.alt = "A left-facing arrow icon";
		leftControl.appendChild(leftImg);
		parent.appendChild(leftControl);
		//Right
		let rightControl = document.createElement("a");
		rightControl.className = "right carousel-control";
		rightControl.href = "#" + id;
		rightControl.setAttribute("data-slide", "next");
		let rightImg = document.createElement("img");
		rightImg.src = "/resources/icon/chevron-right.svg";
		rightImg.alt = "A right-facing arrow icon";
		rightControl.appendChild(rightImg);
		parent.appendChild(rightControl);
	}
	$("#" + id).carousel("pause")
}
function MakeGallery(id, items) {
	MakeGalleryParent(id, items, function (item) {
		let img = document.createElement("img");
		img.src = item.src;
		img.alt = item.alt;
		if (item['allowRightClick'] == null) {
			img.className = "no-save-img";
			img.oncontextmenu = "return false;";
		}
		return img;
	})
}
function MakeModelGallery(id, items) {
	MakeGalleryParent(id, items, function (item) {
		let modelviewer = document.createElement("model-viewer");
		modelviewer.src = item.src;
		modelviewer.poster = item.poster;
		modelviewer.alt = item.alt;
		modelviewer.setAttribute('camera-controls', '');
		modelviewer['touch-action'] = "pan-y";
		console.log(modelviewer);
		return modelviewer;
	})
}

function ToggleBetween(checkbox, first, second) {
	if (first == null) checkbox.checked = false;
	let show = (element) => {
		if (element.hasAttribute("hidden")) {
			element.removeAttribute("hidden");
		}
	}
	let hide = (element) => {
		element.setAttribute("hidden", "hidden");
	}
	if (checkbox.checked) {
		show(first);
		hide(second);
	}
	else {
		hide(first);
		show(second);
	}
}

