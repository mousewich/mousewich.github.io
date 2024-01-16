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
	if (x.className.indexOf(" show") === -1) {
		x.className += " show";
		console.log("showing")
	}
	else {
		x.className = x.className.replace(" show", "");
		console.log("hiding")
	}
}

