import { useState } from "react";

import PlantForm from "./plant-form/PlantForm.tsx";
import PlantList from "./plant-list/PlantList.tsx";
import { Panel, Tab, TabBar } from "./shared/TabBar.tsx";
import BeetSpielwiese from "./spielwiese/BeetSpielwiese.tsx";
import EffektSpielwiese from "./spielwiese/EffektSpielwiese.tsx";
import RenderSpielwiese from "./spielwiese/RenderSpielwiese.tsx";
import WateringNotifications from "./spielwiese/WateringNotifications.tsx";

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
        <Tab
          tabId={"render"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Rendern (Spielwiese)
        </Tab>
        <Tab
          tabId={"effekte"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Effekte (Spielwiese)
        </Tab>
        <Tab
          tabId={"meldungen"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Effekt Event (Spielwiese)
        </Tab>
        <Tab
          tabId={"beet"}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        >
          Compiler (Spielwiese)
        </Tab>

        <Panel tabId={"list"} activeTabId={activeTabId}>
          <PlantList />
        </Panel>
        <Panel tabId={"form"} activeTabId={activeTabId}>
          <PlantForm />
        </Panel>
        <Panel tabId={"render"} activeTabId={activeTabId}>
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"effekte"} activeTabId={activeTabId}>
          <EffektSpielwiese />
        </Panel>
        <Panel tabId={"meldungen"} activeTabId={activeTabId}>
          <WateringNotifications />
        </Panel>
        <Panel tabId={"beet"} activeTabId={activeTabId}>
          <BeetSpielwiese />
        </Panel>
      </TabBar>
    </div>
  );
}
