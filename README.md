# Small Classifier
Small classifier is a lightweight and easy to use text classifier.

## Training
```javascript
var Classifier = require('Smallclassifier');
var classifier = new Classifier();
classifier.train('Hello there', 'greeting');
classifier.train('SmallClassifier is awesome!', 'complement');
```

## Use
```javascript
console.log(classifier.classify('hello there SmallClassifier')); // greeting
console.log(classifier('You are awesome!')); //{"complement": 0.66666666666, "greeting": 0.33333333333}
```
