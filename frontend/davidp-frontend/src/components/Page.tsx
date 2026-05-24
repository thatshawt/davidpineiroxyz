import { type ReactNode, useEffect } from "react";

import { setupSoundsFXDynamic } from "../components/AudioSystem";

type Props = {
  title: string;
  children: ReactNode;
  extraClasses?:string;
};

export function Page({ title, children, extraClasses, ...props}: Props) {

    useEffect(() => {
        window.scrollTo(0,0);
        // window.document.querySelector("#root div.section").scrollIntoView();

        setupSoundsFXDynamic();

        document.querySelector("head title").textContent = `DavidP | ${title}`;
    }, []);

    return (
        <div className={`section ${extraClasses || ""}`} {...props}>
            {children}
        </div>
    );
}
