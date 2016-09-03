// Require the module
var clapDetector = require('clap-detector');

// Define configuration
var clapConfig = {
   AUDIO_SOURCE: 'alsa hw:1,0'// default for linux
};

// Start clap detection
clapDetector.start(clapConfig);

// Register on clap event
clapDetector.onClap(function() {
    //console.log('your callback code here ');
});

// Register to a serie of 3 claps occuring within 2 seconds
clapDetector.onClaps(3, 2000, function(delay) {
    //console.log('your callback code here ');
});
