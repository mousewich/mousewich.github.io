function MakeMinecraftSkinGallery(id, items) {
	let parent = document.getElementById(id);
	if (items.length < 1) return;
	//Indicators
	let indicatorList = [];
	if (items.length > 1) {
		let indicators = document.createElement("ol");
		indicators.className = "carousel-indicators";
		for (let i = 0; i < items.length; i++) {
			let indicator = document.createElement("li");
			if (i === 0) indicator.className = "active";
			indicators.appendChild(indicator);
			indicatorList.push(indicator);
		}
		parent.appendChild(indicators);
	}
	//Wrapper
	let skinGallery = new MinecraftGallery(parent, items);
	for (let index = 0; index < indicatorList.length; index++) {
		indicatorList[index].onclick = () => skinGallery.loadSkinByIndex(index);
		skinGallery.indicatorList.push(indicatorList[index]);
	}
	//Left and Right Controls
	if (items.length > 1) {
		//Left
		let leftControl = document.createElement("a");
		leftControl.className = "left carousel-control";
		leftControl.onclick = () => skinGallery.loadLast();
		let leftImg = document.createElement("img");
		leftImg.src = "/resources/icon/chevron-left.svg";
		leftImg.alt = "A left-facing arrow icon";
		leftControl.appendChild(leftImg);
		parent.appendChild(leftControl);
		//Right
		let rightControl = document.createElement("a");
		rightControl.className = "right carousel-control";
		leftControl.style = "cursor:pointer"
		rightControl.onclick = () => skinGallery.loadNext();
		let rightImg = document.createElement("img");
		rightImg.src = "/resources/icon/chevron-right.svg";
		rightImg.alt = "A right-facing arrow icon";
		rightControl.appendChild(rightImg);
		parent.appendChild(rightControl);
	}
}

class MinecraftGallery {
	#skinViewer;
	parent;
	items;
	#index;
	indicatorList;
	constructor(parent, items) {
		this.parent = parent;
		this.items = items;
		this.#index = 0;
		this.indicatorList = [];
		let container = document.createElement("div");
		container.className = "minecraft-skin-container";
		let canvasElement = document.createElement("canvas");
		canvasElement.className = "skinViewer";
		container.appendChild(canvasElement);
		parent.appendChild(container);
		this.#skinViewer = new skinview3d.SkinViewer({
			canvas: canvasElement,
			width: 300,
			height: 300,
			zoom: 0.7
		});
		this.loadSkinByIndex(0);
		this.#skinViewer.animation = new skinview3d.WalkingAnimation();
	}
	loadSkin(skin) {
		//Load string skin
		if (typeof skin === "string") {
			this.#skinViewer.loadSkin(skin);
		}
		//Load object skin
		else if (typeof skin === "object") {
			this.#skinViewer.loadSkin(skin.skin, {
				model: "slim" in skin ? skin.slim === true ? "slim" : "default" : "auto-detect"
			})
			if ("cape" in skin) {
				if ("elytra" in skin && skin.elytra) this.#skinViewer.loadCape(skin.cape, { backEquipment: "elytra" });
				else this.#skinViewer.loadCape(skin.cape);
			}
			else this.#skinViewer.loadCape(null);
		}
	}
	loadSkinByIndex(index) {
		this.loadSkin(this.items[this.#index = index]);
		for (let i = 0; i < this.indicatorList.length; i++) {
			if (index === i) this.indicatorList[i].className = "active";
			else this.indicatorList[i].className = "";
		}
	}
	loadLast() {
		if (this.#index <= 0) this.#index = this.items.length - 1;
		else this.#index--;
		this.loadSkinByIndex(this.#index);
	}
	loadNext() {
		if (this.#index >= this.items.length - 1) this.#index = 0;
		else this.#index++;
		this.loadSkinByIndex(this.#index);
	}
}