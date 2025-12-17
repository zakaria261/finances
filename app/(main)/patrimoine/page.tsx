// app/(main)/patrimoine/page.tsx (NEW FILE)
import { getAssets } from "@/lib/actions/patrimoine.actions";
import { AddAssetDialog } from "@/components/patrimoine/add-asset-dialog";
import { AssetCard } from "@/components/patrimoine/asset-card";
import { Empty } from "@/components/ui/empty";
import { Home, PiggyBank } from "lucide-react";

export default async function PatrimoinePage() {
  const assets = await getAssets();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          Patrimoine (Assets)
        </h1>
        <AddAssetDialog />
      </div>

      {assets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      ) : (
        <Empty>
          <PiggyBank className="h-12 w-12 text-muted-foreground" />
           <div className="text-center">
                <h3 className="text-lg font-semibold">No Assets Tracked</h3>
                <p className="text-muted-foreground text-sm mt-1">Add your assets to calculate your complete net worth.</p>
            </div>
        </Empty>
      )}
    </div>
  );
}