import { Link as RouterLink } from "react-router-dom";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = {
  to?:string;
  href?:string;
  children?:ReactNode;
  forceOut?:boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export default function Link({ to, href, children, forceOut, ...props }:Props) {
  const url = to || href;
  var isExternal = url.startsWith('http://') || url.startsWith('https://');

  if (forceOut || isExternal) {

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink to={url} {...props}>
      {children}
    </RouterLink>
  );
}