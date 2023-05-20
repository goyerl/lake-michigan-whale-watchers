import os
import json
import boto3
import uuid
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


def handler(event, context=None):
    data = json.loads(event['body'])
    if data['atBatResult'] == '1B':
       total_bases = 1
    elif data['atBatResult'] == '2B':
       total_bases = 2
    elif data['atBatResult'] == '3B':
       total_bases = 3
    elif data['atBatResult'] == 'HR':
       total_bases = 4
    else:
       total_bases = 0

    data['totalBases'] = total_bases
    data['id'] = str(uuid.uuid4())
    response = table.put_item(Item=data)

    print(response)
    
    return {
        'isBase64Encoded': False,
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'body': 'successful',
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


if __name__ == '__main__':
    print(handler(event={'body': json.dumps({
        "gameDate": "05-30-23",
        "atBatResult": "2B",
        "gameMsTime": 1678147200000,
        "inning": 1,
        "rbi": 0,
        "runScored": False,
        "season": "Summer 2023",
        "totalBases": 2,
        "username": "luke"
})}))
