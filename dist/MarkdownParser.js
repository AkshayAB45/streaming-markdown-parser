"use strict";
// =======================
// Streaming Markdown Demo
// =======================
const blogpostMarkdown = `
Here is some inline code: \`print("hello world")\`

And here is a code block:

\`\`\`
function hello() {
  console.log("Hello World");
}
\`\`\`

Streaming markdown is cool!
`;
let currentContainer = null;
/* -------------------------------------------------
   DO NOT EDIT: Simulates streaming tokens
-------------------------------------------------- */
function runStream() {
    currentContainer = document.getElementById("markdownContainer");
    currentContainer.innerHTML = "";
    const tokens = [];
    let remaining = blogpostMarkdown;
    while (remaining.length > 0) {
        const len = Math.floor(Math.random() * 18) + 2;
        tokens.push(remaining.slice(0, len));
        remaining = remaining.slice(len);
    }
    const interval = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(interval);
        }
    }, 20);
}
// Expose to browser
window.runStream = runStream;
/* -------------------------------------------------
   STREAMING PARSER (THIS IS THE TASK)
-------------------------------------------------- */
var State;
(function (State) {
    State[State["NORMAL"] = 0] = "NORMAL";
    State[State["INLINE_CODE"] = 1] = "INLINE_CODE";
    State[State["CODE_BLOCK"] = 2] = "CODE_BLOCK";
})(State || (State = {}));
let state = State.NORMAL;
let backtickCount = 0;
let activeNode = null;
function addToken(token) {
    if (!currentContainer)
        return;
    for (let i = 0; i < token.length; i++) {
        const ch = token[i];
        // Collect backticks (can span tokens)
        if (ch === "`") {
            backtickCount++;
            continue;
        }
        // Process buffered backticks
        if (backtickCount > 0) {
            if (backtickCount >= 3) {
                // Toggle CODE BLOCK
                if (state === State.CODE_BLOCK) {
                    state = State.NORMAL;
                    activeNode = null;
                }
                else {
                    state = State.CODE_BLOCK;
                    activeNode = document.createElement("pre");
                    activeNode.style.background = "#1e1e1e";
                    activeNode.style.color = "#dcdcdc";
                    activeNode.style.padding = "8px";
                    currentContainer.appendChild(activeNode);
                }
            }
            else {
                // Toggle INLINE CODE
                if (state === State.INLINE_CODE) {
                    state = State.NORMAL;
                    activeNode = null;
                }
                else {
                    state = State.INLINE_CODE;
                    activeNode = document.createElement("code");
                    activeNode.style.background = "#eee";
                    activeNode.style.padding = "2px 4px";
                    activeNode.style.borderRadius = "4px";
                    currentContainer.appendChild(activeNode);
                }
            }
            backtickCount = 0;
            i--; // 🔥 IMPORTANT: reprocess current character
            continue;
        }
        // Append text according to state
        if (state === State.CODE_BLOCK || state === State.INLINE_CODE) {
            activeNode.textContent += ch;
        }
        else {
            currentContainer.appendChild(document.createTextNode(ch));
        }
    }
}
//# sourceMappingURL=MarkdownParser.js.map