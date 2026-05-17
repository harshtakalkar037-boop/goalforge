"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCSV } from "@/lib/utils";
export function ExportButton({ data, filename, disabled }: { data:Record<string,unknown>[]; filename:string; disabled?:boolean }) {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => { setLoading(true); try { downloadCSV(data, filename); } finally { setLoading(false); } };
  return (<Button variant="outline" onClick={handleExport} disabled={disabled||loading||data.length===0}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Export CSV</Button>);
}