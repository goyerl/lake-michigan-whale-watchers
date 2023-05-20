import os
import json
import boto3

from decimal import Decimal
from boto3.dynamodb.conditions import Key, Attr

table_name = os.environ.get('TABLE_NAME', 'lmww-at-bats')

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(table_name)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return json.JSONEncoder.default(self, obj)
  

class Stats:
    def __init__(self, seasonName) -> None:
        self.seasonName = seasonName
        self.hits = 0
        self.singles = 0
        self.doubles = 0
        self.triples = 0
        self.hr = 0
        self.sac_fly = 0
        self.runs = 0
        self.rbi = 0
        self.walks = 0
        self.total_bases = 0
        self.at_bats = 0

    def calc_stats(self):
        avg = self.hits / self.at_bats
        obp = (self.hits + self.walks) / (self.at_bats + self.walks + self.sac_fly)
        slg = self.total_bases / self.at_bats
        return {
            'avg': avg,
            'obp': obp,
            'slg': slg,
            'seasonName': self.seasonName,
            'atBats': self.at_bats,
            'singles': self.singles,
            'doubles': self.doubles,
            'triples': self.triples,
            'hr': self.hr,
            'rbi': self.rbi,
            'runs': self.runs,
            'walks': self.walks,
            'totalBases': self.total_bases
        }
  

def build_stats(items):
    season_stats = {}
    for item in items:
        season = item['season']
        result = item['atBatResult'] 
        if season_stats.get(season) == None:
            season_stats[season] = Stats(season)
        if result == '1B':
            season_stats[season].hits += 1
            season_stats[season].singles += 1
            season_stats[season].at_bats += 1
        elif result == '2B':
            season_stats[season].hits += 1
            season_stats[season].at_bats += 1
            season_stats[season].doubles += 1
        elif result == '3B':
            season_stats[season].hits += 1
            season_stats[season].at_bats += 1
            season_stats[season].triples += 1
        elif result == 'HR':
            season_stats[season].hits += 1
            season_stats[season].hr += 1
            season_stats[season].at_bats += 1
        elif result == 'G':
            season_stats[season].at_bats += 1
        elif result == 'F':
            season_stats[season].at_bats += 1
        elif result == 'SF':
            season_stats[season].sac_fly += 1
        elif result == 'L':
            season_stats[season].at_bats += 1
        elif result == 'FC':
            season_stats[season].at_bats += 1
        elif result == 'K':
            season_stats[season].at_bats += 1
        elif result == 'BB':
            season_stats[season].walks += 1
        
        season_stats[season].rbi += item['rbi']
        season_stats[season].total_bases += item['totalBases']

        if item['runScored']:
            season_stats[season].runs += 1

    print(season_stats)

    data = { 'seasons': [], 'total': {}}
    total_stats = Stats('totals')
    for key in season_stats:
        current_season = season_stats[key]
        stat_line = current_season.calc_stats()
        data['seasons'].append(stat_line)
        total_stats.at_bats += stat_line['atBats']
        total_stats.singles += stat_line['singles']
        total_stats.doubles += stat_line['doubles']
        total_stats.triples += stat_line['triples']
        total_stats.hr += stat_line['hr']
        total_stats.runs += stat_line['runs']
        total_stats.rbi += stat_line['rbi']
        total_stats.walks += stat_line['walks']
        total_stats.total_bases += stat_line['totalBases']
    data['total'] = total_stats.calc_stats()


    return data

def handler(event, context=None):
    username = event['pathParameters']['username']
    response = table.scan(
        IndexName='username',
        FilterExpression=Key('username').eq(username))
    
    stats = build_stats(response['Items'])
    
    return {
        'isBase64Encoded': False,
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'body': json.dumps(stats, cls=DecimalEncoder),
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


if __name__ == '__main__':
    print(handler(event={'pathParameters': {'username': 'luke'}}))
