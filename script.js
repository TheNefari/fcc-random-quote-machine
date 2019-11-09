class RQMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      author: "" };

    this.newContent = this.newContent.bind(this);
    this.refresh = this.refresh.bind(this);
  }
  async newContent() {
    $("#text").fadeTo(500, 0);
    $("#author").fadeTo(500, 0);

    let url =
    "https://en.wikiquote.org/w/api.php?action=query&format=json&prop=revisions&continue=grncontinue%7C%7C&prop=categories&clcategories=people&generator=random&rvprop=content&grnnamespace=0&origin=*";
    let idCall =
    "https://en.wikiquote.org/w/api.php?action=parse&format=json&origin=*&pageid=";
    let qA;
    let refresh = this.refresh;
    while (Boolean(qA) == false) {
      await $.getJSON(url, async function (data) {
        let keys = Object.keys(data["query"]["pages"]);
        let pageId = data["query"]["pages"][keys]["pageid"];
        let page = idCall + pageId;

        await $.getJSON(page, async function (data) {
          let parsedText = data["parse"]["text"]["*"];
          let firstUl = parsedText.slice(parsedText.search('id="Quotes"'));
          firstUl = firstUl.slice(firstUl.search("<li>"));
          firstUl = firstUl.slice(0, firstUl.search("<ul>"));

          const parseHTMLString = (() => {
            const parser = new DOMParser();
            return str => parser.parseFromString(str, "text/html");
          })();

          let turnedHTML = parseHTMLString(firstUl);
          let quote = turnedHTML.getElementsByTagName("LI")[0].textContent;
          let parsedAuthor = data["parse"]["title"];

          qA = [quote, parsedAuthor];
        });
      });
    }
    refresh(qA);
  }
  refresh(qA) {
    this.setState({
      text: qA[0],
      author: qA[1] });

    let color = Math.floor(Math.random() * 255) + 1;
    $("#RQMachine").css("background-color", "hsl(" + color + ", 60%, 50%)");
    $("#quote-box").css("color", "hsl(" + color + ", 60%, 50%)");
    $("#new-quote").css("background-color", "hsl(" + color + ", 60%, 50%)");
    $("#tweet-quote").css("background-color", "hsl(" + color + ", 60%, 50%)");
    $("#text").fadeTo(500, 1);
    $("#author").fadeTo(500, 1);
  }
  componentDidMount() {
    this.newContent();
  }
  render() {
    return (
      React.createElement("div", { id: "RQMachine" },
      React.createElement("div", { id: "quote-box" },
      React.createElement("p", { id: "text" }, this.state.text),
      React.createElement("p", { id: "author" }, "- ", this.state.author),
      React.createElement("div", { id: "button-holder" },
      React.createElement("a", { id: "tweet-quote", className: "fa fa-twitter", href: "twitter.com/intent/tweet?text=" + this.state.text + " " + this.state.author, target: "_blank" }),

      React.createElement("button", { id: "new-quote", onClick: this.newContent }, "New Quote"))),




      React.createElement("p", { id: "creator" }, "by Robert M\xFCller")));


  }}

ReactDOM.render(React.createElement(RQMachine, null), document.getElementById("App"));