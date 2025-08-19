import { DateTime, TimeZone } from "https://code4fukui.github.io/day-es/DateTime.js";
import { JSONLWriter } from "https://code4fukui.github.io/JSONL/JSONLWriter.js";
import { JSONLReader } from "https://code4fukui.github.io/JSONL/JSONLReader.js";
import { TAI64N } from "https://code4fukui.github.io/TAI64N-es/TAI64N.js";
import { CBOR } from "https://js.sabae.cc/CBOR.js";
import { CachedMap } from "https://code4fukui.github.io/CachedMap/CachedMap.js";

/*
  posts/
    yyyymmdd/
      id.cbor
    timeline.jsonl // { id }
  
  cache map by id
  latest
*/

const basedir = "data/";

const LATEST_N = 500;
const CACHE_N = 10000;
const TIMEZONE = TimeZone.JST;

export class Posts {
  constructor(latest = []) {
    this.latest = latest;
    this.cachedmap = new CachedMap(CACHE_N);
  }
  static async create() {
    const latest = [];
    try {
      const r = new JSONLReader(basedir + "/timeline.jsonl");
      for (;;) {
        const rec = await r.readRecord();
        if (!rec) break;
        latest.unshift(rec.id);
        if (latest.length > LATEST_N) {
          latest.length = LATEST_N;
        }
      }
      const posts = new Posts(latest);
      for (let i = 0; i < latest.length; i++) {
        latest[i] = await posts.get(latest[i]);
      }
      
      return posts;
    } catch (e) {
      console.log("no timeline data")
    }
    return new Posts();
  }
  async add(post) { // post.data.id as TAI64N
    await this.savePost(post);
    this.updateLatest(post);
    await this.updateTimeline(post);
    return true;
  }
  getPathFromID(id) {
    const tai64n = TAI64N.parse(id);
    const date = TAI64N.toDate(tai64n);
    const dt = new DateTime(date);
    const ymd = dt.toLocal(TIMEZONE).day.toStringYMD();
    const path = basedir + "/" + ymd;
    return path + "/" + id + ".cbor";
  }
  async savePost(post) {
    const fn = this.getPathFromID(post.data.id);
    const path = fn.substring(0, fn.lastIndexOf("/"));
    await Deno.mkdir(path, { recursive: true });
    await Deno.writeFile(fn, CBOR.encode(post));
  }
  async get(id) {
    const post = this.cachedmap.get(id);
    if (post) return post;
    const fn = this.getPathFromID(id);
    const post2 = CBOR.decode(await Deno.readFile(fn));
    this.cachedmap.set(id, post2);
    return post2;
  }
  getLatest(lastdt = null) {
    if (!lastdt) lastdt = TAI64N.stringify(TAI64N.fromYear(0));
    const res = this.latest.filter(i => i.data.id.localeCompare(lastdt) > 0);
    if (res.length) {
      //console.log(res, res.length, lastdt); // , res[0].data.id)
    }
    return res;
  }
  updateLatest(post) {
    //if (!post.data.parent) {
      this.latest.unshift(post);
      if (this.latest.length > LATEST_N) {
        this.latest.length = LATEST_N;
      }
    //}
  }
  async updateTimeline(post) {
    const w = new JSONLWriter(basedir + "/timeline.jsonl", true);
    await w.writeRecord({ id: post.data.id });
    w.close();
  }
}
