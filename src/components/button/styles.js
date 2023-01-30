export default `.btn {
  background: none;
  outline: 0;
  border: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  -webkit-user-select: none;
  user-select: none;
  cursor: unset;
}

:host {
  position: relative;
  display: inline-flex;
  padding: 0.55rem 0.95rem;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 1.5;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  letter-spacing: 0.025em;
  border-width: 0.0625rem;
  border-style: solid;
  border-radius: 0.55rem;
  border-color: #fafbfe;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 6px #b8b9be, -3px -3px 6px #ffffff;
}

:host(:hover) {
  color: #44476a;
  text-decoration: none;
}

:host(.focus),
:host(:focus) {
  outline: 0;
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host(.disabled),
:host(:disabled) {
  opacity: 0.65;
  box-shadow: none;
}

:host(:not(:disabled):not(.disabled).active),
:host(:not(:disabled):not(.disabled):active) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host(not(:disabled):not(.disabled).active:focus),
:host(not(:disabled):not(.disabled):active:focus) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

a.btn.disabled,
fieldset:disabled a.btn {
  pointer-events: none;
}

:host([type='dark']) {
  color: #ecf0f3;
  background-color: #31344b;
}

:host([type='dark'].hover),
:host([type='dark']:hover) {
  color: #ecf0f3;
  background-color: #31344b;
  border-color: #31344b;
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='dark'].focus),
:host([type='dark']:focus) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='dark'].disabled),
:host([type='dark']:disabled) {
  color: #ecf0f3;
  background-color: #31344b;
  border-color: #31344b;
}

:host([type='dark']:not(:disabled):not(.disabled).active),
:host([type='dark']:not(:disabled):not(.disabled):active) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='dark']:not(:disabled):not(.disabled).active:focus),
:host([type='dark']:not(:disabled):not(.disabled):active:focus) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='primary']) {
  color: #31344b;
  background-color: #e6e7ee;
}

:host([type='primary'].hover),
:host([type='primary']:hover) {
  color: #31344b;
  background-color: #e6e7ee;
  border-color: #e6e7ee;
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='primary'].focus),
:host([type='primary']:focus) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='primary'].disabled),
:host([type='primary']:disabled) {
  color: #31344b;
  background-color: #e6e7ee;
  border-color: #e6e7ee;
}

:host([type='primary']:not(:disabled):not(.disabled).active),
:host([type='primary']:not(:disabled):not(.disabled):active) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}

:host([type='primary']:not(:disabled):not(.disabled).active:focus),
:host([type='primary']:not(:disabled):not(.disabled):active:focus) {
  box-shadow: inset 2px 2px 5px #b8b9be, inset -3px -3px 7px #ffffff;
}
`
