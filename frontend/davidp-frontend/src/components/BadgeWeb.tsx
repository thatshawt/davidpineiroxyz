import BadgeStyles from './badge.module.css';
import Link from './Link';

type BadgeProps = {
    url:string;
    image:string;
    // className?:string;
  };

export default function Badge({url, image}:BadgeProps){
// if(className){
//   return (<>
//     <Link href={url} className={className}><img className={BadgeStyles.webBadge} loading='lazy' src={image} alt='' /></Link>
//   </>)
// }else{
    return (<>
    <Link href={url} className={BadgeStyles.removeLinkAfter}><img className={BadgeStyles.webBadge} loading='lazy' src={image} alt='' /></Link>
    </>)
// }
}