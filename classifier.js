"use strict";

function Classifier() {
	function clone(input) {
		let output = {};
		for (let i in input) {
			output[i] = input[i];
		}
		return output;
	}
	function includes(text, inner) {
		let splitText = text.split(/ /g);
		let splitInner = inner.split(/ /g);
		for (let i = 0; i < text.length - splitInner.length; i++) {
			let found = true;
			for (let k = 0; k < splitInner.length; k++) {
				if (splitText[i + k] != splitInner[k]) found = false;

			}
			if (found) return true;
		}
		return false;
	}
	let classifier = function(text) {
		text = classifier.simplify(text);
		let totals = clone(classifier.categories);
		for (let n = classifier.data.length - 1; n >= 0; n--) {
			for (let i in classifier.data[n]) {
				for (let k in classifier.categories) {
					if (classifier.data[n][i][k] && includes(text, i)) {
						text = text.replace(i, '');
						console.log('Found', i, 'removing it. Text is now', text, 'adding', classifier.data[n][i][k], 'to', k);
						totals[k] += classifier.data[n][i][k];
					}
					if (text.length == 0) {
						for (let i in totals) totals[i] /= text.split(/ /g).length
						return totals;
					}
				}
			}
		}
		for (let i in totals) totals[i] /= text.split(/ /g).length
		return totals;
	}
	classifier.classify = function(text) {
		let results = classifier(text);
		let max = 0;
		let maxIndex = 0;
		for (let i in results) if (results[i] > max) {
			max = results[i];
			maxIndex = i;
		}
		return maxIndex;
	}
	classifier.data = [];
	classifier.categories = {};
	classifier.train = function(data, category) {
		if (!classifier.categories[category]) classifier.categories[category] = 1;
		data = classifier.simplify(data);
		let output = [];
		let split = data.split(/ /g);
		let length = split.length;
		while (length >= 0) {
			output[length - 1] = {};
			for (let i = 0; i < split.length - (length - 1); i++) {
				let current = '';
				for (let k = 0; k < length; k++) {
					current += split[i + k] + ' ';
				}
				output[length - 1][current] = {};
				output[length - 1][current][category] = length;
			}
			length--;
		}
		for (let i = 0; i < output.length; i++) {
			for (let k in output[i]) {
				if (k.endsWith(' ')) {
					output[i][k.slice(0, -1)] = output[i][k];
					delete output[i][k];
				}
			}
		}

		/*//Loop through the output
		for (let i = 0; i < output.length - 1; i++) {
			//Now check all the ngrams of i
			for (let k in output[i]) {
				//Check if this is contained in an ngram of n + 1 and the ngram of n + 1 has been seen before
				for (let j in output[i + 1]) {
					if (classifier.data[i + 1]) {
						if (j.includes(k) && Object.keys(classifier.data[i + 1]).includes(j)) {
							delete output[i][k];
							console.log('removing', k, 'because', j, 'includes it and has been seen before');
						}
					}
				}
			}
		}*/

		for (let i = 0; i < output.length; i++) {
			for (let k in output[i]) {
				if (!classifier.data[i]) classifier.data[i] = {};
				if (!classifier.data[i][k]) classifier.data[i][k] = {};
				if (!classifier.data[i][k][category]) {
					classifier.data[i][k][category] = output[i][k][category];
				}
				else {
					classifier.data[i][k][category] += output[i][k][category];
				}
			}
		}
	}
	classifier.simplify = function(text) {
		text = text.replace(/[^a-zA-Z ]/g, '');
		let split = text.split(/ /g);
		for (let i = 0; i < split.length; i++) {
			split[i] = split[i].toLowerCase();
			split[i] = split[i].replace(/(s|est|es|y|ey|d|ed)$/, '');
		}
		let output = split.join(' ');
		return output;
	}

	classifier.trainByObject = function(obj, logging, maxPercentage) {
		let keys = Object.keys(obj).length;
		let totalLoops = 0;
		for (let i in obj) {
			classifier.train(i, obj[i]);
			if (logging) {
				totalLoops++;
				console.log((totalLoops / keys * 100) + '%', 'done');
				if (totalLoops / keys * 100 >= maxPercentage) {
					break;
				}
			}
		}
	}
	return classifier;
}

module.exports = Classifier;
