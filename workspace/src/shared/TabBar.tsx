import { ReactNode } from "react";

/**
 * Eine Tab-Navigation aus drei Bausteinen: `TabBar` ist der Rahmen, `Tab` ein
 * Reiter zum Anklicken und `Panel` der Inhalt dahinter. Angezeigt wird nur das
 * Panel des aktiven Reiters, ein Klick macht einen Reiter aktiv, und der Button
 * des aktiven Reiters ist `disabled`.
 *
 * Welcher Reiter aktiv ist, weiß die TabBar selbst nicht. Der Zustand liegt in
 * der Komponente, die sie benutzt, und wird jedem `Tab` und jedem `Panel`
 * einzeln als Property hereingereicht:
 *
 *   <TabBar>
 *     <Tab tabId="list" activeTabId={activeTabId} onTabChange={setActiveTabId}>
 *       Pflanzen
 *     </Tab>
 *     <Panel tabId="list" activeTabId={activeTabId}>
 *       <PlantList />
 *     </Panel>
 *   </TabBar>
 *
 * ⚠️ Diese Datei ist fertig, du musst hier nichts implementieren. Wir schauen
 *    sie uns gemeinsam an und bauen sie später mehrfach um.
 */

type TabBarProps = {
  /** Enthält die Tabs und Panels dieser TabBar */
  children: ReactNode;
};

/**
 * Äußerer Rahmen der Tab-Navigation. Rendert alle Kinder, also die `Tab`- und
 * `Panel`-Elemente.
 */
export function TabBar({ children }: TabBarProps) {
  return <div className={"TabBar"}>{children}</div>;
}

type TabProps = {
  /** Verbindet diesen Reiter mit dem `Panel`, das dieselbe `tabId` hat */
  tabId: string;
  /** Sagt, welcher Reiter gerade aktiv ist */
  activeTabId: string;
  /** Wird mit der `tabId` dieses Reiters aufgerufen, wenn man ihn anklickt */
  onTabChange: (tabId: string) => void;
  /** Die Beschriftung des Buttons */
  children: ReactNode;
};

/**
 * Ein einzelner Reiter in der Navigationsleiste. Er ist deaktiviert, solange er
 * der aktive ist, und meldet beim Klick seine `tabId` nach außen.
 */
export function Tab({ tabId, activeTabId, onTabChange, children }: TabProps) {
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
  /** Sagt, welcher Reiter gerade aktiv ist */
  activeTabId: string;
  /** Der Inhalt, der hinter diesem Reiter steht */
  children: ReactNode;
};

/**
 * Der Inhalt hinter einem Reiter. Ist ein anderer Reiter aktiv, rendert das
 * Panel nichts, und sein Inhalt wird dabei abgebaut.
 */
export function Panel({ tabId, activeTabId, children }: PanelProps) {
  if (activeTabId !== tabId) {
    return null;
  }

  return <div className={"TabPanel"}>{children}</div>;
}
