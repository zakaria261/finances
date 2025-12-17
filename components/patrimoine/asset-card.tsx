// components/patrimoine/asset-card.tsx (NEW FILE)
import type { Asset } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Home, PiggyBank, Package } from "lucide-react";
import { Badge } from "../ui/badge";

const assetIcons: { [key: string]: React.ReactNode } = {
  SAVINGS: <PiggyBank className="h-6 w-6 text-primary" />,
  REAL_ESTATE: <Home className="h-6 w-6 text-primary" />,
  OTHER: <Package className="h-6 w-6 text-primary" />,
};

const assetTypeMap: { [key: string]: string } = {
    SAVINGS: "Savings",
    REAL_ESTATE: "Real Estate",
    OTHER: "Other"
}

export function AssetCard({ asset }: { asset: Asset }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            {assetIcons[asset.type] || assetIcons.OTHER}
          </div>
          <div>
            <CardTitle>{asset.name}</CardTitle>
            <CardDescription>
                <Badge variant="outline" className="mt-1">{assetTypeMap[asset.type]}</Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{formatCurrency(asset.value)}</p>
        <p className="text-xs text-muted-foreground">Current Value</p>
      </CardContent>
    </Card>
  );
}