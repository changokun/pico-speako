# pico-speako
Just started the development on this node package for text to speech on linux/raspberry pi.

I needed a way to get audible feedback from my raspberry pi while I was not watching the terminal. I am often testing the pin inputs from far away. The existing packages had the occasional error, and also could not handle many successive calls. Successive calls of the same message or type of message are suppressed while one is already playing.

In addition, I needed to specify to send the audio to different devices on the fly.

You will need to install pico speaker, which has different needs whether you are on Stretch or Buster. TODO
If you want to use sound output besides the default output, you will need to configure your [asound](https://www.alsa-project.org/wiki/Asoundrc).

This uses aplay, which is already installed. Make sure the volume is set at a reasonable level with the `alsamixer`.

## Installation

install pico, maybe alsa utils
`npm -i pico-speako`

## Usage
`const say = require('pico-speako')`

`say('What', [where,] [type])`

### Say
```
say('hello') // => "Hello" is spoken from the default speakers. 
say('hello', 'antechamber') // => "Hello" is spoken from the speaker set connected to a device named "antechamber" in the asoundrc.
say('error', 'antechamber', 'info') // => "error" is spoken from the speaker set connected to a device named "antechamber" in the asoundrc, and if other calls to say() with the same type (info) happen before this call is finished, they will be suppressed.
```


