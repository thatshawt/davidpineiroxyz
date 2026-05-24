import InnerBoxLinkDesc from "../components/InnerBoxLinkDesc"
import Link from "../components/Link"
// import { Link } from "react-router-dom"
import { Page } from "../components/Page"

export default function ProjectsPage(){
	return (
	<Page title="Projects">
		<h1>Projects</h1>

		<h2>Code-Focused Projects</h2>

		<p>These projects focus more on coding and programming rather than being deployed on the web.</p>

		<ul>
			<li><InnerBoxLinkDesc href="https://github.com/thatshawt/sarra" urlText="Sarra"><span>I created a <i>Python</i>-based modding system for the browser game <Link href='https://arras.io'>arras.io</Link> that injects <i>C</i>-to-<i>WASM</i> modifications into the game and replaces the original code through <Link to='https://www.mitmproxy.org'>mitmproxy</Link>.</span></InnerBoxLinkDesc>
			</li>
			<li>
				<InnerBoxLinkDesc href="https://github.com/thatshawt/ait-david/tree/main/turing2" urlText="ait-david/turing2"><span>This project was a multi-file <i>C</i> implementation of <Link to="https://arxiv.org/abs/1101.4795">Hector Zenil's CTM Method</Link> that used <i>Makefile</i>s, <i>SQLite3</i>, <i>GNU's GMP</i>, <i>GNU's MPFR</i>, and <i>Nix</i> to compute and store results in an SQLite database.</span></InnerBoxLinkDesc>
			</li>
		</ul>

		<h2>Web Projects</h2>

		<p>These projects are about web things like backend development, REST endpoints, and frontend refractoring. All of them have been deployed onto my cloud VPS with SystemD services, Nginx reverse proxies, custom subdomains, and NixOS configurations.</p>

		<ul>
			<li>
				<InnerBoxLinkDesc href="/projects/davidpineiroxyz" urlText="DavidPineiro.xyz Website"><span>This is a website built with a <i>Lua</i>-based <Link to="https://github.com/pkulchenko/fullmoon">Fullmoon</Link> framework using <i>HTML</i> and <i>CSS</i> that automatically checks GitHub for updates every minute and deploys changes when detected.</span></InnerBoxLinkDesc>
			</li>
			<li>
				<InnerBoxLinkDesc href="/projects/backendproject1" urlText="Excursion Checkout Website Backend"><span>I developed a <i>Spring Boot</i> backend for an <i>AngularJS</i> frontend. I host the frontend, backend, and <i>MariaDB</i> database.</span></InnerBoxLinkDesc>
			</li>
			<li>
				<InnerBoxLinkDesc href="/projects/storeproject1" urlText="Shop Website Modification"><span>Modified a <i>Spring Boot</i> website to add various functionality such as a "buy now" button, new fields to a form, server-side validation for the fields, unit tests, and an about page.</span></InnerBoxLinkDesc>
			</li>
		</ul>

		<h2>Machine Learning Projects</h2>

		<p>These projects are focused on machine learning things such as developing models, performing analysis on data, and evaluating model performance.</p>

		<ul>
			<li>
				<InnerBoxLinkDesc href="/projects/weatherai1" urlText="Weather Health Risk Numerical Regression">
					<span>Developed and trained an <Link to="https://xgboosting.com/about/">XGBoost</Link> model to predict the health risk of weather conditions. A very simple frontend and backend was developed to prove it works. Evaluated performance using <i>RMSE</i> and <i>MAPE</i>.</span>
				</InnerBoxLinkDesc>
			</li>
			<li>
				<InnerBoxLinkDesc href="/projects/studentpassfail" urlText="Student Pass/Fail Classifier">
					<span>Developed and trained an <Link to="https://xgboosting.com/about/">XGBoost</Link> model to predict if a student will pass or fail a class. A very simple frontend and backend was developed to prove it works. Evaluated performance using <i>AUC-ROC</i> and <i>F1 score</i>.</span>
				</InnerBoxLinkDesc>
			</li>
		</ul>
	</Page>)
}