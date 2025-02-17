#!/bin/bash


# Get the events
# curl "https://widgets.blackpulp.com/api/v1/gofamilychurch/events?Congregation_ID=16&order_by=Event_Title&Event_Start_Date%3E=2025-01-01&Event_End_Date%3C=2025-01-31" | jq .  > imported-events.json


# Get the groups
curl "https://widgets.blackpulp.com/api/v1/gofamilychurch/groups?Congregation_ID=16&order_by=Group_Name%2CGroup_ID&top=100" > groups.json
# Get Groups, delete all null values, and just give me the data array
cat groups.json | jq 'del(..|nulls)' > imported-groups.json
rm groups.json
