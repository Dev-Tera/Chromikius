# Merge-Checkliste (develop → main)

Vor jedem Merge von `develop` nach `main` durchgehen. Fokus liegt auf den Stellen, die bei Änderungen leicht auseinanderlaufen (Commands, Config, DB).


## 1. Config

- [ ] Neue `Config`-Felder in `config/prod.json.example` und `config/dev.json.example` ergänzt

## 2. Datenbank

- [ ] Schema-Änderung in `assets/deploy/DBSchema.sql` nachgezogen

## 3. Build & Dependencies

- [ ] `npm run build` läuft fehlerfrei
- [ ] Keine verwaisten Dependencies
- [ ] `npm audit` ohne offene Findings

## 4. Version & Repo-Housekeeping

- [ ] `version` in `package.json` gebumpt und Version-Badge in `README.md` angepasst
- [ ] Keine Debug-/Backup-Reste committet (`*.bak`, `console.log`, auskommentierter Code)

## 5. Deploy 

- [ ] Code auf dem Server aktualisiert
- [ ] Reale `prod.json` auf dem Server um neue Felder erweitert
- [ ] Migration auf das neue DBSchema.sql angewandt
- [ ] npm run deploy läuft ohne Probleme
- [ ] Service neu starten: `systemctl --user restart chromikius`
- [ ] Bot startet ohne Crash (`journalctl -u chromikius`)

