require([
	'jquery',
	'Mustache',
	'./loadImageData',
	'./generatePixelSamples',
	'./ColorTable',
	'./PixelMatrix',
	'./PossibilityMatrix'
], function(
	$,
	Mustache,
	loadImageData,
	generatePixelSamples,
	ColorTable,
	PixelMatrix,
	PossibilityMatrix
) {
	var SCALE = 16;
	$(function() {
		loadImageData('/img/boxes.png')
			.then(function(data) {
				//turn the raw image data into something consumable
				var colorTable = new ColorTable({
					errorColor: { r: 0, g: 255, b: 0, a: 255}
				});
				var input = PixelMatrix.createFromImageData(data.pixelChannels, data.width, data.height, colorTable);
				input.draw({
					$canvas: $('#input-canvas'),
					scale: SCALE,
					fitCanvas: true
				});
				//then generate 3x3 matrices
				var $samples = $('#samples');
				// $('#generate-samples').on('click', function() {
					$samples.empty();
					var sampleWidth = 3;
					var sampleHeight = 3;
					var samples = generatePixelSamples(input, sampleWidth, sampleHeight);
					for(var i = 0; i < samples.length; i++) {
						samples[i].addToDOM($samples, SCALE);
					}
				// });
				//then generate output
				// $('#generate-output').on('click', function() {
					var possibilityMatrix = new PossibilityMatrix({
						samples: samples,
						width: 30,
						height: 20
					});
					possibilityMatrix.draw({
						$canvas: $('#output-canvas'),
						scale: SCALE,
						fitCanvas: true
					});
					var interval = setInterval(function() {
						var possibilityPixel = possibilityMatrix.getLowestEntropyPixel();
						if(possibilityPixel) {
							possibilityMatrix.resolvePixel(possibilityPixel);
						}
						else {
							clearInterval(interval);
						}
						possibilityMatrix.draw({
							$canvas: $('#output-canvas'),
							scale: SCALE,
							fitCanvas: true
						});
					}, 10);
				// });
			})
			.catch(function(err) {
				console.error(err);
			});
	});
});