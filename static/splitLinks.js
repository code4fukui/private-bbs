export const splitLinks = (text) => {
  const regexpURL = /(https?:\/\/(?:\[(?:[a-f0-9:]+:+)+(?:[a-f0-9]+)?\]|[-.a-zA-Z0-9]+)(?::[0-9]+)?[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)/g;
  const r = text.split(regexpURL).filter(i => i.length > 0);
  return r;
};

if (import.meta.main) {
  console.log(splitLinks("あ\nなうhttps://jig.jp/"));
}
