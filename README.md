# @ghom/complate

Comment based templating engine

## Installation

```bash
npm install @ghom/complate
```

## Usage

First, create a comment based template file with the following comment syntax: ``/** tag = js script **/ some data /** tag **/``. Example:

```html
<h1>Index</h1>
Date: <!-- date = new Date().toISOLocalString() --> 15/10/2024 <!-- date -->
```

Here, the data between the ``date`` tags will be replaced with the result of the ``new Date().toISOLocalString()`` script.

Then, use the ``complate`` CLI to render the template:

```bash
complate index.html
```

Or, use the ``complate`` function to render the template:

```js
import { complate } from '@ghom/complate'

complate('index.html')
```

After the render, the comments will not be removed, but the data between the tags will be replaced.  
You can use a configuration file to define some presets for lighten the templating expression like that:  

```js
// complate.js

export function now() {
  return new Date().toUTCString()
}
```

And then, in a html file:

```html
<!-- date = now --><!-- date -->
```