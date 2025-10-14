// utils/matchAadhaar.js
function normalize(s = "") {
  return s.toString().toUpperCase().replace(/[^A-Z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function tokenSimilarity(a = "", b = "") {
  a = normalize(a); b = normalize(b);
  if (!a || !b) return 0;
  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  let matches = 0;
  for (const t of aTokens) if (bTokens.has(t)) matches++;
  return matches / Math.max(aTokens.size, bTokens.size);
}

export function compareAadhaarWithManual(scanned, manual) {
  // scanned: parsed aadhaar object
  // manual: { name, dob, aadhar, gender, address, pincode, ... }
  const result = { passed: false, details: {}, reason: null };

  // 1. Aadhaar number check if provided by user
  if (manual.addharCardNumber) {
    if (String(scanned.uid) !== String(manual.addharCardNumber)) {
      result.reason = "Aadhaar number mismatch";
      return result;
    }
  }

  // 2. Name similarity
  const nameSim = tokenSimilarity(scanned.name || "", manual.name || "");
  result.details.nameSim = nameSim;

  // 3. DOB / YOB
  const scannedYear = scanned.yob || (scanned.dob ? new Date(scanned.dob).getFullYear() : null);
  const manualYear = manual.dob ? new Date(manual.dob).getFullYear() : manual.dob;
  result.details.yearMatch = scannedYear == manualYear;

  // 4. Pincode / vtc / state
  result.details.pincodeMatch = scanned.pc && manual.pincode && String(scanned.pc) === String(manual.pincode);
  result.details.vtcMatch = scanned.vtc && manual.vtc && normalize(scanned.vtc) === normalize(manual.vtc);

  // Decision logic - tune thresholds
  if ((nameSim >= 0.6 && result.details.yearMatch) || result.details.pincodeMatch) {
    result.passed = true;
  } else {
    result.reason = "Fields do not sufficiently match";
  }

  return result;
}
