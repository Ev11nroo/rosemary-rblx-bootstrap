# a simple (cli) roblox bootstrapper for rosemary

its for MY use cases (no one elses) because it uses language meant for web

use [nutmeg](https://github.com/frolleks/nutmeg) for an easier time instead of this

not related to rosemary or roblox

# get starte d

get repository and install dependecies

```bash
git clone https://github.com/Ev11nroo/rosemary-rblx-bootstrap
cd rosemary-rblx-bootstrap
npm install
```

install [rosemary](https://github.com/microlift/rosemary) ([its release page which includes an easy-to-use AppImage](https://github.com/microlift/rosemary/releases))

copy and paste `config.example.json`, rename it to `config.json` and add replace rosemary binary + prefix paths:

```bash
cp config.example.json config.json
open config.json
```

then launch player with:

```bash
npm run player
```

or studio with:

```bash
npm run studio
```
