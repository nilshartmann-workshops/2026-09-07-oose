import "./globals.css";
import "@/lib/setup-dayjs";

import type { Metadata } from "next";
import Counter from "@/components/Counter";

export const metadata: Metadata = {
  title: "Plant Manager",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={"de"}>
      {/* Browser-Erweiterungen hängen Attribute an das body-Element, bevor
          React hydriert. Ohne diese Angabe steht deswegen eine Abweichung auf
          der Konsole, die niemand beheben kann. */}
      <body suppressHydrationWarning>
        <div className={"AppContainer"}>
          <div className={"flex gap-y-2 flex-col"}>
            <h1>Unser Plant Manager !</h1>
            <Counter />
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
