import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type Props = {
  shipmentId: string;
};

export function ShipmentPdfButton({ shipmentId }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      const res = await fetch(`/api/v1/shipments/${shipmentId}/pdf`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al descargar");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `remision-${shipmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      /* download failed silently */
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button variant="ghost" onClick={download} disabled={downloading}>
      <MaterialIcon name={downloading ? "hourglass_top" : "picture_as_pdf"} className="text-sm" />
    </Button>
  );
}
