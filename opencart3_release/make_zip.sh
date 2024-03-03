#!/bin/bash

FROM="./src"
TO="./temp"
ZIP=$1

if [ -d "$TO" ]; then
	rm -r "$TO"
fi
if [ -f "$ZIP" ]; then
	rm "$ZIP"
fi

s="./opencart3.txt"

# Iterate over each line in s
while IFS= read -r line; do
	# Skip lines that contain no "|", contain "#", or start with "@"
	if [[ $line != *"|"* || $line == *"#"* || $line == "@"* ]]; then
		continue
	fi
        # Split the line into "from" and "to" variables
        IFS='|' read -ra parts <<< "$line"
	# Remove leading and trailing spaces	
        from=$(echo "${parts[0]}" | xargs)
        to=$(echo "${parts[1]}" | xargs)
	
	# Extract basenames from "from" and "to"
        from_basename=$(basename "$from")
        to_basename=$(basename "$to")

        # If the basename of "to" is "*", replace it with the basename from "from"
        if [[ $to_basename == "*" ]]; then
		to=${to%\*}${from_basename}
        fi
	# prepend "to" with "TO"
	to="$TO/$to"
	
	# Ensure the directory exists or create it
	mkdir -p -v "$(dirname "$to")"
	# Check if "from" is a URL
        if [[ $from =~ ^http[s]?:// ]]; then
            # If "from" is a link, download it using wget and name as "to"
            curl -s "$from" -o "$to"
        else
		# prepend "from" with "FROM"
		from="$FROM/$from"
		# If "from" is not a link, copy it to "to"
		cp "$from" "$to"
        fi
	
	# Iterate over each line in s once more
	while IFS= read -r lineto; do
		# Skip lines that not start with "@"
		if [[ $lineto != @* ]]; then
			continue
		fi

		# Split the line into "a" and "b" variables
		IFS='|' read -ra parts <<< "$lineto"
		# Remove leading and trailing spaces	
		a=$(echo "${parts[0]}" | xargs)
		b=$(echo "${parts[1]}" | xargs)

		# Replace in file every occurance of "a" with "b"
		awk -i inplace '
		BEGIN { old="${a}"; new="${b}" }
		s=index($0,old) { $0=substr($0,1,s-1) new substr($0,s+length(old)) }
		1' "$to"
	done < "$s"
	
done < "$s"
# Archive everything
cd "$TO"
zip -r "$ZIP" *
cd -
# Delete temporary folder
mv "$TO/$ZIP" "$ZIP"
rm -rf "$TO"

