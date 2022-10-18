
const currencyHexToUTF8 = (code:string) => {

    try{
    if(code.length === 3)
        return code
  
    let decoded = new TextDecoder()
        .decode(hexToBytes(code))
    let padNull = decoded.length
  
    while(decoded.charAt(padNull-1) === '\0')
        padNull--
  
    return decoded.slice(0, padNull)
    } catch(error) {
      console.log(error)
      return code
    }
  }
  
const hexToBytes = (hex:string) => {
    let bytes = new Uint8Array(hex.length / 2)

    for (let i = 0; i !== bytes.length; i++){
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16)
    }

    return bytes
}

const currencyUTF8ToHex = (code:string) => {
    if(/^[a-zA-Z0-9\?\!\@\#\$\%\^\&\*\<\>\(\)\{\}\[\]\|\]\{\}]{3}$/.test(code))
        return code

    if(/^[A-Z0-9]{40}$/.test(code))
        return code

    let hex = ''

    for(let i=0; i<code.length; i++){
        hex += code.charCodeAt(i).toString(16)
    }

    return hex
        .toUpperCase()
        .padEnd(40, '0')
}

function fromHex(hex:string,str:string){
    try{
      str = decodeURIComponent(hex.replace(/(..)/g,'%$1'))
    }
    catch(e){
      str = hex
      console.log('invalid hex input: ' + hex)
    }
    console.log(str)
    return str
  }
  
  
  function toHex(str:string,hex:string){
    try{
      hex = unescape(encodeURIComponent(str))
      .split('').map(function(v){
        return v.charCodeAt(0).toString(16)
      }).join('')
    }
    catch(e){
      hex = str
      console.log('invalid text input: ' + str)
    }
    console.log(hex)
    return hex
  }
  //main( 'testnet' , )
  
  
  // This is the same for all of the below, and
  // you probably won't need it except for debugging
  // in most cases.
  function bytesToHex(bytes:ArrayLike<Number>) {
    return Array.from(
      bytes,
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }
  
  // You almost certainly want UTF-8, which is
  // now natively supported:
function stringToUTF8Bytes(string:string) {
    return new TextEncoder().encode(string);
  }
  
  // But you might want UTF-16 for some reason.
  // .charCodeAt(index) will return the underlying
  // UTF-16 code-units (not code-points!), so you
  // just need to format them in whichever endian order you want.
  function stringToUTF16Bytes(string:string, littleEndian:boolean) {
    const bytes = new Uint8Array(string.length * 2);
    // Using DataView is the only way to get a specific
    // endianness.
    const view = new DataView(bytes.buffer);
    for (let i = 0; i != string.length; i++) {
      view.setUint16(i, string.charCodeAt(i), littleEndian);
    }
    return bytes;
  }
  
  // And you might want UTF-32 in even weirder cases.
  // Fortunately, iterating a string gives the code
  // points, which are identical to the UTF-32 encoding,
  // though you still have the endianess issue.
  function stringToUTF32Bytes(string:string, littleEndian:boolean) {
    const codepoints:any = Array.from(string, c => c.codePointAt(0));
    const bytes = new Uint8Array(codepoints.length * 4);
    // Using DataView is the only way to get a specific
    // endianness.
    const view = new DataView(bytes.buffer);
    for (let i = 0; i != codepoints.length; i++) {
      view.setUint32(i, codepoints[i], littleEndian);
    }
    return bytes;
  }
  
  function stringToAllCaps(string:string) {
  
      var newString = ''
      for (let i=0; i < string.length; i++) {
          if (string.charAt(i) != string.charAt(i).toUpperCase()) {
                  newString = newString + string.charAt(i).toUpperCase()}
              else { newString = newString + string.charAt(i)}
          }
  
      return newString
  }

export {
    currencyHexToUTF8,
    hexToBytes,
    currencyUTF8ToHex
}