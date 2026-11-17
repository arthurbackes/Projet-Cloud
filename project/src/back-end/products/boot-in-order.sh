#!/bin/bash -
if [ "${WITH_PERSISTENT_DATA}" != "" ]; then
  echo "Wait (indefinitely) until the DB creation (name: ${DB_NAME})."
  echo "The DB URL is: ${DB_URL}"
  until curl --request PUT ${DB_URL} ; do
    echo -e "\t DB (${DB_NAME}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME}) was created!"
  while IFS= read -r line; do
    curl -X POST --data "${line}" -H "Content-Type: application/json" ${DB_URL}
  done < "seed/product.jsonl"
fi
echo "Start products service..."
npm start
