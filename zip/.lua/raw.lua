raw = {}

function raw.outLink(url, inner, unsafe)
	if unsafe == "unsafe" then
		return string.format([[<a target='_blank' rel='noopener noreferrer' href='%s'>%s</a>]], EscapeHtml(url), inner)
	else
		return string.format([[<a target='_blank' rel='noopener noreferrer' href='%s'>%s</a>]], EscapeHtml(url), EscapeHtml(inner))
	end
end

function raw.inLink(url, inner, unsafe)
	if unsafe == "unsafe" then
		return string.format([[<a href='%s'>%s</a>]], EscapeHtml(url), inner)
	else
		return string.format([[<a href='%s'>%s</a>]], EscapeHtml(url), EscapeHtml(inner))
	end
end

function raw.link(url, inner, unsafe)
	if url:sub(1,1) == "/" then
		return raw.inLink(url, inner, unsafe)
	else
		return raw.outLink(url, inner, unsafe)
	end
end

return raw