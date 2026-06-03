import type { ReactNode } from "react";
import Link from "./Link";

type Props = {
    href?:string;
    urlText:string;
    children:ReactNode;
};
export default function InnerBoxLinkDesc({href,urlText,children}:Props){
    if(!href){
        return (
            <div className="inner-box">
                <span>{urlText}</span>
                <div>{children}</div>
            </div>
        );
    }else{
        return (
            <div className="inner-box">
                <Link href={href}>{urlText}</Link>
                <div>{children}</div>
            </div>
        );
    }
}