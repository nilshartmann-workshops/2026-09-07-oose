import { useState } from "react";

import PlantForm from "./plant-form/PlantForm.tsx";
import PlantList from "./plant-list/PlantList.tsx";
import { Panel, Tab, TabBar } from "./shared/TabBar.tsx";
import RenderSpielwiese from "./spielwiese/RenderSpielwiese.tsx";
import Counter from "./spielwiese/Counter.tsx";
import WateringNotifications from "./spielwiese/WateringNotifications.tsx";
import BeetSpielwiese from "./spielwiese/BeetSpielwiese.tsx";


export default function App() {

  return (
    <div className={"AppContainer"}>
      <TabBar initialTabId={"list"}>
        <Tab tabId={"meldungen"}>Effekt Event</Tab>
        <Tab tabId={"effekt"}>Effekt Beispiel</Tab>

        <Tab tabId={"render"}>Render Beispiel</Tab>

        <Tab tabId={"list"}>Pflanzen</Tab>
        <Tab tabId={"form"}>Neue Pflanze</Tab>

        {/*<Panel tabId={"beet"} activeTabId={activeTabId}>*/}
        {/*  <BeetSpielwiese />*/}
        {/*</Panel>*/}
        <Panel tabId={"effekt"}>
          <Counter />
        </Panel>
        <Panel tabId={"render"}>
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"list"}>
          <PlantList />
        </Panel>
        <Panel tabId={"form"}>
          <PlantForm />
        </Panel>
        <Panel tabId={"meldungen"}>
          <WateringNotifications />
        </Panel>
      </TabBar>
    </div>
  );
}
