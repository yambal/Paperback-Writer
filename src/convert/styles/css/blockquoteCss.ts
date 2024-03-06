export const blockquoteCss = () => {
  return `
  blockquote {
    position: relative;
    padding: 10px 15px 10px 50px;
    box-sizing: border-box;
    font-style: italic;
    background: #efefef;
    color: #555;
  }
  
  blockquote:before{
    display: inline-block;
    position: absolute;
    top: 10px;
    left: -3px;
    content: "“";
    font-family: sans-serif;
    color: #cfcfcf;
    font-size: 90px;
    line-height: 1;
  }
  
  blockquote p {
    padding: 0;
    margin: 10px 0;
    line-height: 1.7;
  }
  
  blockquote cite {
    display: block;
    text-align: right;
    color: #888888;
    font-size: 0.9em;
  }
  `
}
