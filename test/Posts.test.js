import * as t from "https://deno.land/std/testing/asserts.ts";
import { Posts } from "../Posts.js";
import { Post } from "../static/Post.js";
import { CBOR } from "https://code4fukui.github.io/CBOR-es/CBOR.js";
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";
import { Coder } from "https://code4fukui.github.io/PubkeyUser/PubkeyUser.js";
import * as sec from "https://code4fukui.github.io/sec.js/sec.js";

// https://github.com/code4fukui/PubkeyUser/
//const prikey = sec.prikey();
//await Deno.writeFile("prikey.cbor", CBOR.encode({ prikey }));
const prikey = CBOR.decode(await Deno.readFile("prikey.cbor")).prikey;
const pubkey = sec.pubkey(prikey);
//console.log(prikey, new Uint8Array(pubkey), pubkey);

Deno.test("simple", async () => {
  const id = TAI64N.stringify(TAI64N.encode(new Date("2025-07-16 15:00")));
  const data = {
    id,
    parent: null,
    pubkey: Coder.encode(pubkey),
    name: "user1",
    body: "body1",
    tags: ["test"],
  };
  console.log(data);  
  const post = Post.create(data, prikey);
  const posts = new Posts();
  await posts.add(post);
  const p2 = await posts.get(id);
  console.log(post);
  t.assertEquals(post, p2);
  const latest = posts.getLatest();
  t.assertEquals(latest, [post]);
});
