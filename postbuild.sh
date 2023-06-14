#!/bin/sh
# Script que evita dolores de cabeza
# -----------------------------------

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo "PACKAGE_VERSION: " $PACKAGE_VERSION

# find 'dist' -iname 'main.*' -type f

for i in $(find 'dist/auto-pwa' -iname 'main.*' -type f); 
do
    FILE_NAME="$i"
    #echo "$i"
    #.$is
   # grep -oP 'export \K[^=]+' "$i"
   # var=$(awk -F'"' '/^se=/ {print $2}' "$i" )
done

echo "FILE_NAME: " $FILE_NAME

AMBIENTE="--"

RESULTADO=$(grep -o -m 2 $FILE_NAME -e 'envName:"PRO"' | head -1)
if [[ "$RESULTADO" != "" ]]
then
	echo "PRODUCCION"
  AMBIENTE="PRO"
else
	echo "No es producción"
fi

RESULTADO=$(grep -o -m 2 $FILE_NAME -e 'envName:"QA"' | head -1)
if [[ "$RESULTADO" != "" ]]
then
	echo "QA"
  AMBIENTE="QA"
else
	echo "No es QA"
fi

RESULTADO=$(grep -o -m 2 $FILE_NAME -e 'envName:"LAB"' | head -1)
if [[ "$RESULTADO" != "" ]]
then
	echo "LAB"
  AMBIENTE="LAB"
else
	echo "No es LAB"
fi


# (cd dist  && cd auto-pwa && zip -r -X "../../../published/auto-pwa-v".$PACKAGE_VERSION"-"$AMBIENTE".zip" .)
(cd dist  && cd auto-pwa && zip -r -X "../../../published/auto-pwa-v".$PACKAGE_VERSION"-"$AMBIENTE".zip" .)








