var brainJs = require("brain.js")
var net = new brainJs.NeuralNetwork();

net.train([{input: [0, 0], output: [0]},
           {input: [0, 1], output: [1]},
           {input: [1, 0], output: [1]},
           {input: [1, 1], output: [0]}]);

 console.log(Math.round(net.run([0, 0])));
 console.log(Math.round(net.run([0, 1])));
 console.log(Math.round(net.run([1, 0])));
 console.log(Math.round(net.run([1, 1])));
