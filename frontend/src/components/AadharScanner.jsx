// src/components/AadharScanner.jsx
import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
// import { Html5QrcodeScanner } from "html5-qrcode";
import { parseAadhaarXml } from "../utils/parseAadhaarXml";

export default function AadharScanner({ onScan, onError }) {
    const divRef = useRef(null);
    const qrcodeRegionId = "html5qr-region";

    useEffect(() => {
        const html5QrCode = new Html5Qrcode(qrcodeRegionId);

        html5QrCode
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 300 },
                (decodedText) => {
                    try {
                        if (html5QrCode.getState() === 2 || html5QrCode.getState() === 1) {
                            html5QrCode.stop().catch(() => { });
                        }
                    } catch (e) {
                        console.warn("Stop error:", e);
                    }
                    onScan(decodedText);
                },

                (errorMessage) => {
                    // ignore per-frame errors
                }
            )
            .catch((err) => {
                onError?.(err);
            });

        return () => {
            try {
                if (html5QrCode.getState() === 2 || html5QrCode.getState() === 1) {
                    html5QrCode.stop().catch(() => { });
                }
            } catch (e) {
                console.warn("Cleanup stop error:", e);
            }
        };

    }, [onScan, onError]);

    return (
        <div className="p-2">
            <div id={qrcodeRegionId} ref={divRef} />
            <div className="mt-2 text-sm text-slate-500">Point camera at Aadhaar QR</div>
        </div>
    );
}
