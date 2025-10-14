// helper: parseAadhaarXml.js
export function parseAadhaarXml(xmlString) {
  // Example Aadhaar line: <PrintLetterBarcodeData uid="..." name="..." gender="M" yob="1990" co="..." house="..." street="..." lm="..." loc="..." vtc="..." dist="..." state="..." pc="123456"/>
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml");
    const node = doc.querySelector("PrintLetterBarcodeData");
    if (!node) return null;
    // read attributes (strings)
    const obj = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const a = node.attributes[i];
      obj[a.name] = a.value;
    }
    // normalize some fields
    return {
      uid: obj.uid || null,
      name: obj.name ? obj.name.trim() : null,
      gender: obj.gender || null,
      yob: obj.yob || null,
      dob: obj.dob || null, // sometimes yob or dob present
      co: obj.co || null,
      house: obj.house || null,
      street: obj.street || null,
      lm: obj.lm || null,
      loc: obj.loc || null,
      vtc: obj.vtc || null,
      dist: obj.dist || null,
      state: obj.state || null,
      pc: obj.pc || null,
      raw: obj,
    };
  } catch (e) {
    return null;
  }
}
