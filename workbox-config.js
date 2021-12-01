module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,js,jpg,css,html,webmanifest}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};