#!/bin/bash

shopt -s nullglob
for f in *.html
do
  echo "Removing anchor tags from $f"
  orig=$(basename "$f" .html)_orig.html
  mv $f $orig
  sed 's/<\/\?a\s*[^>]*>//g' $orig > $f
done