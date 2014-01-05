clear

echo "$(tput setaf 2)[BUILD]$(tput sgr0)"

jekyll build
stylus --include-css assets/styl/ --out public/css/

echo
echo "$(tput setaf 2)[COMMIT]$(tput sgr0)"

git add -A
git add -f public/css/styles.css
git commit -m 'Publish Site'

echo
echo "$(tput setaf 2)[PUSH]$(tput sgr0)"
git push origin master
