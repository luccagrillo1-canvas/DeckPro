const protobuf = require("protobufjs");
const fs = require("fs");

protobuf.load("ProPresenter7-Proto/proto/propresenter.proto", (err, root) => {
  if (err) throw err;
  const Presentation = root.lookupType("rv.data.Presentation");
  const buf = fs.readFileSync(process.argv[2]);
  const msg = Presentation.decode(buf);
  console.log(JSON.stringify(msg, null, 2));
});
