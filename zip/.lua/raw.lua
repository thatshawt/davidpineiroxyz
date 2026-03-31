raw = {}

function raw.outLink(url, inner, unsafe, attributes)
	if unsafe == "unsafe" then
		return string.format([[<a %s target='_blank' rel='noopener noreferrer' href='%s'>%s</a>]], attributes or "", EscapeHtml(url), inner)
	else
		return string.format([[<a %s target='_blank' rel='noopener noreferrer' href='%s'>%s</a>]], attributes or "", EscapeHtml(url), EscapeHtml(inner))
	end
end

function raw.inLink(url, inner, unsafe, attributes)
	if unsafe == "unsafe" then
		return string.format([[<a %s href='%s'>%s</a>]], attributes or "", EscapeHtml(url), inner)
	else
		return string.format([[<a %s href='%s'>%s</a>]], attributes or "", EscapeHtml(url), EscapeHtml(inner))
	end
end

function raw.link(url, inner, unsafe, attributes)
	if url:sub(1,1) == "/" then
		return raw.inLink(url, inner, unsafe, attributes)
	else
		return raw.outLink(url, inner, unsafe, attributes)
	end
end

return raw