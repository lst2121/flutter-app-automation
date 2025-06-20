#!/bin/bash

echo "🧹 Cleaning up git repository..."

# Remove allure reports from git tracking
echo "📁 Removing allure-report from git tracking..."
git rm -r --cached allure-report 2>/dev/null || echo "allure-report not found in git"

echo "📁 Removing allure-results from git tracking..."
git rm -r --cached allure-results 2>/dev/null || echo "allure-results not found in git"

echo "📁 Removing reports directory from git tracking..."
git rm -r --cached reports 2>/dev/null || echo "reports directory not found in git"

# Remove any HTML/JSON files that might be tracked
echo "📄 Removing HTML/JSON report files from git tracking..."
git rm --cached *.html 2>/dev/null || echo "No HTML files found in git"
git rm --cached *.json 2>/dev/null || echo "No JSON files found in git"

# Add the changes to git
echo "✅ Adding .gitignore changes..."
git add .gitignore

echo "✅ Adding clean-git.sh to git..."
git add clean-git.sh

echo "📝 Committing changes..."
git commit -m "Remove allure reports from tracking and update .gitignore

- Remove allure-report, allure-results, and reports directories from git tracking
- Add test reports and results to .gitignore
- Prevent future accidental commits of report files"

echo "🎉 Cleanup completed!"
echo "📋 Next steps:"
echo "   - Run: git push (if you want to push these changes)"
echo "   - Your allure reports are now ignored by git"
echo "   - Future report files won't be accidentally committed" 