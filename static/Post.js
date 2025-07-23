import * as sec from "https://code4fukui.github.io/sec.js/sec.js";
import { CBOR } from "https://js.sabae.cc/CBOR.js";
import { Coder } from "https://code4fukui.github.io/PubkeyUser/PubkeyUser.js";

/*
  post
    data
      id // tai64n as id
      parent // link to id or null
      pubkey
      name :String // 
      body :String
      tags // array of tag:String
    sign // sign of CBOR.encode(data)
*/

const dec = (key) => {
  if (key instanceof Uint8Array) return key;
  return Coder.decode(key);
};

export class Post {
  static create(data, prikey) {
    return {
      data,
      sign: sec.sign(dec(prikey), CBOR.encode(data)),
    };
  }
  static verify(post) {
    return sec.verify(post.sign, dec(post.data.pubkey), CBOR.encode(post.data));
  }
};
