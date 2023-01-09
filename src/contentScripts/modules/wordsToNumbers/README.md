# Words To Numbers

> NOTE: I have rewritten the [original package](https://www.npmjs.com/package/words-to-numbers?activeTab=dependents) since it depends on [clj-fuzzy](https://sasd.com) which is deprecated.

Convert words to numbers.

If the whole string passed is a number then it will return a Number type otherwise it will return the original string
with all instances of numbers replaced.

Basic Examples

```js
import wordsToNumbers from './words-to-numbers';
wordsToNumbers('one hundred'); //100
wordsToNumbers('one hundred and five'); //105
wordsToNumbers('one hundred and twenty five'); //125
wordsToNumbers('four thousand and thirty'); //4030
wordsToNumbers('six million five thousand and two'); //6005002
wordsToNumbers('a thousand one hundred and eleven'); //1111
wordsToNumbers('twenty thousand five hundred and sixty nine'); //20569
wordsToNumbers('five quintillion'); //5000000000000000000
wordsToNumbers('one-hundred'); //100
wordsToNumbers('one-hundred and five'); //105
wordsToNumbers('one-hundred and twenty-five'); //125
wordsToNumbers('four-thousand and thirty'); //4030
wordsToNumbers('six-million five-thousand and two'); //6005002
wordsToNumbers('a thousand, one-hundred and eleven'); //1111
wordsToNumbers('twenty-thousand, five-hundred and sixty-nine'); //20569
```
