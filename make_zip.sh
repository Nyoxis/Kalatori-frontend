#!/bin/bash

s=${1:?"missing arg 1 for configuration file"}
FROM=${2:?"missing arg 2 for source directory"}
TO=$(mktemp -d)
ZIP=${3:?"missing arg 3 for outputed zip filename"}

if [ -d "$TO" ]; then
	rm -r "$TO"
fi
if [ -f "$ZIP" ]; then
	rm "$ZIP"
fi

occurances=""
sed_cmd=""

# Iterate over each line in s
while IFS= read -r line; do
	# Skip lines that contain no "|", contain "#", or start with "@"
	if [[ $line != *"|"* || $line == *"#"* || $line == "@"* ]]; then
		# Skip lines that not start with "@"
		if [[ $line == "@"* ]]; then
			# Split the line into "a" and "b" variables exluding first "@"
			IFS='|' read -ra parts <<< "${line#*@}"
			# Remove leading and trailing spaces	
			a=$(echo "${parts[0]}" | xargs)
			b=$(echo "${parts[1]}" | xargs)
			occurances+="$a\n"
			sed_cmd+="s|$a|$b|g;"
		fi
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
done < "$s"

cd "$TO"
# Remove the trailing semicolon
sed_cmd=${sed_cmd%?}
# Replace in files every occurance of "a" with "b"
grep -RlFf <(printf $occurances) | xargs -t sed -i -e "$sed_cmd"

# Archive everything
zip -r "$ZIP" *

cd -
# Delete temporary folder
mv "$TO/$ZIP" "$ZIP"
rm -rf "$TO"

