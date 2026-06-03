import Link from "../../components/Link";
import { Page } from "../../components/Page";

import ProjectStyles from '../Projects.module.css'

export default function DavidPineiroxyzPage(){
	return (
<Page title="DavidPineiro.xyz Website">
	<h1>DavidPineiro.xyz Website</h1>

	<p>tags: <i>Linux, NixOS, SystemD, Subdomain, Cloudflare, DNS, SSL, Nginx, Github, Continuous Deployment, Single Page Application, React, Typescript, JSX, HTML/CSS, SQLite</i></p>

	<h2>Project Links</h2>
	<ul>
		<li><Link href="https://davidpineiro.xyz">Live Deployment</Link></li>
		<li><Link href="https://github.com/thatshawt/davidpineiroxyz">Github Source Code</Link></li>
	</ul>

	<h2>Screenshot</h2>
	<img className={ProjectStyles.projectPhoto} src="/static/media/projects/davidpineiroxyz_thumb.png"/>

	<h2>Summary</h2>
	<p>
		This project showcases the design and deployment of my personal website, hosted on a cloud-based server with a fully automated continuous deployment pipeline. Any changes pushed to GitHub are automatically built and deployed within approximately one minute, ensuring the site remains up to date with minimal manual intervention.
	</p>


	<p>The infrastructure is built on NixOS, where each project is deployed as its own systemd service. When adding a new project, a corresponding subdomain is configured through Cloudflare, and a new service is defined on the server to host it.</p>

	<p>
Nginx is used as a reverse proxy to route incoming traffic to the appropriate service based on subdomain, enabling clean separation between projects while maintaining a unified domain structure. SSL is handled using Cloudflare-issued certificates, with Nginx configured to terminate HTTPS connections and securely proxy traffic to internal services.
	</p>
	
	<p>The website itself is built using <Link href="https://redbean.dev">RedBean</Link>, a single-file web server and framework. This approach was chosen for its simplicity, portability, and ease of deployment, allowing the entire application to be managed and served with minimal overhead.</p>
</Page>)}
