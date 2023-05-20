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


def handler(event, context=None):
    gameDate = event['pathParameters']['gameDate']
    username = event['pathParameters']['username']
    response = table.query(
        IndexName='username',
        KeyConditionExpression=Key('gameDate').eq(gameDate)
        & Key('username').eq(username))
    
    return {
        'isBase64Encoded': False,
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'body': json.dumps(response['Items'], cls=DecimalEncoder),
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


if __name__ == '__main__':
    print(handler(event={'pathParameters': {'gameDate': '05-30-23', 'username': 'luke'}}))
