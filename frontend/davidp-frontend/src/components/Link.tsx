import { Link as RouterLink, useLocation } from "react-router-dom";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = {
  to?:string;
  href?:string;
  hash?:string;
  children?:ReactNode;
  forceOut?:boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export default function Link({ to, href, hash, children, forceOut, ...props }:Props) {
  const url = to || href;

  if(url == undefined)return <span>{children}</span>;

  var isExternal = url.startsWith('http://') || url.startsWith('https://');

  if (forceOut || isExternal) {

    return (
      <a
        href={hash? (url+`#${hash}`) : (url)}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  const location = useLocation();

  return (
    <RouterLink
      to={{
        pathname:url,
        search: "?from="+location.pathname,
        hash:hash
      }}
      {...props}
    >
      {children}
    </RouterLink>
  );
}