declare module "@yudiel/react-qr-scanner" {
  import * as React from "react";

  interface QrScannerProps {
    onResult?: (result: { text?: string } | null) => void;
    onError?: (error: any) => void;
    constraints?: MediaTrackConstraints;
    style?: React.CSSProperties;
  }

  const QrScanner: React.FC<QrScannerProps>;
  export default QrScanner;
}
