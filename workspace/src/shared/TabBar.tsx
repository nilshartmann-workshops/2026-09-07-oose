import {
  Activity,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

/**
 * Eine Tab-Navigation aus drei Bausteinen: `TabBar` ist der Rahmen, `Tab` ein
 * Reiter zum Anklicken und `Panel` der Inhalt dahinter. Angezeigt wird nur das
 * Panel des aktiven Reiters, ein Klick macht einen Reiter aktiv, und der Button
 * des aktiven Reiters ist `disabled`.
 *
 * Welcher Reiter aktiv ist, weiß die `TabBar` selbst und legt es in einen
 * Context. `Tab` und `Panel` lesen es von dort, und der Aufrufer gibt jedem nur
 * noch seine `tabId`:
 *
 *   <TabBar>
 *     <Tab tabId="list">Pflanzen</Tab>
 *     <Panel tabId="list">
 *       <PlantList />
 *     </Panel>
 *   </TabBar>
 */

type TabBarContextValue = {
  activeTabId: string;
  onTabChange: (tabId: string) => void;
};

const TabBarContext = createContext<TabBarContextValue | null>(null);

function useTabBarContext() {
  const context = useContext(TabBarContext);

  if (context === null) {
    throw new Error("Tab and Panel must be used inside a TabBar");
  }

  return context;
}

type TabBarProps = {
  /** Enthält die Tabs und Panels dieser TabBar */
  children: ReactNode;
};

/**
 * Äußerer Rahmen der Tab-Navigation. Hält den aktiven Reiter und stellt ihn
 * seinen Kindern über den Context bereit.
 */
export function TabBar({ children }: TabBarProps) {
  const [activeTabId, setActiveTabId] = useState("list");

  // 🔎 Erzählen: seit React 19 ist der Context selbst der Provider. Die alte
  //    Form <TabBarContext.Provider> gibt es weiterhin.
  return (
    <TabBarContext value={{ activeTabId, onTabChange: setActiveTabId }}>
      <div className={"TabBar"}>{children}</div>
    </TabBarContext>
  );
}

type TabProps = {
  /** Verbindet diesen Reiter mit dem `Panel`, das dieselbe `tabId` hat */
  tabId: string;
  /** Die Beschriftung des Buttons */
  children: ReactNode;
};

/**
 * Ein einzelner Reiter in der Navigationsleiste. Er ist deaktiviert, solange er
 * der aktive ist, und meldet beim Klick seine `tabId` an den Context.
 */
export function Tab({ tabId, children }: TabProps) {
  const { activeTabId, onTabChange } = useTabBarContext();

  const isActive = activeTabId === tabId;

  return (
    <button
      className={"Tab"}
      disabled={isActive}
      onClick={() => onTabChange(tabId)}
    >
      {children}
    </button>
  );
}

type PanelProps = {
  /** Verbindet diesen Inhalt mit dem `Tab`, der dieselbe `tabId` hat */
  tabId: string;
  /** Der Inhalt, der hinter diesem Reiter steht */
  children: ReactNode;
};

/**
 * Der Inhalt hinter einem Reiter. Ist ein anderer Reiter aktiv, rendert das
 * Panel nichts, und sein Inhalt wird dabei abgebaut.
 */
export function Panel({ tabId, children }: PanelProps) {
  const { activeTabId } = useTabBarContext();

  // 🔎 Erzählen: mode="hidden" statt return null. Der Inhalt bleibt im Baum,
  //    deshalb überlebt der Formularzustand den Reiterwechsel.
  // 🔎 Zeigen: die Zähler auf der Render-Spielwiese laufen jetzt weiter, statt
  //    beim Reiterwechsel neu zu beginnen, und sie stehen schon auf 1, bevor
  //    der Reiter das erste Mal offen war. Ein verstecktes Panel rendert React
  //    trotzdem, es lässt nur seine Effekte aus.
  return (
    <Activity mode={activeTabId === tabId ? "visible" : "hidden"}>
      <div className={"TabPanel"}>{children}</div>
    </Activity>
  );
}
