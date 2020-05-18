# pico-speako
This node package handles text to speech on linux/raspberry pi, supporting mutliple output devices (as arguments) and suppresses repeated calls.

I needed a way to get audible feedback from my raspberry pi while I was not watching the terminal. I am often testing the pin inputs from far away. The existing packages had the occasional error, and also could not handle many successive calls. pico-speako ignores successive calls of the same message or type of message while one is already playing.

In addition, I needed to specify to send the audio to different devices on the fly.

You will need to install pico speaker, which will need some libraries added on Stretch (see below).

If you want to use sound output besides the default output, you will need to configure your [asound](https://www.alsa-project.org/wiki/Asoundrc).

This uses aplay, which is already installed. Make sure the volume is set at a reasonable level with the `alsamixer`.

## Installation

Install pico - please refer to offical documentation to get pico installed on your system, but these notes work for me:
If you are using Raspbian Stretch, you need to add these non-free libs. This is not needed in older versions (Buster).

```bash
wget -q https://ftp-master.debian.org/keys/release-10.asc -O- | sudo apt-key add - echo "deb http://deb.debian.org/debian buster non-free" | sudo tee -a /etc/apt/sources.list
```
Then, of course, run
```bash
apt-get update
```

Install pico:
```bash
sudo apt-get install libttspico0 libttspico-utils libttspico-data alsa-utils -y
```
You can test pico with
```bash
pico2wave -l=en-GB -w=/tmp/pico.wav "big chungus" && aplay /tmp/pico.wav
```
If you can't get that working, this package will be useless.

Install pioco-speako:
```bash
npm -i pico-speako
```

## Configuration

You need to configure asound on your own. If you need to change audio output devices in different environments, you can set an environment variable named PICO_SPEAKO_DEVICE=default or whatever your alternative speaker is. When using this env var, all sound will come from the same device, overriding device arguments.

Valid languages: en-US, en-GB, de-DE, es-ES, fr-FR, & it-IT. Default is en-GB.
This is passed as a single argument at any time, try it on the require (see below).

## Usage

```javascript
const say = require('pico-speako') // => loads the function to read English.`
const say = require('pico-speako')('es-ES') // => loads the function to read Spanish.
say('What', [where,] [type])
````

### Say

```javascript
say('hello') // => "Hello" is spoken from the default speakers. 
say('test', 'antechamber') // => "test" is spoken from the speaker set connected to a device named "antechamber" in the asoundrc.
say('problem', 'antechamber', 'info') // => "problem" is spoken from the speaker set connected to a device named "antechamber" in the asoundrc,
			// ...and if other calls to say() with the same type (info) happen before this call is finished, they will be suppressed.
```

#### What

The first argument can be any string you would like read aloud.

#### Where
The second optional argument should be a name from your asound config. I am not an expert at asound configuration, but here is a sample that works for me. With this configuration, I can use a device named 'antechamber':
```bash
pcm.antechamber {
  type plug
  slave.pcm "antechambermixer"
}

pcm.antechambermixer  {
  type dmix
  ipc_key 1024
  slave {
    pcm "hw:0,0"
    period_time 0
    period_size 1024
    buffer_size 4096
  }
}
```

#### Type

If your code causes many calls to say(), pico-speako wants to suppress messages that are the same or are mostly the same. It keeps track of the first several characters of what it is saying, and if successive calls come in that start with the same several characters, it will play the first call and ignore the rest until the first call has finished playing. If your messages would be redundant or noisy to play over eachother, and it is acceptable to not play some of them, you can set a custom type argument (eg 'info') and any calls that use the same type will be ignored if a message of that same type is currently playing. I use this to test a lot of input pins and if the buttons I'm installing are not properly debounced, I can get dozens of calls in a second saying something like 'button 1' or 'button 5'. This can lead to a loud cacophony of gibberish, but if I call them with a type of 'info,' I will only hear the first call.

### Debug

If you have the debug module installed, you can get some debug output labelled "say."

Check that your speakers are on and connected from the command line with something like `speaker-test -c2 -t wav`.
