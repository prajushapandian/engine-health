import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEngineIds, getAvailableDatasets } from "@/lib/engineData";
import { Search, Database } from "lucide-react";

interface InputPanelProps {
  onSubmitEngine: (engineId: string, cycle?: number) => void;
  onSubmitDataset: (dataset: string) => void;
}

const InputPanel = ({ onSubmitEngine, onSubmitDataset }: InputPanelProps) => {
  const [engineId, setEngineId] = useState("");
  const [cycle, setCycle] = useState("");
  const [dataset, setDataset] = useState("");

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Input Parameters
      </h2>
      <Tabs defaultValue="engine" className="w-full">
        <TabsList className="mb-4 w-full bg-muted">
          <TabsTrigger value="engine" className="flex-1 gap-2 font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Search className="h-3.5 w-3.5" />
            Engine Query
          </TabsTrigger>
          <TabsTrigger value="dataset" className="flex-1 gap-2 font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Database className="h-3.5 w-3.5" />
            Dataset
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engine" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="engineId" className="text-xs uppercase tracking-wider text-muted-foreground">
              Engine ID
            </Label>
            <Select value={engineId} onValueChange={setEngineId}>
              <SelectTrigger className="font-mono bg-muted border-border">
                <SelectValue placeholder="Select engine..." />
              </SelectTrigger>
              <SelectContent>
                {getEngineIds().map((id) => (
                  <SelectItem key={id} value={id} className="font-mono">
                    {id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycle" className="text-xs uppercase tracking-wider text-muted-foreground">
              Cycle Number <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Input
              id="cycle"
              type="number"
              placeholder="e.g. 150"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className="font-mono bg-muted border-border"
            />
          </div>

          <Button
            onClick={() => onSubmitEngine(engineId, cycle ? parseInt(cycle) : undefined)}
            disabled={!engineId}
            className="w-full font-mono text-xs uppercase tracking-widest"
          >
            Analyze Engine
          </Button>
        </TabsContent>

        <TabsContent value="dataset" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Select Dataset
            </Label>
            <Select value={dataset} onValueChange={setDataset}>
              <SelectTrigger className="font-mono bg-muted border-border">
                <SelectValue placeholder="Select dataset..." />
              </SelectTrigger>
              <SelectContent>
                {getAvailableDatasets().map((ds) => (
                  <SelectItem key={ds} value={ds} className="font-mono">
                    {ds} — C-MAPSS
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => onSubmitDataset(dataset)}
            disabled={!dataset}
            className="w-full font-mono text-xs uppercase tracking-widest"
          >
            Load Dataset
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InputPanel;
