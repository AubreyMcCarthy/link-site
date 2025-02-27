let pawActive = false;
const effectsWrapper = document.createElement('div');
effectsWrapper.id = 'effects-wrapper';
document.body.appendChild(effectsWrapper);
const container = document.getElementsByClassName('container')[0];

const animateButton = (el) => {
	el.classList.add('active');
	setTimeout(() => {
		el.classList.remove('active');
	}, 200);
}

// Array.from(document.querySelectorAll("a")).forEach((el) => {
// 	el.addEventListener("click", (e) => {
// 		if(!pawActive) return;
// 		e.target.classList.add('active');
// 		setTimeout(() => {
// 			e.target.classList.remove('active');
// 		}, 200);
// 	});
// });


///////////////
// paw
///////////////
// const pawImageWidth = 512;

const lerp = (x, y, a) => x * (1 - a) + y * a;
function easeInOutCubic(x) {
	return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	}
function AttachPaw() {
	const pawHolder = document.createElement('div');
	pawHolder.id = 'paw-holder';

	const pawWrapper = document.createElement('div');
	pawWrapper.id = 'paw-wrapper';
	pawHolder.appendChild(pawWrapper);
	

	let paw = document.createElement('img');
	paw.id = 'paw';
	let pawShadow = document.createElement('img');
	pawShadow.id = 'paw-shadow';
	paw.src = pawShadow.src = 'imgs/paw.png';

	let pawWrist = document.createElement('img');
	pawWrist.id = 'paw-wrist';
	let pawWristShadow = document.createElement('img');
	pawWristShadow.id = 'paw-wrist-shadow';
	pawWrist.src = pawWristShadow.src = 'imgs/paw-wrist.png';

	pawWrapper.appendChild(pawWristShadow);
	pawWrapper.appendChild(pawShadow);
	pawWrapper.appendChild(pawWrist);
	pawWrapper.appendChild(paw);

	const pawSize = 250;
	paw.style.width = pawSize + 'px';
	paw.style.height = pawSize + 'px';
	pawWrist.style.width = pawSize + 'px';

	const pawSizeRcp = pawSize / 512;
	const imgOffsetX = -156 * pawSizeRcp;
	const imgOffsetY = -156 * pawSizeRcp;
	const pawOffsetX = -256 * pawSizeRcp;
	const pawOffsetY = -126 * pawSizeRcp;

	let scale = 1;
	let dist = 1;

	let curOffsetX = imgOffsetX;
	let curOffsetY = imgOffsetY;
	let curMouseX = 0;
	let curMouseY = 0;

	const setPaw = () => {
		paw.style.left = curMouseX + curOffsetX * scale + 'px';
		paw.style.top = curMouseY + curOffsetY  * scale + 'px';
		paw.style.width = pawSize * scale + 'px';
		paw.style.height = pawSize * scale + 'px';

		const wristStart = paw.offsetTop + paw.offsetHeight - 1;
		pawWrist.style.top = wristStart + 'px';
		pawWrist.style.left = paw.offsetLeft + 'px';
		pawWrist.style.height = window.innerHeight - wristStart + 'px';
		pawWrist.style.width = paw.offsetWidth + 'px';

		const shadowDist = dist * 0.9 + 0.1;
		pawShadow.style.left = curMouseX + lerp(curOffsetX, pawOffsetX, shadowDist)  * scale + 'px';
		pawShadow.style.top = curMouseY + lerp(curOffsetX, pawOffsetY, shadowDist)  * scale + 'px';
		pawShadow.style.width = pawSize * scale + 'px';
		pawShadow.style.height = pawSize * scale + 'px';

		const shadowWristStart = pawShadow.offsetTop + pawShadow.offsetHeight - 1;
		pawWristShadow.style.top = shadowWristStart + 'px';
		pawWristShadow.style.left = pawShadow.offsetLeft + 'px';
		pawWristShadow.style.height = window.innerHeight - shadowWristStart + 'px';
		pawWristShadow.style.width = pawShadow.offsetWidth + 'px';

		pawShadow.style.filter =
		pawWristShadow.style.filter =
			`blur(${lerp(2, 10, dist)}px) brightness(${lerp(0, 50, dist)}%) grayscale(100%)`;
	}
	const updatePaw = (posX, posY) => {
		curMouseX = posX;
		curMouseY = posY;
		setPaw();
	}
	const updatePawMouse = (e) => updatePaw(e.clientX, e.clientY);
	const startPawTouch = (e) => {
		dist = 0;
		updatePaw(e.touches[0].clientX, e.touches[0].clientY);
	}
	const updatePawTouch = (e) => {
		updatePaw(e.touches[0].clientX, e.touches[0].clientY);
	}
	const stopPawTouch = (e) => {
		if(e.touches.length == 0) {
			dist = 1;
			setPaw();
		}
	}
	
	let pawInit = false;
	const catBtn = document.getElementById('cat-mode');
	document.body.classList.add('paw-inactive');
	catBtn.addEventListener("click", (e) => {
		e.preventDefault();
		if(!pawInit) {
			document.body.appendChild(pawHolder);
			pawInit = true;
		}
		pawActive = !pawActive;
		if(pawActive) {
			document.addEventListener("mousemove", updatePawMouse);
			document.addEventListener('touchmove', updatePawTouch, { passive: false });
			updatePawMouse(e);
			document.addEventListener('touchstart', startPawTouch, { passive: false });
			updatePawMouse(e);
			document.addEventListener('touchend', stopPawTouch, { passive: false });
			updatePawMouse(e);
			catBtn.innerText = "😻 Mode";
			// catBtn.innerHTML = '<span style="font-size: 1.5rem;">😻</span> Mode';
			pawWrapper.classList.add('active');
			document.body.style.cursor = 'none';
			Array.from(document.querySelectorAll('a')).forEach((el) => el.style.cursor = 'none' );
			document.body.classList.add('paw-active');
			document.body.classList.remove('paw-inactive');
			animateButton(catBtn);
		} else {
			document.removeEventListener("mousemove", updatePawMouse);
			document.removeEventListener('touchmove', updatePawTouch);
			document.removeEventListener('touchstart', startPawTouch);
			updatePawMouse(e);
			document.removeEventListener('touchend', stopPawTouch);
			catBtn.innerText = "😿 Mode";
			// catBtn.innerHTML = '<span style="font-size: 1.5rem;">😿</span> Mode';
			pawWrapper.classList.remove('active');
			console.log("stopping paw");
			document.body.style.cursor = '';
			Array.from(document.querySelectorAll('a')).forEach((el) => el.style.cursor = '' );
			document.body.classList.remove('paw-active');
			document.body.classList.add('paw-inactive');
		}
	});

	const pawPrintWidth = 295;
	const pawPrintHeight = 197;

	const pawPrint = () => {
		const print = document.createElement('img');
		print.className = "paw-print";
		print.src = "imgs/paw-print.png";
		print.style.left = curMouseX + pawPrintWidth * -0.125 + 'px';
		print.style.top = curMouseY + pawPrintHeight * -0.125 + 'px';
		print.style.width = pawPrintWidth * pawSizeRcp  + 'px';
		print.style.height = pawPrintHeight * pawSizeRcp + 'px';
		pawHolder.appendChild(print);

		window.requestAnimationFrame(() => {
				print.style.opacity = "0";
			window.setTimeout(function () {
				pawHolder.removeChild(print);
			}, 2200)
		});
	}

	let start = -1;
	let halfwayCallback = null;

	const simulateClick = (event) => {
		const target = event.target;
		
		const clickEvent = new MouseEvent('click', {
			bubbles: event.bubbles,
			cancelable: event.cancelable,
			view: event.view,
			detail: event.detail,
			screenX: event.screenX,
			screenY: event.screenY,
			clientX: event.clientX,
			clientY: event.clientY,
			ctrlKey: event.ctrlKey,
			altKey: event.altKey,
			shiftKey: event.shiftKey,
			metaKey: event.metaKey,
			button: event.button,
			buttons: event.buttons,
		});
	
		target.dispatchEvent(clickEvent);
	};

	const maxNudge = 300;

	const nudge = (el) => {
		const hasBeenNudgedBefore = 
			el.style.transform != '' || Math.random() > 0.925;
		const nudgeFactor = lerp(0.5, 1.0, Math.random());
		const nudgeX = 
			hasBeenNudgedBefore ? 
			-window.innerWidth :
			Math.max(nudgeFactor * -maxNudge, window.innerWidth * -0.15);

		const nudgeY = Math.random() * maxNudge * 0.1;
		const rotate = 
			(nudgeFactor * hasBeenNudgedBefore ? 200 : 15) 
			* Math.random();
		// console.log(`nudge x:"${nudgeX}, y:"${nudgeY}`);
		el.style.transform = `translate(${nudgeX}px, ${nudgeY}px) rotate(-${rotate}deg)`;

		if(hasBeenNudgedBefore) {
			// reset
			window.setTimeout(() => {
				el.style.opacity = '0';
				window.setTimeout(() => {
					el.style.transform = '';
					window.setTimeout(() => {
						el.style.opacity = '100';
					}, 150);
				}, 1000);
			}, 2000);
		}

		container.style.transform = 'translate(-7.5px, 0)';
		window.requestAnimationFrame(() =>{
			container.style.transform = 'translate(2.5px, 0)';
			window.requestAnimationFrame(() =>{
				container.style.transform = '';
			})	
		})
		// window.setTimeout(() => {
		// 	document.body.style.transform = '';

		// }, 100);
	};

	const nudgeFilterTags = [ 'body', 'nav' ];
	const nudgeFilterClasses = [ 'container', 'profile-wrapper' ];
	const step = (timestamp) => {

		if (start === -1) {
			start = timestamp;
		}

		const elapsed = timestamp - start;
		const duration = 300; // ms
		const t = elapsed / duration; 

		dist = easeInOutCubic(Math.abs(t - 0.5) * 2);
		scale = lerp(0.8, 1, dist);
		setPaw();
		// console.log(t);
		if(halfwayCallback && t > 0.7) {
			// console.log("triggering half way callback");
			// console.log(halfwayCallback.target);
			if(
				!nudgeFilterTags.includes(halfwayCallback.target.tagName.toLowerCase()) &&
				!nudgeFilterClasses.some((c) => halfwayCallback.target.classList.contains(c))
				// !halfwayCallback.target.classList.some((c) => nudgeFilterClasses.contains(c))
				// halfwayCallback.target.tagName.toLowerCase() != 'body' && 
				// halfwayCallback.target.tagName.toLowerCase() != 'nav'
			) {
				if(halfwayCallback.target.tagName.toLowerCase() === 'a') {
					nudge(halfwayCallback.target.parentNode);
					const target = halfwayCallback.target;
					animateButton(target);
				}
				else {
					nudge(halfwayCallback.target);
				}
			}
			if(halfwayCallback.target.id === 'cat-mode') {
				simulateClick(halfwayCallback);
			}
			halfwayCallback = null;
			pawPrint();

		}
		if (t < 1) {
			requestAnimationFrame(step);
		} else {
			dist = 1;
			scale = 1;
			setPaw();
			start = -1;
		}
	}

	document.body.addEventListener("click", (e) => {
		if (halfwayCallback) return;
		if(!pawActive)return;

		e.stopPropagation();
    	e.preventDefault();
		halfwayCallback = e;
		requestAnimationFrame(step);

	}, true)

	window.addEventListener('resize', setPaw);

}

AttachPaw();


document.querySelector("body").addEventListener("click", function (e) {

	if(e.target.tagName.toLowerCase() === 'a') return;
	
	var div = document.createElement("div");

	effectsWrapper.appendChild(div);
	div.style.left = e.clientX + "px";
	div.style.top = e.clientY + "px";
	div.className = 'star-container';
	var maxElems = 11;
	for (i = 0; i < maxElems; i++) {
		var span = document.createElement('img');
		span.src = Math.random() > 0.68 ? 'imgs/star_4.png' : 'imgs/star_5.png';
		var newSpan = div.appendChild(span);
		var deg = i * (360 / maxElems) + Math.floor(Math.random() * 15);
		let height = 60 
		height -= Math.floor(Math.random() * height * 0.6);
		let width = 50;
		width -= Math.floor(Math.random() * width * 0.8);
		width = height * 0.5;
		newSpan.style.height = height + "px";
		newSpan.style.width = width + "px";
		newSpan.style.transform = "rotate(" + deg + "deg)";
		newSpan.className = 'star';
	}
	window.requestAnimationFrame(
		function () {
			Array.from(div.getElementsByClassName('star')).forEach((el) => {
				var trasY = -150 - Math.floor(Math.random() * 200);
				el.style.transform += "scaleY(0.5) translateY(" + trasY + "px)";
				el.style.opacity = "0";
			});
			window.setTimeout(function () {
				effectsWrapper.removeChild(div);
			}, 1300)
		}

	);
});

const styleEl = document.createElement("style");

const SetButtonBackground = () => {
	const buttons = document.getElementsByClassName('link-button');
	const top = buttons[0].offsetTop;
	const bottom = buttons[buttons.length - 1].offsetTop + buttons[buttons.length - 1].offsetHeight;
	const length = bottom - top;
	const size = buttons[0].offsetHeight / length;
	console.log(`length of gradient is ${length}`);
	console.log(`button size is ${size}`);
	// return;

	
	// document.head.appendChild(styleEl);
	// const styleSheet = styleEl.sheet;

	// styleSheet.insertRule(
	// 	`.link-button { background-size: 100% ${length}px }`, 
	// 	// styleSheet.cssRules.length
	// 	0
	// );
	// styleEl.innerHTML = `.link-button { background-size: 100% ${length}px }\n`;
	styleEl.innerHTML += `
		.link-button {
			/* background: linear-gradient(in oklab to bottom, oklab(90% 0.250 0.000) 0%, oklab(90% 0.043 0.161) 50%, oklab(90% -0.217 0.125) 100%); */
			background: linear-gradient(in oklab to bottom, oklab(93% 0.167 0.0), oklab(93% 0.043 0.161), oklab(93% -0.144 0.083));
		}
		.link-button::before {
			background: linear-gradient(in oklab to bottom, oklab(77% 0.133 0.000), oklab(77% 0.035 0.129), oklab(77% -0.115 0.067));
		}
		.link-button:hover {
			/* oklab(0.930, 0.167, 0.000)
			oklab(0.930, -0.144, 0.083) */
			background: linear-gradient(in oklab to bottom, oklab(90% 0.250 0.000), oklab(90% 0.043 0.161), oklab(90% -0.217 0.125));
		}
		.link-button.active, .paw-inactive .link-button:active {
			background: linear-gradient(in oklab to bottom, oklab(80% 0.167 0.0), oklab(80% 0.043 0.161), oklab(80% -0.144 0.083));
		}
		.link-button, .link-button::before, 
		.link-button:hover, .link-button:hover::before, 
		.link-button.active, .link-button.active::before,
		.paw-inactive  .link-button:active, .paw-inactive  .link-button:active::before
		{
			background-size: 100% ${length}px;
		}

    `;
	for(let i = 0; i < buttons.length; i++) {
		const button = buttons[i];
		const className = `button-gradient-${i}`;
		button.classList.add(className);
		
		const pos = (button.offsetTop - top) / length * length;

		styleEl.innerHTML += `
			.${className}, .${className}::before, 
			.${className}:hover, .${className}:hover::before, 
			.${className}.active, .${className}.active::before,
			.paw-inactive  .${className}:active, .paw-inactive  .${className}:active::before
			{ 
				background-position-y: -${pos}px;
			}
		`;
	}
	document.head.appendChild(styleEl);
}
SetButtonBackground();


const rainbowOffsetLength = 15;
const rainbowOffsetAnimation = 100;
const rainbowCount = 10;
const rainbowDelay = 0.33;
const rainbowHeader = (el) => {
	for(let i = rainbowCount; i > 0; i--) {
		const headerElement = document.createElement('div');
		headerElement.className = 'rainbow-element';
		headerElement.classList.add('rainbow-element-' + i);
		el.appendChild(headerElement);
	}
}

const rainbowStyle = () => {
	for(let i = rainbowCount; i > 0; i--) {
		const offset = rainbowOffsetLength * ((i-1) / rainbowCount);
		styleEl.innerHTML += `
		.rainbow-element-${i} {
			${i === 1 ? 'background: white;' : ''}
			${
				i === 1 ?
				'animation: rainbow-wobble  6s ease infinite;' :
				'animation: rainbow-gradient 5s linear infinite, rainbow-wobble  6s ease infinite;'

			}
			animation-delay: ${-10 + (i-1) * rainbowDelay}s;
			top: ${offset * 0.2}px;
			left: -${offset}px;
		}
		`;
	}
}
rainbowHeader(document.getElementById('header-wrapper'));
rainbowHeader(document.getElementById('footer-wrapper'));
rainbowStyle();