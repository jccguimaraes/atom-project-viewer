var style = document.createElement("style");
style.appendChild(document.createTextNode(""));
document.head.appendChild(style);

style.sheet.insertRule('project-viewer {background-color: blue}');
atom.styles.addStyleElement(style);
