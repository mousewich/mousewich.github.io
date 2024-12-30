class SkinViewer {
	#skinViewer;
	parent;
	#characterDropdown;
	#dropdown
	#altDropdown;
	#thumbnails;
	constructor(parent) {
		this.parent = parent;
		let container = document.createElement("div");
		container.className = "minecraft-skin-container";
		this.#characterDropdown = document.createElement("select");
		this.#characterDropdown.name = "characters";
		this.#characterDropdown.className = "minecraft-character-dropdown";
		container.appendChild(this.#characterDropdown);
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
		this.#dropdown = document.createElement("select");
		this.#dropdown.name = "skins";
		this.#dropdown.className = "minecraft-skin-dropdown";
		container.appendChild(this.#dropdown);
		this.#altDropdown = document.createElement("select");
		this.#altDropdown.name = "alts";
		this.#altDropdown.className = "minecraft-skin-dropdown";
		container.appendChild(this.#altDropdown);
		this.#thumbnails = document.createElement("div");
		this.#thumbnails.className = "minecraft-thumbnails";
		container.appendChild(this.#thumbnails);
	}
	setName(name) { this.#skinViewer.nameTag = name; }
	loadSkin(skin, isAlt = false) {
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
		if (!isAlt) {
			this.#dropdown.value = skin["name"];
			this.setAltDropdown(skin);
		}
	}
	createThumbnail(skin, head = true) {
		const skinImage = typeof skin === "string" ? skin : skin.skin;
		const image = new Image();
		const canvas = document.createElement("canvas");
		if (head) {
			canvas.width = canvas.height = 8;
		}
		else {
			canvas.width = 16;
			canvas.height = 32;
		}
		let context = canvas.getContext("2d");
		image.onload = () => {
			if (head) {
				//Head
				context.drawImage(image, 8, 8, 8, 8, 0, 0, 8, 8);
				context.drawImage(image, 40, 8, 8, 8, 0, 0, 8, 8);
			}
			else {
				//Head
				context.drawImage(image, 8, 8, 8, 8, 4, 0, 8, 8);
				context.drawImage(image, 40, 8, 8, 8, 4, 0, 8, 8);
				//Torso
				context.drawImage(image, 20, 20, 8, 12, 4, 8, 8, 12);
				context.drawImage(image, 20, 36, 8, 12, 4, 8, 8, 12);
				//Left Leg
				context.drawImage(image, 20, 52, 4, 12, 8, 20, 4, 12)
				context.drawImage(image, 4, 52, 4, 12, 8, 20, 4, 12)
				//Right Leg
				context.drawImage(image, 4, 20, 4, 12, 4, 20, 4, 12)
				context.drawImage(image, 4, 36, 4, 12, 4, 20, 4, 12)
				//Left Arm
				context.drawImage(image, 36, 52, 4, 12, 12, 8, 4, 12)
				context.drawImage(image, 52, 52, 4, 12, 12, 8, 4, 12)
				//Right Arm
				context.drawImage(image, 44, 20, 4, 12, 0, 8, 4, 12)
				context.drawImage(image, 44, 36, 4, 12, 0, 8, 4, 12)
			}
			const img = document.createElement("img");
			img.src = canvas.toDataURL();
			if (head) {
				img.width = img.height = 48;
				img.className = "minecraft-head-thumbnail"
			}
			else {
				img.width = 64;
				img.height = 128;
				img.className = "minecraft-thumbnail"
			}
			img.onclick = () => this.loadSkin(skin)
			this.#thumbnails.appendChild(img);
		};
		image.src = skinImage;
	}
	loadIndex(index) {
		if (!("showNameTag" in index) || index["showNameTag"] === true) this.#skinViewer.nameTag = index["ign"] || null;
		else this.#skinViewer.nameTag = null;
		let skins = index["skins"] || [];
		this.#thumbnails.innerHTML = "";
		this.#dropdown.innerHTML = "";
		for (let i = 0; i < skins.length; i++) {
			let opt = document.createElement("option");
			opt.innerHTML = skins[i]["name"];
			opt.value = skins[i]["name"];
			opt.onclick = () => this.loadSkin(skins[i]);
			this.#dropdown.append(opt);

			this.createThumbnail(skins[i]);
		}
		this.loadSkin(skins[0]);
		this.#dropdown.value = skins[0]["name"]
	}
	setAltDropdown(skin) {
		let alts = skin["alts"] || [];
		this.#altDropdown.innerHTML = "";
		let addOption = (skin, index) => {
			let opt = document.createElement("option");
			opt.innerHTML = index === 0 ? "Default" : skin["name"] || index;
			opt.value = skin["name"] || index;
			opt.onclick = () => this.loadSkin(skin, index > 0);
			this.#altDropdown.append(opt);
		}
		addOption(skin, 0);
		for (let i = 0; i < alts.length; i++) {
			addOption(alts[i], i + 1);
		}
	}
	loadCharacters(characters) {
		this.#characterDropdown.innerHTML = "";
		let loadCharacter = (character, index) => {
			fetch(character["index"])
				.then((res) => {
					if (!res.ok) {
						throw new Error(`HTTP error! Status: ${res.status}`);
					}
					return res.json();
				})
				.then((data) => {
					let opt = document.createElement("option");
					opt.innerHTML = data["name"];
					opt.onclick = () => this.loadIndex(data);
					this.#characterDropdown.append(opt);
					if (index === 0) {
						this.loadIndex(data);
						this.#characterDropdown.value = data["name"];
					}
				})
				.catch((error) => console.error("Unable to fetch data:", error));
		}
		for (let i = 0; i < characters.length; i++) {
			loadCharacter(characters[i], i)
		}
	}
}