#!/usr/bin/env python3
"""Baut aus index.html, CSS und JS eine einzige HTML-Datei (zum Weitergeben oder Veröffentlichen).
Aufruf: python3 build-single.py ziel.html [--fragment]   (--fragment: ohne <html>/<head>/<body>)"""
import re, sys, pathlib
here = pathlib.Path(__file__).parent
html = (here / "index.html").read_text("utf-8")
css = (here / "css/legeartis.css").read_text("utf-8")
js = "\n".join((here / f).read_text("utf-8") for f in ("js/data.js", "js/app.js"))
font = re.search(r'<link rel="stylesheet" href="https://fonts[^>]+>', html).group(0)
body = html.split("<!--BODY-->")[1].split("<!--/BODY-->")[0]
body = re.sub(r'<script src="js/[^"]+"></script>\s*', "", body)
head = "<title>Legeartis Prototyp</title>\n" + font + "\n<style>\n" + css + "\n</style>\n"
tail = "<script>\n" + js.replace("</script", "<\\/script") + "\n</script>\n"
out = head + body + tail
if "--fragment" not in sys.argv:
    out = '<!doctype html>\n<html lang="de-CH">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' + head + "</head>\n<body>\n" + body + tail + "</body>\n</html>\n"
pathlib.Path(sys.argv[1]).write_text(out, "utf-8")
print("geschrieben:", sys.argv[1], len(out), "Zeichen")
