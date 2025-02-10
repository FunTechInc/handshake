Promise-based postMessage iframe communication library.
0 dependencies, Lightweight.

```bash
$ npm i @funtech-inc/handshake --D
```

```html
// CDN
<script src="https://unpkg.com/@funtech-inc/handshake@latest">
```

## Example

**parent**

```javascript
new Handshake.Parent({
   container: "container",
   url: "http://example.com/child",
}).ready(({ on, emit, container, iframe }) => {
   console.log(container); // HTMLElement
   console.log(iframe); // HTMLIFrameElement
   emit("parentToChild", "hello child");
   on("childToParent", (data) => {
      console.log(data);
   }); // Log... "hello parent"
});
```

**child**

```javascript
new Handshake.Child().ready(({ on, emit }) => {
   emit("childToParent", "hello parent");
   on("parentToChild", (data) => {
      console.log(data);
   }); // Log... "hello child"
});
```

### License

MIT
