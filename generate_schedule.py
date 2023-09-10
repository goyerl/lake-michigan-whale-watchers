import json
from datetime import datetime, timedelta

start_date = "2023-09-12T19:05:00"

def main():
    schedule = []
    date = datetime.fromisoformat(start_date)
    game = {
        "season": "Fall II 2023",
        "date": date.strftime('%m-%d-%y'),
        "msTime": str(int(date.timestamp() * 1000)),
        "opponent": "TBD",
        "time": "TBD",
        "weekName": "Week 1"
    }
    schedule.append(game)
    week = 1
    while week < 7:
        week += 1
        date = date + timedelta(days=7)
        new_game = {
            "season": "Fall II 2023",
            "date": date.strftime('%m-%d-%y'),
            "msTime": str(int(date.timestamp() * 1000)),
            "opponent": "TBD",
            "time": "TBD",
            "weekName": f"Week {week}"
        }
        schedule.append(new_game)

    print(json.dumps(schedule, indent=2))


if __name__ == '__main__':
    main()
