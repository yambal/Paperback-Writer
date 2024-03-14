export const vscodeMarkdownStyle = ` 

 /* Reset margin top for elements */
 h1, h2, h3, h4, h5, h6,
 p, ol, ul, pre {
   margin-top: 0;
 }
 
 h1, h2, h3, h4, h5, h6 {
   font-weight: 600;
   margin-bottom: 16px;
   line-height: 1.25;
 }
 
 #code-csp-warning {
   position: fixed;
   top: 0;
   right: 0;
   color: white;
   margin: 16px;
   text-align: center;
   font-size: 12px;
   font-family: sans-serif;
   background-color:#444444;
   cursor: pointer;
   padding: 6px;
   box-shadow: 1px 1px 1px rgba(0,0,0,.25);
 }
 
 #code-csp-warning:hover {
   text-decoration: none;
   background-color:#007acc;
   box-shadow: 2px 2px 2px rgba(0,0,0,.25);
 }
 
 body.scrollBeyondLastLine {
   margin-bottom: calc(100vh - 22px);
 }
 
 body.showEditorSelection .code-line {
   position: relative;
 }
 
 body.showEditorSelection :not(tr,ul,ol).code-active-line:before,
 body.showEditorSelection :not(tr,ul,ol).code-line:hover:before {
   content: "";
   display: block;
   position: absolute;
   top: 0;
   left: -12px;
   height: 100%;
 }
 
 .vscode-high-contrast.showEditorSelection  :not(tr,ul,ol).code-line .code-line:hover:before {
   border-left: none;
 }
 
 body.showEditorSelection li.code-active-line:before,
 body.showEditorSelection li.code-line:hover:before {
   left: -30px;
 }
 
 .vscode-light.showEditorSelection .code-active-line:before {
   border-left: 3px solid rgba(0, 0, 0, 0.15);
 }
 
 .vscode-light.showEditorSelection .code-line:hover:before {
   border-left: 3px solid rgba(0, 0, 0, 0.40);
 }
 
 .vscode-dark.showEditorSelection .code-active-line:before {
   border-left: 3px solid rgba(255, 255, 255, 0.4);
 }
 
 .vscode-dark.showEditorSelection .code-line:hover:before {
   border-left: 3px solid rgba(255, 255, 255, 0.60);
 }
 
 .vscode-high-contrast.showEditorSelection .code-active-line:before {
   border-left: 3px solid rgba(255, 160, 0, 0.7);
 }
 
 .vscode-high-contrast.showEditorSelection .code-line:hover:before {
   border-left: 3px solid rgba(255, 160, 0, 1);
 }
 
 sub,
 sup {
   line-height: 0;
 }
 
 ul ul:first-child,
 ul ol:first-child,
 ol ul:first-child,
 ol ol:first-child {
   margin-bottom: 0;
 }
 
 img, video {
   max-width: 100%;
   max-height: 100%;
 }
 
 a {
   text-decoration: none;
 }
 
 a:hover {
   text-decoration: underline;
 }
 
 a:focus,
 input:focus,
 select:focus,
 textarea:focus {
   outline: 1px solid -webkit-focus-ring-color;
   outline-offset: -1px;
 }
 
 p {
   margin-bottom: 16px;
 }
 
 li p {
   margin-bottom: 0.7em;
 }
 
 ul,
 ol {
   margin-bottom: 0.7em;
 }
 
 hr {
   border: 0;
   height: 1px;
   border-bottom: 1px solid;
 }

 table {
   border-collapse: collapse;
   margin-bottom: 0.7em;
 }
 
 th {
   text-align: left;
   border-bottom: 1px solid;
 }
 
 th,
 td {
   padding: 5px 10px;
 }
 
 table > tbody > tr + tr > td {
   border-top: 1px solid;
 }
 
 blockquote {
   margin: 0;
   padding: 2px 16px 0 10px;
   border-left-width: 5px;
   border-left-style: solid;
   border-radius: 2px;
 }
 
 code {
   font-family: var(--vscode-editor-font-family, "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace);
   font-size: 1em;
   line-height: 1.357em;
 }
 
 body.wordWrap pre {
   white-space: pre-wrap;
 }
 `