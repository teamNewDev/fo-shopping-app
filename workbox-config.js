module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{png,js,jpg,css,html,manifest}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: 'sw.js'
};