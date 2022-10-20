#!/bin/sh
# Configure task.json to pass the Canvas LMS root path to this script. This should be the path 
# to the folder containing the 'ui' folder.

DOM_EFFECTS_FOLDER="dom-effects"

DOM_EFFECTS_PATH=$(pwd)
CANVAS_ROOT=$1

TARGET_DIR="${CANVAS_ROOT}/ui/shared/${DOM_EFFECTS_FOLDER}"

# We're going to add the dom-effects script into the shared folder.
cd "${CANVAS_ROOT}/ui/shared/"

# If the dom effects folder does not yet exist in the shared folder create it.
if [ ! -d "$DOM_EFFECTS_FOLDER" ]; then
    mkdir $DOM_EFFECTS_FOLDER
fi

# Copy this contents over. 
cp -a "${DOM_EFFECTS_PATH}/." $TARGET_DIR

echo "dom-effects copied to local canvas install path ${TARGET_DIR}"