---
title: Optimizing Life and Node.js
author: Yagiz Nizipli
date: 2024-08-21
marp: true
style: |
  table {
    margin-left: auto;
    margin-right: auto;
  }
transition: slide
paginate: true
---

# Optimizing Life and Node.js

---

## Who am I?

- Principal Systems Engineer at Cloudflare
- Node.js Technical Steering Committee member

---

## Some fun facts:

- Since January 2021, I'm married with my lovely wife, Merve.
- As of June 2023, I've made a person, called Ada.
- As of August 2024, I've made 263 commits to Node.js.

---

## Some of my recent contributions to Node.js

- `node --run <script_name>`
- `node --env-file=.env`
- new URL()
- new URL.canParse()
- Lots and lots of performance improvements

---

<style scoped>
    h2 { text-align: center; }
</style>

## I'm here to share **__my__** secret sauce with you.

---

<style scoped>
    h2 { text-align: center; }
</style>

## How did I optimize my life and Node.js?

---

<style scoped>
    table { max-width: fit-content; margin-left: auto; margin-right: auto;}
    h2 { text-align: center; }
</style>

## Familiar with OR gates?

| A     | B     | A or B |
|-------|-------|--------|
| True  | True  | True   |
| False | True  | True   |
| True  | False | True   |
| False | False | False  |

---

<style scoped>
    h2 { text-align: center; }
</style>

## Let's look into marriage logic

---

<style scoped>
    table { max-width: fit-content; margin-left: auto; margin-right: auto;}
    h2 { text-align: center; }
</style>

## Marriage logic map

| Yagiz | Merve | Result        |
|-------|-------|---------------|
| Wrong | Right | Merve's right |
| Right | Right | Merve's right |
| Right | Wrong | Merve's right |
| Wrong | Wrong | Yagiz's wrong |

---

<style scoped>
    h2 { text-align: center; }
</style>

## How about our daily lives?

--- 

![Kitchen](./kitchen.jpg)

---

<style scoped>
    h2 { text-align: center; }
</style>

## Well, Node.js is not different than a kitchen.

--- 

## TextDecoder

```js
// Stands for `hello world`
const input = new Uint8Array([
  104, 101, 108, 108, 111,  32, 119, 111, 114, 108, 100,
])

const decoder = new TextDecoder("utf8");
const decoded = decoder.decode(input);
assert.strictEqual(decoded, "hello world");
```

---

## TextDecoder continued.

Most of the time we don't care about the options.

```js
const decoder = new TextDecoder('utf8', { ignoreBOM: true, fatal: true });
```

### Options

- `encoding`: Possible values are `utf-8`, `utf-16le`, `utf-16be`...
- `ignoreBom`: True if the byte order mark will be included, false if it will be skipped.
- `fatal`: True if errors should throw, false if it should return a string with a U+FFFD replacement character.

---

<style scoped>
    h2 { text-align: center; }
</style>

## What's the cost of supporting all these options?

---

<style scoped>
    h2 { text-align: center; }
</style>

## Wouldn't life be easier if we could just use `new TextDecoder()`?

---

<style scoped>
    h2, p { text-align: center; }
</style>

## According to the spec, hell no.

We need to make our lives harder.

---

<style scoped>
    h2 { text-align: center; }
</style>

## So, what do we do now?

---

## Facts

- TextDecoder uses `StringDecoder`
- `StringDecoder` uses ICU for all cases.
- ICU is slow.
- Complexity is the enemy of performance (and me).

---

<style scoped>
    h2 { text-align: center; }
</style>

## Remember kitchen?

---

![Kitchen](./kitchen.jpg)

---

<style scoped>
    h2 { text-align: center; }
</style>

## Let's optimize for common people, not for the spec.

---

# Common use case

```js
new TextDecoder('utf8', { fatal: true, ignoreBOM: false });
```

_`fatal` is true by default._

---

## Adding a fast path

```js
class TextDecoder {
    constructor(encoding = 'utf-8', options = kEmptyObject) {
        encoding = `${encoding}`;
        validateObject(options, 'options', kValidateObjectAllowObjectsAndNull);
        // ...
        this[kUTF8FastPath] = enc === 'utf-8';
    }
    
    decode(input = empty, options = kEmptyObject) {
        this[kUTF8FastPath] &&= !(options?.stream);
        
        if (this[kUTF8FastPath]) {
            return decodeUTF8(input, this[kIgnoreBOM], this[kFatal]);
        }
        
        this.#prepareConverter();
        // ...
        return _decode(this[kHandle], input, flags, this.encoding);
    }
}
```

---

<style scoped>
    h2 { text-align: center; }
</style>

## TextDecoder is not the only place where we can do similar things.

---

## `Buffer.byteLength`

```js
function byteLength(string, encoding) {
  // ...
  if (!encoding || encoding === 'utf8') {
    return byteLengthUtf8(string);
  }

  if (encoding === 'ascii') {
    return len;
  }

  return ops.byteLength(string);
}
```

---

## `Buffer.swap16`

```js
Buffer.prototype.swap16 = function swap16() {
  // For Buffer.length < 128, it's generally faster to
  // do the swap in javascript. For larger buffers,
  // dropping down to the native code is faster.
  const len = this.length;
  if (len % 2 !== 0)
    throw new ERR_INVALID_BUFFER_SIZE('16-bits');
  if (len < 128) {
    for (let i = 0; i < len; i += 2)
      swap(this, i, i + 1);
    return this;
  }
  return _swap16(this);
};
```

---

## Buffer(val, 'utf8').byteLength

```c++
uint32_t FastByteLengthUtf8(Local<Value> receiver,
                            const v8::FastOneByteString& source) {
  // For short inputs, the function call overhead to simdutf is maybe
  // not worth it, reserve simdutf for long strings.
  if (source.length > 128) {
    return simdutf::utf8_length_from_latin1(source.data, source.length);
  }

  // ...

  return answer;
}
```

---

<style scoped>
    h2 { text-align: center; }
</style>

## I guess, it's time to wrap up.

---

<style scoped>
    h2 { text-align: center; }
</style>

## Optimize the hell out of your life, just like Node.js.

---

<style scoped>
    h2 { text-align: center; }
</style>

## Thank you for listening.
