#!/bin/bash
curl "https://widgets.blackpulp.com/api/v1/gofamilychurch/events?Congregation_ID=16&order_by=Event_Title&Event_Start_Date%3E=2024-12-01&Event_End_Date%3C=2025-01-01" | jq .  > imported_events.json
