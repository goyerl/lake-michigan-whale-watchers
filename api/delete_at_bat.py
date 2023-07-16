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
    id = event['pathParameters']['id']
    response = table.delete_item(
        Key={
           'gameDate': gameDate,
           'id': id
        })
    
    return {
        'isBase64Encoded': False,
        'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
        'body': response['ResponseMetadata']['HTTPStatusCode'],
        'headers': {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }


if __name__ == '__main__':
    print(handler(event={'pathParameters': {'gameDate': '06-20-23', 'id': '0e2c23a2-8ee1-45fb-aafb-7bd77c015d4d'}}))
