import InnerBoxLinkDesc from "../components/InnerBoxLinkDesc";
import { Page } from "../components/Page";

export default function ReadingsPage(){
return (
<Page title="Readings">
	<h1>Readings</h1>
	<p>I pass these glorious readings on to you now.</p>
	<ul>
		<li>
			<InnerBoxLinkDesc href="/fun/natethesnake" urlText="&quot;Nate The Snake&quot;">
				<>This is a long read, like 1-2 hours. Great story and hilarious ending I highly recommend.</>
			</InnerBoxLinkDesc>
		</li>

		<li>
			<InnerBoxLinkDesc href="/fun/backyardcarnival" urlText="&quot;Backyard Carnival of Death&quot;">
				<>A classic. Like 5-10 minutes read.</>
			</InnerBoxLinkDesc>
		</li>
		<li>
			<InnerBoxLinkDesc href="/fun/regex_parse_html" urlText="&quot;RegEx match open tags except XHTML self-contained tags&quot;">
				<>Quick read. You dare not parse HTML with regex...</>
			</InnerBoxLinkDesc>
		</li>
		<li>
			<InnerBoxLinkDesc href="/fun/python_dictionaries" urlText="&quot;Dictionary in Python&quot;">
				<><code className="inline">citizens</code>, <code className="inline">turds</code>, and <code className="inline">virgins</code>.</>
			</InnerBoxLinkDesc>
		</li>
		<li>
			<InnerBoxLinkDesc href="https://www.icd10data.com/ICD10CM/Codes/V00-Y99/W50-W64/W59-/W59.22" urlText="&quot;Struck by turtle&quot;">
				<>Rest assured. If you are ever struck by a turtle, there is a code for that.</>
			</InnerBoxLinkDesc>
		</li>
	</ul>
</Page>
)}