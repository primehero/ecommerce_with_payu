/**
 * Loads body smoothly into the window.
 * @param {object} window     - Window object.
 * @param {object} document   - Document object.
 * @param {Number} opPerCall  - Opacity to increase per call.
 * @param {Number} fadeInTime - Time between each opacity increment.
 * returns {Promise} A promise that will be resolved when fade in is complete(no reject).
 */
let slowLoader = (function(window, document, opPerCall, fadeInTime) {
	return new Promise((resolve, reject) => {
		var clock, opacity = 0;

		/*
		 * Increments the opacity once per call by certain amount
		 * @params {Number} opPerCall - Opacity to increment per call.
		 */
		let incOp = (function(opPerCall) {
			if (document.body.style.opacity < 1) {
				opacity += opPerCall;
				document.body.style.opacity = opacity;
			}
			else {
				clearInterval(clock);
				resolve();
			}
		}).bind(null, opPerCall);

		/*
		 * Displays the body of the page.
		 * @params {Number} fadeInTime - Time taken to fade in.
		 */
		let displayAll = (function(fadeInTime) {		
			document.body.style.opacity = 0;
			document.body.style.display = "block";
			clock = window.setInterval(incOp, fadeInTime);
		}).bind(null, fadeInTime);

		window.addEventListener("load", displayAll, false);
	});
}).bind(null, window, document);
