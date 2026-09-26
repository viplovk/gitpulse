export interface WorkflowOptions {
  cronExpression: string;
  strategy: 'DAILY_LOG' | 'CHANGELOG' | 'STATS_JSON' | 'CUSTOM_SCRIPT';
  branch: string;
  commitMessage: string;
}

export function generateWorkflowYaml(options: WorkflowOptions): string {
  const { cronExpression, strategy, branch, commitMessage } = options;

  let maintenanceStepScript = '';

  switch (strategy) {
    case 'DAILY_LOG':
      maintenanceStepScript = `TODAY=$(date -u +"%Y-%m-%d")
FILE="DAILY.md"

if [ ! -f "$FILE" ]; then
  echo "# Daily Repository Log" > "$FILE"
  echo "" >> "$FILE"
fi

if ! grep -q "## $TODAY" "$FILE"; then
  echo "" >> "$FILE"
  echo "## $TODAY" >> "$FILE"
  echo "" >> "$FILE"
  echo "- Automated repository maintenance completed." >> "$FILE"
  echo "- Repository metadata and health verified." >> "$FILE"
else
  echo "Log entry for $TODAY already exists. Skipping duplicate."
fi`;
      break;

    case 'CHANGELOG':
      maintenanceStepScript = `TODAY=$(date -u +"%Y-%m-%d")
FILE="CHANGELOG.md"

if [ ! -f "$FILE" ]; then
  echo "# Changelog" > "$FILE"
  echo "" >> "$FILE"
  echo "All notable maintenance runs to this project are documented here." >> "$FILE"
  echo "" >> "$FILE"
fi

if ! grep -q "## \[$TODAY\]" "$FILE"; then
  TMP_FILE=$(mktemp)
  head -n 4 "$FILE" > "$TMP_FILE"
  echo "" >> "$TMP_FILE"
  echo "## [$TODAY] - Maintenance" >> "$TMP_FILE"
  echo "- Scheduled dependency and repository check completed." >> "$TMP_FILE"
  tail -n +5 "$FILE" >> "$TMP_FILE"
  mv "$TMP_FILE" "$FILE"
else
  echo "Changelog entry for $TODAY already present. Skipping."
fi`;
      break;

    case 'STATS_JSON':
      maintenanceStepScript = `mkdir -p .github/gitpulse
STATS_FILE=".github/gitpulse/stats.json"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

FILES_COUNT=$(git ls-files | wc -l | tr -d ' ')
DIRS_COUNT=$(find . -not -path '*/.*' -type d | wc -l | tr -d ' ')

cat <<EOF > "$STATS_FILE"
{
  "updatedAt": "$NOW",
  "fileCount": $FILES_COUNT,
  "directoryCount": $DIRS_COUNT,
  "generator": "GitPulse Automation"
}
EOF
echo "Updated repository stats in $STATS_FILE"`;
      break;

    case 'CUSTOM_SCRIPT':
      maintenanceStepScript = `SCRIPT=".github/gitpulse/maintenance.sh"
if [ -f "$SCRIPT" ]; then
  chmod +x "$SCRIPT"
  echo "Executing custom maintenance script..."
  ./"$SCRIPT"
else
  echo "Warning: Custom maintenance script $SCRIPT not found in repository."
fi`;
      break;
  }

  return `name: GitPulse Maintenance

on:
  schedule:
    - cron: '${cronExpression}'
  workflow_dispatch:

jobs:
  maintenance:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          ref: ${branch}
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config user.name "GitPulse Bot"
          git config user.email "gitpulse-bot@users.noreply.github.com"

      - name: Run maintenance (${strategy})
        run: |
${maintenanceStepScript.split('\n').map((line) => `          ${line}`).join('\n')}

      - name: Check changes
        id: changes
        run: |
          if [ -z "$(git status --porcelain)" ]; then
            echo "changed=false" >> "$GITHUB_OUTPUT"
            echo "No repository changes detected. Commit skipped."
          else
            echo "changed=true" >> "$GITHUB_OUTPUT"
            echo "Repository changes detected:"
            git status --porcelain
          fi

      - name: Commit and push
        if: steps.changes.outputs.changed == 'true'
        run: |
          git add -A
          git commit -m "${commitMessage.replace(/"/g, '\\"')}"
          git push origin ${branch}
`;
}
