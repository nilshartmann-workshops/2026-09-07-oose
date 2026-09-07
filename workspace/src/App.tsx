import { useState } from "react";

import PlantForm from "./plant-form/PlantForm.tsx";
import PlantList from "./plant-list/PlantList.tsx";
import { Panel, Tab, TabBar } from "./shared/TabBar.tsx";
import RenderSpielwiese from "./spielwiese/RenderSpielwiese.tsx";
import Counter from "./spielwiese/Counter.tsx";
import WateringNotifications from "./spielwiese/WateringNotifications.tsx";

export default function App() {
  const [activeTabId, setActiveTabId] = useState("list");

  return (
    <div className={"AppContainer"}>
      <TabBar>
        <Tab
          tabId={"meldungen"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Effekt Event
        </Tab>
        <Tab
          tabId={"effekt"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Effekt Beispiel
        </Tab>

        <Tab
          tabId={"render"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Render Beispiel
        </Tab>

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

        <Panel tabId={"effekt"} activeTabId={activeTabId}>
          <Counter />
        </Panel>
        <Panel tabId={"render"} activeTabId={activeTabId}>
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"list"} activeTabId={activeTabId}>
          <PlantList />
        </Panel>
        <Panel tabId={"form"} activeTabId={activeTabId}>
          <PlantForm />
        </Panel>
        <Panel tabId={"meldungen"} activeTabId={activeTabId}>
          <WateringNotifications />
        </Panel>
      </TabBar>
    </div>
  );
}
