module.exports.generateRandomName = function (length) {
	const allowedCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let name = '';

	for (let i = 0; i < length; i++) {
		name += allowedCharacters.charAt(
			Math.floor(Math.random() * allowedCharacters.length)
		);
	}
	return name;
};
