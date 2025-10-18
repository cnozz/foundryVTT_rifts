# Rifts FoundryVTT System (Starter Repo)

A plug-and-play FoundryVTT system scaffold for Palladium **Rifts** with editable actor sheet.

> **Note**: This repo contains *no* Palladium IP/game text. It’s just scaffolding and UI.

## Folder layout
```
system/
  rifts/
    system.json
    template.json
    dist/rifts.js
    templates/
    styles/
    lang/
scripts/
package.json
```

## Quick start
```bash
npm run build   # copies src/rifts.js -> dist/rifts.js (if src present)
npm run pack    # zips system/rifts into release/rifts-system.zip
```

### Install in Foundry
1. Unzip/copy `system/rifts` to `<Foundry Data>/systems/rifts/`.
2. Restart Foundry and enable the system.

### Development
- `dist/rifts.js` is prebuilt and ready.
- If you prefer a source workflow, create `system/rifts/src/rifts.js` and run `npm run build`.

### License
This scaffold is offered as-is. You are responsible for ensuring compliance with Palladium Books’ policies.
