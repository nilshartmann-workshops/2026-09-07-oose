import PlantForm from "./plant-form/PlantForm.tsx";
import PlantList from "./plant-list/PlantList.tsx";
import { Panel, Tab, TabBar } from "./shared/TabBar.tsx";
import BeetSpielwiese from "./spielwiese/BeetSpielwiese.tsx";
import EffektSpielwiese from "./spielwiese/EffektSpielwiese.tsx";
import RenderSpielwiese from "./spielwiese/RenderSpielwiese.tsx";
import WateringNotifications from "./spielwiese/WateringNotifications.tsx";

export default function App() {
  return (
    <div className={"AppContainer"}>
      <TabBar>
        <Tab tabId={"list"}>Pflanzen</Tab>
        <Tab tabId={"form"}>Neue Pflanze</Tab>
        <Tab tabId={"render"}>Rendern (Spielwiese)</Tab>
        <Tab tabId={"effekte"}>Effekte (Spielwiese)</Tab>
        <Tab tabId={"meldungen"}>Effekt Event (Spielwiese)</Tab>
        <Tab tabId={"beet"}>Compiler (Spielwiese)</Tab>

        <Panel tabId={"list"}>
          <PlantList />
        </Panel>
        <Panel tabId={"form"}>
          <PlantForm />
        </Panel>
        <Panel tabId={"render"}>
          <RenderSpielwiese />
        </Panel>
        <Panel tabId={"effekte"}>
          <EffektSpielwiese />
        </Panel>
        <Panel tabId={"meldungen"}>
          <WateringNotifications />
        </Panel>
        <Panel tabId={"beet"}>
          <BeetSpielwiese />
        </Panel>
      </TabBar>
    </div>
  );
}
