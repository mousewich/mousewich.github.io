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

function MakeGallery(id, items) {
	if (items.length < 1) return;
	let html = `<div class="commission-gallery"><div id="` + id + `" class="carousel slide">`
	//Indicators
	if (items.length > 1) {
		html += `<ol class="carousel-indicators">
		<li data-target="#\` + id + \`" data-slide-to="0" class="active"></li>`
		for (let i = 1; i < items.length; i++) {
			html += `<li data-target="#` + id + `" data-slide-to="` + i + `"`
			if (i === 0) html += ` class="active"`
			html += `></li>`
		}
		html += `</ol>`
	}
	//Wrapper for Slides
	html += `<div class="carousel-inner">`
	for (let i = 0; i < items.length; i++) {
		html += `<div class="item`
		if (i === 0) html += ` active`
		html += `"><img src="` + items[i].src + `" alt="` + items[i].alt + `"`
		if (items[i]['allowRightClick'] == null) {
			html += ` oncontextmenu="return false;"`
		}
		html += `></div>`
	}
	html += `</div>`
	//Left and Right Controls
	if (items.length > 1) {
		html += `<a class="left carousel-control" href="#` + id + `" data-slide="prev">
				<img src="/resources/icon/chevron-left.svg" alt="A left-facing arrow icon">
			</a>
			<a class="right carousel-control" href="#` + id + `" data-slide="next">
				<img src="/resources/icon/chevron-right.svg" alt="A right-facing arrow icon">
			</a>`
	}
	html += `</div></div>`
	document.write(html);
	$("#" + id).carousel("pause")
}

