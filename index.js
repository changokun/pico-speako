try {
  var debug = require('debug')('say')
} catch (er) {
  debug = function(){}
}
var md5 = require('md5')
var fs = require('fs')
const {spawn} = require('child_process')


var currently_saying = []
function say(what, where='default', type) {
	// type is a way to provide shortwhat - ie you can have similar messages suppressed while one of them is already playing.
	// stashing the first x chars in currently_saying, so that we don't have horrendous repeating texts. using the first x chars means related messages will be suppressed. this may need adjustment.
	var short_what = type || what.substr(0, 10) || what
	if(currently_saying.indexOf(short_what) !== -1) {
		debug(`Suppressing saying, “${what}” again because I am already saying it.`)
		return
	}
	debug(`Say “${what}”`)
	const file_path = '/tmp/' + md5(what) + '.wav'
	if( ! fs.existsSync(file_path)) {
		console.log('making file_path', file_path)
		console.log('pico2wave -l en-GB -w', file_path, what)
	  var sub = spawn('pico2wave', [
			"-l",
			"en-GB",
			"-w",
			file_path,
			what
		])
		sub.stderr.on('close', function(){ say(what, where) })
	} else {
		currently_saying.push(short_what)
		where = process.env.AUDIO || where
		// console.log(`aplay -D ${where} ${file_path}`)
	  var sub = spawn('aplay', [
			"-D",
			where,
			file_path,
		])
		sub.on('exit', function() {
			currently_saying.splice(currently_saying.indexOf(short_what), 1)
		})
	}

	// debug(currently_saying)

}


module.exports = say
