#!/bin/zsh
# Daily Wächter runner (Promo + Conversion) for "Die Abnehmrevolution".
# Loaded by launchd (com.mamaspagat.abnehmrevolution-waechter). Logs to .alerts/waechter.log.
# Conversion-Wächter braucht POSTHOG_PERSONAL_API_KEY aus ~/.mamaspagat_secrets.env.

NODE="/Users/Chrisprivat/.nvm/versions/node/v24.15.0/bin/node"
FUNNEL="/Users/Chrisprivat/Library/Mobile Documents/com~apple~CloudDocs/Claude Code/abnehmrevolution-funnel"
SECRETS="$HOME/.mamaspagat_secrets.env"

[ -f "$SECRETS" ] && source "$SECRETS"
cd "$FUNNEL" || exit 1
mkdir -p .alerts

{
  echo "===== Wächter-Lauf $(date '+%Y-%m-%d %H:%M:%S') ====="
  "$NODE" scripts/promo-watcher.mjs
  "$NODE" scripts/conversion-watcher.mjs
  # publish conversion snapshot to dashboard-readable location (gated behind /intern Basic Auth)
  [ -f .alerts/conversion.json ] && cp .alerts/conversion.json intern/alerts-conversion.json
  echo ""
} >> .alerts/waechter.log 2>&1
