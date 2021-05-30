# Curly Placer
A simple templating system for replacing {`variables`} within strings.
## Instalation
```bash
npm install curly-placer
```
## Usage
Let's say you want to print a 2D Vector like this:
```bash
Vec2({x}, {y}) = { 1, 0 };
```
There are 2 ways:
```js
//We can use either object as an input
console.log(format('Vec2({{x}}, {{y}}) = {{ {x}, {y} }};', { x: 1.0, y: 0.0 }));

//or even an array
console.log(format('Vec2({{x}}, {{y}}) = {{ {0}, {1} }};', [1.0, 0.0]));
```
Or perhaps you are loading the format strings from a file and you want to have a dialog with **all the attributes you need to fill**,
to do that just use `getKeys(format, reduceDuplicates)` function like this:
```js
for(const attribute of getKeys(template, true)) 
  dialog.createInput(attribute);
```
_`dialog` and `createInput` are just example objects_
