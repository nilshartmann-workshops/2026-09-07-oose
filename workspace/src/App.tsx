import { useState } from "react";

import PlantForm from "./plant-form/PlantForm.tsx";
import PlantList from "./plant-list/PlantList.tsx";
import { Panel, Tab, TabBar } from "./shared/TabBar.tsx";

export default function App() {
  const [activeTabId, setActiveTabId] = useState("list");

  return (
    <div className={"AppContainer"}>
      <TabBar>
        <Tab
          tabId={"list"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Pflanzen
        </Tab>
        <Tab
          tabId={"form"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Neue Pflanze
        </Tab>

        <Panel tabId={"list"} activeTabId={activeTabId}>
          <PlantList />
        </Panel>
        <Panel tabId={"form"} activeTabId={activeTabId}>
          <PlantForm />
        </Panel>
      </TabBar>
    </div>
  );
}
