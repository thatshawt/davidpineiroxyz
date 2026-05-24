import type { ReactNode } from "react";
import Link from "./Link";

type Props = {
    href:string;
    urlText:string;
    children:ReactNode;
};
export default function InnerBoxLinkDesc({href,urlText,children}:Props){
    return (
    <div className="inner-box">
        <Link href={href}>{urlText}</Link>
        <div>{children}</div>
    </div>);
}