#!/bin/bash

# Sprawdź, czy podano odpowiednią liczbę argumentów
if [ "$#" -ne 4 ]; then
    echo "Usage: $0 template.html image.png output.html number"
    exit 1
fi

# Przypisz argumenty do zmiennych
TEMPLATE_FILE=$1
IMAGE_FILE=$2
OUTPUT_FILE=$3
NUMBER=$4

# Sprawdź, czy plik szablonu istnieje
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Template file not found!"
    exit 1
fi

# Sprawdź, czy plik obrazu istnieje
if [ ! -f "$IMAGE_FILE" ]; then
    echo "Image file not found!"
    exit 1
fi

# Konwertuj plik PNG na string base64
BASE64_STRING=$(base64 -i "$IMAGE_FILE")

# Wstaw string base64 i numer w odpowiednie miejsca w pliku HTML
sed -e "s|data:image/png;base64,[^\"]*|data:image/png;base64,$BASE64_STRING|" \
    -e "s|{{NR}}|$NUMBER|g" "$TEMPLATE_FILE" > "$OUTPUT_FILE"

echo "Output written to $OUTPUT_FILE"