
install
```bash
npm install
```

not necessarily needed but in case the app doesn't run straight from git clone:
- run david's version of the emscripten demo script and copy the wasm output to the public folder:
  ```bash
  cd ~/emscripten_demo/
  rm -rf wasm && cat code.cc | docker run -i $(docker build -q .) | tar xf -
  cd ~/wasm-app/
  rm public/wasm/demo.*
  cp ~/emscripten_demo/wasm/demo.* public/wasm/
  ```

run locally:
```bash
npm run dev
```