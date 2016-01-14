MSG="";

if [ "$1" != "" ]; then
    MSG=$1
else
    MSG="easy"
fi

echo "$MSG"

#exit 0

mv leste_js_filelist ../

git add ./
git commit -m "$MSG" ./
git push origin master
git checkout gh-pages

mv -f ../leste_js_filelist_tmp.js static/js/file.js

git rm -rf static/js/src
mv ../leste_js_filelist static/js/src


git add ./
git commit -m "$MSG" ./
git push origin gh-pages

git checkout master

exit 0
