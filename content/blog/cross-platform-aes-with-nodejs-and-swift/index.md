---
title: "Cross platform encryption with AES between Swift and Node.js"
date: '2019-02-12'
---

While working on an application, I've come to a situation where I needed to transfer some highly sensitive data between the backend and the client. Even though theoretically, I should have used ECDH to transfer the keys of AES and then to do the decryption process on the mobile application itself, for the sake of simplicity and the delivery, I've omitted that part right now.

### The problem

Simply, I wanted to share an object of configuration to the client app from the backend. The request was on SSL, but we all know that a MITM attack can be possible. So, I needed to encrypt the data on the backend and decrypt it on the mobile application. I'm trusting the compilation process of iOS for the security of the AES secret and the IV.

### The solution

On the backend side, this is what I did:

```javascript
const PromiseRouter = require('express-router-wrapper')
const router = new PromiseRouter()
const crypto = require('crypto')

const iv = process.env.VPN_AES_IV
const secret = process.env.VPN_AES_SECRET

router
  .get('/', async (req, res) => {
    const text = {key: "value"}

    const cipher = crypto.createCipheriv(
      'aes-256-cbc', 
      Buffer.from(secret), 
      Buffer.from(iv))

    let encrypted = cipher.update(Buffer.from(text), 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return {
      data: encrypted.toString('hex')
    }
  })

module.exports = router.getOriginal()
```

On the iOS Swift (4.2) side, please do this:

```swift
import CryptoSwift

let AES_IV: String = ""
let AES_SECRET: String = ""

func dataToByteArray(data: NSData) -> [UInt8] {
    let pointer = data.bytes.assumingMemoryBound(to: UInt8.self)
    
    let buffer = UnsafeBufferPointer(start: pointer, count: data.length)
    
    return Array<UInt8>(buffer)
}

extension String {
    func aesEncrypt() throws -> String {
        let encrypted = try AES(key: AES_SECRET, iv: AES_IV).encrypt([UInt8](self.data(using: .utf8)!))
        return Data(encrypted).base64EncodedString()
    }
    
    func aesDecrypt() throws -> String {
        let key: [UInt8] = Array(AES_SECRET.utf8)
        let iv: [UInt8] = Array(AES_IV.utf8)
        
        let encryptedData: NSData = self.hexStringToData()
        let encryptedBytes: [UInt8] = dataToByteArray(data: encryptedData)
        let decryptedBytes: [UInt8] = try AES(key: key, blockMode: CBC(iv: iv)).decrypt(encryptedBytes)
        
        return String(bytes: decryptedBytes, encoding: .utf8)!
    }
    
    func hexStringToData() -> NSData {
        let data = NSMutableData()
        var temp = ""
        for char in self {
            temp += String(char)
            if temp.count == 2 {
                let scanner = Scanner(string: temp)
                var value: CUnsignedInt = 0
                scanner.scanHexInt32(&value)
                data.append(&value, length: 1)
                temp = ""
            }
        }
        return data as NSData
    }
}
```

Before running your application, make sure that you've set up a Podfile and added `pod "CryptoSwift"` into it.
