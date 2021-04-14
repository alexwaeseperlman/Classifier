# ARCHIVED: I wrote this when I was twelve. It is slow, inaccurate, and should not be used.

## Text Classification
This is a model that can be trained to categorize text. It works using the following algorithm:
Training:
- Split the given record into every possible n-gram (e.g. 'this is an example' would become 'this', 'is', 'an', 'example', 'this is', 'is an', 'an example', 'this is an', 'is an example', 'this is an example').
- Store each n-gram along with how many times it appeared in documents each class

Classifying:
- Find each n-gram in the target document that the model has seen before.
- Calculate a score for each class using number of times each n-gram from the target document appeared in that class.
- Normalize all the scores to have a sum of 1.0.

### Training
```javascript
var Classifier = require('Smallclassifier');
var classifier = new Classifier();
classifier.train('Hello there', 'greeting'); // Hello there is a greeting
classifier.train('Hi', 'greeting'); // Hi is a greeting
classifier.train('SmallClassifier is awesome!', 'complement'); // SmallClassifier is awesome! is a complement
```

### Use
```javascript
console.log(classifier.classify('hello there SmallClassifier')); // greeting
console.log(classifier('You are awesome!')); //{"complement": 0.66666666666, "greeting": 0.33333333333}
```
